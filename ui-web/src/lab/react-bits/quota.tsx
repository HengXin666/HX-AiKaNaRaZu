import { useState } from "react";
import {
  Activity,
  AlertCircle,
  Database,
  Gauge as GaugeIcon,
  Plus,
} from "lucide-react";
import { AreaChart, Bars, Gauge, Heatmap, trend } from "./charts";
import { KPI, PageHeader } from "./common";
import {
  Alert,
  AsyncButton,
  Button,
  Card,
  Chip,
  Drawer,
  Field,
  Input,
  Select,
  Switch,
  Table,
  type AppError,
} from "./ui";
const rows = [
  ["视频理解组", "12,000 GB", "8,420 GB", "80%", "华东 A", "预警"],
  ["推荐算法组", "18,000 GB", "9,160 GB", "85%", "华北 B", "正常"],
  ["内容安全组", "8,000 GB", "3,920 GB", "75%", "华南 A", "正常"],
  ["创作工具组", "6,000 GB", "5,480 GB", "90%", "公共池", "临界"],
];
export default function Quota() {
  const [drawer, setDrawer] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [total, setTotal] = useState("8000");
  const [threshold, setThreshold] = useState(80);
  const [renew, setRenew] = useState(true);
  const [route, setRoute] = useState("east");
  const [saving, setSaving] = useState(false);
  const invalid = Number(total) < 8420;
  const save = async () => {
    if (invalid) {
      setError({
        code: "QUOTA_BELOW_USAGE",
        msg: "新额度不能低于当前已使用额度 8,420 GB。",
        fieldErrors: { total: "当前至少需要 8,420 GB" },
        retryable: false,
      });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 850));
    setSaving(false);
    setDrawer(false);
  };
  return (
    <div className="rbl-page">
      <PageHeader
        eyebrow="RELAY CAPACITY"
        title="中转站额度配置"
        description="统一管理节点、团队额度与溢出策略。"
        actions={
          <Button variant="primary" onClick={() => setDrawer(true)}>
            <Plus />
            新增额度池
          </Button>
        }
      />
      {error && <Alert error={error} />}
      <section className="rbl-kpis">
        <KPI
          label="总额度"
          value="64,000 GB"
          delta="4.2%"
          icon={<Database />}
          points={[28, 30, 34, 35, 38, 42]}
        />
        <KPI
          label="已分配"
          value="44,000 GB"
          delta="9.8%"
          icon={<GaugeIcon />}
          points={[21, 24, 25, 29, 34, 39]}
        />
        <KPI
          label="今日消耗"
          value="3,842 GB"
          delta="11.3%"
          icon={<Activity />}
          points={[14, 20, 18, 27, 33, 31]}
        />
        <KPI
          label="预警团队"
          value="4"
          delta="2 新增"
          icon={<AlertCircle />}
          points={[8, 7, 9, 12, 11, 16]}
        />
      </section>
      <section className="rbl-primary-grid">
        <AreaChart
          title="额度消耗与预测"
          data={trend.map((x, i) => ({ ...x, value: x.value * 24 + i * 60 }))}
        />
        <Gauge />
      </section>
      <section className="rbl-three-grid">
        <Bars title="团队额度分布" data={[84, 64, 49, 91]} />
        <Heatmap title="节点延迟 / 成功率" />
        <Card className="rbl-chart-card">
          <header>
            <h3>预警时间线</h3>
          </header>
          <div className="rbl-timeline">
            {[
              ["10:42", "视频理解组达到 80%"],
              ["09:18", "华南 A 延迟恢复"],
              ["昨天", "创作工具组借用公共池"],
            ].map((x) => (
              <div key={x[1]}>
                <i />
                <span>{x[0]}</span>
                <b>{x[1]}</b>
              </div>
            ))}
          </div>
        </Card>
      </section>
      <Card className="rbl-data-card">
        <header>
          <div>
            <h3>额度池</h3>
            <p>28 个团队配置</p>
          </div>
          <Button>批量调整</Button>
        </header>
        <Table
          columns={["团队", "总额", "已用", "阈值", "路由", "状态", "操作"]}
          rows={rows.map((row) => [
            <b>{row[0]}</b>,
            row[1],
            row[2],
            row[3],
            row[4],
            <Chip tone={row[5] === "正常" ? "success" : "warning"}>
              {row[5]}
            </Chip>,
            <Button onClick={() => setDrawer(true)}>编辑</Button>,
          ])}
        />
      </Card>
      <Drawer open={drawer} title="配置额度池" onClose={() => setDrawer(false)}>
        <div className="rbl-drawer-form">
          <Field label="额度池名称">
            <Input defaultValue="视频理解组" />
          </Field>
          <Select
            label="适用团队"
            value="video"
            options={[
              ["video", "视频理解组"],
              ["rec", "推荐算法组"],
            ]}
            onChange={() => {}}
          />
          <Field
            label="总额度（GB）"
            msg={
              invalid ? "新额度不能低于当前已使用额度 8,420 GB。" : undefined
            }
          >
            <Input
              type="number"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
            />
          </Field>
          <Field label={`预警阈值 ${threshold}%`}>
            <Input
              type="range"
              min="50"
              max="100"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
            />
          </Field>
          <Select
            label="节点路由"
            value={route}
            options={[
              ["east", "华东 A"],
              ["north", "华北 B"],
              ["public", "公共池"],
            ]}
            onChange={setRoute}
          />
          <Switch
            checked={renew}
            onChange={setRenew}
            label="自动续期"
            detail="结算周期结束时恢复额度"
          />
          {invalid && error && <Alert error={error} />}
          <div className="rbl-drawer-actions">
            <Button onClick={() => setDrawer(false)}>取消</Button>
            <AsyncButton pending={saving} onClick={save}>
              {saving ? "保存中…" : "保存配置"}
            </AsyncButton>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
