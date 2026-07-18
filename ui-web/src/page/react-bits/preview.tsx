import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { BitsLinkButton } from "./ui";
import "./preview.css";

export function ReactBitsPreviewCard() {
  return (
    <article className="rb-preview">
      <div className="rb-preview-glow" aria-hidden="true" />
      <div className="rb-preview-meta"><span>01</span><small>A · MOTION</small></div>
      <div className="rb-preview-stage" aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <motion.i key={index} animate={{ scale: [1, 1.8], opacity: [.7, 0] }} transition={{ duration: 2.4, delay: index * .55, repeat: Infinity }} />
        ))}
        <motion.b animate={{ rotate: [0, 12, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}><Sparkles size={19} /></motion.b>
      </div>
      <div className="rb-preview-name">[$name React Bits]</div>
      <p className="rb-preview-kicker">CREATIVE MOTION ARCHIVE</p>
      <h3>React Bits</h3>
      <p className="rb-preview-copy">110+ 可复制的动画、文本、背景与交互组件，适合打造带记忆点的产品表面。</p>
      <div className="rb-preview-tags"><span>Source-owned</span><span>Tailwind</span><span>Creative</span></div>
      <div className="rb-preview-actions">
        <BitsLinkButton href="https://reactbits.dev/">访问官网 <ArrowUpRight size={15}/></BitsLinkButton>
        <BitsLinkButton to="/lab/react-bits/dashboard">本站示例 <ArrowRight size={15}/></BitsLinkButton>
      </div>
    </article>
  );
}
