"""网页应用开发回归：真实落盘、协议兼容与目录隔离，模型使用离线替身。"""
from __future__ import annotations

import json
import io
import tempfile
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

from agent.telemetry import Telemetry
from llm.anthropic_client import AnthropicClient
from llm.base import LLMResponse, TokenUsage
from llm.qwen_client import QwenClient
from tools.app_builder import APP_PREVIEW_CSP, AppGenerateTool, GeneratedAppStore, _validated_html


HTML = """<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>计数器</title>
<style>body {font: 18px sans-serif;background:#f4f3ed} button {padding:1rem}</style></head>
<body><main><h1>计数器</h1><p id="value">0</p><button id="add">加一</button></main>
<script>let count=0;document.getElementById('add').addEventListener('click',()=>{
document.getElementById('value').textContent=++count;});</script></body></html>"""


class RecordingClient:
    name = "offline-test"
    model = "test-model"

    def __init__(self, script):
        self.script = list(script)
        self.requests = []
        self.streaming_calls = 0

    def chat(self, messages, tools=None, **kwargs):
        self.requests.append((messages, tools, kwargs))
        result = self.script.pop(0)
        if isinstance(result, Exception):
            raise result
        return result if isinstance(result, LLMResponse) else LLMResponse(content=result, finish_reason="stop", usage=TokenUsage(5, 10, 15))

    def chat_stream(self, messages, tools=None, on_delta=None, **kwargs):
        assert on_delta is None, "HTML 增量不能发送到主对话界面"
        self.streaming_calls += 1
        return self.chat(messages, tools=tools, **kwargs)


def test_app_builder_creates_interactive_file_and_restart_listing():
    with tempfile.TemporaryDirectory() as directory:
        root = Path(directory)
        client = RecordingClient(["```html\n" + HTML + "\n```"])
        telemetry = Telemetry(model="test-model", persist=False)
        tool = AppGenerateTool(client, root, telemetry=telemetry)
        with patch("subprocess.run", side_effect=AssertionError("生成工具不能运行shell")):
            app = json.loads(tool.run("做一个可点击加一的计数器", title="我的计数器"))
        assert app["status"] == "created" and app["title"] == "我的计数器"
        assert app["preview_url"] == f'/v1/apps/{app["id"]}/preview'
        assert app["file"] == f'generated-apps/{app["id"]}/index.html'
        saved = (root / app["file"]).read_text(encoding="utf-8")
        assert "textContent=++count" in saved and "Content-Security-Policy" in saved
        assert "connect-src &#x27;none&#x27;" in saved
        restarted = GeneratedAppStore(root)
        assert restarted.list_apps()[0]["id"] == app["id"]
        assert restarted.get_app(app["id"])["requirements"] == "做一个可点击加一的计数器"
        assert restarted.preview_path(app["id"]) == (root / app["file"]).resolve()
        assert client.requests[0][1] is None and client.requests[0][2]["max_tokens"] >= 4096
        assert client.streaming_calls == 1
        assert telemetry.summary()["llm_calls"] == 1
        assert "sandbox allow-scripts" in APP_PREVIEW_CSP and "connect-src 'none'" in APP_PREVIEW_CSP


def test_app_builder_rejects_empty_inputs_without_model_calls():
    with tempfile.TemporaryDirectory() as directory:
        client = RecordingClient([])
        tool = AppGenerateTool(client, directory)
        for requirements in ("", "  ", 42, "x" * 12001):
            assert tool.run(requirements).startswith("错误")
        assert tool.run("应用", title="x" * 81).startswith("错误")
        assert client.requests == [] and not (Path(directory) / "generated-apps").exists()


def test_app_builder_repairs_incomplete_or_external_output_once():
    with tempfile.TemporaryDirectory() as directory:
        client = RecordingClient([HTML.replace("</html>", ""), HTML])
        tool = AppGenerateTool(client, directory)
        app = json.loads(tool.run("可交互计数器"))
        assert app["status"] == "created" and len(client.requests) == 2
        assert "上次生成未通过校验" in client.requests[1][0][-1]["content"]
        assert "不完整" in client.requests[1][0][-1]["content"]
        assert len(tool.store.list_apps()) == 1


def test_app_builder_does_not_publish_failed_or_truncated_pages():
    with tempfile.TemporaryDirectory() as directory:
        client = RecordingClient([LLMResponse(content=HTML, finish_reason="max_tokens"), "只有说明，没有代码"])
        tool = AppGenerateTool(client, directory)
        result = tool.run("开发应用")
        assert result.startswith("错误") and "没有保存半成品" in result
        assert len(client.requests) == 2 and tool.store.list_apps() == []
        assert not (Path(directory) / "generated-apps").exists()
    with tempfile.TemporaryDirectory() as directory:
        tool = AppGenerateTool(RecordingClient([RuntimeError("模型暂时限流")]), directory)
        assert "模型暂时限流" in tool.run("开发应用")
        assert tool.store.list_apps() == []


def test_app_builder_blocks_external_dependencies_and_navigation_tags():
    rejected = (
        '<script src="https://example.com/app.js"></script>',
        '<link rel="stylesheet" href="/assets/style.css">',
        '<img src="https://example.com/tracker.png">',
        '<iframe src="https://example.com"></iframe>',
        '<object data="file:///etc/passwd"></object>',
        '<base href="https://example.com">',
        '<meta http-equiv="refresh" content="0;url=https://example.com">',
        '<form action="https://example.com"><input></form>',
        '<img src="data:text/html,hello">',
        '<style>@import "https://example.com/style.css";</style>',
        '<style>body {background:url(https://example.com/tracker.png)}</style>',
        '<div style="background:url(assets/image.png)">外部资源</div>',
    )
    for fragment in rejected:
        try:
            _validated_html(HTML.replace("<main>", fragment + "<main>"))
        except ValueError:
            pass
        else:
            assert False, f"未拒绝外部资源/跳转：{fragment}"
    accepted, _ = _validated_html(HTML.replace("<main>", '<a href="#value">返回计数</a><img src="data:image/png;base64,AAAA"><main>'))
    assert "data:image/png;base64,AAAA" in accepted


def test_app_builder_rejects_javascript_that_cannot_work_in_sandbox():
    for code in ("localStorage.setItem('key','value')", "sessionStorage.getItem('key')", "indexedDB.open('db')",
                 "document.cookie='key=value'", "fetch('/v1/memory')", "new WebSocket('wss://example.com')",
                 "window.open('https://example.com')", "window.location.href='https://example.com'",
                 "location='/v1/memory'"):
        unsafe = HTML.replace("let count=0;", code + "; let count=0;")
        try:
            _validated_html(unsafe)
        except ValueError:
            pass
        else:
            assert False, f"未反馈 sandbox 中不支持的代码：{code}"


def test_generated_app_store_blocks_traversal_symlinks_and_untrusted_metadata():
    with tempfile.TemporaryDirectory() as directory:
        root = Path(directory)
        tool = AppGenerateTool(RecordingClient([HTML]), root / "workspace")
        app = json.loads(tool.run("计数器"))
        store, app_id = tool.store, app["id"]
        assert store.preview_path("../../etc/passwd") is None
        assert store.get_app("A" * 32) is None
        metadata_path = store.root / app_id / "metadata.json"
        metadata = json.loads(metadata_path.read_text())
        metadata.update({"preview_url": "https://example.com", "file": "../../etc/passwd"})
        metadata_path.write_text(json.dumps(metadata))
        restored = store.get_app(app_id)
        assert restored["preview_url"].startswith("/v1/apps/") and restored["file"].startswith("generated-apps/")
        preview = store.preview_path(app_id)
        preview.unlink()
        outside = root / "outside.html"
        outside.write_text("private file")
        preview.symlink_to(outside)
        assert store.preview_path(app_id) is None and store.get_app(app_id) is None
        assert store.list_apps() == []
        alias = store.root / ("b" * 32)
        alias.symlink_to(store.root / app_id, target_is_directory=True)
        assert store.preview_path("b" * 32) is None
    with tempfile.TemporaryDirectory() as directory:
        root = Path(directory)
        (root / "workspace").mkdir()
        (root / "outside").mkdir()
        (root / "workspace" / "generated-apps").symlink_to(root / "outside", target_is_directory=True)
        tool = AppGenerateTool(RecordingClient([HTML, HTML]), root / "workspace")
        assert tool.run("计数器").startswith("错误")
        assert list((root / "outside").iterdir()) == []


def test_app_builder_works_through_qwen_and_anthropic_adapters():
    qwen = QwenClient("test-key", enable_search=False)
    qwen_payloads = []
    def qwen_response(request, **kwargs):
        qwen_payloads.append(json.loads(request.data))
        chunks = [{"choices": [{"delta": {"content": HTML[:len(HTML) // 2]}, "finish_reason": None}]},
                  {"choices": [{"delta": {"content": HTML[len(HTML) // 2:]}, "finish_reason": "stop"}],
                   "usage": {"prompt_tokens": 1, "completion_tokens": 2, "total_tokens": 3}}]
        data = "".join("data: " + json.dumps(chunk) + "\n\n" for chunk in chunks) + "data: [DONE]\n\n"
        return io.BytesIO(data.encode())
    anthropic = AnthropicClient.__new__(AnthropicClient)
    anthropic.model, anthropic.max_tokens = "glm-5.3-flash", 4096
    anthropic._sdk = SimpleNamespace(APIError=RuntimeError)
    anthropic_payloads = []
    def anthropic_response(**payload):
        anthropic_payloads.append(payload)
        return {"type": "message", "content": [{"type": "thinking", "thinking": "internal", "signature": "signed"}, {"type": "text", "text": HTML}], "stop_reason": "end_turn", "usage": {"input_tokens": 1, "output_tokens": 2}}
    def anthropic_stream(**payload):
        message = anthropic_response(**payload)
        class Stream:
            text_stream = [HTML[:len(HTML) // 2], HTML[len(HTML) // 2:]]
            def get_final_message(self):
                return message
            def __enter__(self):
                return self
            def __exit__(self, *args):
                return False
        return Stream()
    anthropic._client = SimpleNamespace(messages=SimpleNamespace(stream=anthropic_stream))
    with tempfile.TemporaryDirectory() as directory:
        with patch("llm.qwen_client.urllib.request.urlopen", side_effect=qwen_response):
            for name, client in (("qwen", qwen), ("zai", anthropic)):
                tool = AppGenerateTool(client, Path(directory) / name)
                app = json.loads(tool.run("做一个计数器"))
                assert app["status"] == "created"
                saved = tool.store.preview_path(app["id"]).read_text()
                assert "internal" not in saved and "textContent=++count" in saved
    assert qwen_payloads[0]["max_tokens"] == 8192 and "tools" not in qwen_payloads[0]
    assert qwen_payloads[0]["stream"] is True
    assert anthropic_payloads[0]["max_tokens"] == 8192 and anthropic_payloads[0]["system"]
    assert "tools" not in anthropic_payloads[0]
