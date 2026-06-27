"""脚手架安装引擎测试 — 验证「纯新增, 零副作用」契约。

不依赖 uv / 真实工程: 全部在 tmp 目录里跑 plan→apply→uninstall。

运行:
    cd ref/HX-AiKaNaRaZu && python -m unittest discover -s tests -v
"""

from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path

_SRC: Path = Path(__file__).resolve().parent.parent / "src"
sys.path.insert(0, str(_SRC))

from impl._files import build_files, build_symlinks  # noqa: E402
from impl._install import (  # noqa: E402
    apply,
    clean_backups,
    find_backups,
    plan,
    read_manifest,
    uninstall,
    write_manifest,
)


def _install(target: Path, *, dry_run: bool = False) -> None:
    files = build_files("mypy", "3.11", "src")
    symlinks = build_symlinks()
    actions = plan(target, files, symlinks)
    manifest = apply(target, actions, dry_run=dry_run)
    write_manifest(target, manifest, dry_run=dry_run)


class AdditiveContractTests(unittest.TestCase):
    """安装只新建缺失文件, 已存在的一律原样不动。"""

    def test_existing_files_are_never_modified(self) -> None:
        with tempfile.TemporaryDirectory() as d:
            t = Path(d)
            (t / ".claude").mkdir()
            originals = {
                ".pre-commit-config.yaml": "repos: []\n",
                ".gitignore": "node_modules/\n",
                "pyproject.toml": '[project]\nname = "mine"\n',
                "CLAUDE.md": "# 我的文档\n",
                ".claude/settings.json": '{"mine": true}',
            }
            for rel, content in originals.items():
                (t / rel).write_text(content, encoding="utf-8")

            _install(t)

            # every pre-existing file is byte-for-byte unchanged
            for rel, content in originals.items():
                self.assertEqual((t / rel).read_text(encoding="utf-8"), content, rel)

    def test_no_bak_files_ever_created(self) -> None:
        with tempfile.TemporaryDirectory() as d:
            t = Path(d)
            (t / ".gitignore").write_text("x\n", encoding="utf-8")
            (t / "pyproject.toml").write_text("[project]\n", encoding="utf-8")
            _install(t)
            self.assertEqual(find_backups(t), [], "install must not create any .bak files")

    def test_real_claude_settings_left_alone(self) -> None:
        with tempfile.TemporaryDirectory() as d:
            t = Path(d)
            (t / ".claude").mkdir()
            (t / ".claude/settings.json").write_text('{"mine": 1}', encoding="utf-8")
            _install(t)
            # not replaced by a symlink, content intact
            self.assertFalse((t / ".claude/settings.json").is_symlink())
            self.assertEqual(
                (t / ".claude/settings.json").read_text(encoding="utf-8"), '{"mine": 1}'
            )

    def test_fresh_install_creates_expected_files(self) -> None:
        with tempfile.TemporaryDirectory() as d:
            t = Path(d)
            _install(t)
            self.assertTrue((t / "pyproject.toml").is_file())
            self.assertTrue((t / ".pre-commit-config.yaml").is_file())
            self.assertTrue((t / ".claude/settings.json").is_symlink())
            self.assertTrue((t / "AGENTS.md").is_symlink())


class DryRunTests(unittest.TestCase):
    def test_dry_run_writes_nothing(self) -> None:
        with tempfile.TemporaryDirectory() as d:
            t = Path(d)
            _install(t, dry_run=True)
            self.assertEqual(list(t.iterdir()), [])
            self.assertIsNone(read_manifest(t))


class RoundTripTests(unittest.TestCase):
    def test_install_uninstall_is_exact_inverse(self) -> None:
        with tempfile.TemporaryDirectory() as d:
            t = Path(d)
            (t / ".claude").mkdir()
            (t / ".claude/settings.json").write_text("{}", encoding="utf-8")
            before = {p.name for p in t.rglob("*")}

            _install(t)
            uninstall(t, dry_run=False)

            after = {p.name for p in t.rglob("*")}
            # uninstall removed exactly what install added; user's file remains
            self.assertEqual(before, after)
            self.assertTrue((t / ".claude/settings.json").is_file())

    def test_uninstall_without_manifest_is_noop(self) -> None:
        with tempfile.TemporaryDirectory() as d:
            t = Path(d)
            (t / "keep.txt").write_text("x", encoding="utf-8")
            self.assertFalse(uninstall(t, dry_run=False))
            self.assertTrue((t / "keep.txt").exists())


class BackupSweepTests(unittest.TestCase):
    """清理历史遗留的 .bak 文件 (仅本工具自己的 ``*.bak_<时间戳>``)。"""

    def test_clean_backups_removes_only_timestamped_backups(self) -> None:
        with tempfile.TemporaryDirectory() as d:
            t = Path(d)
            (t / ".pre-commit-config.yaml.bak_20260627_001122").write_text("old", encoding="utf-8")
            (t / ".claude").mkdir()
            (t / ".claude/settings.json.bak_20260101_235959").write_text("old", encoding="utf-8")
            (t / "keep.py").write_text("x", encoding="utf-8")

            removed = clean_backups(t, dry_run=False)

            self.assertEqual(removed, 2)
            self.assertTrue((t / "keep.py").exists())
            self.assertEqual(find_backups(t), [])

    def test_clean_backups_spares_foreign_bak_files(self) -> None:
        # 源码树/第三方的 .bak 不带本工具的时间戳签名, 必须原封不动。
        with tempfile.TemporaryDirectory() as d:
            t = Path(d)
            (t / "vendored.cpp.bak").write_text("src", encoding="utf-8")
            (t / "data.txt.bak").write_text("src", encoding="utf-8")
            (t / "half.bak_20260627").write_text("src", encoding="utf-8")  # 缺 _HHMMSS

            self.assertEqual(find_backups(t), [])
            self.assertEqual(clean_backups(t, dry_run=False), 0)
            self.assertTrue((t / "vendored.cpp.bak").exists())
            self.assertTrue((t / "data.txt.bak").exists())
            self.assertTrue((t / "half.bak_20260627").exists())

    def test_clean_backups_dry_run_keeps_files(self) -> None:
        with tempfile.TemporaryDirectory() as d:
            t = Path(d)
            bak = t / "x.bak_20260101_010101"
            bak.write_text("old", encoding="utf-8")
            clean_backups(t, dry_run=True)
            self.assertTrue(bak.exists())

    def test_clean_backups_skips_git_dir(self) -> None:
        with tempfile.TemporaryDirectory() as d:
            t = Path(d)
            (t / ".git").mkdir()
            (t / ".git" / "obj.bak_20260101_010101").write_text("x", encoding="utf-8")
            self.assertEqual(find_backups(t), [])


if __name__ == "__main__":
    unittest.main()
