"""工具基类：任何实现 name / description / parameters + run() 的类都是一个工具。

parameters 使用 JSON Schema（OpenAI 函数调用格式），例如：
    {
      "type": "object",
      "properties": {
        "expression": {"type": "string", "description": "数学表达式"}
      },
      "required": ["expression"],
    }
"""
from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any


class Tool(ABC):
    name: str = ""
    description: str = ""
    parameters: dict[str, Any] = {"type": "object", "properties": {}}

    @abstractmethod
    def run(self, **kwargs: Any) -> str:
        """执行工具，返回给 LLM 看的文本结果。

        约定：异常应自行捕获并转成可读的错误信息，不要让异常抛给 Agent 循环。
        """

    def to_schema(self) -> dict[str, Any]:
        """转成 OpenAI 函数调用 Schema，随请求发给 LLM。"""
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": self.parameters,
            },
        }
