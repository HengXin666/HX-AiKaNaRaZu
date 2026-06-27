"""Template generators: pyproject, precommit, verify, CI.

Each function takes `checker`, `py_ver`, and `src_dir` and returns a rendered string.
"""

from __future__ import annotations

from ._checkers import CHECKER_CMD, CHECKER_DEPS


def _ruff_target(py_ver: str) -> str:
    """Convert '3.11' to 'py311'."""
    return "py" + py_ver.replace(".", "")


def _mypy_section(py_ver: str) -> str:
    """Generate [tool.mypy] section with proper regex escapes for exclude."""
    bs: str = chr(92)  # single backslash
    return (
        f"[tool.mypy]\n"
        f'python_version = "{py_ver}"\n'
        f"strict = true\n"
        f"warn_unused_ignores = true\n"
        f"disallow_untyped_defs = true\n"
        f"exclude = [\n"
        f"    '^ref/',\n"
        f"    '^{bs}.claude/skills/',\n"
        f"    '^{bs}.agents/skills/',\n"
        f"    '^{bs}.codex/skills/',\n"
        f"    '{bs}.bak',\n"
        f"    '~$',\n"
        f"]\n"
    )


def pyproject_template(checker: str, py_ver: str, src_dir: str) -> str:
    dep: str = CHECKER_DEPS[checker]
    test_ignore: str = (
        '"**/tests/**" = ["ANN", "S101"]\n' if src_dir != "." else '"tests/**" = ["ANN", "S101"]\n'
    )
    checker_section: str = (
        _mypy_section(py_ver)
        if checker == "mypy"
        else '[tool.ty.src]\ninclude = ["api", "server", "models", "config", "utils"]\n'
    )
    return f"""\
[project]
name = "app"
version = "0.1.0"
requires-python = ">={py_ver}"
dependencies = []

[dependency-groups]
dev = ["ruff>=0.8.6", {dep}, "pre-commit>=4.0.0"]

[tool.ruff]
target-version = "{_ruff_target(py_ver)}"
line-length = 100
# 排除非项目代码
exclude = [
    "ref/",
    ".claude/skills/",
    ".agents/skills/",
    ".codex/skills/",
    "*.bak",
    "*.bak_*",
    "*~",
]

[tool.ruff.lint]
# Ruff 默认规则 + 类型标注强制(ANN) + 中文命名拦截(PLC2401)
select = [
    "E", "F", "W", "I", "UP", "ANN", "B", "SIM", "TID", "RUF", "N",
    "PLC2401",  # 禁止非ASCII 变量/函数/类名 (拦 AI 中文命名幻觉)
    "PLC2403",  # 禁止 import ... as 中文别名
]

[tool.ruff.lint.flake8-annotations]
mypy-init-return = true
suppress-none-returning = true

[tool.ruff.lint.per-file-ignores]
"__init__.py" = ["F401"]
{test_ignore}
{checker_section}"""


def _type_cmd(checker: str, src_dir: str) -> str:
    """Build the mypy/ty command for verify.sh (subshell OK)."""
    base: str = CHECKER_CMD[checker]
    if src_dir == ".":
        return base
    return f"(cd {src_dir} && {base})"


def _type_cmd_precommit(checker: str, src_dir: str) -> str:
    """Build the mypy/ty entry for pre-commit (language:system, needs bash -c)."""
    base: str = CHECKER_CMD[checker]
    if src_dir == ".":
        return base
    return f"bash -c 'cd {src_dir} && {base}'"


def precommit_template(checker: str, src_dir: str) -> str:
    type_entry: str = _type_cmd_precommit(checker, src_dir)
    arch_entry: str = f"uv run python scripts/check_arch.py {src_dir}"
    return f"""\
# 提交即验证 (uv 驱动): 给 Agent 明确的 pass/fail 信号
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.8.6
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format
  - repo: local
    hooks:
      - id: type-check
        name: type-check ({checker})
        entry: {type_entry}
        language: system
        pass_filenames: false
        always_run: true
      - id: arch-check
        name: arch-check (300行/文件数/_前缀/中文命名)
        entry: {arch_entry}
        language: system
        pass_filenames: false
        always_run: true
"""


def verify_sh_template(checker: str, src_dir: str) -> str:
    type_cmd: str = _type_cmd(checker, src_dir)
    return f"""\
#!/usr/bin/env bash
# 验证闭环 (uv 版): 给 Agent 明确 pass/fail 信号. Stop hook 复用本脚本.
set -euo pipefail
echo "==> [1/4] ruff check (含 PLC2401 中文命名拦截)"
uv run ruff check .
echo "==> [2/4] ruff format --check"
uv run ruff format --check .
echo "==> [3/4] type-check ({checker})"
{type_cmd}
echo "==> [4/4] arch-check (300行/文件数/_前缀/中文命名)"
uv run python scripts/check_arch.py {src_dir}
echo "ALL PASS"
"""


def ci_yml_template(checker: str, py_ver: str) -> str:
    return f"""\
name: ci
on: [push, pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v5
        with:
          python-version: "{py_ver}"
      - run: uv sync
      - run: bash scripts/verify.sh
"""
