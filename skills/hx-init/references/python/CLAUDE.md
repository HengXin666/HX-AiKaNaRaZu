# AI Coding 强约束

## 0. 黄金工作流 (Explore -> Plan -> Code -> Commit)
1. Explore: 先只读不改, 定位+理解再动手。
2. Plan: 复杂任务先输出实现计划 (改哪些文件、为什么)。
3. Code: 按计划编码。
4. Verify: 结束前运行项目约定校验; Stop hook 会给摘要和日志路径。

## 1. 默认约束范围
- 默认只要求本次新增/修改代码符合规则, 不追完整历史债。
- 只有项目明确启用 strict 时, 才把架构/类型/命名规则作为全仓硬门禁。
- 单 .py 文件建议 <= 300 行; 超出优先拆分或下沉 impl/。
- 新增/修改函数、返回值、关键变量应补类型标注。
- 公开文件避免新增 _ 开头函数; 私有逻辑优先放 impl/。
- 禁止新增中文/非ASCII 标识符: 变量/函数/类/参数/文件名用英文 (中文注释、字符串 OK)。
  若你正打算写 def 计算金额() -- 停下, 这是幻觉, 改成 def calc_amount()。
- 避免浅模块(碎片化小文件), 优先深模块(简单接口 + impl 复杂内核)。

## 2. 目录分层
- api/           按"前端页面"划分子文件夹
- server/        按"业务"划分; impl/ 放私有实现
- models/        按"数据表"划分
- config/const/  所有常量按业务声明
- utils/         所有通用方法按功能实现
详细规则+反例见 .claude/rules/architecture.md 与 .claude/rules/naming.md。
React TS 项目额外规则见 .claude/rules/react-architecture.md 与 .claude/rules/react-ts-naming.md。

- 代码和工程文档优先用纯文本表达, 避免新增无语义文本表情符号。

## 3. 验证闭环
任何改动后运行:
    bash scripts/verify.sh
若失败, 先看 Stop hook 摘要; 只按需读取日志片段, 不粘贴全量日志。

## 4. 初始化避坑
不要自动对全仓库做格式化或空白清理。只处理本次任务触及的文件; 全仓格式化必须单独征得用户确认。
