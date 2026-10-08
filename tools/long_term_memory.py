"""长期记忆工具：让 Agent 能主动记住、查询、更新关于用户的长期记忆。

这些工具让 Agent 自己决定"什么值得记住"，而不是完全依赖自动提取。
"""
from __future__ import annotations

from typing import Any

from agent.long_term_memory import LongTermMemory
from tools.base import Tool


class RememberTool(Tool):
    """主动记住一条关于用户的信息。"""

    name = "remember"
    description = (
        "记住一条关于用户的重要信息（跨会话持久化）。"
        "当用户告诉你他的偏好、背景、正在做的项目、或任何值得长期记住的事时使用。"
        "比如用户说'我是学生'、'我喜欢简洁回答'、'我在做一个Agent项目'。"
    )
    parameters = {
        "type": "object",
        "properties": {
            "content": {"type": "string", "description": "要记住的内容，用一句话描述"},
            "type": {"type": "string", "description": "类型：fact=事实 或 preference=偏好", "enum": ["fact", "preference"]},
            "key": {"type": "string", "description": "如果是偏好，偏好的键名（如'回答风格'、'职业'）"},
        },
        "required": ["content", "type"],
    }

    def __init__(self, ltm: LongTermMemory) -> None:
        self.ltm = ltm

    def run(self, content: str, type: str = "fact", key: str = "") -> str:
        if type == "preference":
            if not key.strip():
                return "偏好类型必须提供 key（偏好名）。"
            self.ltm.set_preference(key.strip(), content.strip())
            return f"已记住偏好：{key} = {content}"
        else:
            self.ltm.add_fact(content.strip(), source="agent")
            return f"已记住：{content}"


class RecallTool(Tool):
    """查询长期记忆：关于用户你都记住了什么。"""

    name = "recall"
    description = (
        "查询你之前记住的关于用户的所有信息（偏好和事实）。"
        "当你不确定用户的偏好或背景时，先用这个工具回忆一下。"
    )
    parameters = {
        "type": "object",
        "properties": {},
    }

    def __init__(self, ltm: LongTermMemory) -> None:
        self.ltm = ltm

    def run(self) -> str:
        prefs = self.ltm.all_preferences()
        facts = self.ltm.all_facts()

        lines = ["【长期记忆】"]
        if prefs:
            lines.append("\n用户偏好：")
            for k, v in prefs.items():
                lines.append(f"  - {k}：{v}")
        if facts:
            lines.append("\n已记住的事实：")
            for f in facts:
                lines.append(f"  - {f.content}")
        if not prefs and not facts:
            lines.append("（还没有任何长期记忆）")
        return "\n".join(lines)


class ForgetTool(Tool):
    """删除一条或全部长期记忆。"""

    name = "forget"
    description = (
        "删除关于用户的记忆。当用户说'忘掉我说过的XX'时使用。"
        "不带参数时清空全部长期记忆。"
    )
    parameters = {
        "type": "object",
        "properties": {
            "key": {"type": "string", "description": "要删除的偏好键名；不填则清空全部记忆"},
        },
    }

    def __init__(self, ltm: LongTermMemory) -> None:
        self.ltm = ltm

    def run(self, key: str = "") -> str:
        if key.strip():
            self.ltm.delete_preference(key.strip())
            return f"已删除偏好：{key}"
        else:
            n = self.ltm.clear_facts()
            # 偏好也清空
            for k in list(self.ltm.all_preferences().keys()):
                self.ltm.delete_preference(k)
            return f"已清空全部长期记忆（删除了 {n} 条事实）"
