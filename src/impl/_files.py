"""Build the file/symlink specs for a target project.

Pure assembly only — actual writing, manifest and uninstall live in
``_install.py``. Install is strictly additive: a spec whose path already exists
is skipped untouched, so there is no merge/overwrite/backup concept here.
"""

from __future__ import annotations

from pathlib import Path

from ._install import FileSpec, SymlinkSpec


def content_root() -> Path:
    """Path to the content/ directory (externalized templates/docs)."""
    return Path(__file__).resolve().parent.parent / "content"


def read_content(rel: str) -> str:
    """Read a content file from the content/ directory."""
    return (content_root() / rel).read_text(encoding="utf-8")


def build_files(checker: str, py_ver: str, src_dir: str = ".") -> list[FileSpec]:
    """Assemble the complete file spec list for a target project."""
    from ._templates import (
        ci_yml_template,
        precommit_template,
        pyproject_template,
        verify_sh_template,
    )

    fmt_hook: str = read_content("hooks/format_after_edit.sh")
    verify_hook: str = read_content("hooks/verify_before_stop.sh")

    return [
        FileSpec("pyproject.toml", pyproject_template(checker, py_ver, src_dir)),
        FileSpec(".pre-commit-config.yaml", precommit_template(checker, src_dir)),
        FileSpec(".gitignore", read_content(".gitignore")),
        FileSpec("CLAUDE.md", read_content("CLAUDE.md")),
        FileSpec(".agents/rules/architecture.md", read_content("rules/architecture.md")),
        FileSpec(".agents/rules/naming.md", read_content("rules/naming.md")),
        FileSpec(
            ".agents/rules/react-architecture.md", read_content("rules/react-architecture.md")
        ),
        FileSpec(".agents/rules/react-ts-naming.md", read_content("rules/react-ts-naming.md")),
        FileSpec(".agents/settings.json", read_content("claude_settings.json")),
        FileSpec(".agents/hooks.json", read_content("codex_hooks.json")),
        FileSpec(".agents/hooks/format_after_edit.sh", fmt_hook),
        FileSpec(".agents/hooks/verify_before_stop.sh", verify_hook),
        FileSpec("scripts/verify.sh", verify_sh_template(checker, src_dir)),
        FileSpec("scripts/check_arch.py", read_content("check_arch.py")),
        FileSpec(".github/workflows/ci.yml", ci_yml_template(checker, py_ver)),
    ]


# Individual symlinks inside .claude/ and .codex/ pointing at the shared .agents/.
# Kept as individual links (not whole-dir) so a user's existing skills/commands
# under .claude/ are never shadowed.
def build_symlinks() -> list[SymlinkSpec]:
    return [
        SymlinkSpec("AGENTS.md", "CLAUDE.md"),
        SymlinkSpec(".claude/settings.json", "../.agents/settings.json"),
        SymlinkSpec(".claude/rules", "../.agents/rules"),
        SymlinkSpec(".claude/hooks.json", "../.agents/hooks.json"),
        SymlinkSpec(".claude/hooks", "../.agents/hooks"),
        SymlinkSpec(".codex/hooks.json", "../.agents/hooks.json"),
        SymlinkSpec(".codex/hooks", "../.agents/hooks"),
    ]
