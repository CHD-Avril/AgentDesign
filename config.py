"""配置加载：从环境变量或 .env 文件读取，所有配置都有默认值。

设计要点：
- 默认后端是 Qwen（阿里云百炼）的 OpenAI 兼容接口；改 QWEN_BASE_URL + QWEN_MODEL 即可接入
  任何 OpenAI 兼容的远端服务。
- 零第三方依赖（不用 python-dotenv），内置极简 .env 解析器。
"""
from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent

DEFAULT_SYSTEM_PROMPT = """你是一个能调用工具干活的智能体（Agent）。

规则：
1. 需要事实、计算、文件、网络等能力时，先调用对应工具获取信息，不要凭空编造。
2. 观察工具返回结果后再决定下一步；需要多个信息时按顺序调用工具。
3. 所有回答使用简体中文，直接给出结论，简明扼要，不重复提问内容。
4. 工具不可用或失败时，明确说明“当前无法完成”及原因，不要假装已经执行。
5. 你的全部智能来自远端大模型 API，本地只负责执行工具。
6. 用户让你写程序时：先用 file_write 把代码保存到工作目录（如 solve.py），需要验证或看结果时再调用 run_python / shell 运行；涉及删除文件、格式化、关机等高风险操作时，先说明风险，执行会由用户授权。"""


def load_dotenv(path: Path | None = None) -> None:
    """极简 .env 解析。已存在的环境变量优先（不覆盖）。"""
    path = path or PROJECT_ROOT / ".env"
    if not path.exists():
        return
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key, value = key.strip(), value.strip().strip("\"'")
        os.environ.setdefault(key, value)


def _env(key: str, default: str) -> str:
    value = os.environ.get(key)
    if value is None or not value.strip():
        return default
    return value.strip()


@dataclass
class Config:
    """Agent 全部可调配置。所有项都能用环境变量覆盖，字段说明见 .env.example。"""

    # ---- 远端 LLM（默认 Qwen / 阿里云百炼）----
    api_key: str = ""
    base_url: str = "https://dashscope.aliyuncs.com/compatible-mode/v1"
    model: str = "qwen-plus"
    temperature: float = 0.3
    timeout: int = 60          # 单次 HTTP 请求超时（秒）
    max_retries: int = 3       # 网络错误 / 限流重试次数
    enable_search: bool = True  # 开启模型自带联网搜索（enable_search），无需额外 Key

    # ---- Agent 循环 ----
    max_turns: int = 12        # 单次任务最大“思考→调工具”轮数
    context_tokens: int = 100_000  # 对话上下文预算（token），超出自动裁剪最老对话
    system_prompt: str = DEFAULT_SYSTEM_PROMPT
    tool_max_retries: int = 1  # 工具网络错误自动重试次数

    # ---- 本地工具 ----
    work_dir: str = "workspace"  # 文件类工具的沙箱目录（相对项目根）
    code_exec_mode: str = "ask"  # 代码执行授权：off=禁用 / auto=低风险自动跑 / ask=每次确认

    # ---- 遥测与日志 ----
    log_dir: str = "logs"       # 日志与用量统计目录（相对项目根）

    # ---- 高级功能开关 ----
    enable_multi_agent: bool = False  # 是否启用多Agent协作模式（主管-员工）

    @classmethod
    def from_env(cls) -> "Config":
        load_dotenv()
        api_key = _env("QWEN_API_KEY", "") or _env("DASHSCOPE_API_KEY", "")
        return cls(
            api_key=api_key,
            base_url=_env("QWEN_BASE_URL", cls.base_url),
            model=_env("QWEN_MODEL", cls.model),
            temperature=float(_env("QWEN_TEMPERATURE", str(cls.temperature))),
            timeout=int(_env("QWEN_TIMEOUT", str(cls.timeout))),
            max_retries=int(_env("QWEN_MAX_RETRIES", str(cls.max_retries))),
            enable_search=_env("QWEN_ENABLE_SEARCH", "true").strip().lower() in ("1", "true", "yes", "on"),
            max_turns=int(_env("AGENT_MAX_TURNS", str(cls.max_turns))),
            context_tokens=int(_env("AGENT_CONTEXT_TOKENS", str(cls.context_tokens))),
            work_dir=_env("AGENT_WORK_DIR", cls.work_dir),
            code_exec_mode=_env("AGENT_CODE_EXEC", cls.code_exec_mode).strip().lower(),
            tool_max_retries=int(_env("AGENT_TOOL_RETRIES", str(cls.tool_max_retries))),
            log_dir=_env("AGENT_LOG_DIR", cls.log_dir),
            enable_multi_agent=_env("AGENT_MULTI_AGENT", "false").strip().lower() in ("1", "true", "yes", "on"),
        )

    def has_api_key(self) -> bool:
        return bool(self.api_key)

    def work_path(self) -> Path:
        """返回（并创建）文件工具的沙箱目录，绝对路径。"""
        p = Path(self.work_dir)
        if not p.is_absolute():
            p = PROJECT_ROOT / p
        p.mkdir(parents=True, exist_ok=True)
        return p.resolve()

    def log_path(self) -> Path:
        """返回（并创建）日志目录，绝对路径。"""
        p = Path(self.log_dir)
        if not p.is_absolute():
            p = PROJECT_ROOT / p
        p.mkdir(parents=True, exist_ok=True)
        return p.resolve()
