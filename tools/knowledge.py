"""知识库工具：让 Agent 能检索知识库、添加文档、列出知识来源。

依赖 agent.rag.KnowledgeBase；在 factory.py 中装配时传入。
"""
from __future__ import annotations

from typing import Any

from agent.rag import KnowledgeBase
from tools.base import Tool


class KnowledgeSearchTool(Tool):
    """语义检索知识库：查询相关文档片段。"""

    name = "knowledge_search"
    description = (
        "在本地知识库中语义检索相关资料。"
        "当用户询问你已经收录过的文档/笔记/资料时使用这个工具，不要凭记忆回答。"
        "返回最相关的文档片段及来源。"
    )
    parameters = {
        "type": "object",
        "properties": {
            "query": {"type": "string", "description": "检索关键词或问题"},
            "top_k": {"type": "integer", "description": "返回条数，默认 3，最大 5"},
        },
        "required": ["query"],
    }

    def __init__(self, kb: KnowledgeBase) -> None:
        self.kb = kb

    def run(self, query: str, top_k: int = 3) -> str:
        if len(self.kb) == 0:
            return "知识库为空，请先添加文档。"
        try:
            top_k = max(1, min(int(top_k), 5))
        except (TypeError, ValueError):
            top_k = 3
        results = self.kb.search(query, top_k=top_k)
        if not results:
            return "没有找到相关内容。"

        lines = [f"找到 {len(results)} 条相关内容：\n"]
        for i, r in enumerate(results, 1):
            lines.append(f"【片段 {i}】来源：{r['source']}（相关度 {r['score']}）")
            lines.append(r["text"][:500])
            lines.append("")
        return "\n".join(lines)


class KnowledgeAddTool(Tool):
    """向知识库添加一段文本（用于临时收录用户提供的资料）。"""

    name = "knowledge_add"
    description = (
        "把一段文本/资料添加到知识库，供以后检索使用。"
        "当用户给你一段重要资料让你记住、或要求保存参考资料时使用。"
    )
    parameters = {
        "type": "object",
        "properties": {
            "text": {"type": "string", "description": "要保存的文本内容"},
            "source": {"type": "string", "description": "来源标识（如文件名、标题），默认 'user_note'"},
        },
        "required": ["text"],
    }

    def __init__(self, kb: KnowledgeBase) -> None:
        self.kb = kb

    def run(self, text: str, source: str = "user_note") -> str:
        if not text.strip():
            return "内容为空，未添加。"
        n = self.kb.add_text(text, source=source)
        return f"已添加 {n} 个文档块到知识库（来源：{source}），当前共 {len(self.kb)} 块。"


class KnowledgeListTool(Tool):
    """列出知识库中所有文档来源。"""

    name = "knowledge_list"
    description = "列出知识库中所有已收录的文档来源及各自的块数。"
    parameters = {
        "type": "object",
        "properties": {},
    }

    def __init__(self, kb: KnowledgeBase) -> None:
        self.kb = kb

    def run(self) -> str:
        sources = self.kb.list_sources()
        if not sources:
            return "知识库为空。"
        lines = [f"知识库共 {len(self.kb)} 个文档块，来源如下："]
        for s in sources:
            lines.append(f"  - {s['source']}：{s['chunks']} 块")
        return "\n".join(lines)
