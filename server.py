"""HTTP 服务：把 Agent 包装成 JSON API + SSE 流式接口 + 托管网页前端（零依赖，标准库）。

启动：
  python server.py --port 8000          # 有 Key 时连接 Qwen；无 Key 自动 mock
  python server.py --port 8000 --mock   # 强制离线模拟

接口：
  GET  /                → 网页前端（web/agent-chat.html）
  GET  /health          → {"status": "ok", "model": "...", "tools": [...], "exec_mode": "..."}
  GET  /v1/tools        → 全部工具 Schema
  POST /v1/chat         → 非流式聊天
       请求体: {"message": "帮我算 12*34", "session_id": "可选"}
       响应:   {"reply": "...", "session_id": "abc", "turns": 2, "tool_uses": [...]}
  GET  /v1/chat/stream?message=...&session_id=...   → SSE 流式聊天
       事件: meta / tool / delta / done / error

测试示例：
  curl -X POST http://127.0.0.1:8000/v1/chat -H "Content-Type: application/json" ^
       -d "{\"message\": \"帮我算 12*34\"}"
"""
from __future__ import annotations

import argparse
import json
import sys
import urllib.parse
import uuid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from agent.core import Agent
from agent.memory import Memory
from config import Config
from factory import create_agent

for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

FRONTEND = Path(__file__).resolve().parent / "web" / "agent-chat.html"

# session_id → Memory（进程内保存；重启即清空，可按需换成 Redis/文件持久化）
SESSIONS: dict[str, Memory] = {}


class _ClientGone(Exception):
    """客户端断开连接（SSE 写入失败时抛出，用于安静结束）。"""


class Handler(BaseHTTPRequestHandler):
    server: ThreadingHTTPServer  # 类型提示

    # ---------- 公共 ----------
    def _cors_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def _send_json(self, code: int, payload: dict) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self._cors_headers()
        self.end_headers()
        self.wfile.write(body)

    def _read_json(self) -> dict:
        length = int(self.headers.get("Content-Length", 0) or 0)
        raw = self.rfile.read(length).decode("utf-8")
        return json.loads(raw) if raw else {}

    def _new_agent(self, memory: Memory) -> Agent:
        return Agent(
            self.server.llm,
            self.server.tools,
            system_prompt=self.server.cfg.system_prompt,
            max_turns=self.server.cfg.max_turns,
            memory=memory,
        )

    def _exec_mode(self) -> str:
        try:
            tool = self.server.tools.get("run_python")
            return tool.authorizer.mode
        except Exception:
            return "?"

    # ---------- 路由 ----------
    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self._cors_headers()
        self.end_headers()

    def do_GET(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        if path == "/health":
            self._send_json(200, {
                "status": "ok",
                "model": getattr(self.server, "model_name", "mock"),
                "tools": self.server.tools.names(),
                "exec_mode": self._exec_mode(),
            })
        elif path == "/v1/tools":
            self._send_json(200, {"tools": self.server.tools.schemas()})
        elif path == "/" or path == "/index.html":
            self._serve_frontend()
        elif path == "/v1/chat/stream":
            self._stream_chat(urllib.parse.parse_qs(parsed.query))
        else:
            self._send_json(404, {"error": "not found"})

    def do_POST(self) -> None:
        if self.path != "/v1/chat":
            self._send_json(404, {"error": "not found"})
            return
        try:
            payload = self._read_json()
        except Exception as err:
            self._send_json(400, {"error": f"无效请求体：{err}"})
            return

        message = str(payload.get("message") or "").strip()
        if not message:
            self._send_json(400, {"error": "message 不能为空"})
            return

        sid = str(payload.get("session_id") or uuid.uuid4().hex)
        memory = SESSIONS.setdefault(sid, Memory(max_tokens=self.server.cfg.context_tokens))
        agent = self._new_agent(memory)
        try:
            result = agent.run(message)
        except Exception as err:
            self._send_json(500, {"error": f"Agent 执行异常：{type(err).__name__}: {err}"})
            return

        usage = memory.usage()
        self._send_json(200, {
            "reply": result.content,
            "session_id": sid,
            "turns": result.turns,
            "interrupted": result.interrupted,
            "usage": usage,
            "tool_uses": [
                {"name": u.name, "arguments": u.arguments, "ok": u.ok, "result": u.result[:500]}
                for u in result.tool_uses
            ],
        })

    # ---------- 前端 ----------
    def _serve_frontend(self) -> None:
        if not FRONTEND.exists():
            self._send_json(404, {"error": f"前端文件缺失：{FRONTEND.name}（web/agent-chat.html）"})
            return
        body = FRONTEND.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self._cors_headers()
        self.end_headers()
        self.wfile.write(body)

    # ---------- SSE 流式聊天 ----------
    def _stream_chat(self, params: dict[str, list[str]]) -> None:
        message = (params.get("message") or [""])[0].strip()
        if not message:
            self._send_json(400, {"error": "message 不能为空"})
            return
        sid = (params.get("session_id") or [uuid.uuid4().hex])[0]

        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream; charset=utf-8")
        self.send_header("Cache-Control", "no-cache")
        self.send_header("X-Accel-Buffering", "no")
        self._cors_headers()
        self.end_headers()

        def sse(event: str, data: dict) -> None:
            chunk = f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n".encode("utf-8")
            try:
                self.wfile.write(chunk)
                self.wfile.flush()
            except (BrokenPipeError, ConnectionResetError, OSError) as err:
                raise _ClientGone() from err

        memory = SESSIONS.setdefault(sid, Memory(max_tokens=self.server.cfg.context_tokens))
        agent = self._new_agent(memory)
        agent.on_tool = lambda name, args, ok, result: sse(
            "tool",
            {"name": name, "arguments": args, "ok": ok, "result": (result or "")[:500]},
        )

        sse("meta", {"session_id": sid, "model": getattr(self.server, "model_name", "mock"),
                     "exec_mode": self._exec_mode()})
        try:
            result = agent.run(message, on_delta=lambda text: sse("delta", {"text": text}))
        except _ClientGone:
            return  # 客户端已断开，安静结束
        except Exception as err:
            sse("error", {"message": f"Agent 执行异常：{type(err).__name__}: {err}"})
            return

        usage = memory.usage()
        sse("done", {
            "turns": result.turns,
            "interrupted": result.interrupted,
            "usage": usage,
            "dropped": memory.dropped_last,
        })

    def log_message(self, fmt: str, *args) -> None:  # 保持简洁日志
        print("[http]", fmt % args)


def main() -> None:
    parser = argparse.ArgumentParser(description="把 Agent 包装成 HTTP 服务 + 网页前端（零依赖）。")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--mock", action="store_true", help="强制使用离线模拟 LLM")
    args = parser.parse_args()

    cfg = Config.from_env()
    # HTTP 服务无交互终端：ask 模式自动降级（低风险放行、高风险拒绝），不会阻塞请求线程
    agent, note = create_agent(cfg, use_mock=args.mock, interactive=False)
    print(note)

    httpd = ThreadingHTTPServer((args.host, args.port), Handler)
    httpd.cfg = cfg
    httpd.llm = agent.llm
    httpd.tools = agent.tools
    httpd.model_name = cfg.model if cfg.has_api_key() and not args.mock else "mock"

    print(f"Agent 服务已启动：http://{args.host}:{args.port}")
    print("网页前端：浏览器打开上面的地址即可对话")
    print("接口：GET /health · GET /v1/tools · POST /v1/chat · GET /v1/chat/stream (SSE)")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n已停止服务。")


if __name__ == "__main__":
    main()
