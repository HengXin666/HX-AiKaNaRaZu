"""交互式一键初始化「AI Coding 强约束」脚手架 (uv 版, 零第三方依赖).

Usage:
    uv run python -m bootstrap          # 交互模式
    uv run python main.py               # 交互模式 (根入口)

交互流程:
    1. 输入 Python 版本 (默认 3.11)
    2. 选择类型检查器 (mypy / ty)
    3. 指定目标目录
    4. 预览将要创建的文件 → 确认
    5. 冲突检测 → 选择处理方式
    6. 安装 / 校验 / 删除 → 选择[1][2][3]

产物:
    pyproject.toml / .pre-commit-config.yaml / .gitignore
    CLAUDE.md / AGENTS.md                      # Claude Code / Codex 入口
    .agents/  {rules/,hooks/,settings.json,hooks.json}  # 共享配置源
    .claude/  内各文件 -> ../.agents/...   (★ 个体软链接, 不覆盖你已有的 skills)
    .codex/   内各文件 -> ../.agents/...   (★ 同上)
    scripts/{verify.sh, check_arch.py}
    .github/workflows/ci.yml
"""

from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path

from impl._files import (
    build_files,
    create_file_symlinks,
    delete_generated_files,
    write_file,
    write_smart,
)


# ---------------------------------------------------------------------------
# interactive helpers
# ---------------------------------------------------------------------------

def _ask(msg: str, default: str = "") -> str:
    """Ask user for input with optional default."""
    prompt = f"{msg} [{default}]: " if default else f"{msg}: "
    try:
        result: str = input(prompt).strip()
    except (EOFError, KeyboardInterrupt):
        print("\n取消。")
        sys.exit(0)
    return result or default


def _choose(msg: str, options: list[str], default_idx: int = 0) -> int:
    """Ask user to choose from a list of options. Returns 0-based index."""
    print(f"\n{msg}")
    for i, opt in enumerate(options):
        print(f"  [{i + 1}] {opt}{' (默认)' if i == default_idx else ''}")
    n: int = len(options)
    while True:
        try:
            raw: str = input(f"  选择 [1-{n}]: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\n取消。")
            sys.exit(0)
        if not raw:
            return default_idx
        try:
            idx: int = int(raw) - 1
            if 0 <= idx < n:
                return idx
        except ValueError:
            pass
        print(f"  请输入 1-{n}")


def _confirm(msg: str, default: bool = True) -> bool:
    """Ask yes/no question."""
    suffix: str = " [Y/n]: " if default else " [y/N]: "
    try:
        raw: str = input(f"{msg}{suffix}").strip().lower()
    except (EOFError, KeyboardInterrupt):
        print("\n取消。")
        sys.exit(0)
    return default if not raw else raw in ("y", "yes")


# ---------------------------------------------------------------------------
# display helpers
# ---------------------------------------------------------------------------

def _show_file_tree(files: list[tuple[str, str, bool]], target: Path) -> None:
    """Print the file tree that will be created, all paths absolute."""
    dirs: dict[str, list[str]] = {}
    for rel, _content, _additive in sorted(files):
        full_parent: Path = (target / rel).resolve().parent
        dirs.setdefault(str(full_parent), []).append(Path(rel).name)

    for d, names in sorted(dirs.items()):
        print(f"  {d}/")
        for n in sorted(names):
            print(f"    ├── {n}")


def _show_symlink_summary(target: Path) -> None:
    """Show what symlinks will be created."""
    t: str = str(target)
    print(f"  {t}/\n    └── AGENTS.md -> CLAUDE.md")
    print(f"  {t}/.claude/\n    ├── settings.json -> ../.agents/settings.json")
    print( "    ├── rules/        -> ../.agents/rules/")
    print( "    ├── hooks.json    -> ../.agents/hooks.json")
    print( "    └── hooks/        -> ../.agents/hooks/")
    print(f"  {t}/.codex/\n    ├── hooks.json    -> ../.agents/hooks.json")
    print( "    └── hooks/        -> ../.agents/hooks/")


def _detect_conflicts(target: Path, files: list[tuple[str, str, bool]]) -> list[str]:
    """Return list of file paths (relative) that already exist."""
    conflicts: list[str] = []
    for rel, _content, _additive in files:
        if (target / rel).exists():
            conflicts.append(rel)
    return conflicts


# ---------------------------------------------------------------------------
# actions
# ---------------------------------------------------------------------------

def _install_deps(target: Path) -> bool:
    """Run uv sync + pre-commit install."""
    if shutil.which("uv") is None:
        print("\n[!] 未检测到 uv, 跳过。装好后手动: uv sync && uv run pre-commit install")
        return False
    print("\n==> uv sync")
    if subprocess.run(["uv", "sync"], cwd=target, check=False).returncode != 0:
        print("[!] uv sync 失败")
        return False
    print("==> uv run pre-commit install")
    if subprocess.run(["uv", "run", "pre-commit", "install"], cwd=target, check=False).returncode != 0:
        print("[!] pre-commit install 失败")
        return False
    print("✓ 安装完成")
    return True


def _run_verify(target: Path) -> bool:
    """Run verify.sh script."""
    vp = target / "scripts" / "verify.sh"
    if not vp.exists():
        print("[!] scripts/verify.sh 不存在")
        return False
    print("\n==> 运行校验...")
    ok = subprocess.run(["bash", str(vp)], cwd=target, check=False).returncode == 0
    print("\n✓ ALL PASS" if ok else "\n✗ 校验失败，请检查上方输出")
    return ok


# ---------------------------------------------------------------------------
# main
# ---------------------------------------------------------------------------

def main() -> int:
    print("=" * 52)
    print("  AI Coding 强约束 脚手架 (交互式)")
    print("=" * 52)

    # ---- Step 1: Python version ----
    py_ver: str = _ask("\n[1/4] Python 版本?", "3.11")

    # ---- Step 2: Type checker ----
    checker_idx: int = _choose(
        "[2/4] 类型检查器?",
        ["mypy (稳, 默认)", "ty (Astral, Beta, 极速)"],
        0,
    )
    checker: str = "mypy" if checker_idx == 0 else "ty"

    # ---- Step 3: Target directory ----
    target_str: str = _ask("\n[3/4] 目标目录?", ".")
    target: Path = Path(target_str).resolve()

    # ---- Step 3.5: Python source directory ----
    print("\n    你的 .py 源码在哪个子目录? (比如 src/ 或 server/src/)")
    print("    check_arch + mypy 会只扫这个目录, 不扫 ref/ 参考项目等。")
    src_dir: str = _ask("    源码目录 (相对目标)?", ".")
    # 去掉多余的 ./ 前缀
    if src_dir.startswith("./"):
        src_dir = src_dir[2:]

    # ---- Build file map ----
    files: list[tuple[str, str, bool]] = build_files(checker, py_ver, src_dir)

    # ---- Step 4: Preview & confirm ----
    print(f"\n[4/4] 将在 {target} 创建以下文件 (源码目录: {src_dir}):\n")
    _show_file_tree(files, target)
    print()
    _show_symlink_summary(target)

    print("\n  ⚠ .claude/ 和 .codex/ 内的已有内容 (skills/commands/等) 不受影响。")

    if not _confirm("\n确认创建这些文件?"):
        print("已取消。")
        return 0

    # ---- Conflict detection ----
    conflicts: list[str] = _detect_conflicts(target, files)

    # Also check if .claude/ or .codex/ exist as whole-directory symlinks
    for d in [".claude", ".codex"]:
        p = target / d
        if p.is_symlink():
            conflicts.append(f"{d}/ (旧版目录链接, 将被替换为个体链接)")

    force: bool = False
    if conflicts:
        # 区分 merge 文件和覆盖文件
        merge_files: set[str] = {".gitignore", "pyproject.toml", ".pre-commit-config.yaml", "CLAUDE.md"}
        print(f"\n[!] 检测到 {len(conflicts)} 个冲突:")
        for c in conflicts:
            tag: str = " [合并模式]" if c in merge_files else ""
            print(f"  - {c}{tag}")

        conflict_choice: int = _choose(
            "如何处理冲突? (合并=只加缺失内容, 不删你的条目)",
            [
                "跳过已存在的 (保留你的文件)",
                "合并 (pyproject/gitignore 等仅追加缺失)",
                "备份后覆盖 (添加 .bak 后缀, 全量替换)",
                "取消安装",
            ],
            0,
        )

        if conflict_choice == 3:
            print("已取消。")
            return 0
        if conflict_choice == 1:
            force = True
        elif conflict_choice == 2:
            import time

            ts: str = time.strftime("%Y%m%d_%H%M%S")
            for rel in conflicts:
                p = target / rel
                if not p.exists():
                    continue
                backup_path = p.with_suffix(p.suffix + f".bak_{ts}")
                if p.is_symlink():
                    p.unlink()
                    print(f"  备份: {rel} (symlink) -> 已移除")
                else:
                    shutil.move(str(p), str(backup_path))
                    print(f"  备份: {rel} -> {backup_path}")

    # ---- Execute ----
    print("\n==> 创建文件中...")
    for rel, content, merge_mode in files:
        writer = write_smart if merge_mode else write_file
        writer(target / rel, content, force=force)

    # Create individual symlinks (not whole-directory)
    print("\n==> 创建链接...")
    create_file_symlinks(target, force=force)

    print("\n✓ 文件创建完成!")

    # ---- Post-install menu ----
    while True:
        choice: int = _choose(
            "下一步?",
            [
                "安装依赖 (uv sync + pre-commit install)",
                "校验 (运行 scripts/verify.sh)",
                "删除 (移除所有生成的文件)",
                "退出",
            ],
            3,
        )

        if choice == 0:
            _install_deps(target)
        elif choice == 1:
            _run_verify(target)
        elif choice == 2:
            if _confirm("\n确定要删除所有生成的文件? 此操作不可恢复!", default=False):
                print()
                delete_generated_files(target, files)
                print("\n✓ 已删除。")
                return 0
        else:
            print("\n提示 — 后续可手动执行:")
            print("  安装: uv sync && uv run pre-commit install")
            print("  校验: bash scripts/verify.sh")
            print("  (本脚本是一次性工具, 用完可删)")
            return 0


if __name__ == "__main__":
    sys.exit(main())
