"""Z.ai Anthropic Messages 客户端：文本、SSE、工具调用与 base64 图像。"""
from __future__ import annotations

import json
from typing import Any, Callable

from .base import LLMClient, LLMResponse, TokenUsage, ToolCall


class AnthropicClient(LLMClient):
    name = "zai-anthropic"

    def __init__(self, api_key: str, base_url: str = "https://api.z.ai/api/anthropic",
                 model: str = "glm-5.3-flash", max_tokens: int = 4096,
                 timeout: int = 90, max_retries: int = 1) -> None:
        if not api_key:
            raise ValueError("缺少 API Key：请配置 ZAI_API_KEY。")
        try:
            import anthropic
        except ImportError as error:
            raise RuntimeError("Z.ai 接口需要 SDK：python3 -m pip install anthropic") from error
        self.model = model
        self.max_tokens = max_tokens
        self._sdk = anthropic
        self._client = anthropic.Anthropic(
            api_key=api_key, base_url=base_url, timeout=timeout, max_retries=max_retries,
        )

    @staticmethod
    def _convert_messages(messages: list[dict[str, Any]]) -> tuple[str, list[dict[str, Any]]]:
        """将 Agent 的 OpenAI 风格工具消息转换为 Anthropic 内容块。"""
        system = []
        converted: list[dict[str, Any]] = []
        for message in messages:
            role = message.get("role")
            content = message.get("content")
            if role == "system":
                system.append(str(content or ""))
                continue
            if role == "tool":
                item = {"role": "user", "content": [{
                    "type": "tool_result", "tool_use_id": message["tool_call_id"],
                    "content": str(content or ""),
                }]}
            else:
                blocks = []
                if role == "assistant" and message.get("_anthropic_content"):
                    # 思考签名仅回传模型；不送到前端或持久化对话。
                    blocks = list(message["_anthropic_content"])
                else:
                    if isinstance(content, list):
                        blocks.extend(content)
                    elif content:
                        blocks.append({"type": "text", "text": str(content)})
                    for call in message.get("tool_calls") or []:
                        fn = call["function"]
                        args = fn.get("arguments") or "{}"
                        blocks.append({"type": "tool_use", "id": call["id"], "name": fn["name"],
                                       "input": json.loads(args) if isinstance(args, str) else args})
                if not blocks:
                    continue
                item = {"role": "assistant" if role == "assistant" else "user", "content": blocks}
            # 多个工具结果需合并到同一个 user 消息。
            if converted and converted[-1]["role"] == item["role"]:
                converted[-1]["content"].extend(item["content"])
            else:
                converted.append(item)
        return "\n\n".join(system), converted

    def _payload(self, messages: list[dict[str, Any]], tools: list[dict[str, Any]] | None,
                 **kwargs: Any) -> dict[str, Any]:
        system, converted = self._convert_messages(messages)
        payload = {"model": self.model, "max_tokens": int(kwargs.get("max_tokens", self.max_tokens)),
                   "messages": converted}
        if system:
            payload["system"] = system
        if tools:
            payload["tools"] = [{"name": tool["function"]["name"],
                                 "description": tool["function"].get("description", ""),
                                 "input_schema": tool["function"].get("parameters", {"type": "object"})}
                                for tool in tools]
        return payload

    @staticmethod
    def _parse(message: Any) -> LLMResponse:
        data = message.model_dump() if hasattr(message, "model_dump") else message
        text, calls = [], []
        for block in data.get("content", []):
            if block["type"] == "text":
                text.append(block["text"])
            elif block["type"] == "tool_use":
                calls.append(ToolCall(id=block["id"], name=block["name"], arguments=block["input"]))
        usage = data.get("usage") or {}
        if not text and not calls:
            if data.get("stop_reason") == "max_tokens":
                raise RuntimeError("Z.ai 输出预算耗尽但未返回 text，请增大 LLM_MAX_TOKENS。")
            raise RuntimeError("Z.ai 未返回可显示的 text 或工具调用，请重试。")
        # 缓存命中和写入也属于输入量，避免缓存请求显示为零。
        input_tokens = sum(int(usage.get(key) or 0) for key in
                           ("input_tokens", "cache_creation_input_tokens", "cache_read_input_tokens"))
        output_tokens = int(usage.get("output_tokens") or 0)
        return LLMResponse(
            content="".join(text), tool_calls=calls,
            finish_reason="tool_calls" if calls else data.get("stop_reason", "stop"),
            raw=data, usage=TokenUsage(input_tokens, output_tokens, input_tokens + output_tokens),
        )

    def _error(self, error: Exception) -> RuntimeError:
        # 不回显服务端原始请求体，避免凭据或图像进入 UI/日志。
        status = getattr(error, "status_code", None)
        if status in (401, 403):
            return RuntimeError(f"Z.ai API 鉴权失败（HTTP {status}）：请检查 ZAI_API_KEY 和账号权限。")
        if status == 429:
            return RuntimeError("Z.ai API 暂时不可用（HTTP 429）：请检查并发限额、额度或账户余额，稍后重试。")
        if status:
            return RuntimeError(f"Z.ai API 请求失败（HTTP {status}）：{type(error).__name__}。")
        return RuntimeError(f"Z.ai API 连接失败：{type(error).__name__}。")

    def chat(self, messages: list[dict[str, Any]], tools: list[dict[str, Any]] | None = None,
             **kwargs: Any) -> LLMResponse:
        try:
            return self._parse(self._client.messages.create(**self._payload(messages, tools, **kwargs)))
        except self._sdk.APIError as error:
            raise self._error(error) from error

    def chat_stream(self, messages: list[dict[str, Any]], tools: list[dict[str, Any]] | None = None,
                    on_delta: Callable[[str], None] | None = None, **kwargs: Any) -> LLMResponse:
        try:
            with self._client.messages.stream(**self._payload(messages, tools, **kwargs)) as stream:
                # text_stream 不包含 thinking，按用户要求只向界面输出 text。
                for delta in stream.text_stream:
                    if on_delta:
                        on_delta(delta)
                return self._parse(stream.get_final_message())
        except self._sdk.APIError as error:
            raise self._error(error) from error

    def close(self) -> None:
        self._client.close()
