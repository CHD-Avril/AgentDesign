"""LLM 抽象接口：所有模型客户端都必须实现 chat()，方便随时切换后端。

这是“接口”的核心 —— 你要接 Qwen 的 API，只需要用现成的 QwenClient；
以后想换其他模型，实现本文件的 LLMClient 子类即可，Agent 其余代码不用动。
"""
from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any


@dataclass
class ToolCall:
    """一次工具调用（OpenAI / Qwen 函数调用格式）。"""

    id: str
    name: str
    arguments: dict[str, Any]


@dataclass
class LLMResponse:
    """一次 LLM 回复的统一封装。"""

    content: str = ""                                  # 文本内容（最终回答或附带说明）
    tool_calls: list[ToolCall] = field(default_factory=list)  # 需要执行的工具调用
    finish_reason: str = ""                            # stop / tool_calls / length ...
    raw: dict[str, Any] | None = None                  # 原始返回，便于排查


class LLMClient(ABC):
    """所有 LLM 后端的统一接口。

    现有实现：
      - QwenClient  : Qwen（阿里云百炼）OpenAI 兼容接口 —— 默认后端
      - MockClient  : 离线模拟，无 Key 时用于测试 / 演示

    接入其他模型：实现本类，把 chat() 换成对应 API 调用即可。
    """

    name: str = "base"

    @abstractmethod
    def chat(
        self,
        messages: list[dict[str, Any]],
        tools: list[dict[str, Any]] | None = None,
        **kwargs: Any,
    ) -> LLMResponse:
        """发起一次对话。

        :param messages: OpenAI 风格消息列表：
            [{"role": "system"|"user"|"assistant"|"tool", "content": ...}, ...]
            其中 assistant 可带 tool_calls，tool 需带 tool_call_id，格式与 OpenAI 一致。
        :param tools:    工具 JSON Schema 列表（OpenAI 函数调用格式），可为 None。
        :returns:        LLMResponse
        """

    def chat_stream(
        self,
        messages: list[dict[str, Any]],
        tools: list[dict[str, Any]] | None = None,
        on_delta: Any | None = None,
        **kwargs: Any,
    ) -> LLMResponse:
        """流式对话：通过 on_delta(text) 逐段回调输出文本，返回完整 LLMResponse。

        默认实现退化为一次性 chat()（回调全部内容）；支持流式的后端
        （如 QwenClient）覆写本方法实现真正的打字机效果。
        """
        response = self.chat(messages, tools=tools, **kwargs)
        if on_delta is not None and response.content:
            on_delta(response.content)
        return response

    def close(self) -> None:
        """释放资源（默认无操作，可按需覆写）。"""
