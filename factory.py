"""装配工厂：根据配置创建 LLM 与 Agent 实例。

这是“接 Qwen API”的对接点之一：有 Key 时自动用 QwenClient；
没有 Key 时自动降级为离线 MockClient（方便先跑通流程）。
"""
from __future__ import annotations

import sys

from agent.core import Agent
from agent.memory import Memory
from config import Config
from llm.mock_client import MockClient
from llm.qwen_client import QwenClient
from tools import default_registry


def create_agent(cfg: Config, *, use_mock: bool | None = None, interactive: bool | None = None, asker=None) -> tuple[Agent, str]:
    """返回 (agent, 状态说明)。

    :param use_mock:    True 强制离线模拟；None 时自动判断（无 Key 则模拟）。
    :param interactive: stdin 是否可交互（决定 ask 授权是否弹窗）；None 时自动判断。
    :param asker:       自定义授权确认回调 asker(提示文本)->bool（如 GUI 弹窗），可选。
    """
    if use_mock is None:
        use_mock = not cfg.has_api_key()

    if use_mock:
        llm = MockClient()
        note = "离线演示模式（MockClient）：未检测到 QWEN_API_KEY，配置后自动切换真实模型。"
    else:
        llm = QwenClient(
            api_key=cfg.api_key,
            base_url=cfg.base_url,
            model=cfg.model,
            temperature=cfg.temperature,
            timeout=cfg.timeout,
            max_retries=cfg.max_retries,
            enable_search=cfg.enable_search,
        )
        note = f"已连接远端模型：{cfg.model} @ {cfg.base_url}"

    if interactive is None:
        interactive = sys.stdin.isatty()

    tools = default_registry(
        cfg.work_path(),
        code_exec_mode=cfg.code_exec_mode,
        interactive=interactive,
        asker=asker,
    )
    agent = Agent(
        llm,
        tools,
        system_prompt=cfg.system_prompt,
        max_turns=cfg.max_turns,
        memory=Memory(max_tokens=cfg.context_tokens),
    )
    return agent, note
