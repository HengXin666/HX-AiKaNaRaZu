import { Button, Card, Chip } from "@heroui/react";
import { ArrowRight, ArrowUpRight, Layers3, Sparkles } from "lucide-react";

export function HeroUIPreviewCard() {
  return (
    <Card className="h-full border border-black/10 bg-white/80 dark:border-white/10 dark:bg-zinc-950/80">
      <Card.Header className="flex items-center justify-between gap-3">
        <Chip color="accent" variant="soft">
          <Sparkles size={13} /> [$name HeroUI]
        </Chip>
        <span className="text-xs text-zinc-500">React · A11y · Motion</span>
      </Card.Header>
      <Card.Content className="flex flex-1 flex-col gap-5">
        <div className="grid min-h-36 place-items-center rounded-2xl bg-[radial-gradient(circle_at_center,rgba(153,0,153,.2),transparent_65%)]">
          <div className="grid size-20 place-items-center rounded-3xl bg-[#990099] text-white shadow-[0_18px_55px_rgba(153,0,153,.35)]">
            <Layers3 size={34} />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">完整、现代且可组合</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            将可访问交互、主题令牌与细腻动效装进一套 React 组件系统，尤其适合高完成度工具与仪表盘。
          </p>
        </div>
        <div className="mt-auto flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onPress={() => window.location.assign("/lab/heroui/dashboard")}
          >
            本站示例 <ArrowRight size={16} />
          </Button>
          <Button
            variant="outline"
            onPress={() => window.open("https://heroui.com/", "_blank", "noopener,noreferrer")}
          >
            访问官网 <ArrowUpRight size={16} />
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
}
