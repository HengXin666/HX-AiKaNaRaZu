# React 前端库

## 固定库

| 用途 | 固定选择 | 备注 | 官方来源 |
| --- | --- | --- | --- |
| 前端框架 | React | 永远使用 | <https://react.dev/> |
| 类型系统 | TypeScript | 永远使用 | <https://www.typescriptlang.org/> |
| 样式 | Tailwind CSS | 必须使用 | <https://tailwindcss.com/> |
| UI | shadcn/ui | 默认 UI 方案 | <https://ui.shadcn.com/docs> |
| 图标 | lucide-react | 默认图标库 | <https://lucide.dev/guide/react> |
| 动效 | React Bits | 明确需要复杂动效时才使用 | <https://github.com/DavidHDev/react-bits> |
| 节点图 | React Flow | 明确存在节点图或流程编辑需求时才使用 | <https://reactflow.dev/> |

## 常用可选库

| 用途 | 可选选择 | 使用条件 | 官方来源 |
| --- | --- | --- | --- |
| 构建工具 | Vite | 新 React SPA 默认使用 | <https://vite.dev/> |
| 服务端状态 | TanStack Query | 需要缓存、重试、分页、失效或乐观更新时 | <https://tanstack.com/query/latest> |
| 路由 | React Router | 需要多页面 SPA 路由时 | <https://reactrouter.com/> |
| 表单 | React Hook Form | 表单复杂度较高时 | <https://react-hook-form.com/> |
| Schema 校验 | Zod | 需要运行时 schema 校验时 | <https://zod.dev/> |

## UI 组件所有权（强制）

选定 UI 库后，业务页面中的可见控件必须来自该 UI 库、项目设计系统对该库的封装，或该库官方 registry 安装到项目中的源码组件。不能只在页面外框使用 UI 库，却在表单和数据区退回裸 HTML。

必须由所选 UI 体系提供或封装的内容至少包括：

```text
Button / IconButton / LinkButton
Input / Textarea
Select / Combobox / Dropdown Menu
Checkbox / RadioGroup / Switch
Form field / Label / Validation message
Table / Pagination
Dialog / Drawer / Popover / Tooltip / Toast
Tabs / Accordion
Skeleton / EmptyState / ErrorState
AsyncActionButton
```

业务页面默认禁止直接出现：

```tsx
<button>
<input>
<textarea>
<select>
<option>
<table>
<dialog>
```

规则边界：

- 原生语义元素可以存在于 UI 库内部、官方 registry 组件内部或项目设计系统适配层内部；禁止业务页面直接使用。
- `Checkbox`、`RadioGroup`、`Select` 等不能用“一个经过 Tailwind 美化的裸元素”冒充 UI 库组件，必须具备所选体系的状态、键盘、焦点和主题行为。
- 若所选库没有某个必需控件，先在该库对应的设计系统目录建立可复用适配组件；不得临时引入第二套 UI 库，也不得在业务页面退回裸控件。
- 同一页面只能有一个 UI 组件所有者。图标库、图表计算库和动效引擎不算第二套 UI 库，但不能替代控件组件。
- 源码型 UI 库安装后的组件也属于该 UI 体系；必须保留来源说明，并由页面通过封装后的组件 API 使用。
- 网络操作必须通过统一的异步操作组件展示 `idle / pressed / pending / success / error`，不得由页面临时拼接多个按钮版本。

Agent 在完成前必须扫描业务页面：

```bash
rg -n '<(button|input|textarea|select|option|table|dialog)(\s|>)' src/page src/pages src/features
```

若命中业务页面，任务不能标记完成；命中 UI 库实现目录时，需要确认这些元素没有泄漏到业务调用层。
