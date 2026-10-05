"""会话记忆：按 token 预算保留最近的对话，超出自动裁剪（滑动窗口）。

设计：
- 上限按 token 数计（默认 100k），而不是按轮数——保证不超模型上下文；
- 超出时成对丢弃最老的 (user, assistant)，尽量保持对话连贯；
- 分词器可插拔：默认内置估算器（零依赖），可换成 tiktoken 等精确分词器。
"""
from __future__ import annotations

import re
from typing import Any, Callable

Tokenizer = Callable[[str], int]

# 中/日/韩 + 全角标点区间
_CJK_RE = re.compile(r"[\u3400-\u9fff\u3000-\u303f\uff00-\uffef]")


def estimate_tokens(text: str) -> int:
    """粗略估算 token 数（不引入第三方分词器）。

    规则：中文/全角字符 ≈ 1 token；英文/数字/半角标点 ≈ 每 4 字符 1 token；
    末尾加 ~10% 余量。qwen 类模型的真实分词数通常低于此估算，留余量更安全。
    """
    if not text:
        return 0
    cjk = len(_CJK_RE.findall(text))
    other = max(0, len(text) - cjk)
    return max(1, int((cjk + other / 4 + 1) * 1.1))


class Memory:
    """只保留 user / assistant 轮次；system 提示由 Agent 每次重建，不计入这里。

    :param max_tokens: 上下文预算（token 数）。超出后自动丢弃最老的完整对话对。
    :param tokenizer:  可插拔的分词器，默认 estimate_tokens。
    """

    def __init__(self, max_tokens: int = 100_000, tokenizer: Tokenizer | None = None) -> None:
        self.max_tokens = max(int(max_tokens), 1)
        self.tokenizer = tokenizer or estimate_tokens
        self._messages: list[dict[str, Any]] = []
        self.dropped_total = 0   # 累计被裁剪的消息条数
        self.dropped_last = 0    # 最近一次 add() 裁剪掉的条数

    def add(self, role: str, content: str) -> None:
        self.dropped_last = 0
        self._messages.append({"role": role, "content": content})
        self._trim()

    def _trim(self) -> None:
        while len(self._messages) > 1 and self._total_tokens() > self.max_tokens:
            # 成对丢弃最老的 (user, assistant)；只剩一条时也保留最后一条不截断
            n = 2 if len(self._messages) >= 4 else 1
            del self._messages[:n]
            self.dropped_total += n
            self.dropped_last += n

    def _total_tokens(self) -> int:
        return sum(self.tokenizer(m.get("content") or "") for m in self._messages)

    def messages(self) -> list[dict[str, Any]]:
        return list(self._messages)

    def clear(self) -> None:
        self._messages.clear()
        self.dropped_total = 0
        self.dropped_last = 0

    def usage(self) -> dict[str, int]:
        """当前上下文占用（便于界面显示）。"""
        return {
            "messages": len(self._messages),
            "tokens": self._total_tokens(),
            "max_tokens": self.max_tokens,
        }
