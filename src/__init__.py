"""AI Coding strong-rule scaffold — bootstrap a Python project with enforced constraints.

Usage (交互模式):
    uv run python main.py               # 完整交互流程
    uv run python -m bootstrap          # 直接调 bootstrap 交互模式

交互步骤: 输入 Python 版本 → 选类型检查器 → 预览文件 → 冲突处理 → [安装/校验/删除]
"""

from bootstrap import main

__all__ = ["main"]
