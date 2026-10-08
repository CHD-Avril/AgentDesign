"""Qwen Embedding 客户端：把文本转成向量（用于 RAG 检索）。

调用阿里云百炼的 text-embedding-v3 接口，OpenAI 兼容格式。
零第三方依赖，只用 urllib。
"""
from __future__ import annotations

import json
import math
import urllib.request
from typing import Any


class EmbeddingClient:
    """文本嵌入客户端：把文本转成稠密向量。"""

    def __init__(
        self,
        api_key: str,
        base_url: str = "https://dashscope.aliyuncs.com/compatible-mode/v1",
        model: str = "text-embedding-v3",
        timeout: int = 30,
    ) -> None:
        if not api_key:
            raise ValueError("缺少 API Key：embedding 需要 QWEN_API_KEY。")
        self.api_key = api_key
        self.model = model
        self.timeout = timeout
        self._endpoint = base_url.rstrip("/") + "/embeddings"

    def embed(self, text: str) -> list[float]:
        """把单条文本转成向量。"""
        vectors = self.embed_batch([text])
        return vectors[0] if vectors else []

    def embed_batch(self, texts: list[str]) -> list[list[float]]:
        """批量把文本转成向量（一次请求多条，更高效）。"""
        if not texts:
            return []
        payload: dict[str, Any] = {
            "model": self.model,
            "input": texts,
        }
        request = urllib.request.Request(
            self._endpoint,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=self.timeout) as resp:
                data = json.loads(resp.read().decode("utf-8"))
        except Exception as err:
            raise RuntimeError(f"Embedding API 调用失败：{type(err).__name__}: {err}") from err

        # OpenAI 兼容格式：data = [{"embedding": [...], "index": 0}, ...]
        items = data.get("data") or []
        # 按 index 排序，保证顺序正确
        items.sort(key=lambda x: x.get("index", 0))
        return [item.get("embedding", []) for item in items]


def cosine_similarity(a: list[float], b: list[float]) -> float:
    """计算两个向量的余弦相似度。"""
    if not a or not b or len(a) != len(b):
        return 0.0
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)
