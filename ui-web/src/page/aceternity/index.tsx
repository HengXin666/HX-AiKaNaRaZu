import { FormEvent, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  LoaderCircle,
  Moon,
  RotateCcw,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { useTheme } from "../../lib/use-theme";
import { AceternityAsyncButton, AceternityButton, AceternityDataTable, AceternityLinkButton, AceternityRadioGroup, AceternitySelect, AceternitySwitch, AceternityTextarea, AceternityTextField } from "./ui";
import "./styles.css";

const metrics = [
  { label: "视觉表现", value: 96, note: "Spotlight / 3D / 边框动效" },
  { label: "组合自由", value: 91, note: "复制源码，完整掌控" },
  { label: "应用覆盖", value: 68, note: "更偏营销与亮点场景" },
  { label: "无障碍基线", value: 72, note: "取决于最终实现" },
];

const components = [
  ["Spotlight", "营销首屏", "极强", "源码复制"],
  ["Moving Border", "CTA / 重点卡片", "强", "源码复制"],
  ["3D Card", "作品与商品展示", "强", "源码复制"],
  ["Form Elements", "业务表单", "中等", "自行组合"],
];

type RequestState = "idle" | "pending" | "success" | "error";

function MovingBorder({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`ac-moving-border ${className}`}>
      <span className="ac-moving-border__orb" aria-hidden="true" />
      <div className="ac-moving-border__content">{children}</div>
    </div>
  );
}

export default function AceternityPage() {
  const { theme, toggleTheme } = useTheme();
  const [requestState, setRequestState] = useState<RequestState>("idle");
  const [shouldFail, setShouldFail] = useState(false);
  const [message, setMessage] = useState("");
  const [scenario, setScenario] = useState("dashboard");
  const [priority, setPriority] = useState("quality");
  const requestContent = {
    idle: <><Sparkles size={17}/>发送评测请求</>, pending: <><LoaderCircle className="ac-spin" size={17}/>正在生成报告…</>, success: <><Check size={17}/>报告生成成功</>, error: <><X size={17}/>请求失败，请重试</>,
  }[requestState];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (requestState === "pending") return;
    setRequestState("pending");
    window.setTimeout(() => setRequestState(shouldFail ? "error" : "success"), 1400);
  }

  return (
    <main className="ac-page" data-theme={theme}>
      <div className="ac-grid" aria-hidden="true" />
      <div className="ac-spotlight" aria-hidden="true" />

      <nav className="ac-nav" aria-label="页面导航">
        <AceternityLinkButton className="ac-back" href="/">
          <ArrowLeft size={17} /> UI Field Guide
        </AceternityLinkButton>
        <div className="ac-nav__actions">
          <span className="ac-status"><span /> Aceternity UI 评测</span>
          <AceternityButton className="ac-icon-button" onPress={toggleTheme}><motion.span key={theme} initial={{rotate:-40,opacity:0,scale:.6}} animate={{rotate:0,opacity:1,scale:1}}>{theme === "dark" ? <Sun size={18}/> : <Moon size={18}/>}</motion.span></AceternityButton>
        </div>
      </nav>

      <header className="ac-hero">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="ac-kicker"><Sparkles size={15} /> Modern interaction collection</div>
          <h1>让界面拥有<br /><span>令人停留的瞬间。</span></h1>
          <p>
            Aceternity UI 是一套面向 React、Tailwind CSS 与 Motion 的现代源码型组件集合，
            擅长把聚光灯、动态边框和空间感交互带进产品界面。
          </p>
          <div className="ac-hero__actions">
            <AceternityLinkButton className="ac-primary-link" href="https://ui.aceternity.com/">
              访问官网 <ArrowUpRight size={17} />
            </AceternityLinkButton>
            <AceternityLinkButton className="ac-secondary-link" href="#playground">查看本站示例</AceternityLinkButton>
          </div>
        </motion.div>

        <MovingBorder className="ac-score-card">
          <div className="ac-score-card__top">
            <span>综合体验指数</span><Sparkles size={17} />
          </div>
          <strong>8.8</strong><small>/ 10</small>
          <div className="ac-score-card__line"><span /></div>
          <p>高视觉密度项目的亮点制造器</p>
        </MovingBorder>
      </header>

      <section className="ac-section" aria-labelledby="highlights-title">
        <div className="ac-section-heading">
          <div><span>01 / HIGHLIGHTS</span><h2 id="highlights-title">它为什么值得关注</h2></div>
          <p>它不是封闭的 npm 黑盒；组件源码进入你的项目，视觉、动画和行为都能继续演化。</p>
        </div>
        <div className="ac-feature-grid">
          {[
            ["01", "源码可拥有", "复制进项目后即可修改结构与动效，不受主题 API 的边界限制。"],
            ["02", "动效即语言", "Motion 驱动的细腻反馈，让重点内容自然获得注意力。"],
            ["03", "Tailwind 原生", "样式就近、组合自由，适合已有 Tailwind 设计系统的产品。"],
          ].map(([index, title, copy]) => (
            <motion.article key={index} className="ac-feature" whileHover={{ y: -5 }}>
              <span>{index}</span><h3>{title}</h3><p>{copy}</p><div className="ac-feature__glow" />
            </motion.article>
          ))}
        </div>
      </section>

      <section className="ac-section" aria-labelledby="data-title">
        <div className="ac-section-heading">
          <div><span>02 / DATA</span><h2 id="data-title">表格与图表适配度</h2></div>
          <p>以下是本站基于典型产品场景的体验评分，用于展示数据密集界面的组合方式。</p>
        </div>
        <div className="ac-data-grid">
          <article className="ac-panel ac-chart-panel">
            <div className="ac-panel__title"><div><span>体验雷达</span><strong>能力分布</strong></div><span className="ac-live">LIVE</span></div>
            <div className="ac-bars">
              {metrics.map((metric, index) => (
                <div className="ac-bar-row" key={metric.label}>
                  <div><span>{metric.label}</span><strong>{metric.value}</strong></div>
                  <div className="ac-bar"><motion.span initial={{ width: 0 }} whileInView={{ width: `${metric.value}%` }} viewport={{ once: true }} transition={{ delay: index * 0.12, duration: 0.75 }} /></div>
                  <small>{metric.note}</small>
                </div>
              ))}
            </div>
          </article>

          <article className="ac-panel ac-table-panel">
            <div className="ac-panel__title"><div><span>组件采样</span><strong>场景覆盖</strong></div><span>4 ITEMS</span></div>
            <AceternityDataTable columns={["组件","适用场景","动效","接入"]} rows={components} />
          </article>
        </div>
      </section>

      <section className="ac-section" id="playground" aria-labelledby="playground-title">
        <div className="ac-section-heading">
          <div><span>03 / PLAYGROUND</span><h2 id="playground-title">表单与网络请求</h2></div>
          <p>一个完整的异步动作演示：正常、按下、加载、成功与失败五种状态均有清晰反馈。</p>
        </div>
        <div className="ac-playground-grid">
          <form className="ac-panel ac-form" onSubmit={submit}>
            <AceternityTextField label="评测主题" name="topic" placeholder="例如：SaaS 数据看板" defaultValue="AI 创作工作台" />
            <AceternitySelect label="评测场景" value={scenario} onChange={setScenario} options={[{value:"dashboard",label:"数据仪表盘"},{value:"tool",label:"AI 工具"},{value:"landing",label:"品牌官网"}]} />
            <AceternityRadioGroup label="评测侧重" value={priority} onChange={setPriority} options={[{value:"quality",label:"视觉质量"},{value:"a11y",label:"可访问性"},{value:"speed",label:"开发效率"}]} />
            <AceternityTextarea label="补充说明" name="message" value={message} onChange={setMessage} placeholder="描述你最关心的交互场景…" />
            <AceternitySwitch checked={shouldFail} onChange={setShouldFail}>模拟失败响应</AceternitySwitch>
            <AceternityAsyncButton state={requestState}>{requestContent}</AceternityAsyncButton>
            {(requestState === "success" || requestState === "error") && (
              <AceternityButton className="ac-reset" onPress={() => setRequestState("idle")}><RotateCcw size={14} /> 重置状态</AceternityButton>
            )}
          </form>

          <MovingBorder className="ac-demo-card">
            <div className="ac-demo-card__eyebrow"><span /> MOVING BORDER</div>
            <div className="ac-orbit"><span /><Sparkles size={28} /></div>
            <h3>被看见，也被记住。</h3>
            <p>动态边框沿容器持续流动，在不打断阅读的前提下为关键区域制造聚焦。</p>
            <div className="ac-demo-card__tags"><span>Motion</span><span>Tailwind</span><span>Source-first</span></div>
          </MovingBorder>
        </div>
      </section>

      <footer className="ac-footer">
        <span>ACETERNITY UI × UI FIELD GUIDE</span>
        <p>本站演示为独立风格复现，评分仅供技术选型参考。</p>
      </footer>
    </main>
  );
}
