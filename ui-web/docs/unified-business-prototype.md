# UI 库统一业务原型规范

状态：`draft-for-review`

本阶段只确定统一业务场景、页面布局、交互合同和验收基线，不继续实现页面，也不在此阶段决定新增哪些 UI 库。

## 1. 原型目标

评测站不再展示“组件目录”，而是展示同一套真实产品在不同 UI 库下的完整实现。

统一产品暂定名：`BiliOps Workspace`。

它是一套面向内容平台运营团队的企业工作台，包含四个业务模块：

1. 企业数据总览：以 B 站视频平台业务为主题。
2. 中转站额度配置：管理线路、节点、团队和用户额度。
3. 社区：用户发帖、评论、互动和内容治理。
4. 设置：组织、安全、通知、集成和危险操作。

比较原则：

```text
固定：信息架构、数据、文案、交互、状态、图表类型、断点、验收任务。
变化：UI 库的组件、视觉语言、动效、密度、焦点表现和交互质感。
```

不允许某个 UI 库通过删除复杂功能来获得更整洁的页面，也不允许为某个库单独改变布局。

## 2. 用户与业务上下文

主要角色：

- 运营负责人：查看视频、用户、收入和活动数据。
- 中转站管理员：分配组织额度、设置预警和节点路由。
- 社区运营：发布内容、回复用户、处理举报。
- 组织管理员：管理成员、权限、安全策略和第三方集成。

统一演示组织：`星轨内容科技`。

统一时间范围：`最近 30 天`。

统一演示数据规模：

- 1,284 个视频。
- 3,812,640 次播放。
- 286,430 个活跃用户。
- 12 个中转节点。
- 28 个团队额度池。
- 18,492 个社区帖子。
- 126 个组织成员。

## 3. 全局业务壳

### 3.1 桌面布局

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Logo / Workspace   全局搜索 ⌘K          创建 +   消息   主题   用户菜单     │ 64
├───────────────┬─────────────────────────────────────────────────────────────┤
│               │ Breadcrumb / 环境状态 / 最近同步                           │
│  企业数据总览 │                                                             │
│  中转站额度   │ Page title + description                 page actions       │
│  社区         │ ─────────────────────────────────────────────────────────── │
│  设置         │                                                             │
│               │ 页面内容：12-column grid                                   │
│  ───────────  │                                                             │
│  帮助与文档   │                                                             │
│  系统状态     │                                                             │
│               │                                                             │
│ 当前 UI 库    │                                                             │
│ [Library ▾]   │                                                             │
└───────────────┴─────────────────────────────────────────────────────────────┘
      248px                         fluid content
```

尺寸合同：

| 区域 | 桌面尺寸 | 行为 |
| --- | --- | --- |
| 顶部栏 | 高 64px | 固定顶部，含全局搜索、创建菜单、消息、主题和账户菜单 |
| 左侧栏 | 宽 248px | 固定；可折叠到 72px；当前模块保持高亮 |
| 内容区 | 最大宽 1600px | 12 列网格，列间距 20px，页面内边距 28px |
| 右侧详情抽屉 | 420px | 图表点、表格行、帖子详情和配置操作统一从右侧进入 |
| 对话框 | 560px / 760px | 只用于需要明确确认或多步骤操作的任务 |

### 3.2 响应式

- `>= 1280px`：完整顶部栏、248px 左侧栏、12 列内容区。
- `768px ~ 1279px`：左侧栏折叠到 72px，图表从双列变单列。
- `< 768px`：左侧栏变 Drawer；顶部搜索变图标；表格允许横向滚动或卡片化，但字段和操作不能减少。

### 3.3 顶部栏固定功能

所有 UI 库必须实现完全相同的顶部栏功能：

- Workspace Switcher。
- 全局搜索 / Command Palette。
- `创建` Dropdown：上传视频、配置额度、发布帖子、邀请成员。
- 消息 Popover，含未读徽标。
- 白天 / 黑夜模式。
- 用户菜单：个人资料、账户安全、退出。

### 3.4 左侧栏固定功能

- 一级导航及 tooltip。
- 展开 / 收起。
- 未读数和异常徽标。
- 当前 UI 库选择器。
- 系统状态入口。
- 键盘焦点和 active 状态。

## 4. 统一页面骨架

四个页面必须尽量使用相同的垂直节奏：

```text
PageHeader
  ├─ Breadcrumb + sync status
  ├─ Title + description
  └─ Primary / secondary actions

ContextToolbar
  ├─ Date range / search
  ├─ Filters / saved view
  └─ Refresh / export / more menu

SummaryRow
  └─ 4 个 KPI Card，均包含趋势、tooltip 和 sparkline

PrimaryInsight
  ├─ 8-column 主图表
  └─ 4-column 次图表或状态面板

SecondaryInsight
  ├─ 4-column 图表
  ├─ 4-column 图表
  └─ 4-column 图表

DataWorkspace
  └─ Table / Feed / Settings form

DetailDrawer / Dialog / Toast
```

KPI、图表和表格不能只是静态插图。每个数据区域必须提供 loading、normal、empty、error 和 refreshing 状态。

## 5. 页面一：企业数据总览

### 5.1 业务任务

运营负责人需要回答：平台是否增长、增长来自哪里、哪些内容异常、接下来应该处理什么。

### 5.2 布局原型

```text
┌ 企业数据总览 ───────────────────────────── [生成报告] [导出 ▾] ┐
│ 最近同步 2 分钟前       [近 30 天 ▾] [全站 ▾] [对比上周期]     │
├────────────┬────────────┬────────────┬────────────┤
│ 总播放量   │ 活跃用户   │ 新增粉丝   │ 预估收入   │  KPI + sparkline
├──────────────────────────────────┬─────────────────┤
│ 播放与互动趋势                   │ 流量来源        │
│ Area + Line + brush              │ Donut + legend  │
├─────────────────┬────────────────┬─────────────────┤
│ 分区表现        │ 发布时间热力图 │ 用户留存漏斗    │
│ Stacked Bar     │ Heatmap        │ Funnel          │
├────────────────────────────────────────────────────┤
│ 视频表现 Table：封面 / 标题 / UP 主 / 播放 / 完播 / 异常 / 操作│
└────────────────────────────────────────────────────┘
```

### 5.3 图表与精细交互

至少包含五种数据表达：

1. KPI Sparkline：hover 显示当天值；点击进入对应指标筛选。
2. 播放与互动趋势：播放、点赞、投币三条序列；legend 可隐藏；crosshair；范围 brush；异常点标记。
3. 流量来源 Donut：首页推荐、搜索、关注、外链；hover 联动中心数字。
4. 分区表现 Stacked Bar：动画、游戏、知识、生活；支持绝对值 / 占比切换。
5. 发布时间 Heatmap：星期 × 小时；hover tooltip；点击过滤视频表格。
6. 用户留存 Funnel：曝光、播放、互动、关注；点击阶段打开解释 Popover。

精细交互：

- 点击趋势异常点打开右侧 Drawer，展示当日内容和来源拆解。
- 表格支持排序、筛选、行选择、列显隐、密度切换和分页。
- 行 hover 显示快捷操作；更多菜单包含查看、比较、标记异常。
- 刷新期间保留旧数据并显示非阻塞 refreshing 状态。

## 6. 页面二：中转站额度配置

### 6.1 业务任务

管理员需要了解总额度、节点健康度、团队消耗和未来风险，并安全地调整额度。

### 6.2 布局原型

```text
┌ 中转站额度配置 ───────────────────────────── [新增额度池]      ┐
│ [全部区域 ▾] [全部节点 ▾] [仅显示预警]      [规则说明] [刷新]  │
├────────────┬────────────┬────────────┬────────────┤
│ 总额度     │ 已分配     │ 今日消耗   │ 预警团队   │
├──────────────────────────────────┬─────────────────┤
│ 额度消耗与预测                   │ 总池使用率      │
│ Area + forecast band             │ Radial Gauge    │
├─────────────────┬────────────────┬─────────────────┤
│ 团队额度分布    │ 节点延迟/成功率│ 预警时间线      │
│ Stacked Bar     │ Scatter        │ Timeline        │
├────────────────────────────────────────────────────┤
│ 额度池 Table：团队 / 总额 / 已用 / 阈值 / 路由 / 状态 / 操作   │
└────────────────────────────────────────────────────┘
```

### 6.3 配置抽屉

点击新增或编辑后打开统一 420px Drawer：

```text
额度池名称        Input
适用团队          Combobox（支持搜索和多选）
结算周期          RadioGroup（日 / 月 / 自定义）
总额度            NumberField + 单位 Select
预警阈值          Slider + NumberField
节点路由          Select
溢出策略          RadioGroup（拒绝 / 借用公共池 / 降级）
自动续期          Switch
高级限制          Accordion
                  [取消] [保存配置]
```

精细交互：

- Slider 与 NumberField 双向联动。
- 总额度小于已用额度时，字段错误立即出现并禁止保存。
- 选择“自定义周期”后渐进显示日期范围控件。
- 保存前若影响在线任务，显示确认 Dialog 和影响摘要。
- 表格支持行内调整阈值；保存成功更新图表并显示 success message。

## 7. 页面三：社区用户发帖与发言

### 7.1 业务任务

社区运营需要发布帖子、回复用户、观察话题趋势并处理风险内容。

### 7.2 布局原型

```text
┌ 社区 ─────────────────────────────────────── [发布帖子]       ┐
│ [全部内容] [待处理 18] [我的草稿 3]   [搜索] [话题 ▾] [排序 ▾]│
├──────────────────────────────────┬─────────────────┤
│ Composer / Feed（8 columns）     │ 社区健康度      │
│                                  │ Radial + stats  │
│ Post Card                        ├─────────────────┤
│  ├ 用户 / 时间 / 更多菜单       │ 发帖趋势 Line   │
│  ├ 正文 / 图片 / 视频           ├─────────────────┤
│  ├ 点赞 / 回复 / 收藏 / 分享    │ 话题 Donut      │
│  └ Inline comments              ├─────────────────┤
│                                  │ 活跃 Heatmap     │
├──────────────────────────────────┴─────────────────┤
│ 举报与治理 Table：内容 / 原因 / 风险 / 举报数 / 处理人 / 操作  │
└────────────────────────────────────────────────────┘
```

### 7.3 Composer

- 用户身份 Select。
- 标题 Input。
- Markdown / Rich Text Tabs。
- 正文编辑器。
- 图片、视频、投票、话题 Popover。
- 可见范围 RadioGroup。
- 允许评论 Switch。
- 保存草稿 / 预览 / 发布按钮。
- 上传进度、字符计数和违规词提示。

精细交互：

- 点赞使用乐观更新；失败时回滚并展示 `msg`。
- 回复在帖子内展开；超过三条后进入 Drawer。
- 删除必须使用确认 Dialog，不得使用浏览器 confirm。
- 举报表格支持批量选择、分配处理人和处理状态 Dropdown。
- Feed 提供 skeleton、空状态、加载更多和单条失败重试。

## 8. 页面四：复杂设置

### 8.1 业务任务

组织管理员需要完成组织、成员、权限、安全、通知、账单和集成配置，并理解修改影响。

### 8.2 布局原型

```text
┌ 设置 ─────────────────────────────────────── [查看审计日志]   ┐
│ [搜索设置…]                                                    │
├───────────────┬───────────────────────────────────────────────┤
│ 组织资料      │ Section header + description                  │
│ 成员与角色    │                                               │
│ 权限策略      │ Form fields                                   │
│ 安全          │ Cards / controls / inline help                │
│ 通知          │                                               │
│ 集成          │ ───────────────────────────────────────────── │
│ API 与 Webhook│ Sticky dirty-state save bar                   │
│ 账单          │                         [放弃更改] [保存设置]  │
│ 危险区域      │                                               │
└───────────────┴───────────────────────────────────────────────┘
```

### 8.3 必须展示的复杂控件

- Settings 子导航与搜索过滤。
- Tabs：常规 / 品牌 / 域名。
- Avatar Upload 和裁剪 Dialog。
- Input、Textarea、Select、Combobox、RadioGroup、CheckboxGroup、Switch。
- 权限矩阵 Table，支持全选、部分选中和 disabled 单元格。
- 安全分数 Radial、登录活动 Histogram、API 使用量 Area Chart。
- Session List、API Key List、Webhook Table。
- Accordion 展示高级策略。
- Sticky Save Bar 处理 dirty、saving、saved、error。
- 危险操作 Dialog 要求输入组织名称确认。

精细交互：

- 离开 dirty 页面前显示阻止导航 Dialog。
- 域名验证为异步状态：checking / verified / failed。
- Webhook 测试显示请求耗时、HTTP 状态和响应 `msg`。
- 权限冲突在矩阵下方显示 inline alert，并可跳转到冲突项。
- API Key 创建成功后只展示一次 secret，并支持复制反馈。

## 9. 图表统一合同

UI 库没有图表组件时，不允许悄悄引入第二套成品 UI 库。

允许共享无视觉的图表计算能力，例如 scale、path、layout 和数据聚合；以下部分必须由当前 UI 体系实现：

- Chart Card。
- Tooltip / Popover。
- Legend 和开关。
- Date Range / Segment Control。
- Empty / Error / Loading。
- Drill-down Drawer。
- 色彩、圆角、字体、网格和动效。

每个图表至少具备：

```text
hover tooltip
keyboard reachable summary
legend toggle
loading skeleton
empty state
error state with retry
responsive resize
reduced-motion support
```

主趋势图额外要求 crosshair、brush/zoom、异常点和点击下钻。

## 10. 错误 `msg` 合同

所有查询和操作使用同一错误结构：

```ts
type AppError = {
  code: string;
  msg: string;
  fieldErrors?: Record<string, string>;
  requestId?: string;
  retryable: boolean;
};
```

硬性规则：

- 接口失败必须展示 `error.msg`，不能只显示“操作失败”。
- 禁止直接渲染 Error 对象、状态码或 `[object Object]`。
- 字段错误优先显示在字段下方，同时保留表单级 `msg`。
- mutation 失败使用 Toast / Message；区块查询失败使用 Inline Alert；页面关键查询失败使用 Page Error。
- 可重试错误显示“重试”；不可重试错误显示下一步处理方式。
- 有 `requestId` 时在错误详情或复制按钮中提供，不占据主文案。

固定演示错误：

| 场景 | code | msg |
| --- | --- | --- |
| 数据总览加载失败 | `DASHBOARD_TIMEOUT` | `数据服务响应超时，请稍后重试。` |
| 额度不足 | `QUOTA_BELOW_USAGE` | `新额度不能低于当前已使用额度 8,420 GB。` |
| 帖子发布失败 | `POST_REJECTED` | `内容包含受限词“内部接口”，请修改后重新发布。` |
| 设置保存冲突 | `SETTINGS_VERSION_CONFLICT` | `设置已被另一位管理员更新，请刷新后重新提交。` |

## 11. 统一网络状态图

| 请求 | 类型 | 阻塞范围 | pending UI | error UI | success 后动作 |
| --- | --- | --- | --- | --- | --- |
| workspace | 页面关键查询 | 业务壳 | App Skeleton | Page Error + msg | 渲染导航和权限 |
| pageSummary | 页面查询 | 页面摘要 | KPI Skeleton | Section Alert + msg | 渲染 KPI |
| chartSeries | 区块查询 | 单个图表 | Chart Skeleton | Chart Error + retry + msg | 保留其他区块 |
| tableRows | 区块查询 | 表格 | Row Skeleton | Table Error + msg | 渲染分页 |
| saveMutation | 用户操作 | 表单 / 按钮 | pending button | Toast + inline msg | 更新缓存和 saved 状态 |
| detailQuery | 依赖查询 | Drawer | Drawer Skeleton | Inline Retry + msg | 渲染详情 |

## 12. UI 库适配合同

每套 UI 库必须实现同一份能力接口，页面不得直接依赖具体库：

```text
AppShell
TopBar
Sidebar
PageHeader
Button / IconButton / AsyncActionButton
Input / Textarea / NumberField
Select / Combobox / DropdownMenu
Checkbox / CheckboxGroup / RadioGroup / Switch
Tabs / Accordion / Tooltip / Popover
Dialog / Drawer / Toast / InlineAlert
Card / KPI Card / Chart Card
DataTable / Pagination
Skeleton / EmptyState / ErrorState
FormField / ValidationMessage
```

缺少上述关键能力的库不允许在页面中使用裸控件补洞。应明确显示“能力缺口”，或在该库自己的适配层完成可复用实现。

## 13. 扩展更多 UI 库

下一阶段目标是把候选从当前 4 套扩展到至少 8 套，但所有新库必须先通过适配合同，不先写页面。

候选组合应覆盖：

- 2 套完整产品级组件库。
- 2 套源码 / registry 型组件体系。
- 2 套现代动效型组件体系。
- 1 套适合企业高密度数据界面的体系。
- 1 套 accessibility-first 体系。

新增流程：

```text
调研候选
  → 填写能力矩阵
  → 实现 LibraryAdapter
  → 通过基础交互 Story
  → 接入四个固定页面
  → 运行统一截图和任务验收
```

## 14. 评测任务

每套 UI 库必须让测试者完成同一组任务：

1. 在数据总览切换 30 天范围，隐藏“投币”序列，点击异常点并查看 Drawer。
2. 筛选动画分区，排序视频表格并导出。
3. 创建额度池，设置 80% 预警，触发一次额度不足错误并看到准确 `msg`。
4. 发布带图片和话题的社区帖子，触发一次内容拒绝并修改重试。
5. 回复帖子、点赞、举报并批量分配处理人。
6. 修改组织域名，观察异步验证状态和 dirty save bar。
7. 创建 API Key，复制 secret，测试一个失败 Webhook 并查看错误 `msg`。
8. 使用键盘完成 Select、RadioGroup、Dialog 和 Drawer 操作。
9. 切换深浅主题和 reduced motion。
10. 在桌面与移动端完成核心任务。

## 15. 原型验收标准

在开始批量实现 UI 库版本前，必须确认：

- 四个页面的桌面线框和移动端线框已认可。
- 图表类型、位置、数据和交互已冻结。
- 所有控件都有明确组件所有者。
- 所有网络请求都有 loading / empty / error / success 设计。
- 所有错误都有 `code + msg` 示例。
- UI 库之间只允许视觉与组件实现不同，不允许删减功能。
- 首页从“组件介绍卡”升级为“进入同一业务环境的 UI 库选择器”。

## 16. 建议实施顺序

```text
1. 先实现无具体 UI 库依赖的 scenario schema、mock data 和 AppError。
2. 用现有四套中的一套完成业务壳与四页黄金样例。
3. 固化截图、交互任务和状态 fixtures。
4. 抽出 LibraryAdapter 合同。
5. 将其余现有 UI 库迁移到相同业务原型。
6. 调研并接入新增 UI 库。
7. 最后重做首页与跨库对比工具。
```
