"""命令行入口。

用法：
  python main.py chat "你好"              # ★ 对话模式（推荐入口）：流式输出 + 多轮记忆
  python main.py                          # 同上，直接进入对话模式
  python main.py "帮我算 (1200-328)*0.7"   # 单次问答（流式输出）
  python main.py --mock "1+1 等于几"       # 无 Key 离线演示
  python main.py --list-tools              # 查看当前工具清单

对话模式内可用命令：
  /help    显示帮助      /tools  列出工具
  /context 查看上下文占用 /clear 清空记忆
  /quit    退出（或 exit / quit / 退出）
"""
from __future__ import annotations

import argparse
import sys

from config import Config
from factory import create_agent
from tools import default_registry

# Windows 控制台中文输出兜底
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

BANNER = "=" * 46
HELP_TEXT = """可用命令：
  /help     显示本帮助
  /tools    列出当前可用工具
  /context  查看上下文占用（tokens）
  /exec     查看代码执行授权模式（ask=每次确认 / auto=低风险自动 / off=禁用）
  /clear    清空对话记忆
  /quit     退出对话（也可输入 exit / quit / 退出）
其余输入都会作为问题发送给 Agent。"""


def _show_tool(name: str, args: dict, ok: bool, result: str) -> None:
    """工具调用过程可视化：显示参数与结果摘要。"""
    args_str = ", ".join(f"{k}={v}" for k, v in args.items()) or "无参数"
    print(f"\n  [工具] {name}({args_str})")
    preview = result if len(result) <= 160 else result[:160] + "…"
    print(f"  [结果] {preview}")


def run_once(agent, question: str) -> None:
    print(f"\n问：{question}")
    print("答：", end="", flush=True)
    result = agent.run(question, on_delta=lambda text: print(text, end="", flush=True))
    print()
    if result.tool_uses:
        print(f"（本轮调用了 {len(result.tool_uses)} 次工具，共 {result.turns} 轮）")
    if result.interrupted:
        print("注意：达到最大轮数，结果可能不完整。")


def repl(agent) -> None:
    model = getattr(agent.llm, "name", "?")
    ctx = f"{agent.memory.max_tokens:,}"
    exec_mode = _exec_mode_label(agent)
    print(BANNER)
    print("  Agent 对话模式 · 后端: " + model)
    print("  流式输出 · 多轮记忆 · 可调用工具干活 · 可写程序并授权运行")
    print(f"  上下文 {ctx} tokens · 超出自动裁剪最老对话 · 代码执行：{exec_mode}")
    print("  输入 /help 查看命令，/quit 退出")
    print(BANNER)
    while True:
        try:
            question = input("\n你 > ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\n再见！")
            break
        if not question:
            continue
        low = question.lower()
        if low in ("exit", "quit", "退出", "/quit"):
            print("再见！")
            break
        if question == "/help":
            print(HELP_TEXT)
            continue
        if question == "/tools":
            for schema in agent.tools.schemas():
                fn = schema["function"]
                print(f"  - {fn['name']}: {fn['description']}")
            continue
        if question == "/context":
            usage = agent.memory.usage()
            print(f"  上下文占用 {usage['tokens']:,}/{usage['max_tokens']:,} tokens · {usage['messages']} 条消息"
                  f" · 累计裁剪 {agent.memory.dropped_total} 条")
            continue
        if question == "/clear":
            agent.reset()
            print("  （对话记忆已清空）")
            continue
        if question == "/exec":
            print("  " + _exec_mode_label(agent, detail=True))
            continue

        print("\nAgent > ", end="", flush=True)
        result = agent.run(question, on_delta=lambda text: print(text, end="", flush=True))
        print()
        if result.interrupted:
            print("  [注意] 达到最大轮数，结果可能不完整。")
        usage = agent.memory.usage()
        extra = f"（已自动省略较早的 {agent.memory.dropped_last} 条对话）" if agent.memory.dropped_last else ""
        print(f"  [上下文] {usage['tokens']:,}/{usage['max_tokens']:,} tokens · {usage['messages']} 条消息 {extra}".rstrip())


def _exec_mode_label(agent, detail: bool = False) -> str:
    """读取当前代码执行授权模式用于展示。"""
    try:
        from tools.executor import RunPythonTool

        tool = agent.tools.get("run_python")
        mode = tool.authorizer.mode if isinstance(tool, RunPythonTool) else "?"
    except Exception:
        mode = "?"
    labels = {"ask": "每次确认（安全）", "auto": "低风险自动", "off": "已禁用"}
    label = labels.get(mode, mode)
    if detail:
        return f"代码执行授权模式：{mode}（{label}）—— 改 AGENT_CODE_EXEC 后重启生效"
    return label


def main() -> int:
    parser = argparse.ArgumentParser(
        description="能调用工具干活的 Agent —— 全部智能来自远端模型（默认 Qwen API），零本地算力。"
    )
    parser.add_argument("question", nargs="?", help="单次问答的问题；填 chat 进入对话模式")
    parser.add_argument("--mock", action="store_true", help="使用离线模拟 LLM（无需 API Key）")
    parser.add_argument("--list-tools", action="store_true", help="列出当前工具清单")
    parser.add_argument("--interactive", action="store_true", help="进入对话模式（同 chat）")
    args = parser.parse_args()

    cfg = Config.from_env()

    if args.list_tools:
        tools = default_registry(cfg.work_path())
        print("当前可用工具：")
        for schema in tools.schemas():
            fn = schema["function"]
            print(f"  - {fn['name']}: {fn['description']}")
        return 0

    agent, note = create_agent(cfg, use_mock=args.mock)
    agent.on_tool = _show_tool
    print(note)

    question = (args.question or "").strip()
    if question and question.lower() != "chat":
        run_once(agent, question)
    else:
        repl(agent)
    return 0


if __name__ == "__main__":
    sys.exit(main())
