import { useMemo, useState } from "react";
import {
  Accordion,
  Button,
  Card,
  Chip,
  Description,
  Input,
  Label,
  Link,
  ListBox,
  ProgressBar,
  Radio,
  RadioGroup,
  Select,
  Separator,
  Slider,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  TextArea,
  TextField,
} from "@heroui/react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  CircleAlert,
  Moon,
  Send,
  Sparkles,
  Sun,
} from "lucide-react";
import { useTheme } from "../../lib/use-theme";
import "./styles.css";

type RequestState = "idle" | "loading" | "success" | "error";

const rows = [
  { key: "table", component: "Table", score: 9.1, note: "排序、选择与空状态齐全" },
  { key: "forms", component: "Form controls", score: 8.8, note: "校验、描述与组合输入清晰" },
  { key: "motion", component: "Motion", score: 8.4, note: "状态动效克制且可配置" },
  { key: "a11y", component: "Accessibility", score: 9.4, note: "键盘和读屏语义是默认能力" },
];

const metrics = [
  { label: "无障碍", value: 94 },
  { label: "组件覆盖", value: 90 },
  { label: "定制自由度", value: 88 },
  { label: "视觉表现", value: 84 },
  { label: "动效", value: 82 },
];

const chartPoints = metrics
  .map((item, index) => `${22 + index * 69},${164 - item.value * 1.28}`)
  .join(" ");

export default function HeroUIPage() {
  const { theme, toggleTheme } = useTheme();
  const [requestState, setRequestState] = useState<RequestState>("idle");
  const [shouldFail, setShouldFail] = useState(false);
  const [intensity, setIntensity] = useState(72);
  const selectedCount = useMemo(() => rows.length, []);

  async function submitDemo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (requestState === "loading") return;
    setRequestState("loading");
    await new Promise((resolve) => window.setTimeout(resolve, 1100));
    setRequestState(shouldFail ? "error" : "success");
  }

  const buttonCopy = {
    idle: "发送评测请求",
    loading: "正在发送…",
    success: "请求已完成",
    error: "请求失败 · 重试",
  }[requestState];

  return (
    <main className="heroui-page" data-theme={theme}>
      <nav className="hero-nav" aria-label="页面导航">
        <Link href="/" className="hero-link"><ArrowLeft size={17} />返回 UI 图鉴</Link>
        <div className="hero-nav-actions">
          <Button
            isIconOnly
            variant="ghost"
            aria-label={theme === "dark" ? "切换到白天模式" : "切换到黑夜模式"}
            onPress={toggleTheme}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <Link
            href="https://heroui.com/"
            target="_blank"
            rel="noreferrer"
            className="hero-link accent-link"
          >
            HeroUI 官网<ArrowUpRight size={16} />
          </Link>
        </div>
      </nav>

      <section className="hero-intro">
        <div className="hero-copy">
          <Chip color="accent" variant="soft">
            <Sparkles size={14} /> [$name HeroUI]
          </Chip>
          <h1>让产品界面既有秩序，<span>也有光泽。</span></h1>
          <p>
            一套面向现代 React 应用的完整组件系统。HeroUI 把可访问性、交互状态和视觉定制放在同一层，
            适合仪表盘、工具型产品与高完成度业务界面。
          </p>
          <div className="hero-cta">
            <Link href="#playground" className="cta-link primary-link">查看本站示例<ArrowUpRight size={17} /></Link>
            <Link href="https://heroui.com/" target="_blank" rel="noreferrer" className="cta-link outline-link">访问官网</Link>
          </div>
        </div>

        <Card className="signal-card">
          <Card.Header className="signal-header">
            <div>
              <p className="eyebrow">LIVE SIGNAL</p>
              <h2>UI 健康度</h2>
            </div>
            <Chip color="success" variant="soft">稳定</Chip>
          </Card.Header>
          <Card.Content>
            <div className="signal-score">92<span>/100</span></div>
            <ProgressBar
              aria-label="UI 健康度 92%"
              value={92}
              color="accent"
              size="sm"
              className="signal-progress"
            ><ProgressBar.Track><ProgressBar.Fill /></ProgressBar.Track></ProgressBar>
            <div className="signal-grid">
              <span><b>42</b>组件</span>
              <span><b>AA</b>无障碍</span>
              <span><b>2.1s</b>上手</span>
            </div>
          </Card.Content>
        </Card>
      </section>

      <section className="highlight-strip" aria-label="HeroUI 亮点">
        {[
          ["A11Y FIRST", "以 React Aria 交互语义为基础"],
          ["TAILWIND", "主题令牌与样式槽位皆可定制"],
          ["COMPOSABLE", "从基础控件组合复杂业务体验"],
          ["MOTION", "自带自然且一致的微交互动效"],
        ].map(([title, text], index) => (
          <div className="highlight-item" key={title}>
            <span>0{index + 1}</span>
            <strong>{title}</strong>
            <p>{text}</p>
          </div>
        ))}
      </section>

      <section className="section-block" id="playground">
        <div className="section-heading">
          <div>
            <p className="eyebrow">EVALUATION / 01</p>
            <h2>数据密度，不等于视觉负担</h2>
          </div>
          <Chip variant="secondary" color="accent">{selectedCount} 项评测</Chip>
        </div>
        <div className="data-grid">
          <Card className="panel-card">
            <Card.Header className="signal-header"><h3>组件评测表</h3><Button size="sm" variant="outline">导出数据<ArrowUpRight size={14}/></Button></Card.Header>
            <Separator />
            <Card.Content className="table-wrap">
              <Table>
              <Table.Content aria-label="HeroUI 组件评测表">
                <TableHeader>
                  <TableColumn>能力</TableColumn>
                  <TableColumn>得分</TableColumn>
                  <TableColumn>观察</TableColumn>
                </TableHeader>
                <TableBody items={rows}>
                  {(row) => (
                    <TableRow key={row.key}>
                      <TableCell><strong>{row.component}</strong></TableCell>
                      <TableCell><Chip size="sm" color="accent" variant="soft">{row.score}</Chip></TableCell>
                      <TableCell>{row.note}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table.Content>
              </Table>
            </Card.Content>
          </Card>

          <Card className="panel-card chart-card">
            <Card.Header className="chart-title">
              <div><h3>能力雷达</h3><p>相对评分 / 100</p></div>
              <Chip size="sm" color="accent">综合 88</Chip>
            </Card.Header>
            <Card.Content>
              <svg className="score-chart" viewBox="0 0 320 190" role="img" aria-label="HeroUI 五项能力评分折线图">
                <defs>
                  <linearGradient id="heroArea" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#990099" stopOpacity=".32" />
                    <stop offset="1" stopColor="#990099" stopOpacity=".02" />
                  </linearGradient>
                </defs>
                {[36, 76, 116, 156].map((y) => <line key={y} x1="16" x2="306" y1={y} y2={y} className="grid-line" />)}
                <polygon points={`22,164 ${chartPoints} 298,164`} fill="url(#heroArea)" />
                <polyline points={chartPoints} className="chart-line" />
                {metrics.map((item, index) => {
                  const x = 22 + index * 69;
                  const y = 164 - item.value * 1.28;
                  return <circle key={item.label} cx={x} cy={y} r="4" className="chart-point" />;
                })}
              </svg>
              <div className="chart-legend">
                {metrics.map((item) => <span key={item.label}><i />{item.label}<b>{item.value}</b></span>)}
              </div>
            </Card.Content>
          </Card>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">EVALUATION / 02</p>
            <h2>完整表单与网络请求状态</h2>
          </div>
          <p className="section-note">按钮覆盖 idle · pressed · loading · success · error</p>
        </div>

        <div className="form-grid">
          <Card className="panel-card">
            <Card.Content>
              <form className="demo-form" onSubmit={submitDemo}>
                <div className="field-row">
                  <TextField isRequired name="name"><Label>姓名</Label><Input placeholder="Lin" minLength={2} /><Description>至少两个字符</Description></TextField>
                  <TextField isRequired name="email"><Label>工作邮箱</Label><Input type="email" placeholder="lin@example.com" /></TextField>
                </div>
                <Select isRequired name="scenario">
                  <Label>评测场景</Label>
                  <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
                  <Select.Popover><ListBox>
                    <ListBox.Item id="dashboard">数据仪表盘</ListBox.Item>
                    <ListBox.Item id="tool">AI / 效率工具</ListBox.Item>
                    <ListBox.Item id="commerce">商业产品</ListBox.Item>
                  </ListBox></Select.Popover>
                </Select>
                <RadioGroup name="priority" defaultValue="quality" variant="secondary">
                  <Label>评测侧重</Label>
                  <div className="hero-radio-row">
                    <Radio value="quality"><Radio.Content><Radio.Control><Radio.Indicator /></Radio.Control>视觉质量</Radio.Content></Radio>
                    <Radio value="a11y"><Radio.Content><Radio.Control><Radio.Indicator /></Radio.Control>可访问性</Radio.Content></Radio>
                    <Radio value="speed"><Radio.Content><Radio.Control><Radio.Indicator /></Radio.Control>开发效率</Radio.Content></Radio>
                  </div>
                </RadioGroup>
                <TextField isRequired name="message"><Label>最关心的体验</Label><TextArea placeholder="描述你希望验证的交互或视觉目标…" rows={4} /></TextField>
                <div className="request-options">
                  <Switch isSelected={shouldFail} onChange={setShouldFail} size="sm">
                    <Switch.Content><Switch.Control><Switch.Thumb /></Switch.Control>模拟失败响应</Switch.Content>
                  </Switch>
                  <span>延迟约 1.1 秒</span>
                </div>
                <Button
                  type="submit"
                  variant={requestState === "error" ? "danger" : requestState === "success" ? "primary" : "secondary"}
                  isPending={requestState === "loading"}
                  className="request-button"
                  size="lg"
                >
                  {requestState === "success" ? <Check size={18} /> : requestState === "error" ? <CircleAlert size={18} /> : requestState === "loading" ? null : <Send size={18} />}{buttonCopy}
                </Button>
                <div className={`request-status is-${requestState}`} role="status" aria-live="polite">
                  {requestState === "idle" && "准备发送一份示例评测请求。按住按钮可观察 pressed 状态。"}
                  {requestState === "loading" && "正在建立安全连接并提交表单…"}
                  {requestState === "success" && "提交成功，示例评测已经进入队列。"}
                  {requestState === "error" && "模拟服务暂不可用，你可以关闭失败开关后重试。"}
                </div>
              </form>
            </Card.Content>
          </Card>

          <Card className="panel-card feature-card">
            <Card.Header>
              <div>
                <p className="eyebrow">HIGHLIGHT CONTROL</p>
                <h3>交互亮度调音台</h3>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="orb-stage">
                <div className="glow-orb" style={{ opacity: 0.35 + intensity / 155, transform: `scale(${0.72 + intensity / 250})` }} />
                <span>{intensity}%</span>
              </div>
              <Label>强调色能量</Label>
              <Slider
                value={intensity}
                onChange={(value) => setIntensity(Number(value))}
                minValue={20}
                maxValue={100}
                step={1}
              ><Slider.Track><Slider.Fill /><Slider.Thumb /></Slider.Track></Slider>
              <Accordion variant="surface" className="feature-accordion">
                <Accordion.Item id="tokens"><Accordion.Heading><Accordion.Trigger>设计令牌</Accordion.Trigger></Accordion.Heading><Accordion.Panel><Accordion.Body>使用语义颜色和可复用间距，让明暗模式拥有一致层级。</Accordion.Body></Accordion.Panel></Accordion.Item>
                <Accordion.Item id="slots"><Accordion.Heading><Accordion.Trigger>样式槽位</Accordion.Trigger></Accordion.Heading><Accordion.Panel><Accordion.Body>针对组件内部结构定制样式，不必破坏交互行为。</Accordion.Body></Accordion.Panel></Accordion.Item>
              </Accordion>
            </Card.Content>
          </Card>
        </div>
      </section>

      <footer className="hero-footer">
        <span>HeroUI 独立能力评测</span>
        <span>Accent #990099 · Light / Dark</span>
      </footer>
    </main>
  );
}
