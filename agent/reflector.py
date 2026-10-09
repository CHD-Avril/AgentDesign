"""自我反思器（Reflector）：执行完后让 LLM 自评，不满意就回炉重做。

经典 Agent 架构的三阶段：Planner → Executor → Reflector
Reflector 的作用：
  1. 拿到最终回答后，让 LLM 自己检查"这个回答完整吗？准确吗？"
  2. 如果评分低于阈值，就给出改进建议，让主 Agent 重新执行

用法：
    reflector = Reflector(llm)
    verdict = reflector.evaluate(question, answer, tool_uses)
    if not verdict.passed:
        # 把改进建议喂回去，让 Agent 重新做
"""
from __future__ import annotations

import json
from dataclasses import dataclass

from llm.base import LLMClient


@dataclass
class ReflectionVerdict:
    """反思结果。"""
    passed: bool           # 是否通过（满意）
    score: float           # 评分 0-10
    feedback: str          # 改进建议
    issues: list[str]      # 发现的问题列表


class Reflector:
    """自我反思器。"""

    def __init__(
        self,
        llm: LLMClient,
        *,
        threshold: float = 7.0,   # 及格线，低于这个分就回炉
        max_rounds: int = 1,      # 最多反思几轮
    ) -> None:
        self.llm = llm
        self.threshold = threshold
        self.max_rounds = max_rounds

    def evaluate(
        self,
        question: str,
        answer: str,
        tool_uses: list | None = None,
    ) -> ReflectionVerdict:
        """评估回答质量，给出是否通过的结论。

        :param question: 用户原始问题
        :param answer: Agent 给出的回答
        :param tool_uses: 用到的工具列表（可选，帮助判断）
        """
        tool_summary = ""
        if tool_uses:
            tool_names = [tu.name for tu in tool_uses]
            tool_summary = f"\n\n用到的工具：{', '.join(tool_names)}"

        prompt = f"""你是一个严格的质量审核员。请评估下面这个 AI 助手的回答质量。

用户问题：{question}

AI 回答：{answer}{tool_summary}

请从以下几个维度评估：
1. **完整性**：是否回答了用户的所有问题？有没有遗漏？
2. **准确性**：内容是否正确？有没有明显错误？
3. **清晰度**：表达是否清楚、有条理？
4. **有用性**：对用户来说有没有实际帮助？

请严格按照 JSON 格式输出（不要输出其他内容）：
{{
  "score": 0-10 的分数,
  "passed": true 或 false（分数 >= {self.threshold} 为 true）,
  "issues": ["问题1", "问题2"],
  "feedback": "如果不通过，给出具体的改进建议；如果通过，写'回答合格'"
}}"""

        try:
            response = self.llm.chat([
                {"role": "user", "content": prompt}
            ], tools=None)

            # 解析 JSON（可能带 markdown 代码块）
            text = response.content.strip()
            if text.startswith("```"):
                # 去掉 ```json ... ``` 包裹
                text = text.split("```")[1]
                if text.startswith("json"):
                    text = text[4:]
                text = text.strip()

            data = json.loads(text)
            return ReflectionVerdict(
                passed=bool(data.get("passed", False)),
                score=float(data.get("score", 0)),
                feedback=str(data.get("feedback", "")),
                issues=list(data.get("issues", [])),
            )
        except Exception as e:
            # 解析失败就默认通过，不阻塞主流程
            return ReflectionVerdict(
                passed=True,
                score=8.0,
                feedback="反思器解析失败，默认通过",
                issues=[],
            )
