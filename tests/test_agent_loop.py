"""Agent 循环测试：用剧本式模拟 LLM 验证 思考→调工具→观察→回答 的闭环。"""
from __future__ import annotations

import tempfile
from pathlib import Path

from agent.core import Agent
from llm.mock_client import ScriptedMockClient
from tools import default_registry


def test_loop_executes_tool_then_answers():
    script = [
        {"type": "tool", "name": "calculator", "arguments": {"expression": "1+1"}},
        {"type": "final", "content": "结果是 2"},
    ]
    llm = ScriptedMockClient(script)
    with tempfile.TemporaryDirectory() as d:
        agent = Agent(llm, default_registry(Path(d)), max_turns=5)
        result = agent.run("1+1 等于几？")

    assert result.content == "结果是 2"
    assert result.turns == 2                       # 一次工具轮 + 一次最终回答
    assert len(result.tool_uses) == 1
    assert result.tool_uses[0].name == "calculator"
    assert result.tool_uses[0].ok is True


def test_loop_handles_unknown_tool_without_crash():
    script = [
        {"type": "tool", "name": "no_such_tool", "arguments": {}},
        {"type": "final", "content": "该工具不存在"},
    ]
    llm = ScriptedMockClient(script)
    with tempfile.TemporaryDirectory() as d:
        agent = Agent(llm, default_registry(Path(d)), max_turns=5)
        result = agent.run("测试")

    assert result.tool_uses[0].ok is False
    assert "不存在" in result.tool_uses[0].result
    assert result.content == "该工具不存在"


def test_loop_stops_at_max_turns():
    script = [{"type": "tool", "name": "calculator", "arguments": {"expression": "1"}}] * 10
    llm = ScriptedMockClient(script)
    with tempfile.TemporaryDirectory() as d:
        agent = Agent(llm, default_registry(Path(d)), max_turns=3)
        result = agent.run("循环测试")

    assert result.interrupted is True
    assert result.turns == 3
    assert len(result.tool_uses) == 3


def test_memory_keeps_history():
    llm = ScriptedMockClient([{"type": "final", "content": "记住了"}])
    with tempfile.TemporaryDirectory() as d:
        agent = Agent(llm, default_registry(Path(d)), max_turns=5)
        agent.run("我叫小明")
        msgs = agent.memory.messages()

    assert msgs[0] == {"role": "user", "content": "我叫小明"}
    assert msgs[1] == {"role": "assistant", "content": "记住了"}


def test_on_tool_hook_fires():
    called: list[tuple] = []

    def hook(name, args, ok, result):
        called.append((name, ok))

    script = [
        {"type": "tool", "name": "calculator", "arguments": {"expression": "2*3"}},
        {"type": "final", "content": "6"},
    ]
    llm = ScriptedMockClient(script)
    with tempfile.TemporaryDirectory() as d:
        agent = Agent(llm, default_registry(Path(d)), max_turns=5, on_tool=hook)
        agent.run("2*3？")

    assert called == [("calculator", True)]


def test_run_stream_delta():
    """流式模式：on_delta 应收到最终回答的全部文本。"""
    llm = ScriptedMockClient([{"type": "final", "content": "流式输出内容"}])
    received: list[str] = []
    with tempfile.TemporaryDirectory() as d:
        agent = Agent(llm, default_registry(Path(d)), max_turns=5)
        result = agent.run("测试", on_delta=lambda text: received.append(text))

    assert result.content == "流式输出内容"
    assert "".join(received) == "流式输出内容"


def test_run_stream_with_tool_then_answer():
    """流式模式 + 工具调用：先执行工具，再流式输出最终回答。"""
    script = [
        {"type": "tool", "name": "calculator", "arguments": {"expression": "7*6"}},
        {"type": "final", "content": "结果是 42"},
    ]
    llm = ScriptedMockClient(script)
    received: list[str] = []
    with tempfile.TemporaryDirectory() as d:
        agent = Agent(llm, default_registry(Path(d)), max_turns=5)
        result = agent.run("7*6？", on_delta=lambda text: received.append(text))

    assert result.content == "结果是 42"
    assert "".join(received) == "结果是 42"
    assert result.tool_uses[0].name == "calculator"
