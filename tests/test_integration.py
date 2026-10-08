"""快速集成测试：验证所有新模块能正常导入和基础功能。"""
import sys
from pathlib import Path

# 确保项目根目录在 path 中
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

def test_imports():
    """测试所有模块能正常导入。"""
    from agent.telemetry import Telemetry
    from agent.rag import KnowledgeBase, split_text
    from agent.long_term_memory import LongTermMemory
    from agent.memory_extractor import MemoryExtractor
    from agent.planner import Planner, needs_planning
    from agent.multi_agent import MultiAgentOrchestrator
    from tools.workflow import WorkflowTool
    from tools.knowledge import KnowledgeSearchTool, KnowledgeAddTool, KnowledgeListTool
    from tools.long_term_memory import RememberTool, RecallTool, ForgetTool
    from tools.multimodal import ImageUnderstandTool, ImageGenerateTool
    print("✅ 所有模块导入成功")

def test_split_text():
    """测试文本切分。"""
    from agent.rag import split_text
    # 用足够长的文本测试切分
    text = "这是第一段内容，包含一些文字。" * 20 + "\n\n这是第二段内容，同样包含很多文字。" * 20
    chunks = split_text(text, chunk_size=100)
    assert len(chunks) >= 3, f"应该至少切出3块，实际 {len(chunks)}"
    print(f"✅ 文本切分：{len(chunks)} 块")

def test_long_term_memory():
    """测试长期记忆（SQLite 内存模式）。"""
    import tempfile
    from agent.long_term_memory import LongTermMemory
    with tempfile.TemporaryDirectory() as tmpdir:
        db_path = Path(tmpdir) / "test.db"
        ltm = LongTermMemory(db_path=db_path)
        ltm.set_preference("回答风格", "简洁")
        ltm.add_fact("用户是学生")
        assert ltm.get_preference("回答风格") == "简洁"
        assert len(ltm.all_facts()) == 1
        prompt = ltm.build_context_prompt()
        assert "用户偏好" in prompt
        ltm.close()  # 关闭连接，避免 Windows 文件占用
        print("✅ 长期记忆：偏好和事实存储正常")

def test_planner():
    """测试规划判断。"""
    from agent.planner import needs_planning
    assert needs_planning("你好") == False, "短任务不应该规划"
    assert needs_planning("帮我分析一下AI Agent的发展历史，比较几个主流框架的优缺点，写一份报告") == True
    print("✅ 规划判断：短任务/长任务区分正常")

def test_telemetry():
    """测试遥测统计。"""
    from agent.telemetry import Telemetry, TokenUsage
    import tempfile
    with tempfile.TemporaryDirectory() as tmpdir:
        t = Telemetry(model="qwen-plus", log_dir=Path(tmpdir))
        usage = TokenUsage(prompt_tokens=100, completion_tokens=50, total_tokens=150)
        t.record_llm(usage, 1200, "测试调用")
        t.record_tool("calculator", 50, "计算")
        s = t.summary()
        assert s["llm_calls"] == 1
        assert s["tool_calls"] == 1
        assert s["total_tokens"] == 150
        assert s["cost_yuan"] > 0
        print(f"✅ 遥测统计：{t.format_summary()}")

def test_workflow():
    """测试工作流工具的变量解析。"""
    from tools.workflow import _resolve_vars
    vars = {"step1": {"result": "hello world", "ok": True}}
    assert _resolve_vars("结果是：${step1.result}", vars) == "结果是：hello world"
    print("✅ 工作流变量解析正常")

if __name__ == "__main__":
    from pathlib import Path
    test_imports()
    test_split_text()
    test_long_term_memory()
    test_planner()
    test_telemetry()
    test_workflow()
    print("\n🎉 所有集成测试通过！")
