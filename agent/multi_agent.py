"""多Agent协作系统：主管-员工模式（Manager-Worker）。

架构：
  用户 → Manager Agent（拆解任务、分配、汇总）
           ├→ Worker 1（搜索Agent：负责查资料）
           ├→ Worker 2（写作Agent：负责整理成文章）
           └→ Worker 3（代码Agent：负责写代码）

Manager 用同一个 LLM，但有专门的 prompt 和工具（task_delegate）。
Worker 是轻量的独立 Agent 实例，各自有不同的 system prompt 和工具集。
"""
from __future__ import annotations

import json
from dataclasses import dataclass, field
from typing import Any

from agent.core import Agent, AgentResult
from llm.base import LLMClient
from tools.base import Tool
from tools.registry import ToolRegistry


@dataclass
class SubTask:
    """一个子任务。"""
    task_id: str
    description: str
    worker_type: str  # "search" / "writer" / "coder" / "general"
    result: str = ""
    status: str = "pending"  # pending / running / done / failed


# ---- 各 Worker 的系统提示词 ----

_WORKER_PROMPTS = {
    "search": """你是一个搜索专员。你的任务是：根据主管分配的子任务，用搜索和网页抓取工具收集信息，然后简洁地返回整理后的资料摘要。

要求：
1. 先调用 web_search 搜索关键词
2. 必要时用 http_fetch 抓取具体网页
3. 最后返回 300 字以内的摘要，列出关键信息和来源链接
""",
    "writer": """你是一个写作专员。你的任务是：根据主管提供的资料，写成结构清晰的文章或报告。

要求：
1. 先通读所有提供的资料
2. 组织成有逻辑的结构（开头、主体、结尾）
3. 语言简洁专业，适合直接交付
4. 长度按任务要求，没有要求就写 500-800 字
""",
    "coder": """你是一个代码专员。你的任务是：根据主管的要求，编写、调试代码。

要求：
1. 用 run_python 工具写代码并运行验证
2. 代码要简洁、可运行、有注释
3. 返回代码和运行结果说明
4. 遇到错误自己调试，直到能跑通
""",
    "general": """你是一个通用执行专员。你的任务是：根据主管分配的子任务，用可用的工具完成它，然后返回结果。

要求：
1. 仔细理解任务目标
2. 用合适的工具完成
3. 返回清晰的结果总结
""",
}


class DelegateTaskTool(Tool):
    """主管Agent专用：把任务分配给子Agent。"""

    name = "delegate_task"
    description = (
        "把一个子任务分配给专门的执行Agent。当任务复杂、需要多步或不同专长时使用。"
        "可用的worker类型：search（搜索资料）、writer（写文章）、coder（写代码）、general（通用）。"
        "返回子Agent的执行结果。"
    )
    parameters = {
        "type": "object",
        "properties": {
            "description": {"type": "string", "description": "子任务的详细描述（给worker的指令）"},
            "worker_type": {
                "type": "string",
                "description": "worker类型：search / writer / coder / general",
                "enum": ["search", "writer", "coder", "general"],
            },
        },
        "required": ["description", "worker_type"],
    }

    def __init__(self, orchestrator: "MultiAgentOrchestrator") -> None:
        self.orchestrator = orchestrator

    def run(self, description: str, worker_type: str = "general") -> str:
        return self.orchestrator.dispatch(description, worker_type)


class MultiAgentOrchestrator:
    """多Agent编排器：管理主管Agent和子Agent。"""

    def __init__(
        self,
        llm: LLMClient,
        base_tools: ToolRegistry,  # 所有可用工具（子Agent从中选）
        max_subtasks: int = 5,
    ) -> None:
        self.llm = llm
        self.base_tools = base_tools
        self.max_subtasks = max_subtasks
        self.subtasks: list[SubTask] = []

    def _create_worker_tools(self, worker_type: str) -> ToolRegistry:
        """根据worker类型，从基础工具集中挑选合适的工具。"""
        registry = ToolRegistry()

        # 所有worker都能用的基础工具
        always_available = ("calculator", "datetime_now", "file_read", "file_write", "file_list")

        # 各worker专属工具
        worker_tools = {
            "search": ("web_search", "http_fetch"),
            "writer": ("file_read", "file_write"),
            "coder": ("run_python", "shell", "file_write", "file_read"),
            "general": (),
        }

        available = set(always_available) | set(worker_tools.get(worker_type, ()))

        for name in self.base_tools.names():
            if name in available:
                tool = self.base_tools.get(name)
                if tool:
                    registry.register(tool)
        return registry

    def dispatch(self, task_description: str, worker_type: str) -> str:
        """分配一个子任务给指定类型的worker，返回执行结果。"""
        task = SubTask(
            task_id=f"task_{len(self.subtasks) + 1}",
            description=task_description,
            worker_type=worker_type,
            status="running",
        )
        self.subtasks.append(task)

        if len(self.subtasks) > self.max_subtasks:
            task.status = "failed"
            return f"已达到最大子任务数（{self.max_subtasks}），请精简任务。"

        # 创建worker agent
        worker_tools = self._create_worker_tools(worker_type)
        prompt = _WORKER_PROMPTS.get(worker_type, _WORKER_PROMPTS["general"])

        worker = Agent(
            self.llm,
            worker_tools,
            system_prompt=prompt,
            max_turns=8,  # 子agent轮数少一些，避免跑飞
        )

        try:
            result: AgentResult = worker.run(task_description)
            task.result = result.content
            task.status = "done"
            return f"【{worker_type} agent 执行结果】\n{result.content}"
        except Exception as err:
            task.status = "failed"
            task.result = str(err)
            return f"【{worker_type} agent 执行失败】{err}"

    def create_manager_agent(self, system_prompt: str = "") -> Agent:
        """创建主管Agent，带 delegate_task 工具。"""
        manager_tools = ToolRegistry()
        # 主管自己也能用一些基础工具
        for name in ("calculator", "datetime_now"):
            tool = self.base_tools.get(name)
            if tool:
                manager_tools.register(tool)
        # 加上任务分配工具
        manager_tools.register(DelegateTaskTool(self))

        default_prompt = """你是一个任务主管。你的工作方式：
1. 收到复杂任务时，先判断是否需要拆分成多个子任务
2. 简单任务自己直接完成；复杂任务用 delegate_task 分配给专门的worker
3. 子任务完成后，汇总所有结果，生成最终回答给用户

可用的worker：
- search：搜索资料、查信息
- writer：写文章、整理成报告
- coder：写代码、调试程序
- general：通用执行

原则：
- 能自己做的简单事不要麻烦worker
- 分给worker的任务要描述清楚、目标明确
- 最后一定要给用户一个完整的、自洽的回答，不要只甩worker的原始结果
"""
        return Agent(
            self.llm,
            manager_tools,
            system_prompt=system_prompt or default_prompt,
            max_turns=15,
        )


# ============================================================
# 辩论/投票模式（Debate / Voting）
# ============================================================

@dataclass
class DebateResult:
    """辩论结果。"""
    question: str
    answers: list[str]       # 每个agent的回答
    winner_index: int        # 最优答案的下标
    winner_answer: str       # 最优答案内容
    judge_reason: str        # 裁判理由
    all_scores: list[float]  # 每个答案的分数


class DebateOrchestrator:
    """辩论式多Agent：多个Agent各自回答，裁判Agent选最优。

    适用场景：
    - 开放性问题（没有标准答案，需要多方视角）
    - 重要决策（多几个角度更稳妥）
    - 创意生成（多几个方案选最好的）
    """

    def __init__(
        self,
        llm: LLMClient,
        base_tools: ToolRegistry,
        *,
        num_debaters: int = 3,       # 几个辩手
        debater_styles: list[str] | None = None,  # 每个辩手的风格
    ) -> None:
        self.llm = llm
        self.base_tools = base_tools
        self.num_debaters = num_debaters

        # 默认辩手风格（从不同角度思考）
        self.debater_styles = debater_styles or [
            "你是一个务实的工程师，注重可行性和落地细节。",
            "你是一个严谨的学者，注重逻辑严密和理论依据。",
            "你是一个创新的产品经理，注重用户体验和商业价值。",
        ]

    def debate(self, question: str) -> DebateResult:
        """发起一轮辩论。"""
        # 第一步：每个辩手独立回答
        answers: list[str] = []
        for i in range(min(self.num_debaters, len(self.debater_styles))):
            style = self.debater_styles[i]
            agent = Agent(
                self.llm,
                self.base_tools,
                system_prompt=f"{style}\n\n请认真回答用户的问题，给出你的观点和理由。",
                max_turns=6,
            )
            result = agent.run(question)
            answers.append(result.content)

        # 第二步：裁判Agent比较所有答案，选出最好的
        judge_prompt = f"""下面有 {len(answers)} 个AI助手对同一个问题的回答。

问题：{question}

"""
        for i, ans in enumerate(answers):
            judge_prompt += f"\n【回答 {i+1}】\n{ans}\n"

        judge_prompt += f"""
请你作为裁判，从以下几个维度评估每个回答：
1. 准确性（内容是否正确）
2. 完整性（是否覆盖了所有要点）
3. 实用性（对用户有没有实际帮助）
4. 逻辑性（推理是否严密）

请严格按 JSON 格式输出（不要输出其他内容）：
{{
  "scores": [{", ".join(["分数"] * len(answers))}],
  "winner": 最优回答的编号（1-{len(answers)}）,
  "reason": "为什么选这个（100字以内）"
}}"""

        try:
            response = self.llm.chat([{"role": "user", "content": judge_prompt}])
            text = response.content.strip()
            if text.startswith("```"):
                text = text.split("```")[1]
                if text.startswith("json"):
                    text = text[4:]
                text = text.strip()

            import json as _json
            data = _json.loads(text)
            scores = [float(s) for s in data.get("scores", [0] * len(answers))]
            winner = int(data.get("winner", 1)) - 1
            reason = str(data.get("reason", ""))

            return DebateResult(
                question=question,
                answers=answers,
                winner_index=winner,
                winner_answer=answers[winner],
                judge_reason=reason,
                all_scores=scores,
            )
        except Exception as e:
            # 裁判失败就默认选第一个
            return DebateResult(
                question=question,
                answers=answers,
                winner_index=0,
                winner_answer=answers[0],
                judge_reason=f"裁判解析失败，默认选第一个回答：{e}",
                all_scores=[8.0] * len(answers),
            )
