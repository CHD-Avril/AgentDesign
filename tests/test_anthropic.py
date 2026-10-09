"""Qwen/Z.ai 适配回归：不使用真实 Key，不调用网络。"""
from __future__ import annotations

import os
import tempfile
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

from agent.core import Agent
from agent.telemetry import Telemetry
from config import Config
from llm.anthropic_client import AnthropicClient
from llm.base import LLMResponse
from tools.builtin import CalculatorTool
from tools.multimodal import AnthropicImageUnderstandTool
from tools.registry import ToolRegistry


class FakeSDKError(Exception):
    def __init__(self, status_code):
        self.status_code = status_code


class FakeMessages:
    def __init__(self, script):
        self.script = list(script)
        self.requests = []

    def create(self, **payload):
        self.requests.append(payload)
        response = self.script.pop(0)
        if isinstance(response, Exception):
            raise response
        return response

    def stream(self, **payload):
        message = self.create(**payload)
        class Stream:
            text_stream = [b["text"] for b in message["content"] if b["type"] == "text"]
            def get_final_message(self):
                return message
            def __enter__(self):
                return self
            def __exit__(self, *args):
                return False
        return Stream()


def fake_client(script):
    client = AnthropicClient.__new__(AnthropicClient)
    client.model, client.max_tokens = "glm-5.3-flash", 4096
    client._sdk = SimpleNamespace(APIError=FakeSDKError)
    client._client = SimpleNamespace(messages=FakeMessages(script))
    return client


def response(content, reason="end_turn"):
    return {"type": "message", "content": content, "stop_reason": reason,
            "usage": {"input_tokens": 10, "output_tokens": 5, "cache_read_input_tokens": 2}}


def test_anthropic_filters_thinking_and_counts_usage():
    parsed = AnthropicClient._parse(response([
        {"type": "thinking", "thinking": "internal-only", "signature": "test-signature"},
        {"type": "text", "text": "可见回答"},
    ]))
    assert parsed.content == "可见回答"
    assert parsed.usage.prompt_tokens == 12 and parsed.usage.total == 17


def test_anthropic_stream_only_emits_text():
    client = fake_client([response([
        {"type": "thinking", "thinking": "not-for-ui", "signature": "signature"},
        {"type": "text", "text": "第一段"}, {"type": "text", "text": "第二段"},
    ])])
    deltas = []
    result = client.chat_stream([{"role": "system", "content": "系统规则"}, {"role": "user", "content": "你好"}], on_delta=deltas.append)
    assert deltas == ["第一段", "第二段"] and result.content == "第一段第二段"
    payload = client._client.messages.requests[0]
    assert payload["system"] == "系统规则" and payload["max_tokens"] == 4096
    assert payload["messages"][0]["role"] == "user"


def test_anthropic_agent_tool_loop_preserves_thinking_signature():
    client = fake_client([
        response([
            {"type": "thinking", "thinking": "need calculator", "signature": "signed"},
            {"type": "tool_use", "id": "t1", "name": "calculator", "input": {"expression": "12*34"}},
            {"type": "tool_use", "id": "t2", "name": "calculator", "input": {"expression": "2+2"}},
        ], "tool_use"),
        response([{"type": "text", "text": "408 和 4"}]),
    ])
    registry = ToolRegistry()
    registry.register(CalculatorTool())
    agent = Agent(client, registry, system_prompt="使用工具")
    result = agent.run("计算两个算式")
    assert result.content == "408 和 4" and len(result.tool_uses) == 2
    payload = client._client.messages.requests[1]
    assistant = payload["messages"][-2]
    assert assistant["content"][0]["signature"] == "signed"
    user = payload["messages"][-1]
    assert [b["tool_use_id"] for b in user["content"]] == ["t1", "t2"]
    assert payload["tools"][0]["input_schema"]["type"] == "object"
    assert "_anthropic_content" not in agent.memory.messages()[-1]


def test_anthropic_image_tool_uses_correct_base64_mime_and_sandbox():
    recorded = []
    class FakeVision:
        def chat(self, messages):
            recorded.extend(messages)
            return LLMResponse(content="红色方块")
    with tempfile.TemporaryDirectory() as directory:
        root = Path(directory)
        (root / "demo.jpg").write_bytes(b"fake-jpeg-test-data")
        tool = AnthropicImageUnderstandTool(FakeVision(), root)
        assert "红色方块" in tool.run("demo.jpg", "描述图片")
        source = recorded[0]["content"][0]["source"]
        assert source["type"] == "base64" and source["media_type"] == "image/jpeg"
        assert source["data"] == "ZmFrZS1qcGVnLXRlc3QtZGF0YQ=="
        assert "错误" in tool.run("/etc/passwd", "分析")
        assert "错误" in tool.run("../outside.jpg", "分析")


def test_anthropic_errors_distinguish_auth_quota_and_empty_thinking():
    for code, expected in ((401, "鉴权"), (429, "429"), (500, "500")):
        client = fake_client([FakeSDKError(code)])
        try:
            client.chat([{"role": "user", "content": "test"}])
        except RuntimeError as error:
            assert expected in str(error)
        else:
            assert False, "SDK 错误应转换为可读的 RuntimeError"
    try:
        AnthropicClient._parse(response([{"type": "thinking", "thinking": "only", "signature": "s"}], "max_tokens"))
    except RuntimeError as error:
        assert "LLM_MAX_TOKENS" in str(error)
    else:
        assert False, "只有 thinking 的预算耗尽不应返回空白完成状态"


def test_qwen_and_zai_config_are_independent():
    with patch("config.load_dotenv"), patch.dict(os.environ, {"LLM_PROVIDER": "zai", "ZAI_API_KEY": "test-zai", "QWEN_API_KEY": "test-qwen"}, clear=True):
        cfg = Config.from_env()
        assert cfg.provider == "zai" and cfg.api_key == "test-zai"
        assert cfg.model == "glm-5.3-flash" and cfg.base_url == "https://api.z.ai/api/anthropic"
        assert cfg.embedding_api_key == "" and cfg.max_output_tokens == 4096
    with patch("config.load_dotenv"), patch.dict(os.environ, {"LLM_PROVIDER": "qwen", "QWEN_API_KEY": "test-qwen", "ZAI_API_KEY": "test-zai"}, clear=True):
        cfg = Config.from_env()
        assert cfg.provider == "qwen" and cfg.api_key == "test-qwen"
        assert cfg.model == "qwen-plus" and "dashscope" in cfg.base_url
        assert cfg.embedding_api_key == "test-qwen"


def test_unknown_model_cost_is_explicitly_unavailable():
    telemetry = Telemetry(model="glm-5.3-flash", persist=False)
    assert telemetry.summary()["cost_available"] is False
