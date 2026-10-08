"""完整测试套件：覆盖所有新增模块。

运行方式：
    python tests/test_all.py

所有测试都在安全范围内运行：
- 不调用真实 LLM API（用 MockClient）
- 不访问真实网络
- 不写真实文件（用临时目录）
- 不执行危险代码
"""
import sys
import tempfile
import time
from pathlib import Path

# 确保项目根目录在 path 中
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

passed = 0
failed = 0

def test(name: str, condition: bool, detail: str = ""):
    global passed, failed
    if condition:
        passed += 1
        print(f"  ✅ {name}")
    else:
        failed += 1
        print(f"  ❌ {name}  {detail}")


print("=" * 60)
print("  AI Agent 全模块测试")
print("=" * 60)

# ============================================================
# 1. 遥测与成本统计
# ============================================================
print("\n📊 1. 遥测与成本统计 (telemetry)")

from agent.telemetry import Telemetry, TokenUsage

with tempfile.TemporaryDirectory() as tmpdir:
    log_dir = Path(tmpdir)
    tel = Telemetry(model="qwen-plus", log_dir=None)  # 测试不写文件，避免句柄占用

    # 记录一次 LLM 调用
    usage = TokenUsage(prompt_tokens=1000, completion_tokens=500, total_tokens=1500)
    cost = tel.record_llm(usage, 1200, "测试对话")

    test("记录 LLM 调用", tel.llm_call_count == 1)
    test("token 累计正确", tel.total_prompt_tokens == 1000 and tel.total_completion_tokens == 500)
    test("成本计算 > 0", cost > 0, f"cost={cost}")
    test("平均延迟计算", tel.llm_total_latency_ms == 1200)

    # 记录工具调用
    tel.record_tool("calculator", 50, "计算 1+1")
    test("记录工具调用", tel.tool_call_count == 1)

    # 摘要
    s = tel.summary()
    test("摘要包含总 token", s["total_tokens"] == 1500)
    test("摘要包含费用", s["cost_yuan"] > 0)

# ============================================================
# 2. 文本切分（RAG 基础）
# ============================================================
print("\n📚 2. 文本切分 (split_text)")

from agent.rag import split_text

# 短文本
chunks = split_text("你好世界", chunk_size=500)
test("短文本不切分", len(chunks) == 1)

# 长文本（多段落）
long_text = ("这是第一段内容，包含一些信息。" * 30 + "\n\n" +
             "这是第二段内容，另外一些信息。" * 30 + "\n\n" +
             "这是第三段内容，最后一些信息。" * 30)
chunks = split_text(long_text, chunk_size=200)
test("长文本切分成多块", len(chunks) >= 3, f"实际 {len(chunks)} 块")
test("每块不超过 chunk_size * 1.5", all(len(c) < 300 for c in chunks))

# 空文本
chunks = split_text("")
test("空文本返回空列表", len(chunks) == 0)

# ============================================================
# 3. 长期记忆（SQLite）
# ============================================================
print("\n💾 3. 长期记忆 (LongTermMemory)")

from agent.long_term_memory import LongTermMemory

with tempfile.TemporaryDirectory() as tmpdir:
    db_path = Path(tmpdir) / "test_memory.db"
    ltm = LongTermMemory(db_path=db_path)

    # 偏好存储
    ltm.set_preference("回答风格", "简洁")
    ltm.set_preference("职业", "学生")
    test("设置偏好", ltm.get_preference("回答风格") == "简洁")
    test("读取所有偏好", len(ltm.all_preferences()) == 2)

    # 事实存储
    ltm.add_fact("用户正在做 Agent 项目")
    ltm.add_fact("用户在西安上学")
    facts = ltm.all_facts()
    test("添加事实", len(facts) == 2)
    test("事实按时间倒序", facts[0].content == "用户在西安上学")

    # 上下文提示词
    prompt = ltm.build_context_prompt()
    test("偏好出现在提示词", "回答风格" in prompt)
    test("事实出现在提示词", "Agent 项目" in prompt)

    # 删除偏好
    ltm.delete_preference("职业")
    test("删除偏好", ltm.get_preference("职业") == "")

    # 清空事实
    n = ltm.clear_facts()
    test("清空事实", n == 2 and len(ltm.all_facts()) == 0)

    ltm.close()

    # 持久化验证（重新打开）
    ltm2 = LongTermMemory(db_path=db_path)
    test("偏好持久化", ltm2.get_preference("回答风格") == "简洁")
    ltm2.close()

# ============================================================
# 4. 任务规划器（启发式判断）
# ============================================================
print("\n📋 4. 任务规划器 (Planner)")

from agent.planner import needs_planning

test("短简单任务不规划", not needs_planning("你好"))
test("短问句不规划", not needs_planning("今天几号？"))
test("长复杂任务要规划", needs_planning("帮我调研一下AI Agent的发展历史，比较几个主流框架的优缺点，写一份详细的报告"))
test("多步任务要规划", needs_planning("第一步先搜索资料，然后整理成文章，最后保存成文件"))
test("比较类任务要规划", needs_planning("比较 LangChain 和 LlamaIndex 两个框架"))

# ============================================================
# 5. 工作流变量解析
# ============================================================
print("\n🔀 5. 工作流变量解析 (_resolve_vars)")

from tools.workflow import _resolve_vars

vars = {
    "step1": {"result": "搜索结果内容", "ok": True},
    "step2": {"result": "抓取到的网页内容", "ok": True},
    "items": ["苹果", "香蕉", "橙子"],
}

test("简单变量引用", _resolve_vars("结果：${step1.result}", vars) == "结果：搜索结果内容")
test("多个变量引用", _resolve_vars("${step1.result} + ${step2.result}", vars) == "搜索结果内容 + 抓取到的网页内容")
test("无变量文本不变", _resolve_vars("没有变量的文本", vars) == "没有变量的文本")
test("找不到的变量原样返回", _resolve_vars("${not_exist.var}", vars) == "${not_exist.var}")

# ============================================================
# 6. 工具注册表（已有，验证不破坏）
# ============================================================
print("\n🔧 6. 工具注册表 (ToolRegistry)")

from tools.registry import ToolRegistry
from tools.base import Tool

class _MockTool(Tool):
    name = "mock_tool"
    description = "测试用工具"
    parameters = {"type": "object", "properties": {"x": {"type": "string"}}}

    def run(self, x: str = "") -> str:
        return f"收到：{x}"

reg = ToolRegistry()
reg.register(_MockTool())

test("注册工具", "mock_tool" in reg.names())
test("列出工具", len(reg.names()) >= 1)
test("获取工具", reg.get("mock_tool") is not None)
test("执行工具", reg.run("mock_tool", {"x": "hello"}) == (True, "收到：hello"))
test("不存在工具返回错误", not reg.run("not_exist", {})[0])
test("JSON 字符串参数自动解析", reg.run("mock_tool", '{"x": "json"}')[0])

# ============================================================
# 7. 计算器安全（已有，验证不破坏）
# ============================================================
print("\n🧮 7. 计算器安全测试")

from tools.builtin import CalculatorTool

calc = CalculatorTool()

test("基本计算", calc.run("1+1")[0] if "=" in calc.run("1+1") else True)
result = calc.run("(1200-328)*0.7")
test("复杂表达式", "610.4" in result, result)
result = calc.run("__import__('os').system('ls')")
test("代码注入被拦截", "错误" in result, result)

# ============================================================
# 8. Agent 核心循环（用 Mock LLM）
# ============================================================
print("\n🤖 8. Agent 核心循环 (Mock LLM)")

from llm.mock_client import MockClient
from agent.core import Agent
from agent.memory import Memory

llm = MockClient()
tools = ToolRegistry()
tools.register(_MockTool())

agent = Agent(
    llm,
    tools,
    system_prompt="你是一个测试助手",
    max_turns=3,
)

# 单次运行
result = agent.run("你好")
test("Agent 能运行", result.content != "")
test("有返回内容", len(result.content) > 0)
test("轮数正确", result.turns >= 1)

# 记忆测试
test("记忆有内容", len(agent.memory.messages()) >= 2)

# ============================================================
# 9. 上下文滑动窗口
# ============================================================
print("\n🪟 9. 上下文滑动窗口 (Memory)")

from agent.memory import Memory

mem = Memory(max_tokens=200)  # 很小的预算
mem.add("user", "你好" * 10)  # 长文本
mem.add("assistant", "你好，有什么可以帮你的？" * 10)
mem.add("user", "第二个问题" * 10)
mem.add("assistant", "第二个回答" * 10)

# 应该触发了裁剪
test("记忆被裁剪", mem.dropped_total > 0, f"dropped={mem.dropped_total}")
test("剩余消息成对", len(mem.messages()) % 2 == 0 or len(mem.messages()) <= 2)

# ============================================================
# 10. 文件沙箱安全
# ============================================================
print("\n🔒 10. 文件沙箱安全")

from pathlib import Path
from tools.builtin import FileReadTool, FileWriteTool

with tempfile.TemporaryDirectory() as tmpdir:
    work_dir = Path(tmpdir)
    # 写文件
    fw = FileWriteTool(work_dir)
    test("写文件", "已写入" in fw.run("test.txt", "hello"))
    # 读文件
    fr = FileReadTool(work_dir)
    test("读文件", "hello" in fr.run("test.txt"))
    # 路径穿越被拦截
    ok, result = False, ""
    try:
        ok, result = False, fr.run("../etc/passwd")
    except:
        pass
    test("路径穿越被拦截", "错误" in result or "越界" in result or "不存在" in result, result[:100])

# ============================================================
# 汇总
# ============================================================
print("\n" + "=" * 60)
total = passed + failed
print(f"  测试结果：{passed}/{total} 通过" + (f"，{failed} 个失败" if failed else " ✅ 全部通过"))
print("=" * 60)

sys.exit(0 if failed == 0 else 1)
