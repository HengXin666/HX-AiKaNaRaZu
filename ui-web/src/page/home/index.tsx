import { lazy, Suspense } from "react";
import { BarChart3, FormInput, Moon, Sparkles, Sun, Table2 } from "lucide-react";
import { useTheme } from "@/lib/use-theme";
import { HomeButton, HomeLink } from "./ui";
import "./home.css";

const ReactBitsPreviewCard = lazy(() => import("@/page/react-bits/preview").then((module) => ({ default: module.ReactBitsPreviewCard })));
const SmoothUIPreviewCard = lazy(() => import("@/page/smoothui/preview").then((module) => ({ default: module.SmoothUIPreviewCard })));
const AceternityPreviewCard = lazy(() => import("@/page/aceternity/preview").then((module) => ({ default: module.AceternityPreviewCard })));
const HeroUIPreviewCard = lazy(() => import("@/page/heroui/preview").then((module) => ({ default: module.HeroUIPreviewCard })));

export default function HomePage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="home-page" data-theme={theme}>
      <header className="home-nav">
        <HomeLink className="home-wordmark" href="#top"><span>UI</span> FIELD GUIDE <sup>04</sup></HomeLink>
        <div className="home-nav-center"><HomeLink href="#libraries">LIBRARIES</HomeLink><HomeLink href="#method">METHOD</HomeLink></div>
        <HomeButton className="home-theme" onPress={toggleTheme} label="切换白天与黑夜模式">
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}<span>{theme === "dark" ? "LIGHT" : "DARK"}</span>
        </HomeButton>
      </header>

      <main id="top">
        <section className="home-hero">
          <div className="home-hero-copy">
            <div className="home-overline"><i /> INTERACTIVE REVIEW · 2026</div>
            <h1>不看截图，<br />直接<span>试用界面。</span></h1>
            <p>四套 UI 体系，四个完全隔离的实现。每个示例都用真实的表格、图表、表单和异步请求来回答：它是否只会好看，还是也能工作？</p>
          </div>
          <div className="home-signal" aria-hidden="true">
            <div className="home-signal-ring ring-a" /><div className="home-signal-ring ring-b" /><div className="home-signal-core"><Sparkles /></div>
            <span className="signal-label label-a">MOTION</span><span className="signal-label label-b">DATA</span><span className="signal-label label-c">STATES</span>
          </div>
        </section>

        <section className="home-method" id="method">
          <div><Table2 /><span>01</span><strong>表格</strong><small>密度、响应式、状态</small></div>
          <div><BarChart3 /><span>02</span><strong>图表</strong><small>视觉层级、交互反馈</small></div>
          <div><FormInput /><span>03</span><strong>表单</strong><small>输入、校验、网络请求</small></div>
          <div><Sparkles /><span>04</span><strong>亮点控件</strong><small>动效、品牌辨识度</small></div>
        </section>

        <section className="home-library-section" id="libraries">
          <div className="home-section-title"><div><span>FIELD 01—04</span><h2>候选 UI 库</h2></div><p>官网了解它的主张，本站示例检验它在相同任务下的实际表现。</p></div>
          <div className="home-library-grid">
            <Suspense fallback={<div className="home-preview-loading">LOADING REACT BITS…</div>}><ReactBitsPreviewCard /></Suspense>
            <Suspense fallback={<div className="home-preview-loading">LOADING SMOOTHUI…</div>}><SmoothUIPreviewCard /></Suspense>
            <Suspense fallback={<div className="home-preview-loading">LOADING ACETERNITY…</div>}><AceternityPreviewCard /></Suspense>
            <Suspense fallback={<div className="home-preview-loading">LOADING HEROUI…</div>}><HeroUIPreviewCard /></Suspense>
          </div>
        </section>
      </main>

      <footer className="home-footer"><span>UI LIBRARY FIELD GUIDE</span><p>Accent specification</p><strong>#990099</strong></footer>
    </div>
  );
}
