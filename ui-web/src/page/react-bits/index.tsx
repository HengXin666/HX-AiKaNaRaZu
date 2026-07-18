import { useMemo, useState, type FormEvent, type MouseEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  LoaderCircle,
  Moon,
  RotateCcw,
  Send,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { useTheme } from "@/lib/use-theme";
import { BitsAsyncButton, BitsButton, BitsDataTable, BitsLinkButton, BitsRadioGroup, BitsSelect, BitsSwitch, BitsTextarea, BitsTextField } from "./ui";
import "./react-bits.css";

type RequestState = "idle" | "pending" | "success" | "error";

const rows = [
  { component: "Spotlight Card", kind: "Surface", motion: "Pointer", score: 94 },
  { component: "Blur Text", kind: "Typography", motion: "Spring", score: 91 },
  { component: "Magic Bento", kind: "Layout", motion: "Pointer", score: 89 },
  { component: "Star Border", kind: "Control", motion: "Loop", score: 86 },
];

function SpotlightCard({ children }: { children: React.ReactNode }) {
  const [position, setPosition] = useState({ x: 50, y: 50 });

  function updateSpotlight(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <div
      className="rb-spotlight-card"
      onMouseMove={updateSpotlight}
      style={{ "--spot-x": `${position.x}%`, "--spot-y": `${position.y}%` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export default function ReactBitsPage() {
  const { theme, toggleTheme } = useTheme();
  const [requestState, setRequestState] = useState<RequestState>("idle");
  const [shouldFail, setShouldFail] = useState(false);
  const [range, setRange] = useState("30d");
  const [scene, setScene] = useState("dashboard");
  const [complexity, setComplexity] = useState("medium");
  const [priority, setPriority] = useState("quality");
  const chartPoints = useMemo(
    () => range === "7d" ? "0,110 55,80 110,92 165,40 220,62 275,24 330,38" : "0,120 55,98 110,110 165,72 220,78 275,42 330,18",
    [range],
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (requestState === "pending") return;
    setRequestState("pending");
    await new Promise((resolve) => window.setTimeout(resolve, 1200));
    setRequestState(shouldFail ? "error" : "success");
  }

  return (
    <div className="rb-page" data-theme={theme}>
      <div className="rb-orb rb-orb-one" aria-hidden="true" />
      <div className="rb-orb rb-orb-two" aria-hidden="true" />
      <header className="rb-header">
        <BitsLinkButton className="rb-icon-link" to="/" label="返回主页"><ArrowLeft size={18} /></BitsLinkButton>
        <div className="rb-brand"><span className="rb-brand-mark"><Sparkles size={17} /></span>React Bits Lab</div>
        <div className="rb-header-actions">
          <BitsLinkButton className="rb-quiet-link" href="https://reactbits.dev/">官网 <ArrowUpRight size={14} /></BitsLinkButton>
          <BitsButton className="rb-icon-link" onPress={toggleTheme}>
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </BitsButton>
        </div>
      </header>

      <main className="rb-main">
        <section className="rb-hero">
          <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="rb-kicker">[$name React Bits]</div>
            <h1>让界面不只是出现，<span>而是登场。</span></h1>
            <p>源码可拥有的动画组件实验室。这里用 Spotlight、Star Border 与文字渐变，验证它在真实产品数据和异步交互中的表现。</p>
            <div className="rb-pills"><span>TypeScript</span><span>Tailwind-ready</span><span>Source-owned</span><span>Motion-rich</span></div>
          </motion.div>
          <SpotlightCard>
            <div className="rb-demo-label">POINTER LAB · LIVE</div>
            <div className="rb-demo-number">110<span>+</span></div>
            <div className="rb-demo-copy">creative building blocks</div>
            <div className="rb-wave"><i /><i /><i /><i /><i /><i /><i /></div>
          </SpotlightCard>
        </section>

        <section className="rb-grid rb-grid-top">
          <article className="rb-panel rb-chart-panel">
            <div className="rb-panel-head">
              <div><span className="rb-eyebrow">图表评测</span><h2>互动完成率</h2></div>
              <div className="rb-segmented">
                {(["7d", "30d"] as const).map((value) => <BitsButton className={range === value ? "active" : ""} onPress={() => setRange(value)} key={value}>{value}</BitsButton>)}
              </div>
            </div>
            <div className="rb-metric"><strong>94.8%</strong><span>↑ 12.4%</span></div>
            <div className="rb-chart" aria-label="互动完成率折线图">
              <svg viewBox="0 0 330 140" role="img">
                <defs><linearGradient id="rb-fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#990099" stopOpacity=".5"/><stop offset="1" stopColor="#990099" stopOpacity="0"/></linearGradient></defs>
                <path d={`M ${chartPoints.replaceAll(" ", " L ")} L 330 140 L 0 140 Z`} fill="url(#rb-fill)" />
                <polyline points={chartPoints} fill="none" stroke="#d000d0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </article>

          <article className="rb-panel rb-form-panel">
            <div className="rb-panel-head"><div><span className="rb-eyebrow">表单 & 网络请求</span><h2>申请组件审阅</h2></div><Send size={20} /></div>
            <form onSubmit={submit}>
              <BitsTextField label="组件名称" name="component" defaultValue="Liquid Chrome" />
              <div className="rb-form-row">
                <BitsSelect label="使用场景" value={scene} onChange={setScene} options={[{value:"dashboard",label:"Dashboard"},{value:"landing",label:"Landing page"},{value:"tool",label:"Creative tool"}]} />
                <BitsSelect label="复杂度" value={complexity} onChange={setComplexity} options={[{value:"low",label:"低"},{value:"medium",label:"中"},{value:"high",label:"高"}]} />
              </div>
              <BitsRadioGroup label="评测侧重" value={priority} onChange={setPriority} options={[{value:"quality",label:"视觉质量"},{value:"a11y",label:"可访问性"},{value:"speed",label:"开发效率"}]} />
              <BitsTextarea label="补充说明" name="notes" placeholder="描述希望验证的交互细节…" />
              <BitsSwitch checked={shouldFail} onChange={setShouldFail}>模拟失败响应</BitsSwitch>
              <BitsAsyncButton disabled={requestState === "pending"}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={requestState} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -7 }}>
                    {requestState === "idle" && <><Send size={16}/> 发送评测</>}
                    {requestState === "pending" && <><LoaderCircle className="rb-spin" size={16}/> 请求发送中</>}
                    {requestState === "success" && <><Check size={16}/> 已成功收录</>}
                    {requestState === "error" && <><X size={16}/> 请求失败，重试</>}
                  </motion.span>
                </AnimatePresence>
              </BitsAsyncButton>
              <div className="rb-state-strip" aria-label="按钮五态说明"><span>idle</span><span>pressed</span><span>pending</span><span>success</span><span>error</span></div>
            </form>
          </article>
        </section>

        <section className="rb-panel rb-table-panel">
          <div className="rb-panel-head"><div><span className="rb-eyebrow">表格评测</span><h2>组件实验清单</h2></div><BitsButton className="rb-reset" onPress={() => setRequestState("idle")}><RotateCcw size={15}/> 重置演示</BitsButton></div>
          <BitsDataTable columns={["组件","类型","动效驱动","适配评分","状态"]} rows={rows.map((row) => [<><span className="rb-component-dot" />{row.component}</>,row.kind,row.motion,<div className="rb-score"><i style={{ width: `${row.score}%` }} /><span>{row.score}</span></div>,<span className="rb-status">Ready</span>])} />
        </section>
      </main>
    </div>
  );
}
