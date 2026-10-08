"""知识库 RAG 核心：文档切分、向量存储、相似度检索。

零第三方依赖：向量存 JSON 文件，余弦相似度纯 Python 计算。
适合中小规模知识库（几千条文档块以内）；大规模可换 SQLite + numpy。
"""
from __future__ import annotations

import json
import re
import time
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Any

from llm.embedding import EmbeddingClient, cosine_similarity


@dataclass
class DocumentChunk:
    """一个文档块（chunk）。"""
    id: str               # 唯一ID
    text: str             # 块文本内容
    source: str           # 来源（文件名 / URL）
    chunk_index: int      # 在原文档中的序号
    embedding: list[float] = field(default_factory=list)
    created_at: float = 0.0


def split_text(
    text: str,
    chunk_size: int = 500,
    overlap: int = 100,
) -> list[str]:
    """把长文本切成重叠的小块。

    策略：优先按段落切，段落太长再按句子切，最后兜底按固定长度切。
    这样保证每个 chunk 语义相对完整。
    """
    text = text.strip()
    if not text:
        return []

    # 先按段落分
    paragraphs = re.split(r"\n\s*\n", text)
    chunks: list[str] = []
    current = ""

    for para in paragraphs:
        para = para.strip()
        if not para:
            continue
        # 当前段落 + 现有内容没超过 chunk_size，就合并
        if len(current) + len(para) + 1 <= chunk_size:
            current = f"{current}\n{para}".strip() if current else para
        else:
            # 当前段落本身就很长，按句子再切
            if current:
                chunks.append(current)
                current = ""
            # 按句号/问号/感叹号切
            sentences = re.split(r"(?<=[。！？.!?])\s*", para)
            for sent in sentences:
                sent = sent.strip()
                if not sent:
                    continue
                if len(current) + len(sent) + 1 <= chunk_size:
                    current = f"{current} {sent}".strip() if current else sent
                else:
                    if current:
                        chunks.append(current)
                    # 句子也太长，硬切
                    if len(sent) > chunk_size:
                        for i in range(0, len(sent), chunk_size - overlap):
                            chunks.append(sent[i : i + chunk_size])
                        current = ""
                    else:
                        current = sent
    if current:
        chunks.append(current)

    # 加重叠（overlap）：前后块取一部分重叠，保证上下文连贯
    if overlap > 0 and len(chunks) > 1:
        overlapped = [chunks[0]]
        for i in range(1, len(chunks)):
            prev_tail = chunks[i - 1][-overlap:]
            overlapped.append(prev_tail + chunks[i])
        chunks = overlapped

    return chunks


@dataclass
class KnowledgeBase:
    """向量知识库：存储文档块 + 向量，支持语义检索。

    用法：
        kb = KnowledgeBase(embedding_client, persist_path=Path("data/kb.json"))
        kb.add_text("关于AI的笔记...", source="notes.md")
        results = kb.search("什么是机器学习", top_k=3)
    """

    embedding_client: EmbeddingClient
    persist_path: Path | None = None
    chunks: list[DocumentChunk] = field(default_factory=list)
    _id_counter: int = 0

    def __post_init__(self) -> None:
        if self.persist_path and self.persist_path.exists():
            self._load()

    def _next_id(self) -> str:
        self._id_counter += 1
        return f"chunk_{int(time.time())}_{self._id_counter}"

    def add_text(self, text: str, source: str = "inline", chunk_size: int = 500) -> int:
        """添加一段文本到知识库，返回添加的块数。"""
        texts = split_text(text, chunk_size=chunk_size)
        if not texts:
            return 0

        # 批量计算 embedding（一次 API 调用）
        vectors = self.embedding_client.embed_batch(texts)

        for i, (t, v) in enumerate(zip(texts, vectors)):
            chunk = DocumentChunk(
                id=self._next_id(),
                text=t,
                source=source,
                chunk_index=i,
                embedding=v,
                created_at=time.time(),
            )
            self.chunks.append(chunk)

        self._save()
        return len(texts)

    def add_file(self, file_path: str | Path) -> int:
        """从文本文件加载（支持 .txt / .md / .csv）。"""
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"文件不存在：{path}")
        text = path.read_text(encoding="utf-8", errors="replace")
        return self.add_text(text, source=path.name)

    def search(self, query: str, top_k: int = 3) -> list[dict[str, Any]]:
        """语义检索：返回最相关的 top_k 个文档块。

        返回 [{"text": ..., "source": ..., "score": 相似度}, ...]
        """
        if not self.chunks:
            return []

        query_vec = self.embedding_client.embed(query)
        scored = []
        for chunk in self.chunks:
            score = cosine_similarity(query_vec, chunk.embedding)
            scored.append({
                "text": chunk.text,
                "source": chunk.source,
                "score": round(score, 4),
                "chunk_index": chunk.chunk_index,
            })

        scored.sort(key=lambda x: x["score"], reverse=True)
        return scored[:top_k]

    def list_sources(self) -> list[dict[str, Any]]:
        """列出知识库中所有文档来源及块数。"""
        sources: dict[str, int] = {}
        for c in self.chunks:
            sources[c.source] = sources.get(c.source, 0) + 1
        return [{"source": k, "chunks": v} for k, v in sorted(sources.items())]

    def clear(self, source: str | None = None) -> int:
        """清空知识库；指定 source 时只删该来源的文档。返回删除的块数。"""
        if source is None:
            n = len(self.chunks)
            self.chunks.clear()
        else:
            before = len(self.chunks)
            self.chunks = [c for c in self.chunks if c.source != source]
            n = before - len(self.chunks)
        self._save()
        return n

    def _save(self) -> None:
        if not self.persist_path:
            return
        self.persist_path.parent.mkdir(parents=True, exist_ok=True)
        data = [asdict(c) for c in self.chunks]
        self.persist_path.write_text(
            json.dumps(data, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )

    def _load(self) -> None:
        try:
            data = json.loads(self.persist_path.read_text(encoding="utf-8"))
            self.chunks = [DocumentChunk(**item) for item in data]
            if self.chunks:
                self._id_counter = max(
                    int(c.id.rsplit("_", 1)[-1]) for c in self.chunks
                )
        except Exception:
            self.chunks = []  # 损坏就重来

    def __len__(self) -> int:
        return len(self.chunks)
