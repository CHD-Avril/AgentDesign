"""用当前模型生成可离线运行的单文件网页应用；只写文件，不执行代码。"""
from __future__ import annotations

import json
import re
import shutil
import tempfile
import time
import uuid
from datetime import datetime, timezone
from html import escape
from html.parser import HTMLParser
from pathlib import Path
from typing import Any

from llm.base import LLMClient
from tools.base import Tool


APP_CONTENT_CSP = (
    "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; "
    "img-src data:; font-src data:; media-src data:; connect-src 'none'; "
    "object-src 'none'; base-uri 'none'; form-action 'none'; frame-src 'none'; worker-src 'none'"
)
# HTTP sandbox 还隔离直接打开的预览页面，iframe 应另外使用 sandbox="allow-scripts"。
APP_PREVIEW_CSP = APP_CONTENT_CSP + "; sandbox allow-scripts"
APP_ID = re.compile(r"^[a-f0-9]{32}$")
MAX_HTML_BYTES = 768 * 1024

APP_SYSTEM_PROMPT = """你是单页网页应用开发者。按用户明确提供的需求创建实际可操作的网页。
只返回一个完整的 HTML 文档，以 <!doctype html> 开始，以 </html> 结束；不要解释或代码围栏。
必须含 html、head、title、body，并写入 UTF-8 charset 与移动端 viewport。
所有 CSS 和 JavaScript 内联在这个文件里，不使用 npm、构建工具、CDN、外部图片、字体、脚本或样式。
界面使用简体中文，布局美观、清晰且适配手机，控件有标签和键盘操作支持。
根据需求实现真实的按钮、增删改、计算、过滤等功能，禁止只做没有行为的静态占位按钮。
用原生 DOM API 和 JavaScript 实现功能；用户文字显示使用 textContent，避免 HTML 注入。
页面会在没有同源权限的 sandbox 中运行，禁止联网、fetch、XHR、WebSocket、iframe、弹窗、跳转、下载、服务端调用。
不要依赖 localStorage、sessionStorage、IndexedDB 或 cookies（sandbox 中不可用）；应用数据保存在页面内存中。
可使用内联 SVG、CSS 图形和 data:image 图像。不要使用 base、object、embed 或 meta refresh。
不要请求 API Key、账户凭据或声称存在没有实现的后端功能。若需求需后端，用明确标注的本地演示数据实现可操作的原型。
优先完整实现核心功能，控制页面大小，确保 HTML、CSS、JavaScript 标签全部闭合。"""


def _validate_script_features(code: str) -> None:
    # 除 CSP 之外，提前反馈常见的不兼容代码，避免生成因 sandbox 权限而无法工作的应用。
    if re.search(r"\b(?:localStorage|sessionStorage|indexedDB)\b|document\s*\.\s*cookie", code):
        raise ValueError("sandbox 预览不支持持久存储或 cookies，请改用页面内存状态")
    if re.search(r"\bfetch\s*\(|\b(?:XMLHttpRequest|WebSocket|EventSource)\b|\.\s*sendBeacon\s*\(|\bimport\s*\(", code):
        raise ValueError("应用不能联网或动态导入，请使用本地页面数据与内联代码")
    if re.search(r"\bwindow\s*\.\s*open\s*\(|\b(?:window|document)\s*\.\s*location\b|(?:^|[;\s])location\s*(?:[.\[]|=)", code):
        raise ValueError("应用不能弹窗或跳转，请在当前页面内完成交互")


def _validate_css_features(css: str) -> None:
    if re.search(r"@import\b", css, flags=re.I):
        raise ValueError("样式必须内联，不能使用 @import")
    for match in re.finditer(r"url\(\s*(['\"]?)(.*?)\1\s*\)", css, flags=re.I | re.S):
        value = match.group(2).strip()
        if value and not (value.startswith("#") or value.lower().startswith("data:")):
            raise ValueError("CSS 资源必须内联，不能引用外部或相对路径文件")


class _AppHTMLValidator(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.opened: set[str] = set()
        self.closed: set[str] = set()
        self.body_content = False
        self.in_body = False
        self.in_title = False
        self.in_code = False
        self.code_tag = ""
        self.script_parts: list[str] = []
        self.style_parts: list[str] = []
        self.title: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.opened.add(tag)
        values = {key.lower(): value or "" for key, value in attrs}
        for key, value in values.items():
            if key.startswith("on"):
                _validate_script_features(value)
        _validate_css_features(values.get("style", ""))
        if tag in {"base", "iframe", "object", "embed"}:
            raise ValueError(f"不允许 {tag}，应用必须为独立单页")
        if tag == "meta" and values.get("http-equiv", "").lower() == "refresh":
            raise ValueError("不允许 meta refresh 跳转")
        if tag == "script" and "src" in values:
            raise ValueError("脚本必须内联，不能引用外部文件")
        if tag == "form" and values.get("action"):
            raise ValueError("表单必须由本地 JavaScript 处理，不能提交到外部地址")
        for key in ("src", "href", "xlink:href", "poster"):
            value = values.get(key, "").strip()
            if value and not (value.startswith("#") or value.lower().startswith("data:image/")):
                raise ValueError("不能引用外部或相对路径资源，请将资源内联")
        if "srcset" in values:
            raise ValueError("图片须使用单个内联 data:image，不能使用 srcset")
        if tag == "body":
            self.in_body = True
        elif self.in_body and tag not in {"script", "style"}:
            self.body_content = True
        if tag == "title":
            self.in_title = True
        if tag in {"script", "style"}:
            self.in_code = True
            self.code_tag = tag

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)
        self.handle_endtag(tag)

    def handle_endtag(self, tag: str) -> None:
        self.closed.add(tag)
        if tag == "body":
            self.in_body = False
        elif tag == "title":
            self.in_title = False
        if tag in {"script", "style"}:
            self.in_code = False
            self.code_tag = ""

    def handle_data(self, data: str) -> None:
        if self.in_title:
            self.title.append(data)
        if self.code_tag == "script":
            self.script_parts.append(data)
        elif self.code_tag == "style":
            self.style_parts.append(data)
        if self.in_body and not self.in_code and data.strip():
            self.body_content = True


def _validated_html(content: str) -> tuple[str, str]:
    """接受完整 HTML 或单个 HTML 围栏，拒绝截断及外部依赖。"""
    if not isinstance(content, str) or not content.strip():
        raise ValueError("模型未返回网页内容")
    source = content.strip()
    fence = re.fullmatch(r"```(?:html)?\s*\n([\s\S]*?)\n```", source, flags=re.I)
    if fence:
        source = fence.group(1).strip()
    elif source.startswith("{"):
        try:
            source = json.loads(source)["html"].strip()
        except (ValueError, KeyError, TypeError, AttributeError) as error:
            raise ValueError("模型没有返回完整 HTML 文档") from error
    if len(source.encode("utf-8")) > MAX_HTML_BYTES:
        raise ValueError("生成文件超过 768 KB，请简化应用")
    if not re.match(r"<!doctype\s+html\s*>", source, flags=re.I) or not re.search(r"</html>\s*$", source, flags=re.I):
        raise ValueError("HTML 文档不完整，须有 doctype 和闭合的 html 标签")
    parser = _AppHTMLValidator()
    parser.feed(source)
    parser.close()
    for tag in ("html", "head", "title", "body"):
        if tag not in parser.opened or tag not in parser.closed:
            raise ValueError(f"缺少完整的 {tag} 标签")
    if not parser.body_content:
        raise ValueError("网页 body 为空，没有可显示内容")
    _validate_script_features("\n".join(parser.script_parts))
    _validate_css_features("\n".join(parser.style_parts))
    title = "".join(parser.title).strip()
    if not title:
        raise ValueError("网页 title 不能为空")
    # 本地文件直接打开时也限制外部资源；HTTP 层必须另加含 sandbox 的 CSP 响应头。
    policy = '<meta http-equiv="Content-Security-Policy" content="' + escape(APP_CONTENT_CSP, quote=True) + '">'
    source = re.sub(r"(<head(?:\s[^>]*)?>)", lambda match: match.group(1) + policy, source, count=1, flags=re.I)
    if len(source.encode("utf-8")) > MAX_HTML_BYTES:
        raise ValueError("生成文件超过 768 KB，请简化应用")
    return source, title[:80]


class GeneratedAppStore:
    """生成物目录与读取边界，供 HTTP 预览接口复用。"""

    def __init__(self, work_dir: Path | str) -> None:
        self.work_dir = Path(work_dir).resolve()
        self.root = self.work_dir / "generated-apps"

    def _safe_root(self) -> bool:
        return not self.root.is_symlink() and self.root.resolve() == self.root

    def _app_dir(self, app_id: str) -> Path | None:
        if not isinstance(app_id, str) or not APP_ID.fullmatch(app_id) or not self._safe_root():
            return None
        folder = self.root / app_id
        if folder.is_symlink() or not folder.is_dir() or folder.resolve().parent != self.root:
            return None
        return folder

    def preview_path(self, app_id: str) -> Path | None:
        folder = self._app_dir(app_id)
        if folder is None:
            return None
        path = folder / "index.html"
        if path.is_symlink() or not path.is_file() or path.stat().st_size > MAX_HTML_BYTES:
            return None
        return path

    def get_app(self, app_id: str) -> dict[str, Any] | None:
        folder = self._app_dir(app_id)
        if folder is None or self.preview_path(app_id) is None:
            return None
        metadata = folder / "metadata.json"
        if metadata.is_symlink() or not metadata.is_file() or metadata.stat().st_size > 64 * 1024:
            return None
        try:
            result = json.loads(metadata.read_text(encoding="utf-8"))
            if not isinstance(result, dict) or result.get("id") != app_id:
                return None
            # URL 和文件路径由真实 ID 重建，不信任落盘 JSON 中的任意地址。
            result["file"] = f"generated-apps/{app_id}/index.html"
            result["preview_url"] = f"/v1/apps/{app_id}/preview"
            return result
        except (OSError, ValueError, UnicodeError):
            return None

    def list_apps(self) -> list[dict[str, Any]]:
        if not self._safe_root() or not self.root.is_dir():
            return []
        apps = [app for folder in self.root.iterdir() if (app := self.get_app(folder.name)) is not None]
        return sorted(apps, key=lambda app: str(app.get("created_at", "")), reverse=True)

    def save(self, html: str, *, title: str, requirements: str, model: str) -> dict[str, Any]:
        if not self._safe_root():
            raise ValueError("generated-apps 目录不能是符号链接")
        self.root.mkdir(parents=True, exist_ok=True)
        app_id = uuid.uuid4().hex
        metadata = {
            "id": app_id, "title": title, "preview_url": f"/v1/apps/{app_id}/preview",
            "file": f"generated-apps/{app_id}/index.html", "requirements": requirements,
            "created_at": datetime.now(timezone.utc).isoformat(), "model": model,
            "bytes": len(html.encode("utf-8")),
        }
        # 完成校验后才创建产物，发布目录保证列表不会读到半成品。
        staging = Path(tempfile.mkdtemp(prefix=".app-", dir=self.root))
        try:
            (staging / "index.html").write_text(html, encoding="utf-8")
            (staging / "metadata.json").write_text(json.dumps(metadata, ensure_ascii=False, indent=2), encoding="utf-8")
            staging.rename(self.root / app_id)
        finally:
            if staging.exists():
                shutil.rmtree(staging)
        return metadata


class AppGenerateTool(Tool):
    name = "app_generate"
    description = (
        "根据用户明确描述的需求开发可操作的单页网页应用，如待办、计算器、计时器、记账、数据看板或落地页。"
        "使用当前模型生成独立 HTML/CSS/JavaScript 并保存到 workspace/generated-apps，返回可预览的地址。"
        "本地交互，无后端、网络或持久存储；需要这些能力时明确告知为本地原型。不要运行 shell。"
    )
    parameters = {
        "type": "object", "properties": {
            "requirements": {"type": "string", "description": "用户明确提供的应用需求，包含核心功能、页面内容及设计偏好，不能凭空扩展用户请求"},
            "title": {"type": "string", "description": "可选的应用名称，最多80字符"},
        }, "required": ["requirements"], "additionalProperties": False,
    }

    def __init__(self, client: LLMClient, work_dir: Path | str, *, max_tokens: int = 8192, telemetry=None) -> None:
        self.client = client
        self.store = GeneratedAppStore(work_dir)
        self.max_tokens = max(4096, int(max_tokens))
        self.telemetry = telemetry

    def run(self, requirements: str, title: str = "") -> str:
        if not isinstance(requirements, str) or not 1 <= len(requirements.strip()) <= 12000:
            return "错误：请提供1–12000字符的明确应用需求。"
        if not isinstance(title, str) or len(title.strip()) > 80:
            return "错误：应用名称必须是最多80字符的文本。"
        requirements, title = requirements.strip(), title.strip()
        requested = json.dumps({"requirements": requirements, "title": title}, ensure_ascii=False)
        error_note = ""
        for attempt in range(2):
            messages = [{"role": "system", "content": APP_SYSTEM_PROMPT}, {"role": "user", "content": requested}]
            if error_note:
                messages.append({"role": "user", "content": f"上次生成未通过校验：{error_note}。请重新生成完整的独立页面并修复上述问题。"})
            try:
                started = time.monotonic()
                # 长 HTML 响应采用流式传输，持续接收避免网关对非流式请求的空闲超时。
                # delta 不发给主对话；只有完整校验并落盘后才返回预览地址。
                stream = getattr(self.client, "chat_stream", None)
                if stream is not None:
                    response = stream(messages, tools=None, on_delta=None, max_tokens=self.max_tokens)
                else:
                    # 兼容旧的仅 chat 接口替身；正式 Qwen/GLM 适配器均走上面的流式路径。
                    response = self.client.chat(messages, tools=None, max_tokens=self.max_tokens)
                if self.telemetry:
                    self.telemetry.record_llm(response.usage, (time.monotonic() - started) * 1000, detail=f"app_generate attempt {attempt + 1}")
                if response.tool_calls:
                    raise ValueError("应用生成应直接返回 HTML，不能请求额外工具")
                if response.finish_reason in {"length", "max_tokens"}:
                    raise ValueError("模型输出预算耗尽，请简化需求或增大生成预算")
                html, html_title = _validated_html(response.content)
                app = self.store.save(html, title=title or html_title, requirements=requirements,
                                      model=str(getattr(self.client, "model", self.client.name)))
                # URL 靠前，保留在 SSE 工具结果摘要中；不把整份 HTML 回传主对话。
                return json.dumps({"status": "created", "id": app["id"], "title": app["title"],
                                   "preview_url": app["preview_url"], "file": app["file"],
                                   "note": "已生成本地交互应用，打开预览可操作。数据仅保留在页面内存。"}, ensure_ascii=False)
            except ValueError as error:
                error_note = str(error)
            except Exception as error:
                return f"错误：应用生成失败（{type(error).__name__}）：{error}"
        return f"错误：未能生成通过校验的应用：{error_note}。没有保存半成品，请调整需求后重试。"
