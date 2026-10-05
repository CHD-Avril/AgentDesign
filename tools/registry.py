"""工具注册表：统一管理工具注册、列举与执行。"""
from __future__ import annotations

import json
from typing import Any

from .base import Tool


class ToolRegistry:
    def __init__(self) -> None:
        self._tools: dict[str, Tool] = {}

    def register(self, tool: Tool) -> Tool:
        if not tool.name:
            raise ValueError("工具必须设置 name。")
        if tool.name in self._tools:
            raise ValueError(f"工具重名：{tool.name}")
        self._tools[tool.name] = tool
        return tool

    def unregister(self, name: str) -> None:
        self._tools.pop(name, None)

    def get(self, name: str) -> Tool | None:
        return self._tools.get(name)

    def names(self) -> list[str]:
        return sorted(self._tools)

    def schemas(self) -> list[dict[str, Any]]:
        """所有工具的 OpenAI 函数调用 Schema（发给 LLM 用）。"""
        return [tool.to_schema() for tool in self._tools.values()]

    def run(self, name: str, arguments: dict[str, Any] | str | None) -> tuple[bool, str]:
        """执行工具，返回 (是否成功, 结果文本)。

        任何异常都被吞成可读信息，保证 Agent 循环不被中断；
        结果文本会作为 tool 消息回传给 LLM。
        """
        tool = self._tools.get(name)
        if tool is None:
            return False, f"工具 {name!r} 不存在。可用工具：{', '.join(self.names())}"

        args = arguments
        if isinstance(args, str):
            try:
                args = json.loads(args)
            except json.JSONDecodeError as err:
                return False, f"工具参数不是合法 JSON：{err}"
        if not isinstance(args, dict):
            return False, f"工具参数必须是 JSON 对象（dict），收到：{type(args).__name__}"

        try:
            return True, tool.run(**args)
        except TypeError as err:
            return False, f"工具参数与签名不匹配：{err}"
        except Exception as err:  # noqa: BLE001 —— 所有异常都应反馈给模型而不是崩溃
            return False, f"工具执行失败：{type(err).__name__}: {err}"
