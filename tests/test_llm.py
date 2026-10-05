"""LLM 客户端解析测试（不联网，只测本地解析逻辑）。"""
from __future__ import annotations

from llm.qwen_client import QwenClient


def test_qwen_parse_tool_calls():
    client = QwenClient(api_key="sk-test")  # 仅测解析，不发请求
    data = {
        "choices": [{
            "message": {
                "content": "我来算一下",
                "tool_calls": [{
                    "id": "call_1",
                    "function": {"name": "calculator", "arguments": '{"expression": "1+1"}'},
                }],
            },
            "finish_reason": "tool_calls",
        }]
    }
    resp = client._parse(data)
    assert resp.content == "我来算一下"
    assert resp.finish_reason == "tool_calls"
    assert len(resp.tool_calls) == 1
    assert resp.tool_calls[0].name == "calculator"
    assert resp.tool_calls[0].arguments == {"expression": "1+1"}


def test_qwen_parse_plain_answer():
    client = QwenClient(api_key="sk-test")
    data = {"choices": [{"message": {"content": "你好"}, "finish_reason": "stop"}]}
    resp = client._parse(data)
    assert resp.content == "你好"
    assert resp.tool_calls == []
    assert resp.finish_reason == "stop"


def test_qwen_requires_key():
    try:
        QwenClient(api_key="")
    except ValueError:
        return
    raise AssertionError("缺少 API Key 时应抛出 ValueError")


def test_qwen_stream_assemble_text():
    client = QwenClient(api_key="sk-test")  # 仅测组装，不发请求
    chunks = [
        {"choices": [{"delta": {"content": "你好"}, "finish_reason": None}]},
        {"choices": [{"delta": {"content": "，世界"}, "finish_reason": None}]},
        {"choices": [{"delta": {}, "finish_reason": "stop"}]},
    ]
    resp = client._assemble_stream(chunks)
    assert resp.content == "你好，世界"
    assert resp.tool_calls == []
    assert resp.finish_reason == "stop"


def test_qwen_stream_assemble_tool_calls():
    """工具调用的 name / arguments 在流式中是增量片段，需正确拼接。"""
    client = QwenClient(api_key="sk-test")
    chunks = [
        {"choices": [{"delta": {"tool_calls": [
            {"index": 0, "id": "call_1", "function": {"name": "calcu", "arguments": ""}},
        ]}, "finish_reason": None}]},
        {"choices": [{"delta": {"tool_calls": [
            {"index": 0, "function": {"name": "lator", "arguments": '{"expr'}},
        ]}, "finish_reason": None}]},
        {"choices": [{"delta": {"tool_calls": [
            {"index": 0, "function": {"arguments": 'ession": "1+1"}'}},
        ]}, "finish_reason": "tool_calls"}]},
    ]
    resp = client._assemble_stream(chunks)
    assert resp.finish_reason == "tool_calls"
    assert len(resp.tool_calls) == 1
    tc = resp.tool_calls[0]
    assert tc.name == "calculator"
    assert tc.arguments == {"expression": "1+1"}
