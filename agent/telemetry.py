"""遥测与用量统计：Token 计数、成本估算、运行日志。

零第三方依赖：用标准库 logging + JSON 持久化。
所有统计数据可用于：
- 实时显示本轮对话消耗了多少 token / 花了多少钱
- 累计统计（跨会话），方便控制成本
- 结构化日志文件，出问题可回溯
"""
from __future__ import annotations

import json
import logging
import time
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Any

# ---- 模型单价（元 / 千 token），按阿里云百炼公开价估算 ----
# 格式: (输入单价, 输出单价) 单位：元/千token
MODEL_PRICING: dict[str, tuple[float, float]] = {
    "qwen-turbo":   (0.0003, 0.0006),
    "qwen-plus":    (0.0008, 0.002),
    "qwen-max":     (0.024,  0.096),
    "qwen-long":    (0.0005, 0.002),
    # embedding 按字符算，这里粗略转 token（1字符≈1token）
    "text-embedding-v3": (0.0007, 0.0),
}

# 默认价格（未知模型时用 qwen-plus 估算）
_DEFAULT_PRICING = MODEL_PRICING["qwen-plus"]


@dataclass
class TokenUsage:
    """一次 LLM 调用的 token 用量。"""
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0

    @property
    def total(self) -> int:
        return self.total_tokens or (self.prompt_tokens + self.completion_tokens)


@dataclass
class CallRecord:
    """一次完整调用的记录（LLM 调用 + 工具调用）。"""
    timestamp: float
    type: str  # "llm" | "tool"
    name: str = ""  # 模型名 / 工具名
    usage: TokenUsage = field(default_factory=TokenUsage)
    cost_yuan: float = 0.0
    latency_ms: float = 0.0
    detail: str = ""  # 简要描述


class Telemetry:
    """全局遥测管理器：累计统计 + 日志输出 + JSON 持久化。

    用法：
        tel = Telemetry(model="qwen-plus", log_dir=Path("logs"))
        tel.record_llm(usage, latency_ms, detail="chat")
        tel.record_tool("web_search", latency_ms=1200, detail="查天气")
        print(tel.summary())  # 累计统计
    """

    def __init__(
        self,
        model: str = "qwen-plus",
        log_dir: Path | None = None,
        persist: bool = True,
    ) -> None:
        self.model = model
        self._pricing = MODEL_PRICING.get(model, _DEFAULT_PRICING)

        # 累计统计
        self.total_prompt_tokens: int = 0
        self.total_completion_tokens: int = 0
        self.total_cost_yuan: float = 0.0
        self.llm_call_count: int = 0
        self.tool_call_count: int = 0
        self.llm_total_latency_ms: float = 0.0

        # 本次会话的调用记录
        self.records: list[CallRecord] = []

        # 日志
        self._log_dir = log_dir
        self._persist = persist
        self._logger = self._setup_logger()

        # 加载历史累计
        if persist and log_dir:
            self._load_history()

    def _setup_logger(self) -> logging.Logger:
        logger = logging.getLogger(f"agent_telemetry_{id(self)}")
        logger.setLevel(logging.INFO)
        logger.handlers.clear()  # 避免重复 handler

        fmt = logging.Formatter(
            "%(asctime)s [%(levelname)s] %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
        # 控制台输出
        sh = logging.StreamHandler()
        sh.setFormatter(fmt)
        logger.addHandler(sh)

        # 文件输出
        if self._log_dir:
            self._log_dir.mkdir(parents=True, exist_ok=True)
            fh = logging.FileHandler(self._log_dir / "agent.log", encoding="utf-8")
            fh.setFormatter(fmt)
            logger.addHandler(fh)

        logger.propagate = False
        return logger

    def _history_path(self) -> Path | None:
        if not self._log_dir:
            return None
        return self._log_dir / "usage_history.json"

    def _load_history(self) -> None:
        path = self._history_path()
        if not path or not path.exists():
            return
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            self.total_prompt_tokens = data.get("prompt_tokens", 0)
            self.total_completion_tokens = data.get("completion_tokens", 0)
            self.total_cost_yuan = data.get("cost_yuan", 0.0)
            self.llm_call_count = data.get("llm_calls", 0)
            self.tool_call_count = data.get("tool_calls", 0)
        except Exception:
            pass  # 历史记录损坏就重来

    def _save_history(self) -> None:
        if not self._persist:
            return
        path = self._history_path()
        if not path:
            return
        data = {
            "prompt_tokens": self.total_prompt_tokens,
            "completion_tokens": self.total_completion_tokens,
            "cost_yuan": round(self.total_cost_yuan, 6),
            "llm_calls": self.llm_call_count,
            "tool_calls": self.tool_call_count,
        }
        try:
            path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        except Exception:
            pass

    def _estimate_cost(self, usage: TokenUsage) -> float:
        """按模型单价估算成本（元）。"""
        in_price, out_price = self._pricing
        return (usage.prompt_tokens * in_price + usage.completion_tokens * out_price) / 1000

    def record_llm(
        self,
        usage: TokenUsage | None,
        latency_ms: float,
        detail: str = "",
    ) -> float:
        """记录一次 LLM 调用，返回本次成本（元）。"""
        usage = usage or TokenUsage()
        cost = self._estimate_cost(usage)

        self.total_prompt_tokens += usage.prompt_tokens
        self.total_completion_tokens += usage.completion_tokens
        self.total_cost_yuan += cost
        self.llm_call_count += 1
        self.llm_total_latency_ms += latency_ms

        record = CallRecord(
            timestamp=time.time(),
            type="llm",
            name=self.model,
            usage=usage,
            cost_yuan=cost,
            latency_ms=latency_ms,
            detail=detail[:200],
        )
        self.records.append(record)

        self._logger.info(
            f"[LLM] {self.model} | in={usage.prompt_tokens} out={usage.completion_tokens} "
            f"| {latency_ms:.0f}ms | ¥{cost:.6f} | {detail[:50]}"
        )
        self._save_history()
        return cost

    def record_tool(self, tool_name: str, latency_ms: float, detail: str = "") -> None:
        """记录一次工具调用。"""
        self.tool_call_count += 1
        record = CallRecord(
            timestamp=time.time(),
            type="tool",
            name=tool_name,
            latency_ms=latency_ms,
            detail=detail[:200],
        )
        self.records.append(record)
        self._logger.info(
            f"[TOOL] {tool_name} | {latency_ms:.0f}ms | {detail[:50]}"
        )
        self._save_history()

    def summary(self) -> dict[str, Any]:
        """累计统计摘要。"""
        return {
            "model": self.model,
            "llm_calls": self.llm_call_count,
            "tool_calls": self.tool_call_count,
            "prompt_tokens": self.total_prompt_tokens,
            "completion_tokens": self.total_completion_tokens,
            "total_tokens": self.total_prompt_tokens + self.total_completion_tokens,
            "cost_yuan": round(self.total_cost_yuan, 4),
            "avg_llm_latency_ms": round(
                self.llm_total_latency_ms / max(1, self.llm_call_count), 0
            ),
        }

    def reset_session(self) -> None:
        """清空本次会话记录（累计历史保留）。"""
        self.records.clear()

    def format_summary(self) -> str:
        """人类可读的统计摘要。"""
        s = self.summary()
        return (
            f"📊 累计统计: "
            f"LLM调用 {s['llm_calls']} 次 | 工具调用 {s['tool_calls']} 次 | "
            f"Token {s['total_tokens']:,} (入 {s['prompt_tokens']:,} / 出 {s['completion_tokens']:,}) | "
            f"费用 ¥{s['cost_yuan']:.4f} | "
            f"平均延迟 {s['avg_llm_latency_ms']:.0f}ms"
        )
