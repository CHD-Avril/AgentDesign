"""代码执行工具：让 Agent 在“授权”后运行 Python 程序或 Shell 命令。

授权策略（AGENT_CODE_EXEC，见 .env）：
  off   —— 完全禁用，工具一律拒绝
  auto  —— 低风险自动执行，命中高风险黑名单直接拒绝
  ask   —— 每次执行前在命令行弹窗，由你输入 y/n 决定（默认，最安全）

安全边界说明（诚实版）：
- 代码/命令运行在本机真实环境（这正是"干活"的意义），所以**授权是主要防线**；
- 附带防护：执行超时、输出截断、工作目录固定为沙箱 workspace/；
- 风险黑名单只做"提示/拦截"用途，不是完备沙箱——请在 ask 模式下审阅后放行。
"""
from __future__ import annotations

import os
import re
import subprocess
import sys
from pathlib import Path
from typing import Any

from .base import Tool

MODE_OFF, MODE_AUTO, MODE_ASK = "off", "auto", "ask"

# ---- 风险检测（黑名单，命中即提示高风险）----
_SHELL_RISK_PATTERNS: list[tuple[str, str]] = [
    (r"\bdel\s+/[fsq]", "强制删除文件"),
    (r"\brmdir\s+/s", "递归删除目录"),
    (r"\bformat\s+[a-zA-Z]:", "格式化磁盘"),
    (r"\bshutdown\b", "关机/重启"),
    (r"\btaskkill\s+/f", "强制结束进程"),
    (r"\brm\s+-rf\b", "递归强制删除"),
    (r"\bmkfs\b", "格式化文件系统"),
    (r">\s*/dev/", "写入系统设备"),
    (r"chmod\s+-R\s+777", "开放全部文件权限"),
]

_PY_RISK_KEYWORDS: list[tuple[str, str]] = [
    ("os.remove(", "删除文件"),
    ("os.unlink(", "删除文件"),
    ("os.rmdir(", "删除目录"),
    ("os.system(", "执行系统命令"),
    ("os.kill(", "结束进程"),
    ("shutil.rmtree(", "递归删除目录"),
    ("subprocess.", "执行子进程"),
    ("pathlib.Path", "文件系统操作"),
    (".unlink()", "删除文件"),
    (".rmdir()", "删除目录"),
    ("shutdown", "关机/重启"),
]


def _detect_risk(kind: str, text: str) -> str:
    """返回风险描述；无风险返回空字符串。"""
    if kind == "shell":
        for pattern, desc in _SHELL_RISK_PATTERNS:
            if re.search(pattern, text, flags=re.I):
                return desc
    else:
        for keyword, desc in _PY_RISK_KEYWORDS:
            if keyword in text:
                return desc
    return ""


class Authorizer:
    """授权器：决定一次代码/命令执行是否放行。"""

    def __init__(self, mode: str = MODE_ASK, interactive: bool = True, asker=None) -> None:
        if mode not in (MODE_OFF, MODE_AUTO, MODE_ASK):
            raise ValueError(f"未知的执行模式：{mode}")
        self.mode = mode
        self.interactive = interactive  # stdin 是否为可交互终端
        self.asker = asker              # 可选：自定义确认回调 asker(提示文本) -> bool（如 GUI 弹窗）

    def check(self, kind: str, description: str, confirm: bool = False) -> tuple[bool, str]:
        """(是否放行, 拒绝原因/提示)。confirm：调用方（如 HTTP 请求）已声明授权。"""
        if self.mode == MODE_OFF:
            return False, "代码执行未启用（AGENT_CODE_EXEC=off），请联系管理员开启。"
        risk = _detect_risk(kind, description)

        if self.mode == MODE_AUTO:
            if risk:
                return False, f"检测到高风险操作（{risk}），已自动拒绝。如需执行，请切换到 ask 模式。"
            return True, ""

        # ask 模式
        if self.asker is not None:
            # 自定义确认（GUI 弹窗等）：由调用方决定
            lines = ["是否允许执行以下操作？"]
            if risk:
                lines.append(f"⚠ 检测到高风险：{risk}")
            lines.append("")
            lines.append(f"类型：{kind}")
            lines.append(f"内容：{description[:300]}")
            if self.asker("\n".join(lines)):
                return True, ""
            return False, "用户拒绝了本次执行。"
        if not self.interactive:
            # 非交互环境（HTTP 服务 / 管道）：安全放行，危险拒绝
            if risk:
                return False, f"检测到高风险操作（{risk}），非交互环境已拒绝；请在命令行对话模式中授权。"
            return True, ""

        prompt = "操作"
        if risk:
            prompt += f"（⚠ 检测到高风险：{risk}）"
        answer = input(f"\n  [授权] 是否允许执行 {kind}：{description[:80]}？{prompt}（y=允许 / n=拒绝）> ").strip().lower()
        if answer in ("y", "yes", "是"):
            return True, ""
        return False, "用户拒绝了本次执行。"


# ================= run_python：运行 Python 程序 =================

class RunPythonTool(Tool):
    """运行一段 Python 代码（本机解释器，带超时，工作目录为沙箱）。"""

    name = "run_python"
    description = (
        "运行一段 Python 代码并返回输出（退出码 + stdout/stderr）。"
        "用于验证程序、跑脚本、处理数据。工作目录是沙箱 workspace/；执行前可能需要用户授权。"
    )
    parameters = {
        "type": "object",
        "properties": {
            "code": {"type": "string", "description": "要执行的完整 Python 代码"},
            "timeout": {"type": "integer", "description": "超时秒数，默认 30，最大 120"},
        },
        "required": ["code"],
    }

    def __init__(self, work_dir: Path, authorizer: Authorizer) -> None:
        self.work_dir = work_dir
        self.authorizer = authorizer

    def run(self, code: str, timeout: int = 30) -> str:
        try:
            timeout = max(1, min(int(timeout), 120))
        except (TypeError, ValueError):
            timeout = 30
        ok, reason = self.authorizer.check("python", code)
        if not ok:
            return f"执行被拒绝：{reason}"

        env = dict(os.environ)
        env["PYTHONIOENCODING"] = "utf-8"
        env["PYTHONUTF8"] = "1"
        try:
            proc = subprocess.run(
                [sys.executable, "-c", code],
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                timeout=timeout,
                cwd=str(self.work_dir),
                env=env,
            )
        except subprocess.TimeoutExpired:
            return f"执行超时（超过 {timeout} 秒，已终止）"
        except Exception as err:
            return f"启动解释器失败：{type(err).__name__}: {err}"

        output = (proc.stdout or "") + (proc.stderr or "")
        output = output.strip()[:4000]
        if proc.returncode != 0:
            return f"退出码 {proc.returncode}\n{output}" if output else f"退出码 {proc.returncode}（无输出）"
        return output or "（执行成功，无输出）"


# ================= shell：执行系统命令 =================

class ShellTool(Tool):
    """执行一条系统命令（Windows: cmd /c；其他: sh -c），工作目录为沙箱。"""

    name = "shell"
    description = (
        "执行一条系统命令（cmd/PowerShell 语法）并返回输出。"
        "工作目录是沙箱 workspace/；删除、格式化、关机等高风险命令默认被拦截，执行前需要用户授权。"
    )
    parameters = {
        "type": "object",
        "properties": {
            "command": {"type": "string", "description": "要执行的命令"},
            "timeout": {"type": "integer", "description": "超时秒数，默认 60，最大 300"},
        },
        "required": ["command"],
    }

    def __init__(self, work_dir: Path, authorizer: Authorizer) -> None:
        self.work_dir = work_dir
        self.authorizer = authorizer

    def run(self, command: str, timeout: int = 60) -> str:
        try:
            timeout = max(1, min(int(timeout), 300))
        except (TypeError, ValueError):
            timeout = 60
        ok, reason = self.authorizer.check("shell", command)
        if not ok:
            return f"执行被拒绝：{reason}"

        if os.name == "nt":
            argv = ["cmd", "/c", command]
        else:
            argv = ["sh", "-c", command]
        try:
            proc = subprocess.run(
                argv,
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                timeout=timeout,
                cwd=str(self.work_dir),
            )
        except subprocess.TimeoutExpired:
            return f"执行超时（超过 {timeout} 秒，已终止）"
        except Exception as err:
            return f"启动命令失败：{type(err).__name__}: {err}"

        output = ((proc.stdout or "") + (proc.stderr or "")).strip()[:4000]
        if proc.returncode != 0:
            return f"退出码 {proc.returncode}\n{output}" if output else f"退出码 {proc.returncode}（无输出）"
        return output or "（执行成功，无输出）"


def make_executor_tools(work_dir: Path, mode: str = MODE_ASK, interactive: bool = True, asker=None) -> list[Tool]:
    """创建共享同一授权器的执行工具。asker：自定义确认回调（如 GUI 弹窗），可选。"""
    authorizer = Authorizer(mode=mode, interactive=interactive, asker=asker)
    return [
        RunPythonTool(work_dir, authorizer),
        ShellTool(work_dir, authorizer),
    ]
