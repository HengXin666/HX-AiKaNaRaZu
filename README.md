# HX-AiKaNaRaZu

AI Coding 强约束技能包。当前仓库以 `skills/hx-init` 为主入口，用来给目标项目安装 Claude/Codex 共享的 hooks、规则文档和工程校验配置。

## 用法

### 一次性安装

默认安装到当前项目的 `.codex/skills/hx-init`：

```bash
curl -fsSL https://raw.githubusercontent.com/HengXin666/HX-AiKaNaRaZu/main/install.sh | bash
```

安装全部 skill 到当前项目：

```bash
curl -fsSL https://raw.githubusercontent.com/HengXin666/HX-AiKaNaRaZu/main/install.sh | bash -s -- --all
git add .codex/skills
```

需要个人全局安装时显式加 `--global`：

```bash
curl -fsSL https://raw.githubusercontent.com/HengXin666/HX-AiKaNaRaZu/main/install.sh | bash -s -- --global
```

更新已有安装时显式加 `--force`，默认不会覆盖已有目录：

```bash
curl -fsSL https://raw.githubusercontent.com/HengXin666/HX-AiKaNaRaZu/main/install.sh | bash -s -- --force
```

安装 `hx-libs-sentaku`：

```bash
curl -fsSL https://raw.githubusercontent.com/HengXin666/HX-AiKaNaRaZu/main/install.sh | bash -s -- --skill hx-libs-sentaku
```

也可以使用简写：

```bash
curl -fsSL https://raw.githubusercontent.com/HengXin666/HX-AiKaNaRaZu/main/install.sh | bash -s -- hx-libs-sentaku
```

也可以基于 Git 本地安装：

```bash
git clone https://github.com/HengXin666/HX-AiKaNaRaZu.git
cd HX-AiKaNaRaZu
./install.sh
```

### 使用 skill

在 Codex 中对目标项目说：

```text
使用 hx-init 为当前项目配置强约束
```

`hx-init` 会先扫描当前目录，然后询问：

- 语言/框架：Python、React TS、Python + React
- 模式：初始化或改造
- Python 类型检查器：mypy、ty 或跳过

## 核心约束

- Python 路径保持纯新增：已存在文件不覆盖、不合并、不备份。
- Agent 配置强制使用真实文件：不创建 `.agents` / `.claude` / `.codex` 之间的软链接，已有配置由 AI 审阅后手动补充。
- React 路径采用审阅式安装：先读取已有配置，再决定新增、追加或跳过。
- 所有 shell hooks 写盘后需要 `chmod 755`。
- 安装记录写入 `.agents/.install-manifest.json`，用于后续精确卸载。

## 装进目标项目的内容

| 类别 | 内容 |
|---|---|
| Agent 入口 | `.agents/rules/*.md` |
| Claude/Codex hooks | `.claude/`、`.codex/`、`.agents/` 下按需写入实体文件；禁止软链，已有文件只审阅式补充 |
| 可选 Git hook | `commit-msg` 检查，要求提交信息形如 `[feat] add installer` |
| GitHub Actions | `.github/workflows/ci.yml` 或审阅式合并已有 workflow |
| Python 校验 | `pyproject.toml`、`.pre-commit-config.yaml`、`scripts/verify.sh`、`scripts/check_arch.py` |
| React 校验 | `lefthook.yml`、Biome/Prettier/TypeScript/Knip hooks 和规则 |

## 目录

```text
skills/
  hx-init/
    SKILL.md
    references/
      _shared/
      python/
      react/
  hx-libs-sentaku/
    SKILL.md
    references/
      db/
      py/
      react/
```

新增语言时，在 `skills/hx-init/references/` 下添加对应目录，并在 `skills/hx-init/SKILL.md` 中扩展识别和安装流程。
