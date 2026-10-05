"""把 Agent 作为 Python 库使用的示例。

运行：python examples/use_agent.py
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from config import Config  # noqa: E402
from factory import create_agent  # noqa: E402


def ask(agent, question: str) -> None:
    result = agent.run(question)
    print(f"\n问：{question}")
    print(f"答：{result.content}")
    for use in result.tool_uses:
        mark = "成功" if use.ok else "失败"
        print(f"  [工具] {use.name}{use.arguments} -> {mark}")


if __name__ == "__main__":
    cfg = Config.from_env()
    agent, note = create_agent(cfg)
    print(note)

    ask(agent, "帮我算一下 (1200-328)*0.7 等于多少")
    ask(agent, "今天是几号？星期几？")
