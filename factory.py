"""装配工厂：根据配置创建 LLM 与 Agent 实例。

这是“接 Qwen API”的对接点之一：有 Key 时自动用 QwenClient；
没有 Key 时自动降级为离线 MockClient（方便先跑通流程）。
"""
from __future__ import annotations

import sys

from agent.core import Agent
from agent.long_term_memory import LongTermMemory
from agent.memory import Memory
from agent.memory_extractor import MemoryExtractor
from agent.multi_agent import MultiAgentOrchestrator
from agent.planner import Planner
from agent.rag import KnowledgeBase
from agent.telemetry import Telemetry
from config import Config
from llm.embedding import EmbeddingClient
from llm.mock_client import MockClient
from llm.qwen_client import QwenClient
from tools import default_registry
from tools.knowledge import KnowledgeAddTool, KnowledgeListTool, KnowledgeSearchTool
from tools.long_term_memory import ForgetTool, RecallTool, RememberTool
from tools.multimodal import ImageGenerateTool, ImageUnderstandTool
from tools.workflow import WorkflowTool


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

    # 遥测与日志
    telemetry = Telemetry(
        model=cfg.model if not use_mock else "mock",
        log_dir=cfg.log_path(),
    )

    # 知识库（需要 API Key，mock 模式跳过）
    kb = None
    if not use_mock:
        try:
            embed_client = EmbeddingClient(
                api_key=cfg.api_key,
                base_url=cfg.base_url,
            )
            kb_path = cfg.log_path().parent / "data" / "knowledge_base.json"
            kb = KnowledgeBase(embed_client, persist_path=kb_path)
            tools.register(KnowledgeSearchTool(kb))
            tools.register(KnowledgeAddTool(kb))
            tools.register(KnowledgeListTool(kb))
            note += f"；知识库已加载（{len(kb)} 块）"
        except Exception as err:
            note += f"；知识库加载失败（{err}）"

    # 长期记忆（所有模式都可用，SQLite 本地存储）
    ltm = LongTermMemory(db_path=cfg.log_path().parent / "data" / "memory.db")
    tools.register(RememberTool(ltm))
    tools.register(RecallTool(ltm))
    tools.register(ForgetTool(ltm))
    tools.register(WorkflowTool(tools))

    # 多模态工具（需要 API Key，mock 模式跳过）
    if not use_mock:
        try:
            tools.register(ImageUnderstandTool(
                api_key=cfg.api_key,
                base_url=cfg.base_url,
                work_dir=cfg.work_path(),
            ))
            tools.register(ImageGenerateTool(
                api_key=cfg.api_key,
                work_dir=cfg.work_path(),
            ))
        except Exception:
            pass  # 多模态工具加载失败不影响主流程

    # 记忆提取器（需要 LLM，mock 模式下跳过自动提取）
    extractor = None
    planner = None
    if not use_mock:
        extractor = MemoryExtractor(llm, ltm)
        planner = Planner(llm)

    agent = Agent(
        llm,
        tools,
        system_prompt=cfg.system_prompt,
        max_turns=cfg.max_turns,
        memory=Memory(max_tokens=cfg.context_tokens),
        telemetry=telemetry,
        tool_max_retries=cfg.tool_max_retries,
        long_term_memory=ltm,
        memory_extractor=extractor,
        planner=planner,
    )

    # 多Agent模式：用主管Agent替换普通Agent
    orchestrator = None
    if cfg.enable_multi_agent and not use_mock:
        try:
            orchestrator = MultiAgentOrchestrator(llm, tools)
            agent = orchestrator.create_manager_agent()
            note += "；多Agent模式已启用（主管-员工）"
        except Exception as err:
            note += f"；多Agent启用失败（{err}）"

    # 把组件挂到 agent 上，方便外部访问
    agent.telemetry = telemetry
    agent.knowledge_base = kb
    agent.long_term_memory = ltm
    agent.orchestrator = orchestrator
    return agent, note
