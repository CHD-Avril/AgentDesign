"""任务规划器：接到复杂任务时，先生成步骤计划，再按计划执行。

解决的问题：
- 简单任务直接执行（不浪费 token 做规划）
- 复杂任务（多步、多工具、跨领域）先输出计划，再按计划走
- 计划可以动态调整（执行中发现不对可以修正）
"""
from __future__ import annotations

import json
from dataclasses import dataclass, field
from typing import Any

from llm.base import LLMClient


@dataclass
class PlanStep:
    """计划中的一个步骤。"""
    step_id: int
    description: str
    tool_hint: str = ""  # 建议用什么工具（可选）
    status: str = "pending"  # pending / in_progress / done / failed


@dataclass
class TaskPlan:
    """一个完整的任务计划。"""
    goal: str
    steps: list[PlanStep] = field(default_factory=list)
    current_step: int = 0

    def to_prompt(self) -> str:
        """把计划转成提示词，拼到 system prompt 里。"""
        lines = [f"\n【任务计划】目标：{self.goal}"]
        lines.append("请按以下步骤执行（当前进行到第 {} 步）：".format(self.current_step + 1))
        for s in self.steps:
            mark = {
                "pending": "  ",
                "in_progress": "▶ ",
                "done": "✓ ",
                "failed": "✗ ",
            }.get(s.status, "  ")
            lines.append(f"  {mark}{s.step_id}. {s.description}")
        lines.append("完成一步后再进行下一步，不要跳步。")
        return "\n".join(lines)

    def mark_done(self, step_id: int, success: bool = True) -> None:
        for s in self.steps:
            if s.step_id == step_id:
                s.status = "done" if success else "failed"
        # 更新当前步
        for i, s in enumerate(self.steps):
            if s.status == "pending":
                self.current_step = i
                break


# 简单的启发式判断：什么任务需要规划
_COMPLEX_KEYWORDS = (
    "比较", "分析", "总结", "写一份", "生成一份", "帮我做",
    "调研", "研究", "整理", "设计", "实现", "计算一下",
    "第一步", "然后", "最后", "流程", "步骤",
)


def needs_planning(user_input: str) -> bool:
    """启发式判断：这个任务是否需要规划。"""
    text = user_input.strip()
    # 太短的任务不需要规划
    if len(text) < 20:
        return False
    # 包含复杂关键词
    return any(kw in text for kw in _COMPLEX_KEYWORDS)


_PLAN_PROMPT = """你是一个任务规划助手。请把用户的复杂任务拆解成 3-7 个清晰的执行步骤。

要求：
1. 每一步用一句话描述，具体可执行。
2. 步骤之间有逻辑顺序（前一步是后一步的基础）。
3. 不要太细（不要把"调用XX工具"写进步骤，那是执行时的事），也不要太粗。
4. 返回 JSON 格式：{"goal": "任务目标", "steps": ["步骤1", "步骤2", ...]}

用户任务：
"""


class Planner:
    """任务规划器：复杂任务先生成计划。"""

    def __init__(self, llm: LLMClient) -> None:
        self.llm = llm

    def create_plan(self, user_input: str) -> TaskPlan | None:
        """为用户任务生成计划；不需要规划时返回 None。"""
        if not needs_planning(user_input):
            return None

        messages = [
            {"role": "system", "content": _PLAN_PROMPT},
            {"role": "user", "content": user_input},
        ]
        try:
            response = self.llm.chat(messages)
            content = response.content.strip()
            # 提取 JSON
            if "```" in content:
                content = content.split("```")[1].replace("json", "", 1).strip()
            start = content.find("{")
            end = content.rfind("}") + 1
            if start >= 0 and end > start:
                data = json.loads(content[start:end])
            else:
                data = json.loads(content)
        except Exception:
            return None  # 规划失败就不规划，直接执行

        steps = [
            PlanStep(step_id=i + 1, description=s)
            for i, s in enumerate(data.get("steps", []))
        ]
        if not steps:
            return None

        return TaskPlan(
            goal=data.get("goal", user_input[:50]),
            steps=steps,
        )
