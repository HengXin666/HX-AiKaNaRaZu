"""Type checker configuration constants.

CHECKER_CMD values use {src_dir} placeholder — replaced at template render time.
"""

from __future__ import annotations

CHECKER_DEPS: dict[str, str] = {
    "mypy": '"mypy>=1.14.1"',
    "ty": '"ty>=0.0.1a1"',
}
# 模板用: src_dir="." → cmd="uv run mypy ." / src_dir="server" → cmd="cd server && uv run mypy ."
CHECKER_CMD: dict[str, str] = {
    "mypy": "uv run mypy .",
    "ty": "uv run ty check .",
}
