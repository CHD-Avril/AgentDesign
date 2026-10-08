"""长期记忆与用户画像：跨会话记住用户偏好和重要事实。

存储：SQLite（Python 标准库自带，零依赖）
两张表：
  - user_profile: 用户偏好（key-value，如"回答风格"="简洁"、"职业"="学生"）
  - facts: 重要事实记忆（用户说过的值得记住的事，带时间戳）

用法：
    ltm = LongTermMemory(db_path=Path("data/memory.db"))
    ltm.set_preference("回答风格", "简洁")
    ltm.add_fact("用户是长安大学的学生")
    prompt_addition = ltm.build_context_prompt()  # 拼到 system prompt 里
"""
from __future__ import annotations

import sqlite3
import threading
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any


@dataclass
class Fact:
    """一条重要事实记忆。"""
    id: int
    content: str
    created_at: float
    source: str = "auto"  # "auto" = 自动提取，"user" = 用户明确说的


class LongTermMemory:
    """长期记忆管理器（线程安全）。"""

    def __init__(self, db_path: str | Path | None = None) -> None:
        self._conn: sqlite3.Connection | None = None
        self._lock = threading.Lock()  # 多线程写入锁
        if db_path:
            self._init_db(Path(db_path))

    def _init_db(self, path: Path) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        # check_same_thread=False 配合锁使用，支持多线程 HTTP 服务
        self._conn = sqlite3.connect(str(path), check_same_thread=False)
        self._conn.row_factory = sqlite3.Row
        with self._lock:
            self._conn.executescript("""
                CREATE TABLE IF NOT EXISTS user_profile (
                    key TEXT PRIMARY KEY,
                    value TEXT NOT NULL,
                    updated_at REAL NOT NULL
                );
                CREATE TABLE IF NOT EXISTS facts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    content TEXT NOT NULL,
                    created_at REAL NOT NULL,
                    source TEXT NOT NULL DEFAULT 'auto'
                );
            """)
            self._conn.commit()

    # ---- 用户偏好 ----
    def set_preference(self, key: str, value: str) -> None:
        """设置/更新用户偏好。"""
        if not self._conn:
            return
        with self._lock:
            self._conn.execute(
                "INSERT OR REPLACE INTO user_profile (key, value, updated_at) VALUES (?, ?, ?)",
                (key.strip(), value.strip(), time.time()),
            )
            self._conn.commit()

    def get_preference(self, key: str, default: str = "") -> str:
        """获取用户偏好。"""
        if not self._conn:
            return default
        with self._lock:
            row = self._conn.execute(
                "SELECT value FROM user_profile WHERE key = ?", (key.strip(),)
            ).fetchone()
        return row["value"] if row else default

    def all_preferences(self) -> dict[str, str]:
        """获取所有用户偏好。"""
        if not self._conn:
            return {}
        with self._lock:
            rows = self._conn.execute("SELECT key, value FROM user_profile").fetchall()
        return {r["key"]: r["value"] for r in rows}

    def delete_preference(self, key: str) -> None:
        if not self._conn:
            return
        with self._lock:
            self._conn.execute("DELETE FROM user_profile WHERE key = ?", (key.strip(),))
            self._conn.commit()

    # ---- 事实记忆 ----
    def add_fact(self, content: str, source: str = "auto") -> None:
        """添加一条重要事实。"""
        if not self._conn:
            return
        with self._lock:
            self._conn.execute(
                "INSERT INTO facts (content, created_at, source) VALUES (?, ?, ?)",
                (content.strip(), time.time(), source),
            )
            self._conn.commit()

    def recent_facts(self, limit: int = 10) -> list[Fact]:
        """获取最近的事实记忆。"""
        if not self._conn:
            return []
        with self._lock:
            rows = self._conn.execute(
                "SELECT * FROM facts ORDER BY created_at DESC LIMIT ?", (limit,)
            ).fetchall()
        return [
            Fact(id=r["id"], content=r["content"], created_at=r["created_at"], source=r["source"])
            for r in rows
        ]

    def all_facts(self) -> list[Fact]:
        if not self._conn:
            return []
        with self._lock:
            rows = self._conn.execute("SELECT * FROM facts ORDER BY created_at DESC").fetchall()
        return [
            Fact(id=r["id"], content=r["content"], created_at=r["created_at"], source=r["source"])
            for r in rows
        ]

    def clear_facts(self) -> int:
        """清空事实记忆，返回删除条数。"""
        if not self._conn:
            return 0
        with self._lock:
            cur = self._conn.execute("DELETE FROM facts")
            self._conn.commit()
        return cur.rowcount

    # ---- 上下文注入 ----
    def build_context_prompt(self) -> str:
        """生成一段提示词，拼到 system prompt 末尾，让 Agent 知道用户画像。"""
        prefs = self.all_preferences()
        facts = self.recent_facts(limit=8)

        parts: list[str] = []

        if prefs:
            parts.append("【用户偏好】（请在回答时自然遵循）")
            for k, v in prefs.items():
                parts.append(f"- {k}：{v}")

        if facts:
            parts.append("\n【你已记住的关于用户的事实】")
            for f in facts:
                parts.append(f"- {f.content}")

        if not parts:
            return ""

        return "\n" + "\n".join(parts)

    def close(self) -> None:
        if self._conn:
            self._conn.close()
            self._conn = None

    def __del__(self) -> None:
        self.close()
