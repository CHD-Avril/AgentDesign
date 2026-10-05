"""Qwen（阿里云百炼）OpenAI 兼容接口客户端。

只依赖 Python 标准库 urllib，无需安装 requests。
官方文档：https://help.aliyun.com/zh/model-studio/developer-reference/compatibility-of-openai-with-dashscope

默认地址：https://dashscope.aliyuncs.com/compatible-mode/v1
常用模型：qwen-plus（推荐，均衡）、qwen-turbo（更快更便宜）、qwen-max（更强）
"""
from __future__ import annotations

import json
import time
import urllib.error
import urllib.request
from typing import Any

from .base import LLMClient, LLMResponse, ToolCall


class QwenClient(LLMClient):
    name = "qwen"

    def __init__(
        self,
        api_key: str,
        base_url: str = "https://dashscope.aliyuncs.com/compatible-mode/v1",
        model: str = "qwen-plus",
        temperature: float = 0.3,
        timeout: int = 60,
        max_retries: int = 3,
        enable_search: bool = False,
    ) -> None:
        if not api_key:
            raise ValueError("缺少 API Key：请在 .env 中配置 QWEN_API_KEY（DASHSCOPE_API_KEY 亦可）。")
        self.api_key = api_key
        self.model = model
        self.temperature = temperature
        self.timeout = timeout
        self.max_retries = max_retries
        self.enable_search = enable_search
        self._endpoint = base_url.rstrip("/") + "/chat/completions"

    # ---------------- 核心接口 ----------------
    def chat(
        self,
        messages: list[dict[str, Any]],
        tools: list[dict[str, Any]] | None = None,
        **kwargs: Any,
    ) -> LLMResponse:
        payload: dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            "temperature": float(kwargs.get("temperature", self.temperature)),
        }
        if self.enable_search or kwargs.get("enable_search"):
            payload["enable_search"] = True
        if tools:
            payload["tools"] = tools
        if kwargs.get("stream"):
            raise NotImplementedError("请使用 chat_stream() 进行流式对话。")

        data = self._post_with_retry(payload)
        return self._parse(data)

    def chat_stream(
        self,
        messages: list[dict[str, Any]],
        tools: list[dict[str, Any]] | None = None,
        on_delta: Any | None = None,
        **kwargs: Any,
    ) -> LLMResponse:
        """流式对话：逐段回调 on_delta(text)，返回完整 LLMResponse（含 tool_calls）。

        Qwen OpenAI 兼容接口的 SSE 流：每行 `data: {json}`，文本按 delta 增量下发；
        tool_calls 的 name / arguments 也是增量片段，需要累积拼接。
        """
        payload: dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            "temperature": float(kwargs.get("temperature", self.temperature)),
            "stream": True,
        }
        if self.enable_search or kwargs.get("enable_search"):
            payload["enable_search"] = True
        if tools:
            payload["tools"] = tools

        request = urllib.request.Request(
            self._endpoint,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )

        chunks: list[dict[str, Any]] = []
        try:
            with urllib.request.urlopen(request, timeout=self.timeout) as resp:
                for raw_line in resp:
                    line = raw_line.decode("utf-8", "replace").strip()
                    if not line.startswith("data:"):
                        continue
                    data = line[5:].strip()
                    if data == "[DONE]":
                        break
                    chunk = json.loads(data)
                    chunks.append(chunk)
                    # 实时回调文本增量（打字机效果）
                    choices = chunk.get("choices") or []
                    if choices and on_delta is not None:
                        delta = choices[0].get("delta") or {}
                        if delta.get("content"):
                            on_delta(delta["content"])
        except urllib.error.HTTPError as err:
            body = err.read().decode("utf-8", "replace")[:500]
            raise RuntimeError(f"Qwen API 请求失败（HTTP {err.code}）：{body}") from err
        except urllib.error.URLError as err:
            raise RuntimeError(f"Qwen API 连接失败：{err}") from err
        except json.JSONDecodeError as err:
            raise RuntimeError(f"Qwen API 流式返回格式异常：{err}") from err

        return self._assemble_stream(chunks)

    # ---------------- 内部实现 ----------------
    def _post_with_retry(self, payload: dict) -> dict:
        last_err: Exception | None = None
        for attempt in range(self.max_retries):
            try:
                return self._post(payload)
            except urllib.error.HTTPError as err:
                body = err.read().decode("utf-8", "replace")[:500]
                if err.code in (400, 401, 403, 404, 422):
                    # 参数 / 鉴权类错误，重试无意义，直接抛出
                    raise RuntimeError(f"Qwen API 请求失败（HTTP {err.code}）：{body}") from err
                last_err = err  # 429 限流、5xx 服务端错误 → 可重试
            except urllib.error.URLError as err:
                last_err = err  # 网络不可达
            if attempt < self.max_retries - 1:
                time.sleep(min(2 ** attempt, 8))
        raise RuntimeError(f"Qwen API 连接失败（已重试 {self.max_retries} 次）：{last_err}")

    def _post(self, payload: dict) -> dict:
        request = urllib.request.Request(
            self._endpoint,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        with urllib.request.urlopen(request, timeout=self.timeout) as resp:
            return json.loads(resp.read().decode("utf-8"))

    @staticmethod
    def _parse(data: dict) -> LLMResponse:
        try:
            choice = data["choices"][0]
            message = choice.get("message", {})
        except (KeyError, IndexError) as err:
            raise RuntimeError(f"Qwen API 返回格式异常：{json.dumps(data, ensure_ascii=False)[:300]}") from err

        tool_calls: list[ToolCall] = []
        for tc in message.get("tool_calls") or []:
            fn = tc.get("function", {})
            raw_args = fn.get("arguments") or "{}"
            try:
                args = json.loads(raw_args)
            except json.JSONDecodeError:
                args = {"_raw": raw_args}
            tool_calls.append(ToolCall(id=tc.get("id", ""), name=fn.get("name", ""), arguments=args))

        return LLMResponse(
            content=message.get("content") or "",
            tool_calls=tool_calls,
            finish_reason=choice.get("finish_reason", ""),
            raw=data,
        )

    @staticmethod
    def _assemble_stream(chunks: list[dict[str, Any]]) -> LLMResponse:
        """把 SSE 流式 chunk 列表拼成完整的 LLMResponse（文本增量 + 工具调用增量）。"""
        content_parts: list[str] = []
        tool_calls: dict[int, dict[str, str]] = {}
        finish_reason = ""

        for chunk in chunks:
            choices = chunk.get("choices") or []
            if not choices:
                continue
            choice = choices[0]
            delta = choice.get("delta") or {}
            if delta.get("content"):
                content_parts.append(delta["content"])
            for tc in delta.get("tool_calls") or []:
                idx = int(tc.get("index", 0))
                entry = tool_calls.setdefault(idx, {"id": "", "name": "", "arguments": ""})
                if tc.get("id"):
                    entry["id"] = tc["id"]
                fn = tc.get("function") or {}
                if fn.get("name"):
                    entry["name"] += fn["name"]          # 名称可能是增量片段
                if fn.get("arguments"):
                    entry["arguments"] += fn["arguments"]  # 参数 JSON 是增量片段
            if choice.get("finish_reason"):
                finish_reason = choice["finish_reason"]

        calls: list[ToolCall] = []
        for idx in sorted(tool_calls):
            entry = tool_calls[idx]
            raw_args = entry["arguments"]
            try:
                args = json.loads(raw_args) if raw_args else {}
            except json.JSONDecodeError:
                args = {"_raw": raw_args}
            calls.append(ToolCall(id=entry["id"] or f"call_{idx}", name=entry["name"], arguments=args))

        return LLMResponse(content="".join(content_parts), tool_calls=calls, finish_reason=finish_reason)
