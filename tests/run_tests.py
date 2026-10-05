"""极简测试运行器：无需 pytest 也能跑（pytest 可直接复用这些 test_ 函数）。

运行：python tests/run_tests.py
"""
from __future__ import annotations

import importlib.util
import sys
import traceback
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def _load(path: Path):
    spec = importlib.util.spec_from_file_location(path.stem, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def main() -> int:
    sys.path.insert(0, str(ROOT))
    passed, failed = 0, []
    for path in sorted(Path(__file__).parent.glob("test_*.py")):
        module = _load(path)
        tests = [n for n in sorted(dir(module)) if n.startswith("test_")]
        for name in tests:
            try:
                getattr(module, name)()
                passed += 1
            except Exception:
                failed.append((f"{path.name}::{name}", traceback.format_exc()))

    print(f"\n通过 {passed} 项，失败 {len(failed)} 项")
    for name, tb in failed:
        print("=" * 60)
        print("失败:", name)
        print(tb)
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
