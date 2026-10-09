"""HTTP 回归测试：真实服务器、临时数据库、离线模型，不访问外部 API。"""
from __future__ import annotations

import json
import tempfile
import threading
import urllib.error
import urllib.request
from contextlib import contextmanager
from pathlib import Path

from config import Config
from llm.base import LLMResponse
from llm.mock_client import MockClient, ScriptedMockClient
from server import create_server


@contextmanager
def running_server(root: Path):
    cfg = Config(log_dir=str(root / "logs"), work_dir=str(root / "workspace"), code_exec_mode="off")
    httpd = create_server(cfg, port=0, use_mock=True)
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    try:
        yield httpd, f"http://127.0.0.1:{httpd.server_port}"
    finally:
        httpd.shutdown()
        thread.join(timeout=3)
        httpd.server_close()
        httpd.chat_history.close()
        httpd.long_term_memory.close()
        httpd.agent_template.episodic_memory._conn.close()
        for handler in httpd.telemetry._logger.handlers:
            handler.close()


def call(base, path, method="GET", payload=None):
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(base + path, data=data, method=method, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            return response.status, response.read().decode(), response.headers
    except urllib.error.HTTPError as error:
        return error.code, error.read().decode(), error.headers


def test_multiturn_history_and_restart_context():
    with tempfile.TemporaryDirectory() as directory:
        root = Path(directory)
        with running_server(root) as (httpd, base):
            for message in ("第一轮内容", "第二轮内容"):
                status, body, _ = call(base, "/v1/chat", "POST", {"message": message, "session_id": "stable-session"})
                assert status == 200, body
            status, body, _ = call(base, "/v1/conversations")
            conversations = json.loads(body)["conversations"]
            assert len(conversations) == 1 and conversations[0]["id"] == "stable-session"
            assert conversations[0]["message_count"] == 4
            assert httpd.telemetry.summary()["llm_calls"] == 2
        with running_server(root) as (httpd, base):
            captured = []
            class RecordingMock(MockClient):
                def chat(self, messages, tools=None, **kwargs):
                    captured.extend(messages)
                    return LLMResponse(content="上下文已恢复")
            httpd.llm = RecordingMock()
            status, body, _ = call(base, "/v1/chat", "POST", {"message": "第三轮", "session_id": "stable-session"})
            assert status == 200, body
            assert [m["role"] for m in captured] == ["system", "user", "assistant", "user", "assistant", "user"]
            assert captured[1]["content"] == "第一轮内容"
            assert len(httpd.chat_history.get_messages("stable-session")) == 6


def test_post_sse_tool_events_and_saved_history():
    with tempfile.TemporaryDirectory() as directory:
        with running_server(Path(directory)) as (httpd, base):
            httpd.llm = ScriptedMockClient([
                {"type": "tool", "name": "calculator", "arguments": {"expression": "12*34"}},
                {"type": "final", "content": "结果是 **408**。"},
            ])
            status, body, headers = call(base, "/v1/chat/stream", "POST", {"message": "计算 12*34", "session_id": "stream-test"})
            assert status == 200 and "text/event-stream" in headers["Content-Type"]
            events = [block for block in body.strip().split("\n\n")]
            assert [block.splitlines()[0] for block in events] == ["event: meta", "event: tool", "event: delta", "event: done"]
            done = json.loads(events[-1].split("data: ")[1])
            assert done["content"] == "结果是 **408**。" and done["usage"]["messages"] == 2
            assert httpd.chat_history.get_messages("stream-test")[-1].content == done["content"]
            assert httpd.telemetry.summary()["tool_calls"] == 1


def test_rename_delete_and_unknown_conversations():
    with tempfile.TemporaryDirectory() as directory:
        with running_server(Path(directory)) as (httpd, base):
            call(base, "/v1/chat", "POST", {"message": "保存这个会话", "session_id": "manage-test"})
            status, _, _ = call(base, "/v1/conversations/manage-test", "PATCH", {"title": "新标题"})
            assert status == 200 and httpd.chat_history.get_conversation("manage-test").title == "新标题"
            assert call(base, "/v1/conversations/manage-test", "PATCH", {"title": "  "})[0] == 400
            assert call(base, "/v1/conversations/manage-test", "DELETE")[0] == 200
            assert httpd.chat_history.get_messages("manage-test") == []
            assert "manage-test" not in httpd.sessions
            assert call(base, "/v1/conversations/manage-test")[0] == 404


def test_input_validation_and_get_sse_compatibility():
    with tempfile.TemporaryDirectory() as directory:
        with running_server(Path(directory)) as (_, base):
            for payload in ([], {"message": ""}, {"message": 42}, {"message": "ok", "session_id": "../bad"}, {"message": "x" * 50001}):
                assert call(base, "/v1/chat", "POST", payload)[0] == 400
            status, body, _ = call(base, "/v1/chat/stream?message=hello&session_id=legacy")
            assert status == 200 and "event: done" in body
            assert json.loads(call(base, "/health")[1])["mode"] == "mock"
            assert json.loads(call(base, "/v1/knowledge")[1])["enabled"] is False


def test_concurrent_session_write_is_rejected():
    with tempfile.TemporaryDirectory() as directory:
        with running_server(Path(directory)) as (httpd, base):
            entered, release = threading.Event(), threading.Event()
            class SlowMock(MockClient):
                def chat(self, messages, tools=None, **kwargs):
                    entered.set()
                    release.wait(timeout=4)
                    return LLMResponse(content="完成")
            httpd.llm = SlowMock()
            results = []
            worker = threading.Thread(target=lambda: results.append(call(base, "/v1/chat", "POST", {"message": "first", "session_id": "same"})[0]))
            worker.start()
            try:
                assert entered.wait(timeout=2)
                assert call(base, "/v1/chat", "POST", {"message": "second", "session_id": "same"})[0] == 409
            finally:
                release.set()
                worker.join(timeout=4)
            assert results == [200]
            assert len(httpd.chat_history.get_messages("same")) == 2


def test_static_serving_does_not_expose_project_files():
    with tempfile.TemporaryDirectory() as directory:
        with running_server(Path(directory)) as (_, base):
            status, body, headers = call(base, "/")
            assert status == 200 and "text/html" in headers["Content-Type"]
            for path in ("/server.py", "/.env", "/%2e%2e/config.py", "/v1/unknown"):
                assert call(base, path)[0] == 404
