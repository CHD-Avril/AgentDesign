"""离线模拟 LLM：没有 API Key 时也能跑通 Agent 闭环（测试 / 演示用）。

- MockClient()              永远直接回答，不调用工具
- ScriptedMockClient(剧本)  按剧本依次返回“调用工具 / 最终回答”，用于自动化测试
"""
from __future__ import annotations

from typing import Any

from .base import LLMClient, LLMResponse, ToolCall


class MockClient(LLMClient):
    name = "mock"

    def __init__(self, reply: str = "（模拟回答）这是离线演示模式，配置 QWEN_API_KEY 后可调用真实模型。") -> None:
        self.reply = reply

    def chat(
        self,
        messages: list[dict[str, Any]],
        tools: list[dict[str, Any]] | None = None,
        **kwargs: Any,
    ) -> LLMResponse:
        user = messages[-1]["content"] if messages and messages[-1].get("role") == "user" else ""
        content = self.reply
        if user:
            content += f"\n你刚才问的是：{user}"
        return LLMResponse(content=content, finish_reason="stop")


class ScriptedMockClient(LLMClient):
    """按剧本响应的模拟客户端，用于测试 Agent 循环。

    剧本元素（按顺序消费）：
      {"type": "tool",  "name": "calculator", "arguments": {"expression": "1+1"}}
      {"type": "final", "content": "结果是 2"}
    """

    name = "mock-scripted"

    def __init__(self, script: list[dict[str, Any]], fallback: str = "（剧本用尽，测试终止）") -> None:
        self.script = list(script)
        self.fallback = fallback
        self.used = 0

    def chat(
        self,
        messages: list[dict[str, Any]],
        tools: list[dict[str, Any]] | None = None,
        **kwargs: Any,
    ) -> LLMResponse:
        if self.used < len(self.script):
            step = self.script[self.used]
            self.used += 1
            if step.get("type") == "tool":
                return LLMResponse(
                    content="",
                    tool_calls=[
                        ToolCall(
                            id=f"call_{self.used}",
                            name=step["name"],
                            arguments=step.get("arguments", {}),
                        )
                    ],
                    finish_reason="tool_calls",
                )
            return LLMResponse(content=step.get("content", ""), finish_reason="stop")
        return LLMResponse(content=self.fallback, finish_reason="stop")
