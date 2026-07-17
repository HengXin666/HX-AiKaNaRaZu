# HX-AiKaNaRaZu

面向新项目和老项目的一键 AI Coding 工程能力包。用户只需要调用 `hx-skill-orchestrator`，它会自动探索仓库、理解业务并调度其余专业 Skill。

## 一键安装

在目标项目根目录执行：

```bash
curl -fsSL https://raw.githubusercontent.com/HengXin666/HX-AiKaNaRaZu/main/install.sh | bash
```

默认一次安装完整套件到 `.codex/skills/`。之后只需要告诉 Codex：

```text
使用 hx-skill-orchestrator 帮我完整配置这个项目
```

也可以更具体地说：

```text
使用 hx-skill-orchestrator 初始化这个新项目
使用 hx-skill-orchestrator 给这个老项目接入完整工程和测试体系
```

## 自动完成的工作

调度入口会自行完成：

1. 判断新项目初始化或老项目渐进接入。
2. 探索源码、文档、业务流程、权限、数据和外部依赖。
3. 保留老项目已有技术栈；新项目缺少选型时调用 `hx-libs-sentaku`。
4. 调用 `hx-init` 补齐最小工程约束、hooks、统一验证入口和 CI。
5. 调用 `hx-test-pipeline` 按实际业务风险设计单元、集成、E2E 和真实外部 canary。
6. 自动运行验证并修复本次引入的问题。

包管理器、测试框架、严格度和接入模式默认由 AI 根据仓库事实决定。只有需要凭证、不可逆操作、生产副作用或无法推断的业务方向时才询问用户。

## 设计原则

- 用户只接触一个调度入口，专业 Skill 在内部按需加载。
- 老项目复用已有工具并渐进接入，不强推大规模重构。
- 新项目使用严格但精简的默认方案。
- 测试围绕业务不变量、权限、失败恢复和外部契约，不机械追求覆盖率。
- 优先复用已有文件；缺少统一入口时才新增一个适配项目的验证脚本。
- 不覆盖用户已有配置，不自动提交或推送。

## 高级安装选项

```bash
./install.sh --global                        # 安装到个人 Codex 目录
./install.sh --force                         # 更新完整套件
./install.sh --skill hx-skill-orchestrator   # 仅安装单个 Skill
```

正常使用不需要选择单个 Skill；默认完整安装才能保证调度入口具备全部能力。

## Skill 组成

```text
skills/
  hx-skill-orchestrator/  # 唯一用户入口
  hx-libs-sentaku/        # 技术选型
  hx-init/                # 新项目初始化与老项目约束接入
  hx-test-pipeline/       # 业务专属分层测试体系
```
