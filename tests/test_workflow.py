"""工作流闭环测试：执行真正的注册工具，同时覆盖作用域、分支和安全边界。"""
from __future__ import annotations

import json

from tools.base import Tool
from tools.builtin import CalculatorTool
from tools.registry import ToolRegistry
from tools.workflow import WorkflowTool, _resolve_vars


class _Echo(Tool):
    name = "echo_json"
    description = "用于验证结构化工具参数"

    def __init__(self):
        self.calls = []

    def run(self, value):
        self.calls.append(value)
        return json.dumps(value, ensure_ascii=False)


class _Fail(Tool):
    name = "fail"

    def run(self):
        raise ValueError("expected failure")


def _setup():
    registry = ToolRegistry()
    echo = registry.register(_Echo())
    registry.register(CalculatorTool())
    registry.register(_Fail())
    workflow = registry.register(WorkflowTool(registry))
    return registry, workflow, echo


def _run(registry, steps, **kwargs):
    transport_ok, result = registry.run("workflow_run", {"steps": steps, "output_format": "json", **kwargs})
    assert transport_ok, result
    return json.loads(result)


def test_workflow_legacy_steps_and_json_data():
    registry, workflow, echo = _setup()
    result = _run(registry, [
        {"tool": "echo_json", "args": {"value": {"items": ["hello", "world"]}}, "save_as": "source"},
        {"tool": "echo_json", "args": {"value": "${source.data.items[1]}"}},
    ])
    assert result["ok"] and result["executed_steps"] == 2
    assert echo.calls == [{"items": ["hello", "world"]}, "world"]
    assert result["variables"]["source"]["result"] == '{"items": ["hello", "world"]}'
    assert "工作流执行完成" in workflow.run([{"tool": "calculator", "args": {"expression": "1+2"}}])
    assert _resolve_vars("${missing.value}", {}) == "${missing.value}"


def test_workflow_recursive_typed_parameters():
    registry, workflow, echo = _setup()
    value = {"items": [1, 2], "active": False, "meta": {"score": 88}}
    result = _run(registry, [
        {"tool": "echo_json", "args": {"value": {"nested": [{"list": "${user.items}"}], "active": "${user.active}", "label": "score=${user.meta.score}"}}},
    ], variables={"user": value})
    assert result["ok"]
    assert echo.calls == [{"nested": [{"list": [1, 2]}], "active": False, "label": "score=88"}]


def test_workflow_conditions_use_real_boolean_and_short_circuit():
    registry, workflow, echo = _setup()
    result = _run(registry, [
        {"tool": "echo_json", "args": {"value": "never"}, "condition": "false", "save_as": "skip"},
        {"tool": "echo_json", "args": {"value": "passed"}, "condition": "skip.ok == false and user.score >= 80 and user.role in ['student', 'teacher']"},
        {"tool": "echo_json", "args": {"value": "short circuit"}, "condition": "true or missing.path == 1"},
    ], variables={"user": {"score": 85, "role": "student"}})
    assert result["ok"] and echo.calls == ["passed", "short circuit"]
    assert result["variables"]["step1"]["ok"] is False
    assert workflow._eval_condition("${step1.ok} == True", {"step1": {"ok": True}})
    assert not workflow._eval_condition("0", {})
    assert workflow._eval_condition("-2 < user.score <= 100 and not false", {"user": {"score": 80}})


def test_workflow_multiway_branch_and_else_outputs():
    registry, workflow, echo = _setup()
    branch = {"type": "branch", "save_as": "route", "branches": [
        {"when": "score >= 90", "steps": [{"type": "assign", "values": {"grade": "A"}}], "outputs": {"grade": "${grade}"}},
        {"when": "score >= 60", "steps": [{"type": "assign", "values": {"grade": "B"}}], "outputs": {"grade": "${grade}"}},
        {"when": "true", "steps": [{"type": "assign", "values": {"grade": "C"}}], "outputs": {"grade": "${grade}"}},
    ]}
    result = _run(registry, [branch, {"tool": "echo_json", "args": {"value": "${route.result.grade}"}}], variables={"score": 92})
    assert result["ok"] and echo.calls == ["A"]
    assert result["results"][0]["branch"] == 0
    assert "grade" not in result["variables"]  # 分支内部变量通过 outputs 显式导出。
    branch["branches"] = branch["branches"][:2]
    branch["else_steps"] = [{"type": "assign", "values": {"grade": "D"}}]
    branch["outputs"] = {"grade": "${grade}"}
    result = _run(registry, [branch], variables={"score": 20})
    assert result["ok"] and result["result"] == {"grade": "D"}
    assert result["results"][0]["branch"] == "else"


def test_workflow_nested_child_inputs_outputs_and_calculator():
    registry, workflow, echo = _setup()
    result = _run(registry, [
        {"type": "assign", "values": {"amount": 7}},
        {"type": "workflow", "inputs": {"price": "${amount}"}, "save_as": "bill", "steps": [
            {"type": "workflow", "inputs": {"unit": "${price}"}, "save_as": "inner", "steps": [
                {"tool": "calculator", "args": {"expression": "${unit} * 3"}, "save_as": "total"}],
             "outputs": {"cost": "${total.data}"}},
        ], "outputs": {"cost": "${inner.result.cost}"}},
        {"tool": "echo_json", "args": {"value": "${bill.result.cost}"}},
    ])
    assert result["ok"] and echo.calls == ["7 * 3 = 21"]
    assert result["variables"]["amount"] == 7
    assert "price" not in result["variables"] and "unit" not in result["variables"]
    assert result["executed_steps"] == 5


def test_workflow_foreach_and_variable_aggregation():
    registry, workflow, echo = _setup()
    result = _run(registry, [
        {"type": "for_each", "items": "${numbers}", "item_name": "number", "index_name": "position", "save_as": "mapped", "steps": [
            {"tool": "echo_json", "args": {"value": "${number}"}, "save_as": "processed"},
        ], "outputs": {"value": "${processed.data}", "index": "${position}"}},
        {"type": "aggregate", "inputs": ["${mapped.result[0].value}", "${mapped.result[1].value}", "${mapped.result[2].value}"], "operation": "sum", "save_as": "sum"},
        {"tool": "echo_json", "args": {"value": "${sum.result}"}},
    ], variables={"numbers": [2, 3, 4]})
    assert result["ok"] and echo.calls == [2, 3, 4, 9]
    assert result["variables"]["mapped"]["result"] == [{"value": 2, "index": 0}, {"value": 3, "index": 1}, {"value": 4, "index": 2}]
    assert "number" not in result["variables"] and "position" not in result["variables"]
    assert result["executed_steps"] == 9


def test_workflow_aggregate_types():
    registry, workflow, echo = _setup()
    operations = [("list", [1, False], [1, False]), ("count", [1, 2], 2),
                  ("merge", [{"a": 1}, {"a": 2, "b": 3}], {"a": 2, "b": 3}),
                  ("concat", ["a", "b"], "a,b"), ("first_nonempty", [None, "", 0, "x"], 0)]
    for operation, inputs, expected in operations:
        result = _run(registry, [{"type": "aggregate", "operation": operation, "inputs": inputs, "separator": ","}])
        assert result["ok"] and result["result"] == expected
    result = _run(registry, [{"type": "aggregate", "operation": "sum", "inputs": [True, "2"]}])
    assert not result["ok"] and "数字数组" in result["result"]


def test_workflow_invalid_conditions_fail_closed_before_side_effects():
    registry, workflow, echo = _setup()
    for condition in ["__import__('os').system('touch /tmp/workflow_bad')", "user.__class__", "[x for x in [1]]", "(lambda: True)()", "user.score + 1 > 4"]:
        ok, result = registry.run("workflow_run", {"steps": [
            {"tool": "echo_json", "args": {"value": "must not run"}},
            {"tool": "echo_json", "args": {"value": "danger"}, "condition": condition},
        ]})
        assert not ok, (condition, result)
    assert echo.calls == []
    result = _run(registry, [{"tool": "echo_json", "args": {"value": "never"}, "condition": "unknown.ok"}])
    assert not result["ok"] and echo.calls == []
    assert "不存在" in result["result"]


def test_workflow_budget_and_depth_cannot_be_bypassed_by_nesting_or_loop():
    registry, workflow, echo = _setup()
    result = _run(registry, [{"type": "for_each", "items": [1, 2, 3], "steps": [
        {"tool": "echo_json", "args": {"value": "${item}"}}]}], max_steps=4)
    assert not result["ok"] and result["executed_steps"] == 4 and echo.calls == [1]
    result = _run(registry, [{"type": "for_each", "items": [1, 2, 3], "steps": []}], max_steps=2)
    assert not result["ok"] and "预算" in result["result"]
    child = [{"tool": "echo_json", "args": {"value": "never"}}]
    for _ in range(3):
        child = [{"type": "workflow", "steps": child}]
    ok, text = registry.run("workflow_run", {"steps": child, "max_depth": 2})
    assert not ok and "深度上限" in text and echo.calls == [1]
    for kwargs in ({"max_steps": 1000}, {"max_depth": 9}, {"max_steps": True}):
        ok, _ = registry.run("workflow_run", {"steps": [], **kwargs})
        assert not ok


def test_workflow_direct_and_indirect_recursion_are_blocked():
    registry, workflow, echo = _setup()
    ok, text = registry.run("workflow_run", {"steps": [
        {"tool": "workflow_run", "args": {"steps": []}},
    ]})
    assert not ok and "递归" in text

    class Reenter(Tool):
        name = "reenter"
        def run(self):
            return workflow.run([{"tool": "echo_json", "args": {"value": "never"}}])
    registry.register(Reenter())
    result = _run(registry, [{"tool": "reenter", "args": {}}])
    assert not result["ok"] and "递归" in result["result"] and echo.calls == []
    # contextvars 的防递归标志会恢复，正常后续调用仍然可用。
    result = _run(registry, [{"tool": "echo_json", "args": {"value": "normal"}}])
    assert result["ok"] and echo.calls == ["normal"]


def test_workflow_failure_propagates_and_noncritical_continues():
    registry, workflow, echo = _setup()
    result = _run(registry, [
        {"type": "workflow", "steps": [{"tool": "fail", "args": {}}]},
        {"tool": "echo_json", "args": {"value": "never"}},
    ])
    assert not result["ok"] and echo.calls == []
    result = _run(registry, [
        {"tool": "fail", "args": {}, "critical": False},
        {"tool": "echo_json", "args": {"value": "recover"}},
    ])
    assert not result["ok"] and echo.calls == ["recover"]
    result = _run(registry, [{"tool": "echo_json", "args": {"value": "${missing}"}}])
    assert not result["ok"] and echo.calls == ["recover"]


def test_workflow_documented_business_example_runs_end_to_end():
    registry, workflow, echo = _setup()
    result = _run(registry, [
        {"type": "assign", "values": {"scores": [70, 90]}},
        {"type": "aggregate", "operation": "sum", "inputs": "${scores}", "save_as": "total"},
        {"type": "branch", "save_as": "decision", "branches": [
            {"when": "total.result >= 160", "steps": [
                {"tool": "calculator", "args": {"expression": "${total.result}/2"}, "save_as": "average"}],
             "outputs": {"average": "${average.result}"}}
        ], "else_steps": [{"type": "assign", "values": {"reason": "分数不足"}}]},
    ])
    assert result["ok"] and result["variables"]["decision"]["result"] == {"average": "160/2 = 80.0"}
    assert "branches" in workflow.to_schema()["function"]["parameters"]["properties"]["steps"]["items"]["properties"]
