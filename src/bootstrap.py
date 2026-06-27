"""交互式一键初始化「AI Coding 强约束」脚手架 (uv 版, 零第三方依赖).

核心承诺: **纯新增, 零副作用**。
    - 只创建不存在的文件/链接; 任何已存在的路径原样不动, 绝不覆盖/合并/备份。
    - 不产生任何 .bak 文件。
    - 安装写 .agents/.install-manifest.json, --uninstall 精确删除新建项 (因为从未改过别的)。

Usage:
    uv run python main.py                 # 交互模式 (推荐)
    uv run python main.py --dry-run       # 预览将新建什么, 不写盘
    uv run python main.py --non-interactive --python 3.11 --checker mypy --target . --src-dir src
    uv run python main.py --uninstall     # 删除本工具新建的文件
    uv run python main.py --clean-backups # 一键清理历史遗留的 *.bak_* 文件
"""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path

from impl._files import build_files, build_symlinks
from impl._install import (
    Action,
    FileSpec,
    SymlinkSpec,
    apply,
    clean_backups,
    plan,
    uninstall,
    write_manifest,
)

# ---------------------------------------------------------------------------
# interactive helpers
# ---------------------------------------------------------------------------


def _ask(msg: str, default: str = "") -> str:
    prompt = f"{msg} [{default}]: " if default else f"{msg}: "
    try:
        result: str = input(prompt).strip()
    except (EOFError, KeyboardInterrupt):
        print("\n取消。")
        sys.exit(0)
    return result or default


def _choose(msg: str, options: list[str], default_idx: int = 0) -> int:
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
    suffix: str = " [Y/n]: " if default else " [y/N]: "
    try:
        raw: str = input(f"{msg}{suffix}").strip().lower()
    except (EOFError, KeyboardInterrupt):
        print("\n取消。")
        sys.exit(0)
    return default if not raw else raw in ("y", "yes")


# ---------------------------------------------------------------------------
# display
# ---------------------------------------------------------------------------


def _show_plan(actions: list[Action]) -> None:
    create: list[Action] = [a for a in actions if a.kind == "create"]
    skip: list[Action] = [a for a in actions if a.kind == "skip"]
    if create:
        print("\n  【将新建】")
        for a in sorted(create, key=lambda x: x.rel):
            suffix = f" -> {a.symlink_target}" if a.is_symlink else ""
            print(f"    + {a.rel}{suffix}")
    if skip:
        print("\n  【已存在, 保留不动】")
        for a in sorted(skip, key=lambda x: x.rel):
            print(f"    = {a.rel}")


# ---------------------------------------------------------------------------
# post-install actions
# ---------------------------------------------------------------------------


def _install_deps(target: Path) -> bool:
    if shutil.which("uv") is None:
        print("\n[!] 未检测到 uv, 跳过。装好后手动: uv sync && uv run pre-commit install")
        return False
    print("\n==> uv sync")
    if subprocess.run(["uv", "sync"], cwd=target, check=False).returncode != 0:
        print("[!] uv sync 失败")
        return False
    print("==> uv run pre-commit install")
    if (
        subprocess.run(["uv", "run", "pre-commit", "install"], cwd=target, check=False).returncode
        != 0
    ):
        print("[!] pre-commit install 失败")
        return False
    print("✓ 安装完成")
    return True


def _run_verify(target: Path) -> bool:
    vp: Path = target / "scripts" / "verify.sh"
    if not vp.exists():
        print("[!] scripts/verify.sh 不存在")
        return False
    print("\n==> 运行校验...")
    ok: bool = subprocess.run(["bash", str(vp)], cwd=target, check=False).returncode == 0
    print("\n✓ ALL PASS" if ok else "\n✗ 校验失败, 请检查上方输出")
    return ok


# ---------------------------------------------------------------------------
# core install routine
# ---------------------------------------------------------------------------


def run_install(
    target: Path,
    files: list[FileSpec],
    symlinks: list[SymlinkSpec],
    *,
    dry_run: bool,
) -> None:
    actions: list[Action] = plan(target, files, symlinks)
    print(f"\n==> 安装计划 (target={target}{', dry-run' if dry_run else ''}, 纯新增/不动已有文件):")
    _show_plan(actions)
    print("\n==> 执行中..." if not dry_run else "\n==> [dry-run] 不会写入磁盘:")
    manifest = apply(target, actions, dry_run=dry_run)
    write_manifest(target, manifest, dry_run=dry_run)
    print(
        f"\n✓ 完成! 新建 {len(manifest.created)} 项, 未改动任何已有文件。"
        if not dry_run
        else "\n✓ dry-run 预览完成 (未改动任何文件)。"
    )


# ---------------------------------------------------------------------------
# headless entry
# ---------------------------------------------------------------------------


def _headless(args: argparse.Namespace) -> int:
    target: Path = Path(args.target).resolve()

    if args.clean_backups:
        clean_backups(target, dry_run=args.dry_run)
        return 0
    if args.uninstall:
        return 0 if uninstall(target, dry_run=args.dry_run) else 1

    src_dir: str = args.src_dir[2:] if args.src_dir.startswith("./") else args.src_dir
    files: list[FileSpec] = build_files(args.checker, args.python, src_dir)
    run_install(target, files, build_symlinks(), dry_run=args.dry_run)
    return 0


# ---------------------------------------------------------------------------
# interactive entry
# ---------------------------------------------------------------------------


def _interactive(args: argparse.Namespace) -> int:
    print("=" * 52)
    print("  AI Coding 强约束 脚手架 (交互式, 纯新增)")
    print("=" * 52)

    if args.clean_backups:
        target: Path = Path(_ask("\n清理哪个目录下的 .bak 备份?", ".")).resolve()
        clean_backups(target, dry_run=args.dry_run)
        return 0

    if args.uninstall:
        target = Path(_ask("\n卸载目标目录?", ".")).resolve()
        if not _confirm(f"\n删除 {target} 下本工具新建的所有文件?", default=False):
            print("已取消。")
            return 0
        return 0 if uninstall(target, dry_run=args.dry_run) else 1

    py_ver: str = _ask("\n[1/4] Python 版本?", "3.11")
    checker_idx: int = _choose(
        "[2/4] 类型检查器?", ["mypy (稳, 默认)", "ty (Astral, Beta, 极速)"], 0
    )
    checker: str = "mypy" if checker_idx == 0 else "ty"

    target = Path(_ask("\n[3/4] 目标目录?", ".")).resolve()

    print("\n    你的 .py 源码在哪个子目录? (比如 src/ 或 server/src/)")
    print("    check_arch + mypy 会只扫这个目录, 不扫 ref/ 参考项目等。")
    src_dir: str = _ask("    源码目录 (相对目标)?", ".")
    if src_dir.startswith("./"):
        src_dir = src_dir[2:]

    files: list[FileSpec] = build_files(checker, py_ver, src_dir)
    symlinks: list[SymlinkSpec] = build_symlinks()

    actions: list[Action] = plan(target, files, symlinks)
    print(f"\n[4/4] 计划在 {target} 执行 (源码目录: {src_dir}):")
    _show_plan(actions)
    print("\n  ✓ 纯新增: 已存在的文件/链接一律保留不动, 不覆盖、不合并、不备份。")

    if not _confirm("\n确认?"):
        print("已取消。")
        return 0

    run_install(target, files, symlinks, dry_run=args.dry_run)

    if args.dry_run:
        return 0

    while True:
        choice = _choose(
            "下一步?",
            [
                "安装依赖 (uv sync + pre-commit install)",
                "校验 (运行 scripts/verify.sh)",
                "卸载 (删除本工具新建的文件)",
                "退出",
            ],
            3,
        )
        if choice == 0:
            _install_deps(target)
        elif choice == 1:
            _run_verify(target)
        elif choice == 2:
            if _confirm("\n删除本工具新建的所有文件?", default=False):
                print()
                uninstall(target, dry_run=False)
                return 0
        else:
            print("\n提示 — 后续可手动执行:")
            print("  安装: uv sync && uv run pre-commit install")
            print("  校验: bash scripts/verify.sh")
            print("  卸载: uv run python main.py --uninstall")
            return 0


# ---------------------------------------------------------------------------
# main
# ---------------------------------------------------------------------------


def _build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="AI Coding 强约束脚手架 (纯新增, 零副作用)")
    p.add_argument("--dry-run", action="store_true", help="只打印计划, 不写盘")
    p.add_argument("--uninstall", action="store_true", help="删除本工具新建的文件")
    p.add_argument("--clean-backups", action="store_true", help="一键清理历史遗留的 *.bak_* 文件")
    p.add_argument(
        "--non-interactive", action="store_true", help="无头模式 (配合下方参数, 适合 CI/测试)"
    )
    p.add_argument("--python", default="3.11", help="Python 版本 (默认 3.11)")
    p.add_argument("--checker", choices=["mypy", "ty"], default="mypy", help="类型检查器")
    p.add_argument("--target", default=".", help="目标目录")
    p.add_argument("--src-dir", default=".", help="源码子目录 (check_arch/mypy 扫描范围)")
    return p


def main(argv: list[str] | None = None) -> int:
    args: argparse.Namespace = _build_parser().parse_args(argv)
    if args.non_interactive:
        return _headless(args)
    return _interactive(args)


if __name__ == "__main__":
    sys.exit(main())
