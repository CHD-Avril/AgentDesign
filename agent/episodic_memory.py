"""情景记忆（Episodic Memory）：记住"发生过的事件"，支持主动回忆。

和长期记忆的区别：
  - 长期记忆：用户偏好、事实（"用户是学生"）—— 一直有效
  - 情景记忆：具体事件（"上次我们讨论了 RAG 的原理"）—— 带时间戳

用途：
  - "我们上次聊到哪了？"
  - "你还记得我们之前做过什么项目吗？"
  - Agent 可以主动调用 recall_events 工具回忆历史

存储：SQLite（线程安全）
"""
from __future__ import annotations

import sqlite3
import threading
import time
from dataclasses import dataclass
from pathlib import Path


@dataclass
class Event:
    """一条情景记忆。"""
    id: int
    summary: str          # 事件摘要（LLM 自动生成）
    category: str        # 类别：conversation / task / decision
    timestamp: float     # 发生时间
    importance: int       # 重要性 1-5（越高越重要）


class EpisodicMemory:
    """情景记忆管理器（线程安全）。"""

    def __init__(self, db_path: str | Path | None = None) -> None:
        self._conn: sqlite3.Connection | None = None
        self._lock = threading.Lock()
        if db_path:
            self._init_db(Path(db_path))

    def _init_db(self, path: Path) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        self._conn = sqlite3.connect(str(path), check_same_thread=False)
        self._conn.row_factory = sqlite3.Row
        with self._lock:
            self._conn.executescript("""
                CREATE TABLE IF NOT EXISTS episodes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    summary TEXT NOT NULL,
                    category TEXT NOT NULL DEFAULT 'conversation',
                    timestamp REAL NOT NULL,
                    importance INTEGER NOT NULL DEFAULT 3
                );
                CREATE INDEX IF NOT EXISTS idx_episodes_time ON episodes(timestamp DESC);
                CREATE INDEX IF NOT EXISTS idx_episodes_importance ON episodes(importance DESC);
            """)
            self._conn.commit()

    def add_event(
        self,
        summary: str,
        *,
        category: str = "conversation",
        importance: int = 3,
    ) -> None:
        """记录一条事件。"""
        if not self._conn:
            return
        with self._lock:
            self._conn.execute(
                "INSERT INTO episodes (summary, category, timestamp, importance) VALUES (?, ?, ?, ?)",
                (summary.strip(), category, time.time(), importance),
            )
            self._conn.commit()

    def recent_events(self, limit: int = 10) -> list[Event]:
        """获取最近的事件。"""
        if not self._conn:
            return []
        with self._lock:
            rows = self._conn.execute(
                "SELECT * FROM episodes ORDER BY timestamp DESC LIMIT ?", (limit,)
            ).fetchall()
        return [
            Event(
                id=r["id"], summary=r["summary"],
                category=r["category"], timestamp=r["timestamp"],
                importance=r["importance"],
            )
            for r in rows
        ]

    def search_events(self, keyword: str, limit: int = 5) -> list[Event]:
        """按关键词搜索历史事件。"""
        if not self._conn:
            return []
        with self._lock:
            rows = self._conn.execute(
                "SELECT * FROM episodes WHERE summary LIKE ? ORDER BY timestamp DESC LIMIT ?",
                (f"%{keyword.strip()}%", limit),
            ).fetchall()
        return [
            Event(
                id=r["id"], summary=r["summary"],
                category=r["category"], timestamp=r["timestamp"],
                importance=r["importance"],
            )
            for r in rows
        ]

    def important_events(self, min_importance: int = 4, limit: int = 10) -> list[Event]:
        """获取重要事件（重要性 >= min_importance）。"""
        if not self._conn:
            return []
        with self._lock:
            rows = self._conn.execute(
                "SELECT * FROM episodes WHERE importance >= ? ORDER BY timestamp DESC LIMIT ?",
                (min_importance, limit),
            ).fetchall()
        return [
            Event(
                id=r["id"], summary=r["summary"],
                category=r["category"], timestamp=r["timestamp"],
                importance=r["importance"],
            )
            for r in rows
        ]

    def build_context_prompt(self, limit: int = 5) -> str:
        """生成一段提示文本，拼到 system prompt 里。"""
        events = self.recent_events(limit=limit)
        if not events:
            return ""
        lines = ["\n\n【近期对话记忆】（你之前和用户聊过这些）："]
        for e in events:
            lines.append(f"  - {e.summary}")
        return "\n".join(lines)

    def clear(self) -> int:
        """清空所有事件，返回删除条数。"""
        if not self._conn:
            return 0
        with self._lock:
            cur = self._conn.execute("DELETE FROM episodes")
            self._conn.commit()
        return cur.rowcount
