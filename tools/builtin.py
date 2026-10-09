"""内置工具集：安全计算、时间、网页抓取、文件沙箱、网页搜索。

安全设计：
- 计算器：AST 白名单求值，杜绝任意代码执行；
- 文件工具：沙箱限定在 work_dir 内，路径越界直接拒绝；
- HTTP 抓取：限制响应大小，防内存被撑爆；
- 默认不提供 shell 工具，需要时按 README「扩展指南」自行添加并评估风险。
"""
from __future__ import annotations

import ast
import base64
import html as html_mod
import operator
import re
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path
from typing import Any

try:
    from zoneinfo import ZoneInfo
except ImportError:  # pragma: no cover —— 极老版本兜底
    ZoneInfo = None

from .base import Tool

# ================= 1. 安全计算器 =================

_ALLOWED_OPERATORS: dict[type, Any] = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.FloorDiv: operator.floordiv,
    ast.Mod: operator.mod,
    ast.Pow: operator.pow,
    ast.USub: operator.neg,
    ast.UAdd: operator.pos,
    ast.BitAnd: operator.and_,
    ast.BitOr: operator.or_,
    ast.BitXor: operator.xor,
    ast.LShift: operator.lshift,
    ast.RShift: operator.rshift,
    ast.Invert: operator.invert,
    ast.Eq: operator.eq,
    ast.NotEq: operator.ne,
    ast.Lt: operator.lt,
    ast.LtE: operator.le,
    ast.Gt: operator.gt,
    ast.GtE: operator.ge,
}
_MAX_RESULT_DIGITS = 18


def safe_eval_expression(expression: str) -> Any:
    """只允许 数字 / 四则 / 幂 / 取模 / 比较 / 位运算 的表达式求值，杜绝任意代码执行。

    传入 `__import__('os')...` 这类内容会被拒绝。
    """
    expression = expression.strip()
    if not expression:
        raise ValueError("表达式为空")
    tree = ast.parse(expression, mode="eval")

    def _eval(node: ast.AST) -> Any:
        if isinstance(node, ast.Expression):
            return _eval(node.body)
        if isinstance(node, ast.Constant):
            if node.value is None or isinstance(node.value, (int, float, bool)):
                return node.value
            raise ValueError(f"不支持的常量：{node.value!r}")
        if isinstance(node, ast.BinOp):
            op = _ALLOWED_OPERATORS.get(type(node.op))
            if op is None:
                raise ValueError(f"不支持的运算符：{type(node.op).__name__}")
            return op(_eval(node.left), _eval(node.right))
        if isinstance(node, ast.UnaryOp):
            op = _ALLOWED_OPERATORS.get(type(node.op))
            if op is None:
                raise ValueError(f"不支持的运算符：{type(node.op).__name__}")
            return op(_eval(node.operand))
        if isinstance(node, ast.Compare):
            left = _eval(node.left)
            for op_node, comp in zip(node.ops, node.comparators):
                op = _ALLOWED_OPERATORS.get(type(op_node))
                if op is None:
                    raise ValueError(f"不支持的比较：{type(op_node).__name__}")
                if not op(left, _eval(comp)):
                    return False
                left = _eval(comp)
            return True
        raise ValueError(f"不支持的表达式节点：{type(node).__name__}")

    result = _eval(tree.body)
    if isinstance(result, float):
        if result != result:  # NaN
            raise ValueError("结果不是数字")
        result = round(result, 10)
        if abs(result) >= 10 ** _MAX_RESULT_DIGITS:
            raise ValueError(f"结果超出范围（{_MAX_RESULT_DIGITS} 位）")
    elif isinstance(result, int) and abs(result) >= 10 ** _MAX_RESULT_DIGITS:
        raise ValueError(f"结果超出范围（{_MAX_RESULT_DIGITS} 位）")
    return result


class CalculatorTool(Tool):
    name = "calculator"
    description = "执行数学计算。支持四则运算、幂、取模、比较、位运算。任何需要算数的问题都用它。"
    parameters = {
        "type": "object",
        "properties": {
            "expression": {"type": "string", "description": "数学表达式，例如 (1200-328)*0.7 或 2**10"},
        },
        "required": ["expression"],
    }

    def run(self, expression: str) -> str:
        try:
            result = safe_eval_expression(expression)
        except ZeroDivisionError:
            return "错误：除数为零"
        except Exception as err:
            return f"错误：{err}"
        return f"{expression} = {result}"


# ================= 2. 当前时间 =================

def _now() -> datetime:
    if ZoneInfo is not None:
        try:
            return datetime.now(ZoneInfo("Asia/Shanghai"))
        except Exception:
            pass  # 缺少 tzdata 时退回本机时间
    return datetime.now()


class DateTimeTool(Tool):
    name = "datetime_now"
    description = "获取当前日期与时间（北京时间）。需要知道今天几号、星期几、几点时使用。"
    parameters = {
        "type": "object",
        "properties": {
            "format": {
                "type": "string",
                "description": "strftime 格式，默认 %Y-%m-%d %H:%M:%S %A",
            },
        },
    }

    def run(self, format: str = "%Y-%m-%d %H:%M:%S %A") -> str:
        return _now().strftime(format)


# ================= 3. 网页 / 文本抓取 =================

class HttpFetchTool(Tool):
    """抓取网页或文本文件的正文（纯文本，限大小）。给 Agent 联网能力。"""

    name = "http_fetch"
    description = "抓取一个网页或文本文件的正文内容（纯文本，约 200KB 上限）。用于获取公开网页信息。"
    parameters = {
        "type": "object",
        "properties": {
            "url": {"type": "string", "description": "完整的 http(s) 网址"},
        },
        "required": ["url"],
    }

    def __init__(self, timeout: int = 20, max_bytes: int = 200_000, max_chars: int = 3_000) -> None:
        self.timeout = timeout
        self.max_bytes = max_bytes
        self.max_chars = max_chars

    def run(self, url: str) -> str:
        if not url.startswith(("http://", "https://")):
            return "错误：只支持 http/https 网址"
        request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (compatible; Agent/1.0)"})
        try:
            with urllib.request.urlopen(request, timeout=self.timeout) as resp:
                raw = resp.read(self.max_bytes + 1)
        except Exception as err:
            return f"抓取失败：{type(err).__name__}: {err}"

        if len(raw) > self.max_bytes:
            text = raw[: self.max_bytes].decode("utf-8", "replace")
            note = f"\n（内容超过 {self.max_bytes} 字节，已截断）"
        else:
            text = raw.decode("utf-8", "replace")
            note = ""
        # 去脚本样式与标签，压空白
        text = re.sub(r"<script[\s\S]*?</script>|<style[\s\S]*?</style>", " ", text, flags=re.I)
        text = re.sub(r"<[^>]+>", " ", text)
        text = html_mod.unescape(re.sub(r"\s+", " ", text)).strip()
        if len(text) > self.max_chars:
            text = text[: self.max_chars] + " ……（正文已截断）"
        return text + note if text else "(页面没有可读文本内容)"


# ================= 4. 文件沙箱 =================

class _FileMixin:
    """文件工具公共部分：路径安全检查，支持多目录白名单 + 系统目录黑名单。"""

    work_dir: Path
    allowed_roots: list[Path]  # 允许访问的根目录列表

    # 系统目录黑名单（绝对禁止，防止搞坏系统）
    _FORBIDDEN_ROOTS = [
        "C:\\Windows",
        "C:\\Program Files",
        "C:\\Program Files (x86)",
        "C:\\System Volume Information",
        "C:\\$Recycle.Bin",
        "C:\\Boot",
        "C:\\Recovery",
    ]

    def _resolve(self, path_str: str) -> Path:
        """把用户给的路径解析成绝对路径，同时做安全检查。

        支持两种路径：
        - 相对路径：相对于 work_dir（比如 "notes.txt"）
        - 绝对路径：直接用（比如 "C:/Users/xxx/Desktop/notes.txt"）
        """
        p = Path(path_str)

        # 1. 解析成绝对路径
        if p.is_absolute():
            target = p.resolve()
        else:
            target = (self.work_dir / path_str).resolve()

        # 2. 先检查黑名单（系统目录绝对禁止）
        for forbidden in self._FORBIDDEN_ROOTS:
            try:
                forbidden_path = Path(forbidden).resolve()
                if target == forbidden_path or forbidden_path in target.parents:
                    raise PermissionError(
                        f"禁止访问系统目录：{target}（为了安全，系统目录不允许操作）"
                    )
            except (OSError, ValueError):
                continue

        # 3. 再检查白名单（必须在允许的目录范围内）
        for root in self.allowed_roots:
            try:
                root_resolved = root.resolve()
                if target == root_resolved or root_resolved in target.parents:
                    return target
            except (OSError, ValueError):
                continue

        # 4. 都不在，拒绝
        allowed_str = ", ".join(str(r) for r in self.allowed_roots)
        raise PermissionError(
            f"路径越界：{path_str!r}\n"
            f"允许访问的目录：{allowed_str}\n"
            f"（系统目录已自动禁止）"
        )


class FileListTool(_FileMixin, Tool):
    name = "file_list"
    description = "列出文件目录。支持相对路径（相对于沙箱）或绝对路径（在允许的目录范围内）。"
    parameters = {
        "type": "object",
        "properties": {
            "subdir": {"type": "string", "description": "目录路径，默认 '.'（沙箱根目录）。支持绝对路径如 'C:/Users/xxx/Desktop'"},
        },
    }

    def __init__(self, work_dir: Path) -> None:
        self.work_dir = work_dir
        # 白名单：沙箱目录 + 用户主目录
        self.allowed_roots = [
            work_dir.resolve(),
            Path.home().resolve(),  # 你的用户目录（桌面、文档、下载等）
        ]

    def run(self, subdir: str = ".") -> str:
        try:
            target = self._resolve(subdir)
        except Exception as err:
            return f"错误：{err}"
        if not target.exists():
            return f"目录不存在：{subdir}"
        if not target.is_dir():
            return f"不是目录：{subdir}"
        lines = []
        for item in sorted(target.iterdir()):
            if item.is_dir():
                lines.append(f"{item.name}/  [目录]")
            else:
                try:
                    size = item.stat().st_size
                except OSError:
                    size = 0
                lines.append(f"{item.name}  [文件] {size} 字节")
        return "\n".join(lines) if lines else "（空目录）"


class FileReadTool(_FileMixin, Tool):
    name = "file_read"
    description = "读取文本文件内容。支持相对路径（相对于沙箱）或绝对路径（在允许的目录范围内）。"
    parameters = {
        "type": "object",
        "properties": {
            "path": {"type": "string", "description": "文件路径，支持绝对路径如 'C:/Users/xxx/Desktop/note.txt'"},
            "max_chars": {"type": "integer", "description": "最多读取字符数，默认 10000"},
        },
        "required": ["path"],
    }

    def __init__(self, work_dir: Path) -> None:
        self.work_dir = work_dir
        self.allowed_roots = [
            work_dir.resolve(),
            Path.home().resolve(),
        ]

    def run(self, path: str, max_chars: int = 10_000) -> str:
        try:
            target = self._resolve(path)
        except Exception as err:
            return f"错误：{err}"
        if not target.is_file():
            return f"文件不存在：{path}"
        try:
            text = target.read_text(encoding="utf-8", errors="replace")
        except Exception as err:
            return f"读取失败：{type(err).__name__}: {err}"
        if len(text) > max_chars:
            return text[:max_chars] + f"\n……（已截断，全文 {len(text)} 字符）"
        return text


class FileWriteTool(_FileMixin, Tool):
    name = "file_write"
    description = "把文本写入文件（自动创建目录，覆盖已有文件）。支持相对路径或绝对路径。"
    parameters = {
        "type": "object",
        "properties": {
            "path": {"type": "string", "description": "文件路径，支持绝对路径如 'C:/Users/xxx/Desktop/note.txt'"},
            "content": {"type": "string", "description": "要写入的文本内容"},
        },
        "required": ["path", "content"],
    }

    def __init__(self, work_dir: Path) -> None:
        self.work_dir = work_dir
        self.allowed_roots = [
            work_dir.resolve(),
            Path.home().resolve(),
        ]

    def run(self, path: str, content: str) -> str:
        try:
            target = self._resolve(path)
        except Exception as err:
            return f"错误：{err}"
        try:
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(content, encoding="utf-8")
        except Exception as err:
            return f"写入失败：{type(err).__name__}: {err}"
        return f"已写入 {len(content)} 字符 → {path}"


# ================= 5. 网页搜索（免 Key，国内可用） =================

class WebSearchTool(Tool):
    """网页搜索，无需 Key。

    主搜索源：Bing（cn.bing.com / www.bing.com，国内可达），解析 b_algo 结果块；
    失败自动回退 DuckDuckGo。
    想换更稳定的搜索服务（如博查、SerpAPI），实现 _search_api() 返回
    [(标题, 链接, 摘要), ...] 并在 _search() 里优先调用即可。
    """

    name = "web_search"
    description = "搜索互联网，返回结果标题、链接和摘要。用于查资料、找网页、获取实时信息。"
    parameters = {
        "type": "object",
        "properties": {
            "query": {"type": "string", "description": "搜索关键词"},
            "n": {"type": "integer", "description": "返回条数，默认 5，最大 10"},
        },
        "required": ["query"],
    }

    def __init__(self, timeout: int = 20) -> None:
        self.timeout = timeout

    # ---------- 对外接口 ----------
    def run(self, query: str, n: int = 5) -> str:
        try:
            n = max(1, min(int(n), 10))
        except (TypeError, ValueError):
            n = 5
        try:
            results = self._search(query, n)
        except Exception as err:
            return (
                f"搜索失败：{type(err).__name__}: {err}"
                "（可自行接入搜索 API，见 WebSearchTool._search_api 注释）"
            )
        if not results:
            return "没有搜到结果。"
        lines = []
        for i, item in enumerate(results[:n], 1):
            title, url, snippet = (list(item) + ["", ""])[:3]
            if not url:
                continue
            line = f"{i}. {title}\n   {url}"
            if snippet:
                line += f"\n   {snippet[:120]}"
            lines.append(line)
        return "\n".join(lines) if lines else "没有搜到结果。"

    # ---------- 搜索源 ----------
    def _search(self, query: str, n: int) -> list[tuple[str, str, str]]:
        """多源搜索：Bing 优先，DuckDuckGo 兜底；返回 [(标题, 链接, 摘要), ...]。"""
        last_err: Exception | None = None
        for source in (self._search_bing, self._search_ddg):
            try:
                results = source(query, n)
                if results:
                    return results
            except Exception as err:  # noqa: BLE001
                last_err = err
        raise RuntimeError(f"Bing/DuckDuckGo 均不可用：{last_err}") from last_err

    def _search_api(self, query: str, n: int) -> list[tuple[str, str, str]]:
        """【扩展点】接入你自己的搜索 API 就在这里实现，返回 [(标题, 链接, 摘要), ...]，
        并在 _search() 中把它放到最前面优先调用。"""
        raise NotImplementedError

    # ---------- Bing ----------
    def _search_bing(self, query: str, n: int) -> list[tuple[str, str, str]]:
        for host in ("https://cn.bing.com/search", "https://www.bing.com/search"):
            url = f"{host}?q={urllib.parse.quote(query)}&count={n}&mkt=zh-CN"
            request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"})
            try:
                with urllib.request.urlopen(request, timeout=self.timeout) as resp:
                    page = resp.read(400_000).decode("utf-8", "replace")
                results = self._parse_bing(page, n)
                if results:
                    return results
            except Exception:
                continue  # 换下一个 host
        return []

    @staticmethod
    def _parse_bing(page: str, n: int) -> list[tuple[str, str, str]]:
        """解析 Bing 搜索页：<li class="b_algo"> 块内 h2 a 为标题链接，<p> 为摘要。"""
        results: list[tuple[str, str, str]] = []
        blocks = re.split(r'<li class="b_algo"', page)[1:]
        for block in blocks[: max(n, 10)]:
            match = re.search(r'<h2[^>]*>\s*<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>', block, flags=re.S)
            if not match:
                continue
            url = html_mod.unescape(match.group(1))
            title = html_mod.unescape(re.sub(r"<[^>]+>", "", match.group(2))).strip()
            if not title:
                continue
            url = WebSearchTool._clean_url(url)
            snippet_match = re.search(r"<p[^>]*>(.*?)</p>", block, flags=re.S)
            snippet = html_mod.unescape(re.sub(r"<[^>]+>", "", snippet_match.group(1))).strip() if snippet_match else ""
            results.append((title, url, snippet))
        return results

    @staticmethod
    def _clean_url(url: str) -> str:
        """还原 Bing 的 /ck/a 跳转链接：u= 参数为 'a1' + base64(真实URL)。"""
        if "/ck/a" in url and "u=" in url:
            token = urllib.parse.unquote(url.split("u=", 1)[1].split("&", 1)[0])
            if token.startswith("a1"):
                payload = token[2:]
                try:
                    payload += "=" * (-len(payload) % 4)
                    return base64.urlsafe_b64decode(payload).decode("utf-8", "replace")
                except Exception:
                    pass  # 解析失败则退回原样
            return token
        return url

    # ---------- DuckDuckGo（兜底） ----------
    def _search_ddg(self, query: str, n: int) -> list[tuple[str, str, str]]:
        url = "https://html.duckduckgo.com/html/?q=" + urllib.parse.quote(query)
        request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (compatible; Agent/1.0)"})
        with urllib.request.urlopen(request, timeout=self.timeout) as resp:
            page = resp.read(300_000).decode("utf-8", "replace")
        results: list[tuple[str, str, str]] = []
        pattern = re.compile(r'<a[^>]+class="result__a"[^>]*href="([^"]+)"[^>]*>(.*?)</a>', flags=re.S)
        for match in pattern.finditer(page):
            href = html_mod.unescape(match.group(1))
            title = html_mod.unescape(re.sub(r"<[^>]+>", "", match.group(2))).strip()
            if not title:
                continue
            if "uddg=" in href:  # 去掉 DuckDuckGo 跳转前缀
                href = urllib.parse.unquote(href.split("uddg=", 1)[1].split("&", 1)[0])
            elif href.startswith("//"):
                href = "https:" + href
            results.append((title, href, ""))
        return results
