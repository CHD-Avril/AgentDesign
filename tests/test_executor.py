"""代码执行工具测试：授权策略、真实运行、超时、高风险拦截。"""
from __future__ import annotations

import tempfile
from pathlib import Path

from tools.executor import Authorizer, RunPythonTool, ShellTool, make_executor_tools


# ---------- 授权器 ----------

def test_authorizer_off_blocks_all():
    auth = Authorizer(mode="off")
    ok, reason = auth.check("python", "print(1)")
    assert not ok and "off" in reason


def test_authorizer_auto_runs_safe_and_blocks_risk():
    auth = Authorizer(mode="auto", interactive=True)
    ok, _ = auth.check("python", "print(1 + 1)")
    assert ok
    ok2, reason2 = auth.check("python", "import shutil; shutil.rmtree('x')")
    assert not ok2 and "删除" in reason2
    ok3, reason3 = auth.check("shell", "del /s /q C:\\temp\\*")
    assert not ok3 and "删除" in reason3


def test_authorizer_ask_offline_falls_back_safe():
    # 非交互 + ask：安全放行、危险拒绝
    auth = Authorizer(mode="ask", interactive=False)
    ok, _ = auth.check("shell", "echo hello")
    assert ok
    ok2, _ = auth.check("shell", "shutdown /s")
    assert not ok2


def test_authorizer_ask_with_asker_callback():
    # 自定义确认回调（GUI 弹窗）：返回 True 放行，False 拒绝
    auth = Authorizer(mode="ask", interactive=False, asker=lambda text: True)
    ok, reason = auth.check("python", "print(1)")
    assert ok and reason == ""
    auth2 = Authorizer(mode="ask", interactive=False, asker=lambda text: False)
    ok2, reason2 = auth2.check("shell", "echo hi")
    assert not ok2 and "拒绝" in reason2
    # 提示文本应包含类型与内容
    seen = {}
    auth3 = Authorizer(mode="ask", interactive=False, asker=lambda t: seen.setdefault("t", t) or True)
    auth3.check("python", "import os; print(os.getcwd())")
    assert "python" in seen["t"] and "os.getcwd" in seen["t"]


def test_risk_detection_python():
    from tools.executor import _detect_risk

    assert _detect_risk("python", "print('hi')") == ""
    assert "删除" in _detect_risk("python", "os.remove('a.txt')")
    assert "递归删除" in _detect_risk("python", "import shutil; shutil.rmtree('d')")


# ---------- run_python 真实执行 ----------

def test_run_python_ok():
    with tempfile.TemporaryDirectory() as d:
        tool = RunPythonTool(Path(d), Authorizer(mode="auto"))
        res = tool.run("a = [i for i in range(10) if i % 2 == 0]\nprint(sum(a))")
        assert res == "20"


def test_run_python_error_reports_stderr():
    with tempfile.TemporaryDirectory() as d:
        tool = RunPythonTool(Path(d), Authorizer(mode="auto"))
        res = tool.run("print(1)\nprint(undefined_var)")
        assert res.startswith("退出码") and "undefined_var" in res


def test_run_python_timeout():
    with tempfile.TemporaryDirectory() as d:
        tool = RunPythonTool(Path(d), Authorizer(mode="auto"))
        res = tool.run("import time; time.sleep(5)", timeout=1)
        assert "超时" in res


def test_run_python_denied_when_off():
    with tempfile.TemporaryDirectory() as d:
        tool = RunPythonTool(Path(d), Authorizer(mode="off"))
        res = tool.run("print(1)")
        assert "拒绝" in res


def test_run_python_works_in_sandbox_cwd():
    with tempfile.TemporaryDirectory() as d:
        tool = RunPythonTool(Path(d), Authorizer(mode="auto"))
        res = tool.run("import os; print(os.getcwd())")
        assert res == str(Path(d).resolve())


# ---------- shell 执行 ----------

def test_shell_echo_ok():
    with tempfile.TemporaryDirectory() as d:
        tool = ShellTool(Path(d), Authorizer(mode="auto"))
        res = tool.run("echo hello-agent")
        assert "hello-agent" in res


def test_shell_blocked_when_off():
    with tempfile.TemporaryDirectory() as d:
        tool = ShellTool(Path(d), Authorizer(mode="off"))
        res = tool.run("echo hi")
        assert "拒绝" in res


def test_make_executor_tools_shares_authorizer():
    with tempfile.TemporaryDirectory() as d:
        tools = make_executor_tools(Path(d), mode="off")
        names = [t.name for t in tools]
        assert "run_python" in names and "shell" in names
        assert tools[0].run("print(1)").startswith("执行被拒绝")
