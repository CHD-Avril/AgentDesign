"""对话历史：保存每次对话，下次打开能看到以前的。

存储：SQLite（线程安全）
两张表：
  - conversations: 对话列表（id、标题、时间戳、消息数）
  - messages: 每条消息（对话id、角色、内容、时间戳）

用法：
    history = ChatHistory(db_path="data/chat_history.db")
    conv_id = history.create_conversation("你好")
    history.add_message(conv_id, "user", "你好")
    history.add_message(conv_id, "assistant", "你好！有什么可以帮你的？")
    convs = history.list_conversations()
"""
from __future__ import annotations

import sqlite3
import threading
import time
import uuid
from dataclasses import dataclass
from pathlib import Path


@dataclass
class Conversation:
    """一段对话。"""
    id: str
    title: str          # 对话标题（第一条消息的前 20 字）
    created_at: float
    updated_at: float
    message_count: int = 0


@dataclass
class Message:
    """一条消息。"""
    role: str           # "user" / "assistant"
    content: str
    timestamp: float


class ChatHistory:
    """对话历史管理器（线程安全）。"""

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
                CREATE TABLE IF NOT EXISTS conversations (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    created_at REAL NOT NULL,
                    updated_at REAL NOT NULL
                );
                CREATE TABLE IF NOT EXISTS messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    conversation_id TEXT NOT NULL,
                    role TEXT NOT NULL,
                    content TEXT NOT NULL,
                    timestamp REAL NOT NULL,
                    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
                );
                CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id);
                CREATE INDEX IF NOT EXISTS idx_conversations_updated ON conversations(updated_at DESC);
            """)
            self._conn.commit()

    def create_conversation(self, first_message: str, conv_id: str | None = None) -> str:
        """创建一段新对话，返回对话 id。"""
        conv_id = conv_id or f"conv_{uuid.uuid4().hex}"
        title = first_message[:30] + ("..." if len(first_message) > 30 else "")
        now = time.time()
        if not self._conn:
            return conv_id
        with self._lock:
            self._conn.execute(
                "INSERT INTO conversations (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
                (conv_id, title, now, now),
            )
            self._conn.commit()
        return conv_id

    def get_conversation(self, conv_id: str) -> Conversation | None:
        if not self._conn:
            return None
        with self._lock:
            row = self._conn.execute(
                "SELECT c.*, COUNT(m.id) AS msg_count FROM conversations c "
                "LEFT JOIN messages m ON c.id = m.conversation_id WHERE c.id = ? GROUP BY c.id",
                (conv_id,),
            ).fetchone()
        return Conversation(row["id"], row["title"], row["created_at"], row["updated_at"], row["msg_count"]) if row else None

    def save_turn(self, conv_id: str, user: str, assistant: str) -> None:
        """使用稳定的会话 ID，原子保存一整轮对话。"""
        if not self._conn:
            return
        now = time.time()
        title = user[:30] + ("..." if len(user) > 30 else "")
        with self._lock, self._conn:
            self._conn.execute(
                "INSERT OR IGNORE INTO conversations VALUES (?, ?, ?, ?)",
                (conv_id, title, now, now),
            )
            self._conn.executemany(
                "INSERT INTO messages (conversation_id, role, content, timestamp) VALUES (?, ?, ?, ?)",
                [(conv_id, "user", user, now), (conv_id, "assistant", assistant, now)],
            )
            self._conn.execute("UPDATE conversations SET updated_at = ? WHERE id = ?", (now, conv_id))

    def rename_conversation(self, conv_id: str, title: str) -> None:
        if self._conn:
            with self._lock, self._conn:
                self._conn.execute("UPDATE conversations SET title = ? WHERE id = ?", (title, conv_id))

    def close(self) -> None:
        if self._conn:
            self._conn.close()
            self._conn = None

    def add_message(self, conv_id: str, role: str, content: str) -> None:
        """往对话里加一条消息。"""
        if not self._conn:
            return
        with self._lock:
            self._conn.execute(
                "INSERT INTO messages (conversation_id, role, content, timestamp) VALUES (?, ?, ?, ?)",
                (conv_id, role, content, time.time()),
            )
            # 更新对话的更新时间
            self._conn.execute(
                "UPDATE conversations SET updated_at = ? WHERE id = ?",
                (time.time(), conv_id),
            )
            self._conn.commit()

    def list_conversations(self, limit: int = 50) -> list[Conversation]:
        """列出最近的对话（按更新时间倒序）。"""
        if not self._conn:
            return []
        with self._lock:
            rows = self._conn.execute(
                """
                SELECT c.*, COUNT(m.id) as msg_count
                FROM conversations c
                LEFT JOIN messages m ON c.id = m.conversation_id
                GROUP BY c.id
                ORDER BY c.updated_at DESC
                LIMIT ?
                """,
                (limit,),
            ).fetchall()
        return [
            Conversation(
                id=r["id"],
                title=r["title"],
                created_at=r["created_at"],
                updated_at=r["updated_at"],
                message_count=r["msg_count"],
            )
            for r in rows
        ]

    def get_messages(self, conv_id: str) -> list[Message]:
        """获取某段对话的所有消息。"""
        if not self._conn:
            return []
        with self._lock:
            rows = self._conn.execute(
                "SELECT role, content, timestamp FROM messages WHERE conversation_id = ? ORDER BY id ASC",
                (conv_id,),
            ).fetchall()
        return [
            Message(role=r["role"], content=r["content"], timestamp=r["timestamp"])
            for r in rows
        ]

    def delete_conversation(self, conv_id: str) -> None:
        """删除一段对话（连同它的所有消息）。"""
        if not self._conn:
            return
        with self._lock:
            self._conn.execute("DELETE FROM messages WHERE conversation_id = ?", (conv_id,))
            self._conn.execute("DELETE FROM conversations WHERE id = ?", (conv_id,))
            self._conn.commit()

    def clear_all(self) -> int:
        """清空所有对话历史，返回删除的对话数。"""
        if not self._conn:
            return 0
        with self._lock:
            cur = self._conn.execute("SELECT COUNT(*) FROM conversations")
            count = cur.fetchone()[0]
            self._conn.execute("DELETE FROM messages")
            self._conn.execute("DELETE FROM conversations")
            self._conn.commit()
        return count
