import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleAlert,
  LoaderCircle,
  Moon,
  MousePointer2,
  Sparkles,
  Sun,
  WandSparkles,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useTheme } from "../../lib/use-theme";
import { SmoothAsyncButton, SmoothButton, SmoothDataTable, SmoothLinkButton, SmoothRadioGroup, SmoothSelect, SmoothSwitch, SmoothTextarea, SmoothTextField } from "./ui";
import "./smoothui.css";

type RequestState = "idle" | "pending" | "success" | "error";

const traffic = [
  { day: "周一", value: 34 },
  { day: "周二", value: 48 },
  { day: "周三", value: 43 },
  { day: "周四", value: 67 },
  { day: "周五", value: 58 },
  { day: "周六", value: 82 },
  { day: "周日", value: 74 },
];

const rows = [
  { flow: "产品候补名单", channel: "Web", conversion: "12.8%", status: "增长中" },
  { flow: "功能发布通知", channel: "Email", conversion: "9.4%", status: "稳定" },
  { flow: "创作者邀请", channel: "Social", conversion: "16.1%", status: "增长中" },
  { flow: "回访问卷", channel: "In-app", conversion: "7.6%", status: "观察中" },
];

function DotGrid() {
  return (
    <div className="su-orbit" aria-hidden="true">
      <motion.div
        className="su-orbit__halo"
        animate={{ rotate: 360 }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="su-orbit__core"
        animate={{ scale: [1, 1.12, 1], rotate: [0, 8, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <WandSparkles size={34} />
      </motion.div>
      {[0, 1, 2].map((item) => (
        <motion.span
          className={`su-orbit__dot su-orbit__dot--${item + 1}`}
          key={item}
          animate={{ scale: [0.75, 1.35, 0.75], opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 2.4, delay: item * 0.42, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

function AnimatedChart() {
  const points = traffic.map((item, index) => {
    const x = 15 + index * 45;
    const y = 125 - item.value;
    return `${x},${y}`;
  });

  return (
    <div className="su-chart-wrap">
      <div className="su-chart-head">
        <div>
          <span>本周互动</span>
          <strong>24,892</strong>
        </div>
        <span className="su-up">+18.4%</span>
      </div>
      <svg className="su-chart" viewBox="0 0 310 150" role="img" aria-label="一周互动数据折线图">
        <defs>
          <linearGradient id="smooth-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#990099" stopOpacity=".34" />
            <stop offset="100%" stopColor="#990099" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[35, 75, 115].map((y) => <line key={y} x1="10" y1={y} x2="300" y2={y} className="su-grid-line" />)}
        <motion.path
          d={`M ${points.join(" L ")} L 285,140 L 15,140 Z`}
          fill="url(#smooth-area)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />
        <motion.polyline
          points={points.join(" ")}
          className="su-chart-line"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        {traffic.map((item, index) => (
          <motion.circle
            key={item.day}
            cx={15 + index * 45}
            cy={125 - item.value}
            r="4"
            className="su-chart-dot"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: .55 + index * .08 }}
          />
        ))}
      </svg>
      <div className="su-axis">{traffic.map((item) => <span key={item.day}>{item.day}</span>)}</div>
    </div>
  );
}

export default function SmoothUIPage() {
  const { theme, toggleTheme } = useTheme();
  const [requestState, setRequestState] = useState<RequestState>("idle");
  const [outcome, setOutcome] = useState("success");
  const [activeMetric, setActiveMetric] = useState(1);
  const [scenario, setScenario] = useState("dashboard");
  const [priority, setPriority] = useState("quality");

  useEffect(() => {
    if (requestState !== "success" && requestState !== "error") return;
    const reset = window.setTimeout(() => setRequestState("idle"), 2400);
    return () => window.clearTimeout(reset);
  }, [requestState]);

  const buttonCopy = useMemo(() => ({
    idle: "发送测试请求",
    pending: "正在连接…",
    success: "请求已完成",
    error: "请求失败，重试",
  }[requestState]), [requestState]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (requestState === "pending") return;
    setRequestState("pending");
    window.setTimeout(() => setRequestState(outcome === "success" ? "success" : "error"), 1350);
  }

  const statusIcon = requestState === "pending"
    ? <LoaderCircle className="su-spin" size={18} />
    : requestState === "success"
      ? <Check size={18} />
      : requestState === "error"
        ? <CircleAlert size={18} />
        : <ArrowUpRight size={18} />;

  return (
    <div className="smooth-page" data-theme={theme}>
      <div className="su-glow su-glow--one" />
      <div className="su-glow su-glow--two" />
      <header className="su-nav">
        <SmoothLinkButton href="/" className="su-back"><ArrowLeft size={17} /> UI Field Guide</SmoothLinkButton>
        <div className="su-nav__actions">
          <SmoothLinkButton href="https://smoothui.dev/" className="su-link-button">
            官方网站 <ArrowUpRight size={15} />
          </SmoothLinkButton>
          <SmoothButton className="su-icon-button" onPress={toggleTheme}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={theme} initial={{ opacity: 0, rotate: -60 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 60 }}>
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </motion.span>
            </AnimatePresence>
          </SmoothButton>
        </div>
      </header>

      <main>
        <section className="su-hero">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }}>
            <span className="su-eyebrow"><Sparkles size={14} /> 源码型动效组件生态</span>
            <h1>让界面在每一次<br /><em>互动中呼吸。</em></h1>
            <p>SmoothUI 将 React、Tailwind 与 Motion 的表达力装进可复制、可改造的组件源码中。它更像一套视觉积木，而不是不可触碰的黑盒。</p>
            <div className="su-hero__actions">
              <SmoothLinkButton href="#playground" className="su-primary">查看本站示例 <ChevronRight size={17} /></SmoothLinkButton>
              <SmoothLinkButton href="https://smoothui.dev/" className="su-secondary">访问 SmoothUI</SmoothLinkButton>
            </div>
            <div className="su-pills">
              <span>Motion-ready</span><span>Tailwind CSS</span><span>Copy & own</span>
            </div>
          </motion.div>
          <motion.div className="su-visual" initial={{ opacity: 0, scale: .88 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .15, duration: .75 }}>
            <DotGrid />
            <motion.div className="su-float-card su-float-card--top" animate={{ y: [-5, 6, -5] }} transition={{ duration: 4, repeat: Infinity }}>
              <span className="su-mini-icon"><MousePointer2 size={15} /></span>
              <div><strong>Fluid motion</strong><small>60 fps interaction</small></div>
            </motion.div>
            <motion.div className="su-float-card su-float-card--bottom" animate={{ y: [5, -7, 5] }} transition={{ duration: 4.8, repeat: Infinity }}>
              <span className="su-live-dot" />
              <div><strong>Open source</strong><small>Make it entirely yours</small></div>
            </motion.div>
          </motion.div>
        </section>

        <section className="su-section" id="playground">
          <div className="su-section-title">
            <div><span className="su-kicker">INTERACTION LAB</span><h2>亮点控件，不止是装饰</h2></div>
            <p>点击指标卡，观察内容与布局自然切换。</p>
          </div>
          <div className="su-metric-grid">
            {[{ label: "访问量", value: "84.2K", delta: "+12%" }, { label: "转化率", value: "16.8%", delta: "+4.2%" }, { label: "响应时间", value: "126ms", delta: "−18ms" }].map((metric, index) => (
              <SmoothButton key={metric.label} className={`su-metric ${activeMetric === index ? "is-active" : ""}`} onPress={() => setActiveMetric(index)}>
                {activeMetric === index && <motion.span className="su-metric__active" layoutId="metric-active" />}
                <span>{metric.label}</span><strong>{metric.value}</strong><small>{metric.delta} 本周</small>
              </SmoothButton>
            ))}
          </div>
        </section>

        <section className="su-showcase-grid">
          <article className="su-panel su-chart-panel">
            <span className="su-panel-label">图表 / DATA STORY</span>
            <AnimatedChart />
          </article>
          <article className="su-panel su-form-panel">
            <span className="su-panel-label">表单与网络请求 / FORM</span>
            <h3>投递一次模拟任务</h3>
            <p>选择预期响应，完整体验按钮的按压、加载与结果状态。</p>
            <form onSubmit={submit}>
              <SmoothTextField label="工作邮箱" name="email" type="email" defaultValue="hello@smooth.dev" />
              <SmoothSelect label="评测场景" value={scenario} onChange={setScenario} options={[{value:"dashboard",label:"数据仪表盘"},{value:"tool",label:"AI 工具"},{value:"landing",label:"品牌官网"}]} />
              <SmoothRadioGroup label="评测侧重" value={priority} onChange={setPriority} options={[{value:"quality",label:"视觉质量"},{value:"a11y",label:"可访问性"},{value:"speed",label:"开发效率"}]} />
              <SmoothTextarea label="补充说明" name="notes" placeholder="描述希望验证的交互细节…" />
              <SmoothSelect label="模拟响应" value={outcome} onChange={setOutcome} options={[{value:"success",label:"200 · 成功"},{value:"error",label:"500 · 失败"}]} />
              <SmoothSwitch checked={outcome === "error"} onChange={(checked) => setOutcome(checked ? "error" : "success")}>模拟失败响应</SmoothSwitch>
              <SmoothAsyncButton state={requestState} icon={statusIcon} label={buttonCopy} />
            </form>
            <div className="su-state-legend"><span>默认</span><span>按下</span><span>加载</span><span>完成</span><span>失败</span></div>
          </article>
        </section>

        <section className="su-panel su-table-panel">
          <div className="su-table-heading"><div><span className="su-panel-label">表格 / CAMPAIGN FLOWS</span><h3>转化表现概览</h3></div><SmoothButton>导出数据 <ArrowUpRight size={15} /></SmoothButton></div>
          <SmoothDataTable columns={["流程","渠道","转化率","状态"]} rows={rows.map((row) => [<><span className="su-row-mark" />{row.flow}</>,row.channel,<strong>{row.conversion}</strong>,<span className={`su-status ${row.status === "增长中" ? "is-growing" : ""}`}>{row.status}</span>])} />
        </section>

        <section className="su-verdict">
          <span className="su-eyebrow"><Sparkles size={14} /> 评测速览</span>
          <h2>适合希望掌控源码，<br />又在意动效质感的团队。</h2>
          <div className="su-score-grid">
            <div><strong>9.2</strong><span>视觉表现</span></div><div><strong>9.0</strong><span>可定制性</span></div><div><strong>8.3</strong><span>业务覆盖</span></div>
          </div>
          <p>优势是鲜明的动效语言与“复制即拥有”；代价是团队需要自行维护组件一致性与复杂业务状态。它尤其适合品牌官网、创意工具和需要高辨识度的产品界面。</p>
        </section>
      </main>
      <footer><span>SmoothUI evaluation · UI Field Guide</span><SmoothLinkButton href="/">返回全部 UI 库</SmoothLinkButton></footer>
    </div>
  );
}
