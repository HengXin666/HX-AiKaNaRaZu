"""Install engine — strictly additive, zero side effects.

Design (deliberately minimal, after the merge/backup/diff version proved too
fiddly and littered the tree with .bak files):

- **Only create what is missing.** If a target path already exists (real file,
  dir, or symlink), we leave it completely untouched and report "skip". We never
  overwrite, never merge, never back up. Installing can therefore not damage or
  even modify a single existing byte.
- **No .bak files, ever.** Nothing is copied aside, so nothing to clean up.
- **One-file manifest for clean uninstall.** ``.agents/.install-manifest.json``
  records only the paths we actually created, so uninstall deletes exactly those
  and nothing else — a true inverse of install.
- **Backup sweep.** ``clean_backups`` removes leftover ``*.bak_<时间戳>`` files
  written by the older version of this tool, in one command. The match is the
  exact timestamped signature only, so手工/第三方的 ``*.bak`` 源码文件不会被误删。
"""

from __future__ import annotations

import json
import os
import re
import shutil
from dataclasses import dataclass, field
from pathlib import Path

MANIFEST_REL: str = ".agents/.install-manifest.json"


# ---------------------------------------------------------------------------
# specs
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class FileSpec:
    """A file the tool wants to create (only if absent)."""

    rel: str
    content: str

    @property
    def executable(self) -> bool:
        return self.rel.endswith(".sh")


@dataclass(frozen=True)
class SymlinkSpec:
    """A symlink the tool wants to create (only if absent). Relative target."""

    rel: str
    target: str


@dataclass
class Action:
    """One planned step: create or skip. No mutation of existing paths ever."""

    rel: str
    kind: str  # "create" | "skip"
    is_symlink: bool = False
    symlink_target: str = ""
    content: str | None = None
    executable: bool = False
    reason: str = ""


@dataclass
class Manifest:
    """Exactly what install created — enough for a clean, exact uninstall."""

    created: list[str] = field(default_factory=list)

    def to_json(self) -> str:
        return json.dumps({"created": self.created}, ensure_ascii=False, indent=2)

    @staticmethod
    def from_json(text: str) -> Manifest:
        raw: dict[str, object] = json.loads(text)
        value = raw.get("created")
        created = [str(x) for x in value] if isinstance(value, list) else []
        # Back-compat: older manifests also tracked symlinks/modified separately.
        for key in ("symlinks", "modified"):
            extra = raw.get(key)
            if isinstance(extra, list):
                for item in extra:
                    if isinstance(item, dict) and "rel" in item:
                        created.append(str(item["rel"]))
        m = Manifest()
        m.created = created
        return m


# ---------------------------------------------------------------------------
# planning (pure: reads disk, writes nothing)
# ---------------------------------------------------------------------------


def plan_file(target: Path, spec: FileSpec) -> Action:
    path: Path = target / spec.rel
    if path.exists() or path.is_symlink():
        return Action(spec.rel, "skip", reason="已存在, 保留不动")
    return Action(spec.rel, "create", content=spec.content, executable=spec.executable)


def plan_symlink(target: Path, spec: SymlinkSpec) -> Action:
    path: Path = target / spec.rel
    if path.is_symlink() and os.readlink(path) == spec.target:
        return Action(
            spec.rel, "skip", is_symlink=True, symlink_target=spec.target, reason="链接已就位"
        )
    if os.path.lexists(path):
        return Action(
            spec.rel, "skip", is_symlink=True, symlink_target=spec.target, reason="已存在, 保留不动"
        )
    return Action(spec.rel, "create", is_symlink=True, symlink_target=spec.target)


def plan(target: Path, files: list[FileSpec], symlinks: list[SymlinkSpec]) -> list[Action]:
    return [plan_file(target, f) for f in files] + [plan_symlink(target, s) for s in symlinks]


# ---------------------------------------------------------------------------
# apply
# ---------------------------------------------------------------------------


def apply(target: Path, actions: list[Action], *, dry_run: bool) -> Manifest:
    """Create the missing files/symlinks; never touch existing paths."""
    manifest = Manifest()
    for a in actions:
        if a.kind == "skip":
            print(f"  跳过: {a.rel}  ({a.reason})")
            continue

        path: Path = target / a.rel
        if a.is_symlink:
            if dry_run:
                print(f"  [dry-run] 链接: {a.rel} -> {a.symlink_target}")
            else:
                path.parent.mkdir(parents=True, exist_ok=True)
                path.symlink_to(a.symlink_target)
                print(f"  链接: {a.rel} -> {a.symlink_target}")
        elif dry_run:
            print(f"  [dry-run] 新建: {a.rel}")
        else:
            assert a.content is not None
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(a.content, encoding="utf-8")
            if a.executable:
                path.chmod(0o755)
            print(f"  新建: {a.rel}")
        manifest.created.append(a.rel)
    return manifest


# ---------------------------------------------------------------------------
# manifest
# ---------------------------------------------------------------------------


def write_manifest(target: Path, manifest: Manifest, *, dry_run: bool) -> None:
    if not manifest.created:
        return
    if dry_run:
        print(f"  [dry-run] 写清单: {MANIFEST_REL}")
        return
    path: Path = target / MANIFEST_REL
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(manifest.to_json(), encoding="utf-8")
    print(f"  清单: {MANIFEST_REL}")


def read_manifest(target: Path) -> Manifest | None:
    path: Path = target / MANIFEST_REL
    if not path.is_file():
        return None
    return Manifest.from_json(path.read_text(encoding="utf-8"))


# ---------------------------------------------------------------------------
# uninstall — delete exactly what we created (nothing was ever modified)
# ---------------------------------------------------------------------------


def uninstall(target: Path, *, dry_run: bool) -> bool:
    manifest: Manifest | None = read_manifest(target)
    if manifest is None:
        print(f"[!] 未找到安装清单 {MANIFEST_REL}, 无可卸载。")
        return False

    # Delete created paths. Deepest first so dirs empty out naturally.
    for rel in sorted(set(manifest.created), key=len, reverse=True):
        path: Path = target / rel
        if dry_run:
            if path.is_symlink() or path.exists():
                print(f"  [dry-run] 删除: {rel}")
            continue
        if path.is_symlink() or path.is_file():
            path.unlink()
            print(f"  删除: {rel}")
        elif path.is_dir():
            shutil.rmtree(path)
            print(f"  删除: {rel}/")

    if dry_run:
        print(f"  [dry-run] 删除清单: {MANIFEST_REL}")
    else:
        mpath: Path = target / MANIFEST_REL
        if mpath.is_file():
            mpath.unlink()
    _prune_empty_dirs(target, dry_run=dry_run)
    print("\n✓ 已删除所有由本工具新建的文件。" if not dry_run else "\n[dry-run] 卸载预览完成。")
    return True


def _prune_empty_dirs(target: Path, *, dry_run: bool) -> None:
    candidates: list[str] = [
        ".agents/rules",
        ".agents/hooks",
        ".agents",
        ".claude",
        ".codex",
        "scripts",
        ".github/workflows",
        ".github",
    ]
    for rel in candidates:
        p: Path = target / rel
        if p.is_dir() and not p.is_symlink():
            try:
                if not list(p.iterdir()):
                    if dry_run:
                        print(f"  [dry-run] 删空目录: {rel}/")
                    else:
                        p.rmdir()
                        print(f"  删除: {rel}/ (空目录)")
            except OSError:
                pass


# ---------------------------------------------------------------------------
# backup sweep — clean up .bak litter left by the older tool version
# ---------------------------------------------------------------------------

_BACKUP_SKIP_DIRS: frozenset[str] = frozenset(
    {".git", ".venv", "venv", "node_modules", "__pycache__", ".mypy_cache", ".ruff_cache"}
)

# 旧版本安装器备份命名为 ``<name>.bak_<YYYYMMDD>_<HHMMSS>``。
# 只匹配这个精确签名, 避免误删源码树里手工/第三方的 ``*.bak`` 文件。
_BACKUP_SUFFIX_RE = re.compile(r"\.bak_\d{8}_\d{6}$")


def find_backups(target: Path) -> list[Path]:
    """Find only this tool's own timestamped backups (``*.bak_<ts>``), skipping vcs/venv."""
    found: list[Path] = []
    for root, dirs, files in os.walk(target):
        dirs[:] = [d for d in dirs if d not in _BACKUP_SKIP_DIRS]
        root_path = Path(root)
        for name in (*dirs, *files):
            if _BACKUP_SUFFIX_RE.search(name):
                found.append(root_path / name)
    return sorted(set(found))


def clean_backups(target: Path, *, dry_run: bool) -> int:
    """Delete leftover .bak files in one sweep. Returns how many were removed."""
    backups: list[Path] = find_backups(target)
    if not backups:
        print("没有发现 .bak 备份文件, 无需清理。")
        return 0
    for p in backups:
        rel = p.relative_to(target)
        if dry_run:
            print(f"  [dry-run] 删除备份: {rel}")
            continue
        if p.is_dir() and not p.is_symlink():
            shutil.rmtree(p)
        else:
            p.unlink()
        print(f"  删除备份: {rel}")
    verb = "可删除" if dry_run else "已删除"
    print(f"\n✓ {verb} {len(backups)} 个 .bak 备份。")
    return len(backups)
