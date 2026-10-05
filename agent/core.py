"""Agent 核心：函数调用式 ReAct 循环。

一次任务的执行流程：
  用户输入 → 拼消息（system + 历史 + 本次）→ 调 LLM（带上全部工具 Schema）
    ├─ LLM 返回 tool_calls → 逐个执行工具 → 结果作为 tool 消息回传 → 回到“调 LLM”
    └─ LLM 返回纯文本       → 即为最终回答，结束

零本地算力：LLM 的“思考”全部发生在远端 API，本地只负责执行工具。
"""
from __future__ import annotations

import json
from dataclasses import dataclass, field
from typing import Any, Callable

from llm.base import LLMClient
from tools.registry import ToolRegistry

from .memory import Memory

ToolHook = Callable[[str, dict[str, Any], bool, str], None]  # (工具名, 参数, 是否成功, 结果文本)


@dataclass
class ToolUse:
    """一次实际发生的工具调用记录。"""

    name: str
    arguments: dict[str, Any]
    ok: bool
    result: str


@dataclass
class AgentResult:
    content: str
    turns: int = 0                                   # 实际消耗的 LLM 调用轮数
    tool_uses: list[ToolUse] = field(default_factory=list)
    interrupted: bool = False                        # 是否因达到最大轮数而中断


class Agent:
    def __init__(
        self,
        llm: LLMClient,
        tools: ToolRegistry,
        *,
        system_prompt: str = "",
        max_turns: int = 12,
        memory: Memory | None = None,
        on_tool: ToolHook | None = None,
    ) -> None:
        self.llm = llm
        self.tools = tools
        self.system_prompt = system_prompt
        self.max_turns = max_turns
        self.memory = memory or Memory()
        self.on_tool = on_tool

    def run(self, user_input: str, *, on_delta: Callable[[str], None] | None = None) -> AgentResult:
        """执行一次任务。

        :param on_delta: 流式输出回调：LLM 每产生一段文本就回调一次（打字机效果）。
                        传了就用 chat_stream，否则一次性返回。
        """
        messages: list[dict[str, Any]] = []
        if self.system_prompt:
            messages.append({"role": "system", "content": self.system_prompt})
        messages.extend(self.memory.messages())
        messages.append({"role": "user", "content": user_input})

        tool_uses: list[ToolUse] = []
        for turn in range(1, self.max_turns + 1):
            if on_delta is not None:
                response = self.llm.chat_stream(messages, tools=self.tools.schemas(), on_delta=on_delta)
            else:
                response = self.llm.chat(messages, tools=self.tools.schemas())

            # ---- 模型给出最终回答 ----
            if not response.tool_calls:
                self.memory.add("user", user_input)
                self.memory.add("assistant", response.content)
                return AgentResult(content=response.content, turns=turn, tool_uses=tool_uses)

            # ---- 模型要求调用工具：先回传 assistant 消息（OpenAI 格式）----
            messages.append({
                "role": "assistant",
                "content": response.content or None,
                "tool_calls": [
                    {
                        "id": tc.id,
                        "type": "function",
                        "function": {
                            "name": tc.name,
                            "arguments": json.dumps(tc.arguments, ensure_ascii=False),
                        },
                    }
                    for tc in response.tool_calls
                ],
            })

            # ---- 逐个执行工具，结果作为 tool 消息回传 ----
            for tc in response.tool_calls:
                ok, result = self.tools.run(tc.name, tc.arguments)
                use = ToolUse(name=tc.name, arguments=tc.arguments, ok=ok, result=result)
                tool_uses.append(use)
                if self.on_tool:
                    self.on_tool(tc.name, tc.arguments, ok, result)
                messages.append({"role": "tool", "tool_call_id": tc.id, "content": result})

        # ---- 达到最大轮数 ----
        self.memory.add("user", user_input)
        self.memory.add("assistant", "(达到最大轮数，未完成)")
        return AgentResult(
            content="已达到最大工具轮数，任务可能未完成，请简化问题或补充信息。",
            turns=self.max_turns,
            tool_uses=tool_uses,
            interrupted=True,
        )

    def reset(self) -> None:
        self.memory.clear()
