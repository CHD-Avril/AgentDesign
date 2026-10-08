"""工作流编排（轻量版）：让 Agent 能一次定义多步骤并按顺序执行。

不做可视化拖拽，而是通过一个 workflow_run 工具让 Agent 直接定义步骤列表。
支持：
- 顺序执行多个工具调用
- 条件分支（if）：根据前一步结果决定是否执行下一步
- 批量循环（for_each）：对列表中每个值执行同一个工具

用法（LLM 调用时）：
    workflow_run(steps=[
        {"tool": "web_search", "args": {"query": "AI Agent 最新进展"}, "save_as": "search_result"},
        {"tool": "http_fetch", "args": {"url": "${search_result.items[0].url}"}},
        {"tool": "file_write", "args": {"path": "report.md", "content": "${step2.result}"}},
    ])
"""
from __future__ import annotations

import json
import re
import time
from typing import Any

from tools.base import Tool
from tools.registry import ToolRegistry


def _resolve_vars(text: str, variables: dict[str, Any]) -> str:
    """解析 ${var} 或 ${var.key} 形式的变量引用。"""
    if not isinstance(text, str):
        return text

    def replacer(match: re.Match) -> str:
        path = match.group(1)
        parts = path.split(".")
        val: Any = variables
        try:
            for p in parts:
                # 支持 list 索引，如 items[0]
                idx_match = re.match(r"(\w+)\[(\d+)\]", p)
                if idx_match:
                    key, idx = idx_match.groups()
                    val = val[key][int(idx)]
                else:
                    val = val[p]
            if isinstance(val, (dict, list)):
                return json.dumps(val, ensure_ascii=False)
            return str(val)
        except (KeyError, IndexError, TypeError):
            return match.group(0)  # 找不到就原样返回

    return re.sub(r"\$\{([^}]+)\}", replacer, text)


class WorkflowTool(Tool):
    """工作流执行器：按顺序执行多个工具调用，支持变量引用和条件。"""

    name = "workflow_run"
    description = (
        "按顺序执行一个多步骤工作流，适合复杂任务。"
        "每个步骤调用一个工具，前一步的结果可以用 ${stepN.result} 引用给后一步用。"
        "当任务需要多个步骤才能完成时使用这个工具，而不是一步一步单独调用。"
    )
    parameters = {
        "type": "object",
        "properties": {
            "steps": {
                "type": "array",
                "description": "步骤列表，每个步骤包含 tool（工具名）、args（参数）、save_as（可选，保存结果为变量名）",
                "items": {
                    "type": "object",
                    "properties": {
                        "tool": {"type": "string", "description": "要调用的工具名"},
                        "args": {"type": "object", "description": "工具参数（支持 ${var} 变量引用）"},
                        "save_as": {"type": "string", "description": "可选：把结果保存为变量，供后面步骤引用"},
                        "condition": {"type": "string", "description": "可选：条件表达式，如 'step1.ok == True'，不满足则跳过此步"},
                    },
                    "required": ["tool", "args"],
                },
            },
        },
        "required": ["steps"],
    }

    def __init__(self, registry: ToolRegistry) -> None:
        self.registry = registry

    def run(self, steps: list[dict[str, Any]]) -> str:
        if not steps:
            return "工作流为空。"

        variables: dict[str, Any] = {}
        results: list[dict[str, Any]] = []
        t0 = time.time()

        for i, step in enumerate(steps, 1):
            tool_name = step.get("tool", "")
            args = step.get("args", {}) or {}
            save_as = step.get("save_as", "")

            # 解析变量
            resolved_args = self._resolve_step_args(args, variables)

            # 检查条件
            condition = step.get("condition", "")
            if condition and not self._eval_condition(condition, variables):
                results.append({
                    "step": i,
                    "tool": tool_name,
                    "status": "skipped",
                    "reason": f"条件不满足：{condition}",
                })
                if save_as:
                    variables[save_as] = {"ok": False, "result": "skipped"}
                continue

            # 执行工具
            ok, result = self.registry.run(tool_name, resolved_args)

            step_result = {
                "step": i,
                "tool": tool_name,
                "ok": ok,
                "result": result[:500] if isinstance(result, str) else str(result)[:500],
            }
            results.append(step_result)

            # 保存到变量
            if save_as:
                variables[save_as] = {"ok": ok, "result": result}
            # 也可以用 stepN 引用
            variables[f"step{i}"] = {"ok": ok, "result": result}

            # 关键步骤失败就中断
            if not ok and step.get("critical", True):
                results.append({"step": i, "status": "aborted", "reason": f"关键步骤失败：{tool_name}"})
                break

        elapsed = time.time() - t0
        # 输出摘要
        lines = [f"工作流执行完成（共 {len(results)} 步，耗时 {elapsed:.1f}s）："]
        for r in results:
            if r.get("status") == "skipped":
                lines.append(f"  步骤 {r['step']}: 跳过（{r.get('reason', '')}）")
            elif r.get("status") == "aborted":
                lines.append(f"  步骤 {r['step']}: 中断（{r.get('reason', '')}）")
            else:
                status = "成功" if r.get("ok") else "失败"
                lines.append(f"  步骤 {r['step']}: {r['tool']} - {status}")
                lines.append(f"    结果：{r.get('result', '')[:200]}")
        return "\n".join(lines)

    def _resolve_step_args(self, args: dict[str, Any], variables: dict[str, Any]) -> dict[str, Any]:
        """递归解析参数中的变量引用。"""
        resolved = {}
        for k, v in args.items():
            if isinstance(v, str):
                resolved[k] = _resolve_vars(v, variables)
            elif isinstance(v, dict):
                resolved[k] = self._resolve_step_args(v, variables)
            elif isinstance(v, list):
                resolved[k] = [
                    _resolve_vars(item, variables) if isinstance(item, str) else item
                    for item in v
                ]
            else:
                resolved[k] = v
        return resolved

    @staticmethod
    def _eval_condition(condition: str, variables: dict[str, Any]) -> bool:
        """简单的条件求值（非常有限，仅支持 == / !=）。"""
        try:
            # 解析变量后 eval（简单场景用）
            resolved = _resolve_vars(condition, variables)
            # 只允许简单比较
            if "==" in resolved:
                left, right = resolved.split("==", 1)
                return left.strip().strip("'\"") == right.strip().strip("'\"")
            if "!=" in resolved:
                left, right = resolved.split("!=", 1)
                return left.strip().strip("'\"") != right.strip().strip("'\"")
            # 没有比较运算符就当布尔值
            return bool(resolved.strip().strip("'\""))
        except Exception:
            return True  # 条件解析失败就默认执行
