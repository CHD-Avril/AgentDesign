"""Agent JSON API、POST/GET SSE 流式聊天和前端托管（Python 标准库）。

python server.py --mock --port 8000
构建 frontend/dist 后自动提供 React 工作台，否则提供原有单文件界面。
"""
from __future__ import annotations

import argparse
import json
import mimetypes
import re
import sys
import threading
import urllib.parse
import uuid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from agent.chat_history import ChatHistory
from agent.core import Agent
from agent.memory import Memory
from config import Config
from factory import create_agent
from tools.app_builder import APP_PREVIEW_CSP, GeneratedAppStore

for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

ROOT = Path(__file__).resolve().parent
FRONTEND = ROOT / "web" / "agent-chat.html"
FRONTEND_DIST = ROOT / "frontend" / "dist"
# 每个服务实例维护独立的会话缓存；同一会话的同时写入返回 409。
SESSION_ID = re.compile(r"^[A-Za-z0-9_-]{1,128}$")
MEDIA_FILE = re.compile(r"^[0-9a-f]{32}\.(?:mp3|wav|m4a|ogg|opus|aac|flac|mp4|webm|mov|png|jpg|jpeg|webp|gif)$")
MEDIA_TYPES = {".mp3": "audio/mpeg", ".wav": "audio/wav", ".m4a": "audio/mp4",
               ".ogg": "audio/ogg", ".opus": "audio/ogg", ".aac": "audio/aac", ".flac": "audio/flac", ".mp4": "video/mp4",
               ".webm": "video/webm", ".mov": "video/quicktime", ".png": "image/png",
               ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif"}


class _ClientGone(Exception):
    """客户端断开 SSE 连接。"""


class Handler(BaseHTTPRequestHandler):
    server: ThreadingHTTPServer

    def _cors_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, X-File-Name")

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
        if not 0 <= length <= 1_048_576:
            raise ValueError("请求体不得超过 1 MB")
        payload = json.loads(self.rfile.read(length).decode("utf-8")) if length else {}
        if not isinstance(payload, dict):
            raise ValueError("请求体必须是 JSON 对象")
        return payload

    def _new_agent(self, memory: Memory) -> Agent:
        template = getattr(self.server, "agent_template", None)
        return Agent(
            self.server.llm, self.server.tools,
            system_prompt=self.server.cfg.system_prompt,
            max_turns=self.server.cfg.max_turns, memory=memory,
            telemetry=getattr(self.server, "telemetry", None),
            tool_max_retries=self.server.cfg.tool_max_retries,
            long_term_memory=getattr(self.server, "long_term_memory", None),
            memory_extractor=getattr(template, "memory_extractor", None),
            planner=getattr(template, "planner", None),
            reflector=getattr(template, "reflector", None),
        )

    def _exec_mode(self) -> str:
        try:
            return self.server.tools.get("run_python").authorizer.mode
        except Exception:
            return "off"

    def _session(self, sid: str) -> tuple[Memory, threading.Lock]:
        with self.server.sessions_guard:
            lock = self.server.session_locks.setdefault(sid, threading.Lock())
            if sid not in self.server.sessions:
                memory = Memory(max_tokens=self.server.cfg.context_tokens)
                history = self.server.chat_history
                for msg in history.get_messages(sid):
                    memory.add(msg.role, msg.content)
                self.server.sessions[sid] = memory
            return self.server.sessions[sid], lock

    def _chat_input(self, payload: dict) -> tuple[str, str]:
        message = payload.get("message", "")
        sid = payload.get("session_id") or uuid.uuid4().hex
        if not isinstance(message, str) or not message.strip():
            raise ValueError("message 不能为空，且必须是字符串")
        if len(message) > 50_000:
            raise ValueError("消息不得超过 50,000 字符")
        if not isinstance(sid, str) or not SESSION_ID.fullmatch(sid):
            raise ValueError("无效的 session_id")
        return message.strip(), sid

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self._cors_headers()
        self.end_headers()

    def do_GET(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        if path == "/health":
            self._send_json(200, {
                "status": "ok", "model": self.server.model_name,
                "tools": self.server.tools.names(), "exec_mode": self._exec_mode(),
                "mode": "mock" if self.server.model_name == "mock" else "live",
                "context_tokens": self.server.cfg.context_tokens,
                "provider": self.server.cfg.provider,
                "max_output_tokens": self.server.cfg.max_output_tokens,
                "audio_configured": bool(getattr(self.server.cfg, "media_api_key", "")),
            })
        elif path == "/v1/apps":
            store = GeneratedAppStore(self.server.cfg.work_path())
            self._send_json(200, {"apps": store.list_apps()})
        elif path.startswith("/v1/apps/") and path.endswith("/preview"):
            app_id = path[len("/v1/apps/"):-len("/preview")]
            try:
                target = GeneratedAppStore(self.server.cfg.work_path()).preview_path(app_id)
                if target is None:
                    raise ValueError("应用不存在")
                self._serve_artifact(target, "text/html; charset=utf-8", csp=APP_PREVIEW_CSP)
            except (ValueError, OSError):
                self._send_json(404, {"error": "应用不存在"})
        elif path.startswith("/v1/media/"):
            name = path[len("/v1/media/"):]
            root = self.server.cfg.work_path() / "media"
            target = root / name
            if not MEDIA_FILE.fullmatch(name) or target.is_symlink() or not target.is_file() or root.is_symlink():
                self._send_json(404, {"error": "媒体文件不存在"})
                return
            self._serve_artifact(target, MEDIA_TYPES[target.suffix])
        elif path == "/v1/tools":
            self._send_json(200, {"tools": self.server.tools.schemas()})
        elif path == "/v1/stats":
            tel = getattr(self.server, "telemetry", None)
            self._send_json(200, tel.summary() if tel else {"error": "telemetry not available"})
        elif path == "/v1/knowledge":
            kb = getattr(self.server, "knowledge_base", None)
            self._send_json(200, {
                "enabled": kb is not None,
                "total_chunks": len(kb) if kb is not None else 0,
                "sources": kb.list_sources() if kb is not None else [],
                "note": getattr(self.server.agent_template, "knowledge_note", ""),
            })
        elif path == "/v1/memory":
            ltm = getattr(self.server, "long_term_memory", None)
            self._send_json(200, {
                "preferences": ltm.all_preferences() if ltm else {},
                "facts": [{"content": f.content, "source": f.source} for f in ltm.recent_facts(20)] if ltm else [],
            })
        elif path == "/v1/conversations":
            self._send_json(200, {"conversations": [
                {"id": c.id, "title": c.title, "updated_at": c.updated_at, "message_count": c.message_count}
                for c in self.server.chat_history.list_conversations(limit=200)
            ]})
        elif path.startswith("/v1/conversations/"):
            sid = path.rsplit("/", 1)[-1]
            conv = self.server.chat_history.get_conversation(sid)
            if not conv:
                self._send_json(404, {"error": "对话不存在"})
                return
            self._send_json(200, {
                "id": sid, "title": conv.title,
                "messages": [{"role": m.role, "content": m.content, "timestamp": m.timestamp}
                             for m in self.server.chat_history.get_messages(sid)],
            })
        elif path == "/v1/chat/stream":
            params = urllib.parse.parse_qs(parsed.query)
            self._handle_chat({k: v[0] for k, v in params.items()}, stream=True)
        elif path.startswith("/v1/"):
            self._send_json(404, {"error": "not found"})
        else:
            self._serve_frontend(path)

    def do_POST(self) -> None:
        path = urllib.parse.urlparse(self.path).path
        if path == "/v1/uploads":
            self._upload_media()
            return
        if path not in ("/v1/chat", "/v1/chat/stream"):
            self._send_json(404, {"error": "not found"})
            return
        try:
            payload = self._read_json()
        except (ValueError, UnicodeError) as err:
            self._send_json(400, {"error": f"无效请求体：{err}"})
            return
        self._handle_chat(payload, stream=path.endswith("/stream"))

    def _upload_media(self) -> None:
        try:
            name = urllib.parse.unquote(self.headers.get("X-File-Name", ""))
            suffix = Path(name).suffix.lower()
            length = int(self.headers.get("Content-Length", "0"))
            if suffix not in MEDIA_TYPES:
                raise ValueError("仅支持常见音频、视频和图片格式")
            if not 0 < length <= 32 * 1024 * 1024:
                raise ValueError("文件需为 1 字节至 32 MB")
            root = self.server.cfg.work_path() / "media"
            if root.is_symlink():
                raise ValueError("媒体目录不可为符号链接")
            root.mkdir(parents=True, exist_ok=True)
            filename = uuid.uuid4().hex + suffix
            content = self.rfile.read(length)
            if len(content) != length:
                raise ValueError("文件上传不完整")
            (root / filename).write_bytes(content)
            self._send_json(201, {"file": "media/" + filename,
                                  "media_url": "/v1/media/" + filename,
                                  "name": Path(name).name[:150], "size": length})
        except (ValueError, OSError) as error:
            self._send_json(400, {"error": str(error)})

    def _serve_artifact(self, target: Path, content_type: str, *, csp: str = "") -> None:
        body = target.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Cache-Control", "no-store")
        if csp:
            self.send_header("Content-Security-Policy", csp)
        self.end_headers()
        self.wfile.write(body)

    def _handle_chat(self, payload: dict, *, stream: bool) -> None:
        try:
            message, sid = self._chat_input(payload)
        except ValueError as err:
            self._send_json(400, {"error": str(err)})
            return
        memory, lock = self._session(sid)
        if not lock.acquire(blocking=False):
            self._send_json(409, {"error": "此对话正在生成回复，请稍后再试"})
            return
        try:
            if stream:
                self._stream_chat(message, sid, memory)
            else:
                result = self._new_agent(memory).run(message)
                self.server.chat_history.save_turn(sid, message, result.content)
                self._send_json(200, {
                    "reply": result.content, "session_id": sid, "turns": result.turns,
                    "interrupted": result.interrupted, "usage": memory.usage(),
                    "tool_uses": [{"name": u.name, "arguments": u.arguments, "ok": u.ok, "result": u.result[:500]}
                                  for u in result.tool_uses],
                })
        except _ClientGone:
            pass
        except Exception as err:
            if not stream:
                self._send_json(500, {"error": f"Agent 执行异常：{type(err).__name__}: {err}"})
        finally:
            lock.release()

    def _stream_chat(self, message: str, sid: str, memory: Memory) -> None:
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
            except OSError as err:
                raise _ClientGone() from err

        sse("meta", {"session_id": sid, "model": self.server.model_name, "exec_mode": self._exec_mode()})
        agent = self._new_agent(memory)
        agent.on_tool = lambda name, args, ok, result: sse(
            "tool", {"name": name, "arguments": args, "ok": ok, "result": (result or "")[:500]})
        try:
            result = agent.run(message, on_delta=lambda delta: sse("delta", {"text": delta}))
            self.server.chat_history.save_turn(sid, message, result.content)
        except _ClientGone:
            raise
        except Exception as err:
            sse("error", {"message": f"Agent 执行异常：{type(err).__name__}: {err}"})
            return
        sse("done", {
            "session_id": sid, "content": result.content, "turns": result.turns,
            "interrupted": result.interrupted, "usage": memory.usage(), "dropped": memory.dropped_last,
        })

    def _conversation_mutation(self, *, delete: bool) -> None:
        path = urllib.parse.urlparse(self.path).path
        if not path.startswith("/v1/conversations/"):
            self._send_json(404, {"error": "not found"})
            return
        sid = path.rsplit("/", 1)[-1]
        if not self.server.chat_history.get_conversation(sid):
            self._send_json(404, {"error": "对话不存在"})
            return
        _, lock = self._session(sid)
        if not lock.acquire(blocking=False):
            self._send_json(409, {"error": "对话正在运行，暂时无法修改"})
            return
        try:
            if delete:
                self.server.chat_history.delete_conversation(sid)
                with self.server.sessions_guard:
                    self.server.sessions.pop(sid, None)
            else:
                try:
                    payload = self._read_json()
                    title = payload.get("title", "")
                    if not isinstance(title, str) or not 1 <= len(title.strip()) <= 100:
                        raise ValueError("标题需为 1–100 字符")
                except (ValueError, UnicodeError) as err:
                    self._send_json(400, {"error": str(err)})
                    return
                self.server.chat_history.rename_conversation(sid, title.strip())
            self._send_json(200, {"ok": True})
        finally:
            lock.release()

    def do_PATCH(self) -> None:
        self._conversation_mutation(delete=False)

    def do_DELETE(self) -> None:
        self._conversation_mutation(delete=True)

    def _serve_frontend(self, path: str = "/") -> None:
        root = FRONTEND_DIST.resolve()
        if (root / "index.html").is_file():
            candidate = (root / urllib.parse.unquote(path).lstrip("/")).resolve()
            if root not in candidate.parents and candidate != root:
                self._send_json(404, {"error": "not found"})
                return
            target = root / "index.html" if path in ("/", "/index.html") else candidate
        else:
            target = FRONTEND if path in ("/", "/index.html") else None
        if target is None or not target.is_file():
            self._send_json(404, {"error": "前端文件不存在"})
            return
        body = target.read_bytes()
        content_type = mimetypes.guess_type(str(target))[0] or "application/octet-stream"
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-cache" if target.suffix == ".html" else "public, max-age=3600")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt: str, *args) -> None:
        # 避免旧版 GET SSE 的用户消息进入访问日志。
        print("[http]", self.command, urllib.parse.urlparse(self.path).path)


def create_server(cfg: Config, *, host: str = "127.0.0.1", port: int = 8000, use_mock: bool = False) -> ThreadingHTTPServer:
    agent, note = create_agent(cfg, use_mock=use_mock or not cfg.has_api_key(), interactive=False)
    httpd = ThreadingHTTPServer((host, port), Handler)
    httpd.cfg = cfg
    httpd.agent_template = agent
    httpd.llm, httpd.tools = agent.llm, agent.tools
    httpd.model_name = cfg.model if cfg.has_api_key() and not use_mock else "mock"
    for key in ("telemetry", "knowledge_base", "long_term_memory"):
        setattr(httpd, key, getattr(agent, key, None))
    httpd.chat_history = ChatHistory(cfg.log_path().parent / "data" / "chat_history.db")
    httpd.sessions = {}
    httpd.session_locks = {}
    httpd.sessions_guard = threading.Lock()
    httpd.note = note
    return httpd


def main() -> None:
    parser = argparse.ArgumentParser(description="Agent 工作台 HTTP 服务")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--mock", action="store_true")
    args = parser.parse_args()
    httpd = create_server(Config.from_env(), host=args.host, port=args.port, use_mock=args.mock)
    print(httpd.note)
    print(f"Agent 工作台：http://{args.host}:{args.port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n已停止服务。")
    finally:
        httpd.server_close()
        httpd.chat_history.close()


if __name__ == "__main__":
    main()
