"""知识库 RAG 核心：文档切分、向量存储、两阶段检索（召回+重排）。

零第三方依赖：向量存 JSON 文件，余弦相似度纯 Python 计算。
高级特性：
  - 混合检索：向量语义检索 + 关键词检索（BM25 简易版）
  - 两阶段检索：先召回 top 20，再用 LLM 重排取 top 3-5
  - 查询改写：搜索前先让 LLM 优化查询词
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

    # ---- 关键词检索（简易 BM25 / 词频匹配）----
    def _keyword_search(self, query: str, top_k: int = 20) -> list[dict[str, Any]]:
        """关键词检索：基于词频的简易匹配（混合检索的一路）。"""
        if not self.chunks:
            return []
        keywords = [w.lower() for w in re.findall(r"[\w\u4e00-\u9fa5]+", query) if len(w) > 1]
        if not keywords:
            return []

        scored = []
        for chunk in self.chunks:
            text_lower = chunk.text.lower()
            # 计算命中关键词的数量（简易 TF）
            hits = sum(text_lower.count(kw) for kw in keywords)
            if hits > 0:
                # 归一化：命中数 / 文本长度
                score = hits / max(len(chunk.text) / 100, 1)
                scored.append({
                    "text": chunk.text,
                    "source": chunk.source,
                    "score": round(score, 4),
                    "chunk_index": chunk.chunk_index,
                })

        scored.sort(key=lambda x: x["score"], reverse=True)
        return scored[:top_k]

    def search_hybrid(self, query: str, top_k: int = 5, vector_weight: float = 0.7) -> list[dict[str, Any]]:
        """混合检索：向量语义 + 关键词，加权合并。

        :param vector_weight: 向量检索的权重（关键词权重 = 1 - vector_weight）
        """
        if not self.chunks:
            return []

        # 两路召回各取 top 20
        vector_results = self.search(query, top_k=20)
        keyword_results = self._keyword_search(query, top_k=20)

        # 合并去重（按文本内容去重）
        merged: dict[str, dict[str, Any]] = {}
        for r in vector_results:
            merged[r["text"]] = {
                **r,
                "vector_score": r["score"],
                "keyword_score": 0.0,
            }
        for r in keyword_results:
            if r["text"] in merged:
                merged[r["text"]]["keyword_score"] = r["score"]
            else:
                merged[r["text"]] = {
                    **r,
                    "vector_score": 0.0,
                    "keyword_score": r["score"],
                }

        # 加权综合打分
        for item in merged.values():
            # 归一化（简易：直接乘权重）
            item["score"] = round(
                item["vector_score"] * vector_weight +
                item["keyword_score"] * (1 - vector_weight),
                4,
            )

        results = sorted(merged.values(), key=lambda x: x["score"], reverse=True)
        return results[:top_k]

    # ---- 两阶段检索：召回 + Rerank ----
    def search_with_rerank(
        self,
        query: str,
        llm_client,
        *,
        recall_k: int = 20,    # 第一阶段召回多少条
        final_k: int = 5,      # 第二阶段最终保留多少条
    ) -> list[dict[str, Any]]:
        """两阶段检索：先混合召回 top recall_k，再用 LLM 重排取 top final_k。

        这是工业级 RAG 的标准做法：粗筛快、精排准。
        """
        if not self.chunks:
            return []

        # 第一阶段：混合召回（多取一点）
        candidates = self.search_hybrid(query, top_k=recall_k)
        if len(candidates) <= final_k:
            return candidates

        # 第二阶段：LLM 重排
        prompt = f"""用户的问题是：{query}

下面有 {len(candidates)} 段候选文档，请判断每段和问题的相关性，1-10 分。

"""
        for i, c in enumerate(candidates):
            prompt += f"\n[{i+1}] {c['text'][:200]}...\n"

        prompt += f"""
请严格按 JSON 格式输出（不要输出其他内容）：
{{
  "scores": [{", ".join(["分数"] * len(candidates))}],
  "reasoning": "简单说明"
}}"""

        try:
            response = llm_client.chat([{"role": "user", "content": prompt}])
            text = response.content.strip()
            if text.startswith("```"):
                text = text.split("```")[1]
                if text.startswith("json"):
                    text = text[4:]
                text = text.strip()

            import json as _json
            data = _json.loads(text)
            scores = data.get("scores", [])

            # 给每条加上 rerank 分数
            for i, c in enumerate(candidates):
                if i < len(scores):
                    c["rerank_score"] = float(scores[i])
                else:
                    c["rerank_score"] = c.get("score", 0)

            # 按 rerank 分数排序
            candidates.sort(key=lambda x: x.get("rerank_score", 0), reverse=True)
            return candidates[:final_k]
        except Exception:
            # 重排失败就退回普通混合检索
            return candidates[:final_k]

    # ---- 查询改写 ----
    @staticmethod
    def rewrite_query(query: str, llm_client) -> str:
        """搜索前先让 LLM 优化查询词（加关键词、补全语义）。"""
        prompt = f"""用户的原始查询是："{query}"

请把它改写成更适合搜索的关键词组合（更简洁、更精准），直接输出改写后的查询，不要解释。
例如："什么是AI" → "人工智能 定义 原理"
"""
        try:
            response = llm_client.chat([{"role": "user", "content": prompt}])
            rewritten = response.content.strip().strip('"').strip("'")
            return rewritten if rewritten else query
        except Exception:
            return query

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
