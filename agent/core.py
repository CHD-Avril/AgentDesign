"""Agent 核心：函数调用式 ReAct 循环。

一次任务的执行流程：
  用户输入 → 拼消息（system + 历史 + 本次）→ 调 LLM（带上全部工具 Schema）
    ├─ LLM 返回 tool_calls → 逐个执行工具 → 结果作为 tool 消息回传 → 回到“调 LLM”
    └─ LLM 返回纯文本       → 即为最终回答，结束

零本地算力：LLM 的“思考”全部发生在远端 API，本地只负责执行工具。
"""
from __future__ import annotations

import json
import threading
import time
from dataclasses import dataclass, field
from typing import Any, Callable

from llm.base import LLMClient
from tools.registry import ToolRegistry

from .memory import Memory
from .telemetry import Telemetry, TokenUsage
from .long_term_memory import LongTermMemory
from .memory_extractor import MemoryExtractor
from .planner import Planner, TaskPlan
from .reflector import Reflector, ReflectionVerdict

ToolHook = Callable[[str, dict[str, Any], bool, str], None]  # (工具名, 参数, 是否成功, 结果文本)


@dataclass
class ToolUse:
    """一次实际发生的工具调用记录。"""

    name: str
    arguments: dict[str, Any]
    ok: bool
    result: str
    latency_ms: float = 0.0
    retries: int = 0


@dataclass
class AgentResult:
    content: str
    turns: int = 0                                   # 实际消耗的 LLM 调用轮数
    tool_uses: list[ToolUse] = field(default_factory=list)
    interrupted: bool = False                        # 是否因达到最大轮数而中断
    total_cost_yuan: float = 0.0                     # 本次任务总花费（元）
    total_tokens: int = 0                           # 本次任务总 token 数


# 可自动重试的工具错误关键词（网络超时类）
_RETRYABLE_ERRORS = (
    "超时", "timeout", "timed out",
    "连接", "connection", "network",
    "502", "503", "504",
)


def _is_retryable_error(result: str) -> bool:
    """判断工具错误是否值得自动重试。"""
    low = result.lower()
    return any(err in low for err in _RETRYABLE_ERRORS)


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
        telemetry: Telemetry | None = None,
        tool_max_retries: int = 1,  # 工具失败自动重试次数（仅网络类错误）
        long_term_memory: LongTermMemory | None = None,
        memory_extractor: MemoryExtractor | None = None,
        planner: Planner | None = None,
        reflector: Reflector | None = None,  # 自我反思器（可选）
    ) -> None:
        self.llm = llm
        self.tools = tools
        self.base_system_prompt = system_prompt
        self.max_turns = max_turns
        self.memory = memory or Memory()
        self.on_tool = on_tool
        self.telemetry = telemetry
        self.tool_max_retries = tool_max_retries
        self.long_term_memory = long_term_memory
        self.memory_extractor = memory_extractor
        self.planner = planner
        self.reflector = reflector

        # 动态 system prompt（每次调用时拼接长期记忆）
        self.system_prompt = system_prompt

    def run(self, user_input: str, *, on_delta: Callable[[str], None] | None = None) -> AgentResult:
        """执行一次任务。

        :param on_delta: 流式输出回调：LLM 每产生一段文本就回调一次（打字机效果）。
                        传了就用 chat_stream，否则一次性返回。
        """
        # 复杂任务先生成计划
        plan: TaskPlan | None = None
        if self.planner:
            try:
                plan = self.planner.create_plan(user_input)
            except Exception:
                plan = None

        # 动态拼接 system prompt（基础 + 长期记忆 + 任务计划）
        system_prompt = self.base_system_prompt
        if self.long_term_memory:
            system_prompt += self.long_term_memory.build_context_prompt()
        if plan:
            system_prompt += plan.to_prompt()

        messages: list[dict[str, Any]] = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.extend(self.memory.messages())
        messages.append({"role": "user", "content": user_input})

        tool_uses: list[ToolUse] = []
        total_cost: float = 0.0
        total_tokens: int = 0

        for turn in range(1, self.max_turns + 1):
            # ---- 调用 LLM，计时 ----
            t0 = time.time()
            if on_delta is not None:
                response = self.llm.chat_stream(messages, tools=self.tools.schemas(), on_delta=on_delta)
            else:
                response = self.llm.chat(messages, tools=self.tools.schemas())
            latency_ms = (time.time() - t0) * 1000

            # ---- 记录 telemetry ----
            if self.telemetry:
                cost = self.telemetry.record_llm(
                    response.usage, latency_ms, detail=f"turn {turn}"
                )
                total_cost += cost
                total_tokens += response.usage.total

            # ---- 模型给出最终回答 ----
            if not response.tool_calls:
                # 自我反思：如果启用了 reflector，先评估一下
                if self.reflector:
                    try:
                        verdict = self.reflector.evaluate(
                            user_input, response.content, tool_uses
                        )
                        # 如果不通过，把改进建议加进消息，让 Agent 继续
                        if not verdict.passed and verdict.feedback:
                            # 把当前回答作为历史，加上改进建议
                            messages.append({
                                "role": "assistant",
                                "content": response.content,
                            })
                            messages.append({
                                "role": "user",
                                "content": f"你的上一个回答不够好。问题：{'; '.join(verdict.issues)}。改进建议：{verdict.feedback}。请重新回答，确保覆盖所有要点。",
                            })
                            # 继续下一轮，不返回
                            continue
                    except Exception:
                        pass  # 反思失败不阻塞主流程

                self.memory.add("user", user_input)
                self.memory.add("assistant", response.content)

                # 自动提取记忆（异步式，失败不影响主流程）
                if self.memory_extractor:
                    try:
                        self.memory_extractor.extract_from_conversation(
                            user_input, response.content
                        )
                    except Exception:
                        pass  # 记忆提取失败就静默跳过

                return AgentResult(
                    content=response.content,
                    turns=turn,
                    tool_uses=tool_uses,
                    total_cost_yuan=total_cost,
                    total_tokens=total_tokens,
                )

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
            if response.raw and response.raw.get("type") == "message":
                # Anthropic 的 thinking 签名与工具块需原样回传，仅保留在本次运行中。
                messages[-1]["_anthropic_content"] = response.raw.get("content", [])

            # ---- 并发执行所有工具调用 ----
            # 结果按 tc 顺序返回，保证消息顺序和 LLM 输出一致
            results: list[tuple[bool, str, float, int]] = [None] * len(response.tool_calls)  # type: ignore

            def _run_one(idx: int, tc) -> None:
                results[idx] = self._execute_tool_with_retry(tc.name, tc.arguments)

            threads: list[threading.Thread] = []
            for idx, tc in enumerate(response.tool_calls):
                t = threading.Thread(target=_run_one, args=(idx, tc), daemon=True)
                t.start()
                threads.append(t)
            for t in threads:
                t.join()

            # ---- 处理结果（按顺序）----
            for idx, tc in enumerate(response.tool_calls):
                ok, result, elapsed, retries = results[idx]
                use = ToolUse(
                    name=tc.name,
                    arguments=tc.arguments,
                    ok=ok,
                    result=result,
                    latency_ms=elapsed,
                    retries=retries,
                )
                tool_uses.append(use)

                if self.telemetry:
                    self.telemetry.record_tool(
                        tc.name, elapsed,
                        detail=f"{'成功' if ok else '失败'} {str(tc.arguments)[:80]}"
                    )
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
            total_cost_yuan=total_cost,
            total_tokens=total_tokens,
        )

    def _execute_tool_with_retry(self, name: str, arguments: dict) -> tuple[bool, str, float, int]:
        """执行工具，网络类错误自动重试。返回 (是否成功, 结果, 耗时ms, 重试次数)。"""
        retries = 0
        t0 = time.time()
        ok, result = self.tools.run(name, arguments)

        while not ok and retries < self.tool_max_retries and _is_retryable_error(result):
            retries += 1
            time.sleep(1.0 * retries)  # 简单退避
            ok, result = self.tools.run(name, arguments)

        elapsed = (time.time() - t0) * 1000
        return ok, result, elapsed, retries

    def reset(self) -> None:
        self.memory.clear()
