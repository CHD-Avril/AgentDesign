"""上下文管理测试：token 估算、按预算滑动窗口裁剪、Agent 集成。"""
from __future__ import annotations

import tempfile
from pathlib import Path

from agent.core import Agent
from agent.memory import Memory, estimate_tokens
from llm.mock_client import ScriptedMockClient
from tools import default_registry


def test_estimate_tokens():
    assert estimate_tokens("") == 0
    assert estimate_tokens("你好世界") > 0          # 中文按 1 字 ≈ 1 token
    zh = estimate_tokens("你好世界")
    assert zh <= 5
    assert estimate_tokens("hello") >= 1            # 英文按 4 字符 ≈ 1 token
    assert estimate_tokens("hello world") < estimate_tokens("你好世界" * 20)


def test_memory_keeps_within_budget():
    """固定每条 10 tokens：30 条 × 10 = 300，预算 100 → 应只剩最新 10 条。"""
    mem = Memory(max_tokens=100, tokenizer=lambda s: 10)
    for i in range(30):
        mem.add("user" if i % 2 == 0 else "assistant", f"msg{i}")

    msgs = mem.messages()
    assert len(msgs) == 10
    assert msgs[-1]["content"] == "msg29"
    assert msgs[0]["content"] == "msg20" and msgs[0]["role"] == "user"
    assert mem.dropped_total == 20
    assert mem.usage()["tokens"] == 100


def test_memory_trims_oldest_pairs():
    """成对裁剪：始终保留最新内容，丢弃最老对话对。"""
    mem = Memory(max_tokens=40, tokenizer=lambda s: 10)
    for i in range(12):
        mem.add("user" if i % 2 == 0 else "assistant", f"m{i}")
    assert mem.dropped_total == 8                   # 累计裁剪 4 对
    contents = [m["content"] for m in mem.messages()]
    assert contents == ["m8", "m9", "m10", "m11"]
    assert "m0" not in contents
    # 触发一次裁剪后，dropped_last 反映当次裁剪数
    mem.add("user", "新问题")
    assert mem.dropped_last == 2


def test_memory_single_huge_message_kept():
    """单条消息超过预算时：至少保留最新一条，不截断内容。"""
    mem = Memory(max_tokens=10, tokenizer=lambda s: 100)
    mem.add("user", "超长内容" * 50)
    assert len(mem.messages()) == 1
    assert mem.messages()[0]["role"] == "user"


def test_agent_with_small_context_keeps_working():
    """Agent 配小预算上下文：多轮对话仍正常，且记忆被自动裁剪。"""
    final = ScriptedMockClient([{"type": "final", "content": "收到"}])
    with tempfile.TemporaryDirectory() as d:
        agent = Agent(
            final,
            default_registry(Path(d)),
            max_turns=5,
            memory=Memory(max_tokens=50, tokenizer=lambda s: 20),
        )
        for _ in range(5):
            agent.run("再聊一句")

    msgs = agent.memory.messages()
    assert 0 < len(msgs) <= 4
    assert agent.memory.usage()["tokens"] <= 50
    assert agent.memory.dropped_total > 0
