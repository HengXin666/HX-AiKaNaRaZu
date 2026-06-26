#!/usr/bin/env python3
"""交互式 AI Coding 强约束脚手架 — 入口包装。

Usage:
    uv run python main.py                     # 交互模式 (推荐)
    uv run python -m bootstrap                # 直接调 bootstrap 交互模式

交互流程:
    1. 输入 Python 版本 (默认 3.11)
    2. 选类型检查器 (mypy/ty)
    3. 目标目录
    4. 预览文件列表 → 确认
    5. 冲突处理 (跳过/覆盖/备份/取消)
    6. 安装/校验/删除 菜单 [1][2][3]

The real logic lives in src/.
"""

from __future__ import annotations

import sys
from pathlib import Path

_HERE: Path = Path(__file__).resolve().parent
sys.path.insert(0, str(_HERE / "src"))

from bootstrap import main  # noqa: E402

if __name__ == "__main__":
    sys.exit(main())
