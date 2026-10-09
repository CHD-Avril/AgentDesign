"""有界工作流：工具、业务变量、聚合、条件分支、子流程与批量循环。

旧式 ``{"tool": "calculator", "args": {...}, "save_as": "answer"}`` 仍可使用。
完整的 ``${answer.result}`` 引用保留原始类型；工具 JSON 输出可用
``${answer.data.items[0]}`` 读取。条件只支持字面量、变量路径、比较和
and / or / not，不执行 Python 代码。子流程通过 inputs / outputs 传递变量。

可运行示例（已注册 calculator 时）：
    workflow_run(steps=[
        {"type": "assign", "values": {"scores": [70, 90]}},
        {"type": "aggregate", "operation": "sum", "inputs": "${scores}",
         "save_as": "total"},
        {"type": "branch", "save_as": "decision", "branches": [
            {"when": "total.result >= 160", "steps": [
                {"tool": "calculator", "args": {"expression": "${total.result}/2"},
                 "save_as": "average"}], "outputs": {"average": "${average.result}"}}
        ], "else_steps": [{"type": "assign", "values": {"reason": "分数不足"}}]},
    ])
"""
from __future__ import annotations

import ast
import contextvars
import json
import re
import time
from dataclasses import dataclass, field
from typing import Any

from tools.base import Tool
from tools.registry import ToolRegistry

_REFERENCE = re.compile(r"\$\{([^}]+)\}")
_PATH = re.compile(r"[A-Za-z_]\w*(?:(?:\.[A-Za-z_]\w*)|(?:\[\d+\]))*")
_PATH_PART = re.compile(r"([A-Za-z_]\w*)|\[(\d+)\]")
_ACTIVE_WORKFLOW = contextvars.ContextVar("active_workflow", default=False)


def _lookup(path: str, variables: dict[str, Any]) -> Any:
    if not _PATH.fullmatch(path):
        raise ValueError(f"变量路径不合法：{path}")
    value: Any = variables
    try:
        for match in _PATH_PART.finditer(path):
            key, index = match.groups()
            value = value[int(index)] if index is not None else value[key]
        return value
    except (KeyError, IndexError, TypeError) as err:
        raise ValueError(f"变量不存在：{path}") from err


def _resolve_vars(text: str, variables: dict[str, Any]) -> str:
    """兼容旧接口：插值为文本；缺失引用保持原样。"""
    if not isinstance(text, str):
        return text

    def replacer(match: re.Match) -> str:
        try:
            value = _lookup(match.group(1), variables)
        except ValueError:
            return match.group(0)
        return json.dumps(value, ensure_ascii=False) if isinstance(value, (dict, list)) else str(value)

    return _REFERENCE.sub(replacer, text)


def _resolve_value(value: Any, variables: dict[str, Any]) -> Any:
    """工具参数的完整变量引用保留类型，嵌套参数也逐层解析。"""
    if isinstance(value, str):
        exact = _REFERENCE.fullmatch(value)
        if exact:
            return _lookup(exact.group(1), variables)

        def replace(match: re.Match) -> str:
            resolved = _lookup(match.group(1), variables)
            return json.dumps(resolved, ensure_ascii=False) if isinstance(resolved, (dict, list)) else str(resolved)

        return _REFERENCE.sub(replace, value)
    if isinstance(value, dict):
        return {key: _resolve_value(item, variables) for key, item in value.items()}
    if isinstance(value, list):
        return [_resolve_value(item, variables) for item in value]
    return value


class _SafeCondition:
    """AST 白名单解释器，只读取 JSON 值，禁止函数、属性访问和运算代码。"""

    _allowed = (
        ast.Expression, ast.Constant, ast.Name, ast.Attribute, ast.Subscript,
        ast.Load, ast.List, ast.Tuple, ast.Dict, ast.BoolOp, ast.And, ast.Or,
        ast.UnaryOp, ast.Not, ast.USub, ast.UAdd, ast.Compare, ast.Eq, ast.NotEq,
        ast.Lt, ast.LtE, ast.Gt, ast.GtE, ast.In, ast.NotIn, ast.Is, ast.IsNot,
    )

    @classmethod
    def parse(cls, condition: str | bool) -> ast.Expression | bool:
        if isinstance(condition, bool):
            return condition
        if not isinstance(condition, str) or not condition.strip():
            raise ValueError("条件必须是非空字符串或布尔值")
        if len(condition) > 2048:
            raise ValueError("条件表达式过长")
        # ${user.score} 与 user.score 两种写法都可使用。
        def reference(match: re.Match) -> str:
            path = match.group(1)
            if not _PATH.fullmatch(path):
                raise ValueError(f"条件变量路径不合法：{path}")
            return path
        expression = _REFERENCE.sub(reference, condition)
        try:
            tree = ast.parse(expression, mode="eval")
        except (SyntaxError, RecursionError) as err:
            raise ValueError("条件表达式语法错误") from err
        nodes = list(ast.walk(tree))
        if len(nodes) > 128:
            raise ValueError("条件表达式过于复杂")
        for node in nodes:
            if not isinstance(node, cls._allowed):
                raise ValueError(f"条件不支持 {type(node).__name__}，只允许变量、比较和逻辑组合")
            if isinstance(node, ast.Name) and node.id.startswith("_"):
                raise ValueError("条件不能访问私有变量")
            if isinstance(node, ast.Attribute) and node.attr.startswith("_"):
                raise ValueError("条件不能访问私有属性")
            if isinstance(node, ast.Constant) and not isinstance(node.value, (str, int, float, bool, type(None))):
                raise ValueError("条件字面量类型不支持")
        return tree

    @classmethod
    def evaluate(cls, condition: str | bool, variables: dict[str, Any]) -> bool:
        tree = cls.parse(condition)
        if isinstance(tree, bool):
            return tree

        def visit(node: ast.AST) -> Any:
            if isinstance(node, ast.Constant):
                return node.value
            if isinstance(node, ast.Name):
                if node.id in ("true", "false", "null"):
                    return {"true": True, "false": False, "null": None}[node.id]
                if node.id not in variables:
                    raise ValueError(f"条件变量不存在：{node.id}")
                return variables[node.id]
            if isinstance(node, ast.Attribute):
                value = visit(node.value)
                if not isinstance(value, dict) or node.attr not in value:
                    raise ValueError(f"条件变量字段不存在：{node.attr}")
                return value[node.attr]
            if isinstance(node, ast.Subscript):
                value, key = visit(node.value), visit(node.slice)
                if not isinstance(value, (dict, list, tuple)) or not isinstance(key, (str, int)):
                    raise ValueError("条件索引只支持字典字段或列表下标")
                try:
                    return value[key]
                except (KeyError, IndexError, TypeError) as err:
                    raise ValueError("条件索引不存在") from err
            if isinstance(node, (ast.List, ast.Tuple)):
                return [visit(item) for item in node.elts]
            if isinstance(node, ast.Dict):
                return {visit(key): visit(value) for key, value in zip(node.keys, node.values)}
            if isinstance(node, ast.UnaryOp):
                value = visit(node.operand)
                if isinstance(node.op, ast.Not):
                    return not value
                if not isinstance(value, (int, float)) or isinstance(value, bool):
                    raise ValueError("条件中的正负号只适用于数字")
                return -value if isinstance(node.op, ast.USub) else value
            if isinstance(node, ast.BoolOp):
                if isinstance(node.op, ast.And):
                    return all(bool(visit(value)) for value in node.values)
                return any(bool(visit(value)) for value in node.values)
            if isinstance(node, ast.Compare):
                left = visit(node.left)
                for operator, right_node in zip(node.ops, node.comparators):
                    right = visit(right_node)
                    try:
                        if isinstance(operator, ast.Eq):
                            matched = left == right
                        elif isinstance(operator, ast.NotEq):
                            matched = left != right
                        elif isinstance(operator, ast.Lt):
                            matched = left < right
                        elif isinstance(operator, ast.LtE):
                            matched = left <= right
                        elif isinstance(operator, ast.Gt):
                            matched = left > right
                        elif isinstance(operator, ast.GtE):
                            matched = left >= right
                        elif isinstance(operator, ast.In):
                            matched = left in right
                        elif isinstance(operator, ast.NotIn):
                            matched = left not in right
                        elif isinstance(operator, ast.Is):
                            matched = left is right
                        else:
                            matched = left is not right
                    except TypeError as err:
                        raise ValueError("条件比较的值类型不匹配") from err
                    if not matched:
                        return False
                    left = right
                return True
            raise ValueError("条件包含不支持的表达式")

        return bool(visit(tree.body))


@dataclass
class _Execution:
    max_steps: int
    max_depth: int
    count: int = 0
    results: list[dict[str, Any]] = field(default_factory=list)

    def consume(self) -> None:
        if self.count >= self.max_steps:
            raise ValueError(f"达到总执行步数上限（{self.max_steps}），已停止后续执行")
        self.count += 1


_NODE_PROPERTIES = {
    "type": {"type": "string", "enum": ["tool", "assign", "aggregate", "branch", "workflow", "for_each"],
             "description": "默认 tool；assign 业务变量，aggregate 聚合，branch 首个匹配分支，workflow 子流程，for_each 批处理"},
    "tool": {"type": "string", "description": "工具名；不能递归调用 workflow_run，嵌套请用 workflow 节点"},
    "args": {"type": "object", "description": "工具参数，支持递归变量引用；完整 ${var} 保留原类型"},
    "save_as": {"type": "string", "description": "结果变量名，读取 ${name.result}；工具 JSON 结果读取 ${name.data.key}"},
    "condition": {"description": "可选执行条件，如 total.result >= 80 and user.active == true；支持字符串或布尔值", "anyOf": [{"type": "string"}, {"type": "boolean"}]},
    "critical": {"type": "boolean", "description": "默认 true，失败立即终止当前流程及父流程"},
    "values": {"type": "object", "description": "assign 节点赋值对象，之后可直接读取 ${变量名}"},
    "operation": {"type": "string", "enum": ["list", "merge", "concat", "sum", "count", "first_nonempty"], "description": "aggregate 聚合方式"},
    "inputs": {"description": "aggregate 的数组/数组引用，或 workflow 的局部输入变量对象"},
    "separator": {"type": "string", "description": "concat 聚合连接符，默认空字符串"},
    "steps": {"type": "array", "items": {"type": "object"}, "description": "workflow / for_each 内部步骤，可继续嵌套相同节点"},
    "outputs": {"type": "object", "description": "从子流程变量导出的对象，例如 {answer: '${answer.result}'}；未提供则取最后一步结果"},
    "branches": {"type": "array", "description": "按顺序选择首个 when 为真的分支，只执行该分支", "items": {"type": "object", "properties": {"when": {"anyOf": [{"type": "string"}, {"type": "boolean"}]}, "steps": {"type": "array", "items": {"type": "object"}}, "outputs": {"type": "object"}}, "required": ["when", "steps"]}},
    "else_steps": {"type": "array", "items": {"type": "object"}, "description": "branch 无匹配分支时执行的步骤，默认空"},
    "items": {"description": "for_each 的数组或完整数组变量引用"},
    "item_name": {"type": "string", "description": "循环项局部变量名，默认 item"},
    "index_name": {"type": "string", "description": "循环下标局部变量名，默认 index"},
}


class WorkflowTool(Tool):
    """可组合的工作流解释器，所有节点共享执行预算。"""

    name = "workflow_run"
    description = (
        "执行含业务逻辑、工具调用、变量聚合、条件/多路分支、嵌套子流程和批处理的工作流。"
        "旧 tool/args/save_as 步骤仍可使用。${stepN.result} 引用前一步；完整变量引用保留类型。"
        "branch 的 branches=[{when,steps,outputs}] 首个匹配执行，否则 else_steps；"
        "workflow 使用 steps/inputs/outputs，for_each 使用 items/steps/outputs。"
        "aggregate 的 inputs 为数组，operation 支持 list/merge/concat/sum/count/first_nonempty。"
        "条件只允许比较和 and/or/not，不执行代码；子流程受统一步数和深度限制。"
    )
    parameters = {
        "type": "object",
        "properties": {
            "steps": {"type": "array", "maxItems": 500, "items": {"type": "object", "properties": _NODE_PROPERTIES}},
            "variables": {"type": "object", "description": "流程初始业务变量"},
            "max_steps": {"type": "integer", "minimum": 1, "maximum": 500, "description": "所有分支、循环、嵌套共享总预算，默认 100"},
            "max_depth": {"type": "integer", "minimum": 1, "maximum": 8, "description": "最大嵌套层数，默认 4"},
            "output_format": {"type": "string", "enum": ["text", "json"], "description": "默认 text 摘要；json 提供完整结果与变量，便于后续工具处理"},
        },
        "required": ["steps"],
    }

    def __init__(self, registry: ToolRegistry) -> None:
        self.registry = registry

    @staticmethod
    def _variable_name(name: Any) -> str:
        if not isinstance(name, str) or not re.fullmatch(r"[A-Za-z_]\w*", name) or name.startswith("_"):
            raise ValueError("变量名必须是字母/下划线开头的公开标识符")
        return name

    def _validate_steps(self, steps: Any, depth: int, max_depth: int) -> None:
        if not isinstance(steps, list) or len(steps) > 500:
            raise ValueError("steps 必须是最多 500 项的数组")
        if depth > max_depth:
            raise ValueError(f"超过嵌套深度上限（{max_depth}）")
        for step in steps:
            if not isinstance(step, dict):
                raise ValueError("每个步骤必须是对象")
            kind = step.get("type", "tool")
            if kind not in ("tool", "assign", "aggregate", "branch", "workflow", "for_each"):
                raise ValueError(f"未知工作流节点类型：{kind}")
            if "save_as" in step:
                self._variable_name(step["save_as"])
            if "critical" in step and not isinstance(step["critical"], bool):
                raise ValueError("critical 必须是布尔值")
            if "condition" in step:
                _SafeCondition.parse(step["condition"])
            if kind == "tool":
                tool_name = step.get("tool")
                if not isinstance(tool_name, str) or not tool_name:
                    raise ValueError("tool 节点缺少工具名")
                if tool_name == self.name or isinstance(self.registry.get(tool_name), WorkflowTool):
                    raise ValueError("禁止递归调用 workflow_run；嵌套请使用 type=workflow 节点")
                if not isinstance(step.get("args", {}), dict):
                    raise ValueError("工具 args 必须是对象")
            elif kind == "assign":
                if not isinstance(step.get("values"), dict):
                    raise ValueError("assign 需要 values 对象")
                for name in step["values"]:
                    self._variable_name(name)
            elif kind == "aggregate":
                if step.get("operation", "list") not in ("list", "merge", "concat", "sum", "count", "first_nonempty"):
                    raise ValueError("不支持的聚合 operation")
                if "inputs" not in step:
                    raise ValueError("aggregate 需要 inputs 数组或数组引用")
            elif kind == "branch":
                branches = step.get("branches")
                if not isinstance(branches, list) or not branches or len(branches) > 100:
                    raise ValueError("branch 需要 1 到 100 个 branches")
                for branch in branches:
                    if not isinstance(branch, dict) or "when" not in branch:
                        raise ValueError("每个分支需要 when 和 steps")
                    _SafeCondition.parse(branch["when"])
                    self._validate_steps(branch.get("steps"), depth + 1, max_depth)
                    if "outputs" in branch and not isinstance(branch["outputs"], dict):
                        raise ValueError("分支 outputs 必须是对象")
                self._validate_steps(step.get("else_steps", []), depth + 1, max_depth)
            else:
                self._validate_steps(step.get("steps"), depth + 1, max_depth)
                if kind == "workflow" and not isinstance(step.get("inputs", {}), dict):
                    raise ValueError("workflow inputs 必须是对象")
                if kind == "for_each":
                    if "items" not in step:
                        raise ValueError("for_each 需要 items 数组或数组引用")
                    self._variable_name(step.get("item_name", "item"))
                    self._variable_name(step.get("index_name", "index"))
                    if step.get("item_name", "item") == step.get("index_name", "index"):
                        raise ValueError("item_name 与 index_name 不能相同")
            if "outputs" in step and not isinstance(step["outputs"], dict):
                raise ValueError("outputs 必须是对象")

    @staticmethod
    def _aggregate(operation: str, values: Any, separator: str) -> Any:
        if not isinstance(values, list):
            raise ValueError("aggregate inputs 解析后必须是数组")
        if operation == "list":
            return values
        if operation == "count":
            return len(values)
        if operation == "sum":
            if any(not isinstance(value, (int, float)) or isinstance(value, bool) for value in values):
                raise ValueError("sum 聚合只接受数字数组")
            return sum(values)
        if operation == "merge":
            merged = {}
            for value in values:
                if not isinstance(value, dict):
                    raise ValueError("merge 聚合只接受对象数组")
                merged.update(value)
            return merged
        if operation == "concat":
            if not isinstance(separator, str):
                raise ValueError("concat separator 必须是字符串")
            return separator.join(str(value) for value in values)
        return next((value for value in values if value is not None and value != ""), None)

    @staticmethod
    def _save(variables: dict[str, Any], index: int, step: dict[str, Any], ok: bool, result: Any) -> None:
        data = result
        if isinstance(result, str):
            try:
                data = json.loads(result)
            except (ValueError, TypeError):
                pass
        saved = {"ok": ok, "result": result, "data": data}
        variables[f"step{index}"] = saved
        if step.get("save_as"):
            variables[step["save_as"]] = saved

    def _child(self, steps: list, parent: dict, execution: _Execution, depth: int,
               path: str, inputs: dict | None = None, outputs: dict | None = None) -> tuple[bool, Any]:
        child = dict(parent)
        child.update(inputs or {})
        ok, last = self._execute(steps, child, execution, depth, path)
        if not ok:
            return False, last
        return True, _resolve_value(outputs, child) if outputs is not None else last

    def _execute(self, steps: list, variables: dict, execution: _Execution,
                 depth: int = 0, prefix: str = "") -> tuple[bool, Any]:
        last: Any = None
        all_ok = True
        for index, step in enumerate(steps, 1):
            execution.consume()
            path = f"{prefix}.{index}" if prefix else str(index)
            kind = step.get("type", "tool")
            label = step.get("tool", "") if kind == "tool" else kind
            entry: dict[str, Any] = {"step": path, "type": kind, "tool": label}
            if "condition" in step and not self._eval_condition(step["condition"], variables):
                entry.update(status="skipped", reason=f"条件不满足：{step['condition']}")
                execution.results.append(entry)
                self._save(variables, index, step, False, "skipped")
                continue
            execution.results.append(entry)
            try:
                if kind == "tool":
                    ok, result = self.registry.run(step["tool"], _resolve_value(step.get("args", {}), variables))
                elif kind == "assign":
                    result = _resolve_value(step["values"], variables)
                    variables.update(result)
                    ok = True
                elif kind == "aggregate":
                    result = self._aggregate(step.get("operation", "list"), _resolve_value(step["inputs"], variables), step.get("separator", ""))
                    ok = True
                elif kind == "workflow":
                    ok, result = self._child(step["steps"], variables, execution, depth + 1, path,
                                             _resolve_value(step.get("inputs", {}), variables), step.get("outputs"))
                elif kind == "branch":
                    selected = None
                    for branch in step["branches"]:
                        if self._eval_condition(branch["when"], variables):
                            selected = branch
                            break
                    entry["branch"] = step["branches"].index(selected) if selected is not None else "else"
                    ok, result = self._child(selected["steps"] if selected is not None else step.get("else_steps", []),
                                             variables, execution, depth + 1, path,
                                             outputs=selected.get("outputs", step.get("outputs")) if selected is not None else step.get("outputs"))
                else:
                    items = _resolve_value(step["items"], variables)
                    if not isinstance(items, list):
                        raise ValueError("for_each items 解析后必须是数组")
                    if len(items) > execution.max_steps:
                        raise ValueError("循环项数量超过总执行预算")
                    result, ok = [], True
                    for item_index, item in enumerate(items):
                        execution.consume()  # 即使循环体为空也计入预算。
                        item_ok, item_result = self._child(step["steps"], variables, execution, depth + 1,
                            f"{path}[{item_index}]", {step.get("item_name", "item"): item, step.get("index_name", "index"): item_index}, step.get("outputs"))
                        result.append(item_result)
                        if not item_ok:
                            ok = False
                            break
            except (ValueError, TypeError) as err:
                ok, result = False, str(err)
            last = result
            entry.update(ok=ok, status="success" if ok else "failed", result=result)
            self._save(variables, index, step, ok, result)
            if not ok:
                all_ok = False
                if step.get("critical", True):
                    entry["status"] = "aborted"
                    return False, result
        return all_ok, last

    def run(self, steps: list[dict[str, Any]], variables: dict[str, Any] | None = None,
            max_steps: int = 100, max_depth: int = 4, output_format: str = "text") -> str:
        if _ACTIVE_WORKFLOW.get():
            raise ValueError("禁止从工具内部递归执行工作流；嵌套请使用 workflow 节点")
        if isinstance(max_steps, bool) or not isinstance(max_steps, int) or not 1 <= max_steps <= 500:
            raise ValueError("max_steps 必须是 1 到 500 的整数")
        if isinstance(max_depth, bool) or not isinstance(max_depth, int) or not 1 <= max_depth <= 8:
            raise ValueError("max_depth 必须是 1 到 8 的整数")
        if output_format not in ("text", "json"):
            raise ValueError("output_format 必须是 text 或 json")
        if variables is not None and not isinstance(variables, dict):
            raise ValueError("variables 必须是对象")
        for name in variables or {}:
            self._variable_name(name)
        self._validate_steps(steps, 0, max_depth)
        if not steps and output_format == "text":
            return "工作流为空。"
        scope = dict(variables or {})
        execution = _Execution(max_steps=max_steps, max_depth=max_depth)
        started = time.monotonic()
        active_token = _ACTIVE_WORKFLOW.set(True)
        try:
            try:
                ok, last = self._execute(steps, scope, execution)
            except ValueError as err:
                ok, last = False, str(err)
                execution.results.append({"step": "limit", "status": "aborted", "ok": False, "reason": str(err)})
        finally:
            _ACTIVE_WORKFLOW.reset(active_token)
        elapsed = time.monotonic() - started
        if output_format == "json":
            return json.dumps({"ok": ok, "executed_steps": execution.count, "result": last,
                               "results": execution.results, "variables": scope}, ensure_ascii=False)
        lines = [f"工作流{'执行完成' if ok else '已中断或存在失败'}（共 {execution.count} 步，耗时 {elapsed:.1f}s）："]
        for result in execution.results:
            if result.get("status") == "skipped":
                lines.append(f"  步骤 {result['step']}: 跳过（{result['reason']}）")
            elif result.get("status") == "aborted" and "reason" in result:
                lines.append(f"  步骤 {result['step']}: 中断（{result['reason']}）")
            else:
                status = "成功" if result.get("ok") else "失败/中断"
                lines.append(f"  步骤 {result['step']}: {result.get('tool', '')} - {status}")
                rendered = json.dumps(result.get("result"), ensure_ascii=False) if not isinstance(result.get("result"), str) else result["result"]
                lines.append(f"    结果：{rendered[:200]}")
        return "\n".join(lines)

    def _resolve_step_args(self, args: dict[str, Any], variables: dict[str, Any]) -> dict[str, Any]:
        return _resolve_value(args, variables)

    @staticmethod
    def _eval_condition(condition: str | bool, variables: dict[str, Any]) -> bool:
        return _SafeCondition.evaluate(condition, variables)
