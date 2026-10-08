"""记忆提取器：用 LLM 自动从对话中提取值得长期记住的信息。

每次对话结束后调用一次，让 LLM 判断哪些内容值得记住，
自动写入长期记忆。零额外依赖——直接调用同一个 LLM 客户端。
"""
from __future__ import annotations

import json
from typing import Any

from agent.long_term_memory import LongTermMemory
from llm.base import LLMClient


_EXTRACT_PROMPT = """你是一个记忆提取助手。请从以下对话中提取值得长期记住的关于用户的信息。

提取规则：
1. 只提取稳定的、跨会话有用的信息（如用户的职业、偏好、重要背景、正在做的项目）。
2. 不要提取一次性的临时信息（如"今天天气怎么样"这种问句）。
3. 如果没有值得记住的，返回空列表。
4. 每条记忆用简短的一句话描述。

返回 JSON 格式：
{"facts": ["事实1", "事实2"], "preferences": {"偏好键": "偏好值"}}

对话内容：
---
"""


class MemoryExtractor:
    """对话结束后自动提取记忆。"""

    def __init__(self, llm: LLMClient, ltm: LongTermMemory) -> None:
        self.llm = llm
        self.ltm = ltm

    def extract_from_conversation(self, user_input: str, assistant_reply: str) -> int:
        """从一轮对话中提取记忆，返回新记忆的条数。"""
        conversation = f"用户：{user_input}\n助手：{assistant_reply}"
        messages = [
            {"role": "system", "content": _EXTRACT_PROMPT},
            {"role": "user", "content": conversation},
        ]

        try:
            response = self.llm.chat(messages)
            content = response.content.strip()
            # 提取 JSON（可能被 markdown 包裹）
            if "```" in content:
                content = content.split("```")[1].replace("json", "", 1).strip()
            start = content.find("{")
            end = content.rfind("}") + 1
            if start >= 0 and end > start:
                data = json.loads(content[start:end])
            else:
                data = json.loads(content)
        except Exception:
            return 0  # 提取失败就静默跳过，不影响主流程

        count = 0
        # 提取事实
        for fact in data.get("facts", []):
            if fact.strip():
                self.ltm.add_fact(fact.strip(), source="auto")
                count += 1
        # 提取偏好
        for k, v in data.get("preferences", {}).items():
            if k.strip() and v.strip():
                self.ltm.set_preference(k.strip(), v.strip())
                count += 1

        return count
