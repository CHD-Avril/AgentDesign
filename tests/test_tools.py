"""工具安全测试：计算器白名单、文件沙箱、注册表。"""
from __future__ import annotations

import tempfile
from pathlib import Path

from tools import default_registry
from tools.builtin import CalculatorTool, WebSearchTool, safe_eval_expression


def test_calculator_basic():
    assert safe_eval_expression("(1200-328)*0.7") == 610.4
    assert safe_eval_expression("2**10") == 1024
    assert safe_eval_expression("17 % 5") == 2
    assert safe_eval_expression("3 > 2") is True


def test_calculator_rejects_code_injection():
    evil = [
        "__import__('os').system('whoami')",
        "open('/etc/passwd').read()",
        "lambda: 1",
        "[x for x in range(3)]",
        "1 if True else 2",
    ]
    for expr in evil:
        result = CalculatorTool().run(expr)
        assert result.startswith("错误"), f"{expr!r} 竟然没被拒绝：{result}"


def test_calculator_div_zero():
    assert "除数为零" in CalculatorTool().run("1/0")


def test_registry_unknown_tool():
    with tempfile.TemporaryDirectory() as d:
        reg = default_registry(Path(d))
        ok, res = reg.run("no_such_tool", {})
        assert ok is False and "不存在" in res


def test_file_write_read_roundtrip():
    with tempfile.TemporaryDirectory() as d:
        reg = default_registry(Path(d))
        ok, _ = reg.run("file_write", {"path": "a/b.txt", "content": "你好，Agent"})
        assert ok
        ok2, res2 = reg.run("file_read", {"path": "a/b.txt"})
        assert ok2 and "你好，Agent" in res2


def test_file_sandbox_blocks_traversal():
    with tempfile.TemporaryDirectory() as d:
        reg = default_registry(Path(d))
        for bad in ("../secret.txt", "..\\..\\Windows\\win.ini", "/etc/passwd"):
            ok, res = reg.run("file_read", {"path": bad})
            assert not ok or "错误" in res, f"路径 {bad!r} 未被拦截：{res}"


def test_file_list():
    with tempfile.TemporaryDirectory() as d:
        reg = default_registry(Path(d))
        reg.run("file_write", {"path": "x.txt", "content": "1"})
        ok, res = reg.run("file_list", {})
        assert ok and "x.txt" in res


# ---------- 网页搜索（Bing 解析） ----------

_BING_HTML = """
<li class="b_algo">
  <h2><a href="https://example.com/1">第一个结果标题</a></h2>
  <div class="b_caption"><p>这是第一个结果的摘要内容。</p></div>
</li>
<li class="b_algo">
  <h2><a href="https://cn.bing.com/ck/a?u=a1aHR0cHM6Ly9leGFtcGxlLmNvbS8y&ntb=1">第二个结果标题</a></h2>
  <p>第二个结果的摘要。</p>
</li>
<li class="b_algo"><h2><a href="https://example.com/3">第三个结果标题</a></h2></li>
"""


def test_parse_bing_results():
    results = WebSearchTool._parse_bing(_BING_HTML, 5)
    assert len(results) == 3
    assert results[0][0] == "第一个结果标题"
    assert results[0][1] == "https://example.com/1"
    assert "摘要" in results[0][2]
    assert results[1][1] == "https://example.com/2"  # ck/a 跳转被还原
    assert results[2][2] == ""                        # 无摘要时为空


def test_clean_bing_url():
    # u= 参数为 a1 + base64(真实URL)
    cleaned = WebSearchTool._clean_url("https://cn.bing.com/ck/a?u=a1aHR0cHM6Ly9leGFtcGxlLmNvbS9wYWdl&ntb=1")
    assert cleaned == "https://example.com/page"
    plain = WebSearchTool._clean_url("https://example.com/plain")
    assert plain == "https://example.com/plain"


def test_web_search_run_format():
    tool = WebSearchTool()
    text = tool.run("测试查询", n=2)
    assert isinstance(text, str)
    if not text.startswith("搜索失败"):
        assert "1." in text and "\n   " in text  # 编号 + 链接格式
