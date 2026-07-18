import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { AceternityLinkButton } from "./ui";
import "./styles.css";

export function AceternityPreviewCard() {
  return (
    <motion.article
      className="ac-preview"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <span className="ac-preview__moving-light" aria-hidden="true" />
      <div className="ac-preview__inner">
        <div className="ac-preview__grid" aria-hidden="true" />
        <div className="ac-preview__spotlight" aria-hidden="true" />

        <div className="ac-preview__topline">
          <span className="ac-preview__name">[$name Aceternity UI]</span>
          <span className="ac-preview__index">01 / SOURCE UI</span>
        </div>

        <div className="ac-preview__content">
          <div className="ac-preview__mark" aria-hidden="true">
            <span /><Sparkles size={23} />
          </div>
          <p className="ac-preview__eyebrow"><Sparkles size={13} /> React · Tailwind · Motion</p>
          <h2>让交互成为<br /><span>视觉的引力场。</span></h2>
          <p className="ac-preview__copy">
            现代源码型组件集合，以 Spotlight、Moving Border 和空间动效，
            为营销首屏与关键操作制造令人停留的瞬间。
          </p>

          <div className="ac-preview__tags" aria-label="Aceternity UI 亮点">
            <span>源码可控</span>
            <span>高表现动效</span>
            <span>Tailwind 原生</span>
          </div>
        </div>

        <div className="ac-preview__actions">
          <AceternityLinkButton
            href="https://ui.aceternity.com/"
            className="ac-preview__official"
          >
            访问官网 <ArrowUpRight size={16} />
          </AceternityLinkButton>
          <AceternityLinkButton href="/lab/aceternity/dashboard" className="ac-preview__demo">
            本站示例 <ArrowRight size={16} />
          </AceternityLinkButton>
        </div>
      </div>
    </motion.article>
  );
}

export default AceternityPreviewCard;
