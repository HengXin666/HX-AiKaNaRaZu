import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { SmoothLinkButton } from "./ui";
import "./smoothui.css";

const bars = [42, 67, 51, 86, 63, 76];

export function SmoothUIPreviewCard() {
  return (
    <motion.article
      className="su-preview"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="su-preview__visual" aria-hidden="true">
        <div className="su-preview__grid" />
        <motion.div
          className="su-preview__orb"
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        >
          <i /><i />
        </motion.div>
        <div className="su-preview__bars">
          {bars.map((height, index) => (
            <motion.i
              key={height}
              initial={{ height: 10 }}
              whileInView={{ height }}
              viewport={{ once: true }}
              transition={{ delay: .12 + index * .06, duration: .7, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </div>
        <motion.div
          className="su-preview__signal"
          animate={{ y: [-4, 5, -4] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span><Sparkles size={13} /></span>
          <div><strong>Motion ready</strong><small>Copy · own · refine</small></div>
        </motion.div>
      </div>

      <div className="su-preview__name">[$name SmoothUI]</div>
      <span className="su-preview__eyebrow">Animated product UI</span>
      <h3>顺滑动效，也能进入真实产品。</h3>
      <p>把 Motion、GSAP 与应用控件放进可复制的源码体系；既有视觉表现力，也保留充分的改造空间。</p>
      <div className="su-preview__tags">
        <span>Motion</span><span>GSAP</span><span>Source-owned</span>
      </div>
      <div className="su-preview__actions">
        <SmoothLinkButton href="https://smoothui.dev/">
          访问官网 <ArrowUpRight size={15} />
        </SmoothLinkButton>
        <SmoothLinkButton href="/lab/smoothui/dashboard">
          <motion.span whileHover={{ x: 2 }}>本站示例 <ArrowRight size={15} /></motion.span>
        </SmoothLinkButton>
      </div>
    </motion.article>
  );
}

export default SmoothUIPreviewCard;
