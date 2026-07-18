import { useState } from "react";
import {
  Check,
  Copy,
  FileText,
  KeyRound,
  Shield,
  Trash2,
  Webhook,
} from "lucide-react";
import { AreaChart, Bars, Gauge } from "./charts";
import { PageHeader } from "./common";
import {
  Alert,
  AsyncButton,
  Button,
  Card,
  Chip,
  Dialog,
  Field,
  Input,
  Segments,
  Select,
  Switch,
  Table,
  Textarea,
  type AppError,
} from "./ui";
export default function Settings() {
  const [tab, setTab] = useState("general");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [domain, setDomain] = useState("starlight.video");
  const [verified, setVerified] = useState(false);
  const [twofa, setTwofa] = useState(true);
  const [danger, setDanger] = useState(false);
  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 850));
    setSaving(false);
    if (error) return;
    setDirty(false);
  };
  const conflict = () =>
    setError({
      code: "SETTINGS_VERSION_CONFLICT",
      msg: "设置已被另一位管理员更新，请刷新后重新提交。",
      requestId: "req_set_4472",
      retryable: true,
    });
  return (
    <div className="rbl-page">
      <PageHeader
        eyebrow="ORGANIZATION CONTROL"
        title="设置"
        description="组织、安全、通知、集成与权限策略。"
        actions={
          <Button>
            <FileText />
            查看审计日志
          </Button>
        }
      />
      {error && <Alert error={error} onRetry={() => setError(null)} />}
      <div className="rbl-settings-layout">
        <Card className="rbl-settings-nav">
          {[
            "组织资料",
            "成员与角色",
            "权限策略",
            "安全",
            "通知",
            "集成",
            "API 与 Webhook",
            "账单",
            "危险区域",
          ].map((x, i) => (
            <Button key={x} className={i === 0 ? "active" : ""}>{x}</Button>
          ))}
        </Card>
        <div className="rbl-settings-main">
          <Card className="rbl-settings-card">
            <header>
              <div>
                <h3>组织资料</h3>
                <p>展示给所有成员和协作者的信息。</p>
              </div>
              <Segments
                value={tab}
                items={[
                  ["general", "常规"],
                  ["brand", "品牌"],
                  ["domain", "域名"],
                ]}
                onChange={setTab}
              />
            </header>
            {tab === "general" && (
              <div className="rbl-settings-form">
                <div className="rbl-avatar large">星</div>
                <Field label="组织名称">
                  <Input
                    defaultValue="星轨内容科技"
                    onChange={() => setDirty(true)}
                  />
                </Field>
                <Field label="组织简介">
                  <Textarea
                    defaultValue="连接创作者、内容和技术的企业工作台。"
                    onChange={() => setDirty(true)}
                  />
                </Field>
                <Select
                  label="默认语言"
                  value="zh"
                  options={[
                    ["zh", "简体中文"],
                    ["en", "English"],
                    ["ja", "日本語"],
                  ]}
                  onChange={() => setDirty(true)}
                />
              </div>
            )}
            {tab === "brand" && (
              <div className="rbl-brand-editor">
                <div className="rbl-logo-preview">星轨</div>
                <Button>上传品牌图</Button>
                <p>建议尺寸 512 × 512，支持 PNG、SVG。</p>
              </div>
            )}
            {tab === "domain" && (
              <div className="rbl-domain">
                <Field label="组织域名">
                  <Input
                    value={domain}
                    onChange={(e) => {
                      setDomain(e.target.value);
                      setDirty(true);
                      setVerified(false);
                    }}
                  />
                </Field>
                <Button
                  variant="primary"
                  onClick={() => setTimeout(() => setVerified(true), 600)}
                >
                  {verified ? (
                    <>
                      <Check />
                      已验证
                    </>
                  ) : (
                    "验证域名"
                  )}
                </Button>
              </div>
            )}
          </Card>
          <section className="rbl-three-grid">
            <Gauge title="安全分数" value={86} label="良好" />
            <Bars title="登录活动" data={[62, 76, 58, 91]} />
            <AreaChart title="API 使用量" />
          </section>
          <Card className="rbl-settings-card">
            <header>
              <div>
                <h3>安全与通知</h3>
                <p>策略修改会记录到审计日志。</p>
              </div>
              <Shield />
            </header>
            <Switch
              checked={twofa}
              onChange={(v) => {
                setTwofa(v);
                setDirty(true);
              }}
              label="强制双因素认证"
              detail="所有管理员下次登录时必须配置。"
            />
            <Switch
              checked={true}
              onChange={() => setDirty(true)}
              label="异常登录通知"
              detail="向安全联系人发送即时消息。"
            />
          </Card>
          <Card className="rbl-data-card">
            <header>
              <div>
                <h3>API Key 与 Webhook</h3>
                <p>密钥仅在创建时展示一次。</p>
              </div>
              <Button variant="primary">
                <KeyRound />
                创建密钥
              </Button>
            </header>
            <Table
              columns={["名称", "权限", "最近使用", "状态", "操作"]}
              rows={[
                [
                  "Production Bot",
                  "内容读取",
                  "2 分钟前",
                  <Chip tone="success">活跃</Chip>,
                  <Button icon>
                    <Copy />
                  </Button>,
                ],
                [
                  "Analytics Hook",
                  "事件推送",
                  "1 小时前",
                  <Chip>活跃</Chip>,
                  <Button onClick={conflict}>
                    <Webhook />
                    测试
                  </Button>,
                ],
              ]}
            />
          </Card>
          <Card className="rbl-danger">
            <header>
              <div>
                <h3>危险区域</h3>
                <p>删除组织后，所有数据将无法恢复。</p>
              </div>
              <Button variant="danger" onClick={() => setDanger(true)}>
                <Trash2 />
                删除组织
              </Button>
            </header>
          </Card>
        </div>
      </div>
      {dirty && (
        <div className="rbl-savebar">
          <span>
            <i />
            有未保存的更改
          </span>
          <div>
            <Button onClick={() => setDirty(false)}>放弃更改</Button>
            <AsyncButton pending={saving} onClick={save}>
              {saving ? "保存中…" : "保存设置"}
            </AsyncButton>
            <Button variant="ghost" onClick={conflict}>
              模拟冲突
            </Button>
          </div>
        </div>
      )}
      <Dialog
        open={danger}
        title="确认删除组织"
        onClose={() => setDanger(false)}
      >
        <div className="rbl-danger-dialog">
          <p>输入组织名称“星轨内容科技”以确认。此操作不可撤销。</p>
          <Field label="组织名称">
            <Input />
          </Field>
          <Button variant="danger" onClick={() => setDanger(false)}>
            永久删除
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
