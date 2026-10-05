"""工具包：Tool 基类、注册表与内置工具。"""
from .base import Tool
from .builtin import (
    CalculatorTool,
    DateTimeTool,
    FileListTool,
    FileReadTool,
    FileWriteTool,
    HttpFetchTool,
    WebSearchTool,
)
from .executor import RunPythonTool, ShellTool, make_executor_tools
from .registry import ToolRegistry

__all__ = [
    "Tool",
    "ToolRegistry",
    "CalculatorTool",
    "DateTimeTool",
    "HttpFetchTool",
    "WebSearchTool",
    "FileListTool",
    "FileReadTool",
    "FileWriteTool",
    "RunPythonTool",
    "ShellTool",
    "make_executor_tools",
    "default_registry",
]


def default_registry(work_dir, code_exec_mode: str = "ask", interactive: bool = True, asker=None):
    """创建带全套内置工具的注册表。

    :param work_dir:       文件类工具的沙箱根目录（Path 或可转 Path 的字符串）
    :param code_exec_mode: 代码执行授权策略：off / auto / ask（见 tools/executor.py）
    :param interactive:    stdin 是否可交互（ask 模式下决定是否弹窗确认）
    :param asker:          自定义确认回调 asker(提示文本)->bool（GUI 弹窗等），可选
    """
    registry = ToolRegistry()
    registry.register(CalculatorTool())
    registry.register(DateTimeTool())
    registry.register(HttpFetchTool())
    registry.register(WebSearchTool())
    registry.register(FileListTool(work_dir))
    registry.register(FileReadTool(work_dir))
    registry.register(FileWriteTool(work_dir))
    for tool in make_executor_tools(work_dir, mode=code_exec_mode, interactive=interactive, asker=asker):
        registry.register(tool)
    return registry
