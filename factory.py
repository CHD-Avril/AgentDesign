"""装配工厂：根据配置创建 LLM 与 Agent 实例。

根据 LLM_PROVIDER 选择 Qwen 或 Z.ai Anthropic；
没有当前接口的 Key 时自动降级为离线 MockClient。
"""
from __future__ import annotations

import sys

from agent.core import Agent
from agent.episodic_memory import EpisodicMemory
from agent.long_term_memory import LongTermMemory
from agent.memory import Memory
from agent.memory_extractor import MemoryExtractor
from agent.multi_agent import MultiAgentOrchestrator
from agent.planner import Planner
from agent.rag import KnowledgeBase
from agent.reflector import Reflector
from agent.telemetry import Telemetry
from config import Config
from llm.embedding import EmbeddingClient
from llm.anthropic_client import AnthropicClient
from llm.mock_client import MockClient
from llm.qwen_client import QwenClient
from tools import default_registry
from tools.knowledge import KnowledgeAddTool, KnowledgeListTool, KnowledgeSearchTool
from tools.long_term_memory import ForgetTool, RecallTool, RememberTool
from tools.multimodal import AnthropicImageUnderstandTool, ImageGenerateTool, ImageUnderstandTool
from tools.workflow import WorkflowTool
from tools.app_builder import AppGenerateTool
from tools.media import (MediaAPIClient, QwenMediaAPIClient, AudioTranscribeTool, TextToSpeechTool,
                         VoiceChatTool, PodcastGenerateTool, VideoAnalyzeTool)


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
        note = "离线演示模式（MockClient）：配置模型 API Key 并移除 --mock 可切换真实模型。"
    elif cfg.provider == "zai":
        llm = AnthropicClient(
            api_key=cfg.api_key, base_url=cfg.base_url, model=cfg.model,
            max_tokens=cfg.max_output_tokens, timeout=cfg.timeout, max_retries=cfg.max_retries,
        )
        note = f"已配置 Z.ai Anthropic 模型：{cfg.model} @ {cfg.base_url}"
    else:
        llm = QwenClient(
            api_key=cfg.api_key,
            base_url=cfg.base_url,
            model=cfg.model,
            temperature=cfg.temperature,
            timeout=cfg.timeout,
            max_retries=cfg.max_retries,
            enable_search=cfg.enable_search,
            max_tokens=cfg.max_output_tokens,
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
    knowledge_note = "离线演示未启用知识库。" if use_mock else "请配置独立的 EMBEDDING_API_KEY 以启用知识库。"
    embedding_key = cfg.embedding_api_key or (cfg.api_key if cfg.provider == "qwen" else "")
    if not use_mock and embedding_key:
        try:
            embed_client = EmbeddingClient(
                api_key=embedding_key,
                base_url=cfg.embedding_base_url,
                model=cfg.embedding_model,
            )
            kb_path = cfg.log_path().parent / "data" / "knowledge_base.json"
            kb = KnowledgeBase(embed_client, persist_path=kb_path)
            tools.register(KnowledgeSearchTool(kb))
            tools.register(KnowledgeAddTool(kb))
            tools.register(KnowledgeListTool(kb))
            note += f"；知识库已加载（{len(kb)} 块）"
        except Exception as err:
            knowledge_note = "Embedding 服务加载失败，请检查配置。"
            note += f"；知识库加载失败（{err}）"

    # 长期记忆（所有模式都可用，SQLite 本地存储）
    ltm = LongTermMemory(db_path=cfg.log_path().parent / "data" / "memory.db")
    tools.register(RememberTool(ltm))
    tools.register(RecallTool(ltm))
    tools.register(ForgetTool(ltm))
    tools.register(WorkflowTool(tools))

    # 多模态工具（需要 API Key，mock 模式跳过）
    if not use_mock and cfg.provider == "zai":
        tools.register(AnthropicImageUnderstandTool(llm, cfg.work_path()))
    elif not use_mock:
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

    if not use_mock:
        tools.register(AppGenerateTool(llm, cfg.work_path(), max_tokens=max(8192, cfg.max_output_tokens), telemetry=telemetry))
        if cfg.media_provider == "qwen":
            media = QwenMediaAPIClient(
                api_key=cfg.media_api_key, asr_base_url=cfg.qwen_asr_base_url,
                tts_base_url=cfg.qwen_tts_base_url, transcribe_model=cfg.qwen_asr_model,
                tts_model=cfg.qwen_tts_model, voice=cfg.media_voice, timeout=cfg.media_timeout,
            )
        else:
            media = MediaAPIClient(
                api_key=cfg.media_api_key, base_url=cfg.media_base_url,
                transcribe_model=cfg.media_transcribe_model, tts_model=cfg.media_tts_model,
                voice=cfg.media_voice, timeout=cfg.media_timeout,
            )
        tools.register(AudioTranscribeTool(media, cfg.work_path()))
        tools.register(TextToSpeechTool(media, cfg.work_path()))
        tools.register(VoiceChatTool(llm, media, cfg.work_path()))
        tools.register(PodcastGenerateTool(llm, media, cfg.work_path()))
        vision = llm if cfg.provider == "zai" else QwenClient(
            cfg.api_key, cfg.base_url, cfg.vision_model, timeout=cfg.timeout,
            max_retries=cfg.max_retries, max_tokens=cfg.max_output_tokens,
        )
        tools.register(VideoAnalyzeTool(vision, cfg.work_path(), media,
                                       image_format="anthropic" if cfg.provider == "zai" else "openai"))

    # 记忆提取器、规划器、反思器（需要 LLM，mock 模式下跳过）
    extractor = None
    planner = None
    reflector = None
    if not use_mock:
        extractor = MemoryExtractor(llm, ltm)
        planner = Planner(llm)
        reflector = Reflector(llm)  # 自我反思器

    # 情景记忆（所有模式都可用，SQLite 本地存储）
    episodic = EpisodicMemory(db_path=cfg.log_path().parent / "data" / "episodes.db")

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
        reflector=reflector,  # 自我反思器
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
    agent.knowledge_note = knowledge_note
    agent.long_term_memory = ltm
    agent.episodic_memory = episodic  # 情景记忆
    agent.reflector = reflector      # 反思器
    agent.orchestrator = orchestrator
    return agent, note
