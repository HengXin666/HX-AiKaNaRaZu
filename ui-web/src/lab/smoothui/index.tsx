import{useEffect, useState, type ReactNode} from "react";
import{useLocation, useNavigate} from "react-router-dom";
import{AnimatePresence, motion} from "motion/react";
import{
    Activity,
    AlertCircle,
    BarChart3,
    Bell,
    Bot,
    Check,
    ChevronLeft,
    CircleDollarSign,
    Copy,
    Database,
    Download,
    Gauge,
    Heart,
    HelpCircle,
    LayoutDashboard,
    Menu,
    MessageCircle,
    Moon,
    MoreHorizontal,
    Plus,
    RefreshCw,
    Search,
    Send,
    Settings,
    Shield,
    Sparkles,
    Sun,
    Upload,
    UserPlus,
    Users,
    Video,
    X,
} from "lucide-react";
import{useTheme} from "@/lib/use-theme";
import{Area, Bars, Donut, Funnel, GaugeChart, Heatmap, Metric, type Point} from
    "./charts";
import{SAlert, SAvatarButton, SBadge, SButton, SCard, SDrawer, SIconButton,
       SInput, SModal, SNodeButton, SSearchInput, SSelect, SSwitch, STable,
       STableBody, STableCell, STableHead, STableHeader, STableRow, STextarea,
       SToast} from "./ui";
import "./styles.css";

type ModuleId = "dashboard" | "quota" | "community" | "settings";
type AppError = {code : string;
msg : string;
fieldErrors ?: Record<string, string>;
requestId ?: string;
retryable : boolean
}
;
const trend : Point[] = [
  {label : "06/01", value : 72, secondary : 28},
  {label : "06/05", value : 86, secondary : 35},
  {label : "06/09", value : 79, secondary : 31},
  {label : "06/13", value : 108, secondary : 42},
  {label : "06/17", value : 104, secondary : 48},
  {label : "06/21", value : 132, secondary : 55},
  {label : "06/25", value : 149, secondary : 61},
  {label : "06/30", value : 166, secondary : 72}
];
const heat =
    Array.from({length : 42}, (_, i) => 18 + ((i * 17 + i % 5 * 11) % 82));
const videos = [
  {
    title : "10 分钟看懂生成式 AI",
    author : "科技研习社",
    play : "86.4 万",
    rate : "68%",
    status : "增长"
  },
  {
    title : "城市夜行：上海篇",
    author : "镜头之外",
    play : "62.1 万",
    rate : "74%",
    status : "稳定"
  },
  {
    title : "独立游戏开发日志 #12",
    author : "像素工坊",
    play : "48.7 万",
    rate : "81%",
    status : "增长"
  },
  {
    title : "三分钟料理：夏日凉面",
    author : "阿满厨房",
    play : "31.5 万",
    rate : "57%",
    status : "关注"
  }
];
const quotas = [
  {
    team : "视频理解组",
    quota : "12,000 GB",
    used : "8,420 GB",
    threshold : "80%",
    route : "华东 A",
    status : "预警"
  },
  {
    team : "推荐算法组",
    quota : "18,000 GB",
    used : "9,160 GB",
    threshold : "85%",
    route : "华北 B",
    status : "正常"
  },
  {
    team : "内容安全组",
    quota : "8,000 GB",
    used : "3,920 GB",
    threshold : "75%",
    route : "华南 A",
    status : "正常"
  },
  {
    team : "创作工具组",
    quota : "6,000 GB",
    used : "5,480 GB",
    threshold : "90%",
    route : "公共池",
    status : "临界"
  }
];

function PageHeader({eyebrow, title, description, actions, range = true} : {
eyebrow:
  string;
title:
  string;
description:
  string;
actions:
  ReactNode;
  range ?: boolean
}) {
  const[period, setPeriod] = useState("30d");
  const[refreshing, setRefreshing] = useState(false);
  return <><header className = "sbo-page-head"><div><span>{eyebrow} </span>
             <h1>{title} </h1> <p>{description} </p> </div>
             <div>{actions} </div>
             </header><div className = "sbo-toolbar"><div>
             <SBadge tone = "success"> 实时数据</SBadge>
             <span> 最近同步 2 分钟前</span></div><div>{
                 range &&
                 <SSelect compact label = "时间范围" value = {period} onChange =
                      {setPeriod} options = {[[ "7d", "近 7 天" ],
                                              [ "30d", "近 30 天" ],
                                              [ "90d", "近 90 天" ]]} />} <SButton kind = "outline" onPress = {() => {setRefreshing(true);
  setTimeout(() => setRefreshing(false), 900)
}
}
>
    <RefreshCw size = {14} className = {refreshing ? "spin" : ""} />{
        refreshing ? "刷新中" : "刷新"} </SButton>
    <SIconButton label = "更多"><MoreHorizontal /></SIconButton></div></div>
    </>
}
function KPIs({kind = "dash"} : {kind ?: "dash" | "quota"}) {
  const dash = [
    <Metric label = "总播放量" value = "381.2 万" delta =
         "12.8%" points = {[22, 28, 26, 36, 41, 47]} icon = {<Video />} />,
    <Metric label = "活跃用户" value = "28.6 万" delta =
         "8.4%" points = {[18, 21, 29, 27, 35, 39]} icon = {<Users />} />,
    <Metric label = "新增粉丝" value = "42,891" delta =
         "16.1%" points = {[14, 17, 16, 24, 29, 37]} icon = {<Heart />} />,
    <Metric label = "预估收入" value = "¥ 862,430" delta = "6.9%" points =
         {[24, 25, 31, 29, 34, 38]} icon = {<CircleDollarSign />} />
  ];
  const quota = [
    <Metric label = "总额度" value = "64,000 GB" delta =
         "4.2%" points = {[28, 30, 34, 35, 38, 42]} icon = {<Database />} />,
    <Metric label = "已分配" value = "44,000 GB" delta =
         "9.8%" points = {[21, 24, 25, 29, 34, 39]} icon = {<Gauge />} />,
    <Metric label = "今日消耗" value = "3,842 GB" delta =
         "11.3%" points = {[14, 20, 18, 27, 33, 31]} icon = {<Activity />} />,
    <Metric label = "预警团队" value = "4" delta =
         "2 新增" points = {[8, 7, 9, 12, 11, 16]} icon = {<AlertCircle />} />
  ];
  return <div className = "sbo-kpis">{
             (kind === "dash" ? dash : quota)
                 .map((x, i) => <div key = {i}>{x} </div>)} </div>
}
function Pager(){
    return <div className = "sbo-pager"> <span > 1–4 / 28 </span>
               <SButton kind = "outline"> 上一页</SButton> <SButton className = "active" > 1 </SButton> <SButton > 2 </SButton>
                                   <SButton kind = "outline"> 下一页</SButton>
                                   </div>}

function Dashboard({onDetail} : {onDetail : (p : Point) => void}) {
  const[error, setError] = useState<AppError | null>(null);
  const[sort, setSort] = useState(false);
  return <div className = "sbo-page">
         <PageHeader eyebrow = "CONTENT INTELLIGENCE" title =
              "企业数据总览" description =
                  "围绕视频、用户与收入的全站运营态势。" actions =
                      {<><SButton kind = "outline"><Download /> 导出</SButton>
                       <SButton kind = "primary"><Sparkles />
                           生成报告</SButton></>} />{
             error &&
             <SAlert error = {error} onRetry = {() => setError(null)} />} <KPIs /> <div className = "sbo-primary">
         <Area title = "播放与互动趋势" data = {trend} onPoint = {onDetail} />
         <Donut title = "流量来源" data =
              {[{label : "首页推荐", value : 46, color : "#990099"},
                {label : "站内搜索", value : 24, color : "#d23ad2"},
                {label : "关注动态", value : 18, color : "#7750c7"},
                {label : "外部链接", value : 12, color : "#6b7280"}]} /></div>
         <div className = "sbo-thirds">
         <Bars title = "内容分区表现" data =
              {[{label : "动画", value : 82, secondary : 61},
                {label : "游戏", value : 74, secondary : 66},
                {label : "知识", value : 63, secondary : 48},
                {label : "生活", value : 51, secondary : 44}]} />
         <Heatmap title = "发布时间热力图" values = {heat} />
         <Funnel title = "用户留存漏斗" /></div>
         <SCard className = "sbo-table-card"><header><div><h3> 视频表现</h3>
         <p> 内容、完播和异常表现</p></div><div>
         <SButton kind = "outline" onPress = {() => setSort(!sort)}>
         <BarChart3 /> 播放排序</SButton>
         <SButton kind = "outline" onPress =
              {() => setError({
                      code : "DASHBOARD_TIMEOUT",
                      msg : "数据服务响应超时，请稍后重试。",
                      requestId : "req_dash_9201",
                      retryable : true
                    })}>
             模拟错误</SButton></div></header><div className = "sbo-table">
         <STable><STableHead><STableRow><STableHeader> 视频</STableHeader><STableHeader> UP 主</STableHeader><STableHeader> 播放</STableHeader><STableHeader> 完播率</STableHeader><STableHeader> 状态</STableHeader><STableHeader> 操作</STableHeader></STableRow></STableHead><STableBody>{[... videos]
                     .sort((a, b) => sort ? b.play.localeCompare(a.play) : 0)
                     .map(x => <STableRow key = {x.title}><STableCell>
                              <span className = "sbo-video"><i><Video /></i>
                              <b>{x.title} </b>
                              </span></STableCell><STableCell>{x.author} </STableCell><STableCell>{x.play} </STableCell><STableCell>{x.rate} </STableCell><STableCell>
                              <SBadge tone = {x.status === "关注" ? "warning"
                                                       : "success"}>{x.status} </SBadge> </STableCell><STableCell><SIconButton label = "更多">
                              <MoreHorizontal /></SIconButton></STableCell></STableRow>)}</STableBody></STable></div><Pager /></SCard></div>
}

function Quota({onConfigure} : {onConfigure : () => void}) {
  const[error, setError] = useState<AppError | null>(null);return <div className="sbo-page"><PageHeader eyebrow="RELAY CAPACITY" title="中转站额度配置" description="统一管理节点、团队额度与溢出策略。" actions={<SButton kind="primary" onPress={onConfigure}><Plus/>新增额度池</SButton>}/>{error&&<SAlert error={error}/>}<KPIs kind="quota"/><div className="sbo-primary"><Area title="额度消耗与预测" data={trend.map((x,i) => ({...x,value:x.value*30,secondary:(x.secondary??0)*38+i*80}))}/><GaugeChart title="总池使用率" value={69} label="44 / 64 TB"/></div><div className="sbo-thirds"><Bars title="团队额度分布" data={[{label:"视频理解",value:84,secondary:70},{label:"推荐算法",value:64,secondary:51},{label:"内容安全",value:49,secondary:39},{label:"创作工具",value:91,secondary:82}]}/><SCard className="sbo-chart"><header><div><h3>节点质量</h3><p>延迟 × 成功率</p></div></header><div className="sbo-node-map">{[[24,30,"华东 A"],[46,52,"华北 B"],[72,74,"新加坡"],[34,68,"华南 A"]].map(([x,y,l]) => <SNodeButton key={l} style={
    {
    left:
      `${x}%`, top :`${y}%`
    }} title={`${l} · 正常`}><i/><span>{l}</span></SNodeButton>)}</div></SCard><SCard className="sbo-chart"><header><h3>预警时间线</h3></header><div className="sbo-timeline">{[["10:42","视频理解组达到 80%"],["09:18","华南 A 延迟恢复"],["昨天","创作工具组借用公共池"]].map(x => <div key={x[1]}><i/><span>{x[0]}</span><b>{x[1]}</b></div>)}</div></SCard></div><SCard className="sbo-table-card"><header><div><h3>额度池</h3><p>28 个团队配置</p></div><SButton kind="outline">批量调整</SButton></header><div className="sbo-table"><STable><STableHead><STableRow><STableHeader>团队</STableHeader><STableHeader>总额</STableHeader><STableHeader>已用</STableHeader><STableHeader>阈值</STableHeader><STableHeader>路由</STableHeader><STableHeader>状态</STableHeader><STableHeader>操作</STableHeader></STableRow></STableHead><STableBody>{quotas.map(x => <STableRow key={x.team}><STableCell><b>{x.team}</b></STableCell><STableCell>{x.quota}</STableCell><STableCell>{x.used}</STableCell><STableCell>{x.threshold}</STableCell><STableCell>{x.route}</STableCell><STableCell><SBadge tone={x.status==="正常"?"success":"warning"}>{x.status}</SBadge></STableCell><STableCell><SButton onPress={onConfigure}>编辑</SButton></STableCell></STableRow>)}</STableBody></STable></div><div className="sbo-table-bottom"><SButton onPress={() => setError({code:"QUOTA_BELOW_USAGE",msg:"新额度不能低于当前已使用额度 8,420 GB。",retryable:false})}>模拟额度错误</SButton><Pager/></div></SCard></div>
}

function Community({showToast} : {showToast : (m : string) => void}) {
  const[message, setMessage] = useState("");
  const[liked, setLiked] = useState(false);
  const[tab, setTab] = useState("rich");
  const[error, setError] = useState<AppError | null>(null);
  const publish = () => {
    if (message.includes("内部接口")) {
      setError({
        code : "POST_REJECTED",
        msg : "内容包含受限词“内部接口”，请修改后重新发布。",
        fieldErrors : {content : "请移除受限词"},
        retryable : false
      });
      return
    }
    setError(null);
    setMessage("");
    showToast("帖子发布成功，已进入社区最新动态。");
  };
  return <div className = "sbo-page">
             <PageHeader
                  eyebrow = "COMMUNITY OPERATIONS" title = "社区" description = "发布内容、回复用户并治理风险讨论。" actions = {<SButton kind = "primary"><Plus /> 发布帖子</SButton>} />{error && <SAlert error = {error} />} <div className = "sbo-community" > <div className = "sbo-feed"><SCard className = "sbo-composer"><header><span className = "sbo-avatar"> 星</span><div><b> 星轨内容科技</b><p>
                                                                                                                                                                                                                                                                        以组织身份发布</p></div></header><div className = "sbo-tabs"><SButton className =
                                                                                                                                                                                                                                                                                                                            {
                                                                                                                                                                                                                                                                                                                                tab === "rich" ? "active" : ""} onPress = {() =>
                                                                                                                                                                                                                                                                                                                                                                                setTab(
                                                                                                                                                                                                                                                                                                                                                                                    "rich")}>
                                                                                                                                                                                                                                                                            富文本</SButton><SButton className = {tab === "markdown" ? "active" : ""} onPress = {() => setTab("markdown")}> Markdown</SButton>
                                                                                                                                                                                                                                                  </div> <STextarea
                                                                                                                                                                                                                                                      label =
                                                                                                                                                                                                                                                      {
                                                                                                                                                                                                                                                          tab === "rich" ? "帖子内容"
                                                                                                                                                                                                                                                                          : "Markdown"} value = {message} onChange = {setMessage} error = {error
                                                                                                                                                                                                                                                                                                                                           ?.fieldErrors
                                                                                                                                                                                                                                                                                                                                           ?.content } placeholder =
                                                                                                                                                                                                                                                                                                                                                {tab === "rich" ? "分享新鲜事，输入“内部接口”可测试错误 msg…" : "# 使用 Markdown 创作"} /
                                                                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                                                <footer>
                                                                                                                                                                                                                                                                                                                                                    <div>
                                                                                                                                                                                                                                                                                                                                                    <SIconButton
                                                                                                                                                                                                                                                                                                                                                         label =
                                                                                                                                                                                                                                                                                                                                                             "上传">
                                                                                                                                                                                                                                                                                                                                                    <Upload />
                                                                                                                                                                                                                                                                                                                                                    </SIconButton><SBadge>{
                                                                                                                                                                                                                                                                                                                                                        message
                                                                                                                                                                                                                                                                                                                                                            .length} /
                                                                                                                                                                                                                                                                                                                                                    500 </SBadge> </div><SButton kind = "primary" onPress = {publish}><Send /> 发布</SButton></footer>
                                                                                                                                                                                                                                                                                                                                                </SCard>{[{
                                                                                                                                                                                                                                                                                                                                                               name : "像素工坊",
                                                                                                                                                                                                                                                                                                                                                               time :
                                                                                                                                                                                                                                                                                                                                                                   "18 分钟前",
                                                                                                                                                                                                                                                                                                                                                               text :
                                                                                                                                                                                                                                                                                                                                                                   "独立游戏开发日志第 12 期上线了！这次重点拆解角色状态机与光照优化。",
                                                                                                                                                                                                                                                                                                                                                               tag :
                                                                                                                                                                                                                                                                                                                                                                   "#独立游戏"
                                                                                                                                                                                                                                                                                                                                                             },
                                                                                                                                                                                                                                                                                                                                                              {
                                                                                                                                                                                                                                                                                                                                                                name :
                                                                                                                                                                                                                                                                                                                                                                    "科技研习社",
                                                                                                                                                                                                                                                                                                                                                                time :
                                                                                                                                                                                                                                                                                                                                                                    "42 分钟前",
                                                                                                                                                                                                                                                                                                                                                                text :
                                                                                                                                                                                                                                                                                                                                                                    "生成式 AI 系列进入收官阶段，下一期想看模型部署还是提示工程？",
                                                                                                                                                                                                                                                                                                                                                                tag :
                                                                                                                                                                                                                                                                                                                                                                    "#AI创作"
                                                                                                                                                                                                                                                                                                                                                              }]
                                                                                                                                                                                                                                                                                                                                                                 .map((p,
                                                                                                                                                                                                                                                                                                                                                                       i) => <SCard className = "sbo-post" key = {p.name}>
                                                                                                                                                                                                                                                                                                                                                                            <header>
                                                                                                                                                                                                                                                                                                                                                                            <span className =
                                                                                                                                                                                                                                                                                                                                                                                 "sbo-avatar">{p.name
                                                                                                                                                                                                                                                                                                                                                                                                   [0]} </span>
                                                                                                                                                                                                                                                                                                                                                                            <div>
                                                                                                                                                                                                                                                                                                                                                                            <b>{p.name} </b> <p>{p.time} </p> </div><SIconButton label =
                                                                                                                                                                                                                                                                                                                                                                                                                  "更多"><MoreHorizontal /></SIconButton></header><p>{p.text} </p>
                                                                                                                                                                                                                                                                                                                                                                            <SBadge>{p.tag} </SBadge> <footer><SButton
                                                                                                                                                                                                                                                                                                                                                                                               className =
                                                                                                                                                                                                                                                                                                                                                                                                   {liked && i === 0 ? "liked" : ""} onPress = {() => {if (i ===
                                                                                                                                                                                                                                                                                                                                                                                                                                                               0)
                                                                                                                                                                                                                                                                                                                                                                                                                                                           setLiked(!liked)}}><Heart />{i === 0 ? (liked ? 129 : 128)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 : 86} </SButton>
                                                                                                                                                                                                                                                                                                                                                                      <SButton> <MessageCircle /> 24 </SButton> <SButton><Send />
                                                                                                                                                                                                                                                                                                                                                                                                             分享</SButton></footer></SCard>)} </div>
                                                                                                                                                                                                                                                                                                                                           <aside><GaugeChart
                                                                                                                                                                                                                                                                                                                                                       title = "社区健康度" value =
                                                                                                                                                                                                                                                                                                                                                           {92} label = "状态良好" /><Area
                                                                                                                                                                                                                                                                                                                                                                                          title = "发帖趋势" data = {trend
                                                                                                                                                                                                                                                                                                                                                                                                                         .slice(0, 6)} /><Donut title = "热门话题" data =
                                                                                                                                                                                                                                                                                                                                                                                                                                              {[{
                                                                                                                                                                                                                                                                                                                                                                                                                                                label :
                                                                                                                                                                                                                                                                                                                                                                                                                                                    "AI 创作",
                                                                                                                                                                                                                                                                                                                                                                                                                                                value :
                                                                                                                                                                                                                                                                                                                                                                                                                                                    38,
                                                                                                                                                                                                                                                                                                                                                                                                                                                color :
                                                                                                                                                                                                                                                                                                                                                                                                                                                    "#990099"
                                                                                                                                                                                                                                                                                                                                                                                                                                              },
                                                                                                                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                                                                                                  label :
                                                                                                                                                                                                                                                                                                                                                                                                                                                      "独立游戏",
                                                                                                                                                                                                                                                                                                                                                                                                                                                  value :
                                                                                                                                                                                                                                                                                                                                                                                                                                                      27,
                                                                                                                                                                                                                                                                                                                                                                                                                                                  color :
                                                                                                                                                                                                                                                                                                                                                                                                                                                      "#d23ad2"
                                                                                                                                                                                                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                                                                                                  label :
                                                                                                                                                                                                                                                                                                                                                                                                                                                      "生活方式",
                                                                                                                                                                                                                                                                                                                                                                                                                                                  value :
                                                                                                                                                                                                                                                                                                                                                                                                                                                      21,
                                                                                                                                                                                                                                                                                                                                                                                                                                                  color :
                                                                                                                                                                                                                                                                                                                                                                                                                                                      "#7750c7"
                                                                                                                                                                                                                                                                                                                                                                                                                                                },
                                                                                                                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                                                                                                  label :
                                                                                                                                                                                                                                                                                                                                                                                                                                                      "其他",
                                                                                                                                                                                                                                                                                                                                                                                                                                                  value :
                                                                                                                                                                                                                                                                                                                                                                                                                                                      14,
                                                                                                                                                                                                                                                                                                                                                                                                                                                  color :
                                                                                                                                                                                                                                                                                                                                                                                                                                                      "#64748b"
                                                                                                                                                                                                                                                                                                                                                                                                                                                }]} /></aside>
                                                                                                                                                                                                                                                                                                                                           </div><SCard className =
                                                                                                                                                                                                                                                                                                                                                     "sbo-table-card"><header><div>
                                                                                                                                                                                                                                                                                                                                           <h3>
                                                                                                                                                                                                                                                                                                                                               举报与治理</h3> <p > 18 条内容待处理</p></div><SButton kind = "outline">
                                                                                                                                                                                                                                                                                                                                                                          批量分配</SButton></header><div className = "sbo-table">
                                                                                                                                                                                                                                                                                                                                           <STable><STableHead><STableRow><STableHeader>
                                                                                                                                                                                                                                                                                                                                               内容</STableHeader><STableHeader>
                                                                                                                                                                                                                                                                                                                                                   原因</STableHeader><STableHeader>
                                                                                                                                                                                                                                                                                                                                                       风险</STableHeader><STableHeader>
                                                                                                                                                                                                                                                                                                                                                           举报数</STableHeader><STableHeader>
                                                                                                                                                                                                                                                                                                                                                               处理人</STableHeader><STableHeader>
                                                                                                                                                                                                                                                                                                                                                                   操作</STableHeader></STableRow></STableHead><STableBody>{[
                                                                                                                                                                                                                                                                                                                                                       [
                                                                                                                                                                                                                                                                                                                                                         "疑似推广外链",
                                                                                                                                                                                                                                                                                                                                                         "垃圾广告",
                                                                                                                                                                                                                                                                                                                                                         "高",
                                                                                                                                                                                                                                                                                                                                                         "12",
                                                                                                                                                                                                                                                                                                                                                         "未分配"
                                                                                                                                                                                                                                                                                                                                                       ],
                                                                                                                                                                                                                                                                                                                                                       [
                                                                                                                                                                                                                                                                                                                                                         "争议性回复",
                                                                                                                                                                                                                                                                                                                                                         "人身攻击",
                                                                                                                                                                                                                                                                                                                                                         "中",
                                                                                                                                                                                                                                                                                                                                                         "7",
                                                                                                                                                                                                                                                                                                                                                         "林可"
                                                                                                                                                                                                                                                                                                                                                       ],
                                                                                                                                                                                                                                                                                                                                                       [
                                                                                                                                                                                                                                                                                                                                                         "转载视频",
                                                                                                                                                                                                                                                                                                                                                         "版权争议",
                                                                                                                                                                                                                                                                                                                                                         "中",
                                                                                                                                                                                                                                                                                                                                                         "4",
                                                                                                                                                                                                                                                                                                                                                         "周雨"
                                                                                                                                                                                                                                                                                                                                                       ]]
                                                                                                                                                                                                                                                                                                                                                       .map(x => <STableRow key = {x[0]}><STableCell><b>{x[0]} </b> </STableCell><STableCell>{x
                                                                                                                                                                                                                                                                                                                                                                                                                        [1]} </STableCell><STableCell>
                                                                                                                                                                                                                                                                                                                                                                <SBadge tone =
                                                                                                                                                                                                                                                                                                                                                                     {x[2] ===
                                                                                                                                                                                                                                                                                                                                                                          "高" ? "danger" : "warning"}>{x
                                                                                                                                                                                                                                                                                                                                                                                                            [2]} </SBadge> </STableCell><STableCell>{x[3]} </STableCell><STableCell>{x[4]} </STableCell><STableCell><SButton> 处理</SButton></STableCell></STableRow>)}</STableBody></STable>
                                                                                                                                                                                                                                                                                                                                           </div>
                                                                                                                                                                                                                                                                                                                                           </SCard>
                                                                                                                                                                                                                                                                                                                                           </div>
}

function SettingsPage({showToast} : {showToast : (m : string) => void}) {
  const[section, setSection] = useState("org");
  const[tab, setTab] = useState("general");
  const[name, setName] = useState("星轨内容科技");
  const[bio, setBio] = useState("为创作者提供下一代内容技术与运营服务。");
  const[dirty, setDirty] = useState(false);
  const[saving, setSaving] = useState(false);
  const[error, setError] = useState<AppError | null>(null);
  const[twoFactor, setTwoFactor] = useState(true);
  const change = (fn : (v : string) => void) => (v : string) => {
    fn(v);
    setDirty(true)
  };
  const save = () => {
    setSaving(true);
    setTimeout(() =>                     {
                      setSaving(false);
                      setDirty(false);
                      showToast("设置已保存并同步到组织成员。")
                    },
               900)
  };
  return <div className = "sbo-page sbo-settings-page">
             <PageHeader eyebrow = "ORGANIZATION CONTROL" title =
                  "设置" description =
                      "管理组织、安全、通知、集成与开发者能力。" actions =
                          {<SButton kind = "outline">
                               查看审计日志</SButton>} range = {false} />{
                 error &&
                 <SAlert error = {error} onRetry = {() => setError(null)} />} <div className =
             "sbo-settings" >
             <aside>{
                 ["组织资料", "成员与角色", "权限策略", "安全", "通知", "集成",
                  "API 与 Webhook", "账单", "危险区域"]
                     .map((x, i) =>
                              <SButton className = {section === (i ? x : "org")
                                                                     ? "active"
                                                                     : ""} key =
                                   {x} onPress = {() => setSection(
                                                             i ? x : "org")}>{
                                  x} </SButton>)} </aside>
             <div><div className = "sbo-tabs">{
                 [[ "general", "常规" ], [ "brand", "品牌" ],
                  [ "domain", "域名" ]]
                     .map(x => <SButton key = {x[0]} className =
                                     {tab === x[0] ? "active" : ""} onPress =
                                         {() => setTab(x[0])}>{x[1]} </SButton>)} </div>
             <SCard className = "sbo-settings-form"><header><div>
             <h3> 组织资料</h3><p> 展示给成员和协作者的信息。</p></div>
             </header><div className = "sbo-avatar-row">
             <span className = "sbo-avatar large"> 星</span>
             <SButton kind = "outline"> 更换头像</SButton></div>
             <SInput label =
                  "组织名称" value = {name} onChange = {change(setName)} />
             <STextarea label =
                  "组织简介" value = {bio} onChange = {change(setBio)} />
             <SSelect label = "默认语言" value =
                  "zh" onChange = {() => setDirty(true)} options =
                      {[[ "zh", "简体中文" ], [ "en", "English" ],
                        [ "ja", "日本語" ]]} />{
                 tab === "domain" && <div className = "sbo-domain">
                   <SInput label = "自定义域名" value =
                        "studio.biliops.cn" onChange = {() => setDirty(true)} />
                   <SBadge tone = "success">
                       已验证</SBadge></div>} </SCard>
             <div className = "sbo-settings-charts">
             <GaugeChart title = "安全分数" value = {86} label = "良好" />
             <Bars title = "登录活动" data = {[{label : "周一", value : 62},
                                               {label : "周二", value : 76},
                                               {label : "周三", value : 58},
                                               {label : "周四", value : 91}]} />
             <Area title = "API 使用量" data = {trend.slice(0, 6)} /></div>
             <SCard className = "sbo-security"><header><div>
             <h3> 安全与通知</h3><p> 策略修改会记录到审计日志。</p></div>
             </header> <SSwitch checked = {twoFactor} onChange = {
               v => {setTwoFactor(v);
  setDirty(true)
}
}
label = "强制双因素认证" description =
    "所有管理员下次登录时必须配置。" />
    <SSwitch checked = {true} onChange = {() => setDirty(true)} label =
         "异常登录通知" description = "向安全联系人发送即时消息。" /><details>
    <summary> 高级会话策略</summary>
    <p> 会话有效期 12 小时；高风险设备需重新认证。</p></details></SCard>
    <SCard className = "sbo-danger"><header><div><h3> 危险区域</h3>
    <p> 这些操作不可撤销。</p></div></header>
    <SButton kind = "danger" onPress =
         {() => setError({
                 code : "SETTINGS_VERSION_CONFLICT",
                 msg : "设置已被另一位管理员更新，请刷新后重新提交。",
                 requestId : "req_settings_442",
                 retryable : true
               })}>
        模拟版本冲突</SButton></SCard></div>
    </div>{
        dirty &&<motion.div className = "sbo-savebar" initial =
                     {{y : 50, opacity : 0}} animate = {{y : 0, opacity : 1}}>
        <span><i />
            有未保存的更改</span><div>
        <SButton onPress = {() => setDirty(false)}>
            放弃更改</SButton>
        <SButton kind = "primary" disabled = {saving} onPress = {save}>
        <Check />{saving ? "保存中…" : "保存设置"} </SButton>
        </div></motion.div>} </div>
}

function QuotaDrawer({open, onClose, showToast} : {
open:
  boolean;
onClose:
  () => void;
showToast:
  (m : string) => void
}) {
  const[name, setName] = useState("视频理解组");
  const[quota, setQuota] = useState("12000");
  const[threshold, setThreshold] = useState("80");
  const[route, setRoute] = useState("east");
  const[renew, setRenew] = useState(true);
  const error = Number(quota) < 8420 ? "新额度不能低于当前已使用额度 8,420 GB。"
                                     : undefined;
  return <SDrawer open = {open} onClose = {onClose} title =
             "配置额度池" footer = {
                 <><SButton onPress = {onClose}> 取消</SButton> <SButton kind = "primary" disabled = {
                     Boolean(error)} onPress = {() => {onClose();
  showToast("额度配置已保存，1 分钟内生效。")
}
}
> 保存配置</SButton></>
}
> <div className = "sbo-drawer-form">
    <SInput label = "额度池名称" value = {name} onChange = {setName} />
    <SSelect label = "适用团队" value = "video" onChange =
     {() => {}
    } options = {[[ "video", "视频理解组" ], [ "recommend", "推荐算法组" ],
                  [ "safety", "内容安全组" ]]} />
    <SInput label = "总额度（GB）" value = {quota} type =
         "number" onChange = {setQuota} error = {error} />
    <SInput label = "预警阈值（%）" value = {threshold} type =
         "number" onChange = {setThreshold} /><div className = "sbo-threshold">
    <span style = {{width :`${threshold}%`}} /></div>
    <SSelect label = "节点路由" value = {route} onChange = {setRoute} options =
         {[[ "east", "华东 A" ], [ "north", "华北 B" ],
           [ "public", "公共池" ]]} />
    <SSwitch checked = {renew} onChange = {setRenew} label = "自动续期" />
    <details><summary> 高级限制</summary><p> 并发上限 40，超额时借用公共池。 </p> </details></div></SDrawer>
}

export default function BiliOpsSmoothUI() {
  const {theme, toggleTheme} = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const module =
      (location.pathname.split("/").pop() || "dashboard") as ModuleId;
  const[collapsed, setCollapsed] = useState(false);
  const[mobile, setMobile] = useState(false);
  const[createOpen, setCreateOpen] = useState(false);
  const[noticeOpen, setNoticeOpen] = useState(false);
  const[quotaOpen, setQuotaOpen] = useState(false);
  const[detail, setDetail] = useState<Point | null>(null);
  const[toast, setToast] = useState("");
  const[command, setCommand] = useState(false);
  const[dangerOpen, setDangerOpen] = useState(false);
  useEffect(() =>                  {
                   if (!toast)
                     return;
                   const t = setTimeout(() => setToast(""), 2600);
                   return () => clearTimeout(t)
                 },
            [toast]);
  const go = (id : ModuleId) => {
    navigate(`/ lab / smoothui / ${ id }`);
    setMobile(false)
  };
  const nav = [
    {
      id : "dashboard" as const,
      label : "企业数据总览",
      icon : <LayoutDashboard />
    },
    {id : "quota" as const, label : "中转站额度", icon : <Gauge />},
    {id : "community" as const, label : "社区", icon : <MessageCircle />},
    {id : "settings" as const, label : "设置", icon : <Settings />}
  ];
  return <div className = {`sbo-app ${collapsed ? "collapsed" : ""}`} data-theme = {theme}><header className = "sbo-top">
         <div className = "sbo-logo">
         <SIconButton label = "菜单" onPress = {() => setMobile(true)}><Menu />
         </SIconButton><span><Bot /></span><b> BiliOps</b>
         <SBadge> SmoothUI</SBadge></div><div className = "sbo-search">
         <Search />
         <SSearchInput placeholder="搜索视频、用户、配置…" onFocus={() => setCommand(true)} onBlur={() => setTimeout(() => setCommand(false), 150)} />
         <kbd>⌘ K</kbd>{
             command &&
             <motion.div className = "sbo-command" initial =
                  {{opacity : 0, y : -6}} animate = {{opacity : 1, y : 0}}>
                 <small>
                     快速跳转</small>{nav.map(
                         x =>                              <SButton key = {x.id} onPress = {() => go(x.id)}>{
                                 x.icon} {x.label} <kbd >↵</kbd>
                             </SButton>)} </motion.div> } </div>
         <div className = "sbo-top-actions"><div className = "sbo-pop">
         <SButton kind =
              "primary" onPress = {() => setCreateOpen(!createOpen)}>
         <Plus /> 创建</SButton>{
             createOpen &&
             <div className = "sbo-popmenu">{
                 [[<Upload />, "上传视频" ], [<Gauge />, "配置额度" ],
                  [<MessageCircle />, "发布帖子" ], [<UserPlus />, "邀请成员" ]]
                     .map(x =>                               <SButton key = {x[1] as string} onPress = {() => {
                                   setToast(`已选择：${ x[1] }`);
                                   setCreateOpen(false)}}>{x[0]} {x[1]} </SButton>)
}
</div>
}
</div><div className = "sbo-pop">
    <SIconButton label = "通知" onPress = {() => setNoticeOpen(!noticeOpen)}>
    <Bell /> <i className =
    "sbo-count" > 3 </i>
    </SIconButton>{
        noticeOpen &&<div className = "sbo-notices"><h4> 通知</h4><b>
            额度即将耗尽</b><span>
                视频理解组已使用 80 %
        </span><b> 新举报待处理</b><span> 社区收到 18 条举报</span></div>} </div>
    <SIconButton label = "切换主题" onPress = {toggleTheme}>{
        theme === "dark" ? <Sun /> : <Moon />} </SIconButton>
    <SAvatarButton label="用户菜单">HX</SAvatarButton></div></header>
    <aside className = {`sbo-side ${mobile ? "mobile" : ""}`}>
    <div className = "sbo-workspace"><span className = "sbo-avatar"> 星</span>{
        !collapsed &&
        <div><b> 星轨内容科技</b><small> 企业工作区</small></div>} {
        mobile
            &&<SIconButton label = "关闭" onPress = {() => setMobile(false)}>
        <X /></SIconButton>} </div>
    <nav>{nav.map(
        x =>             <SButton key = {x.id} title =
                 {collapsed ? x.label : undefined} className =
                     {module === x.id ? "active" : ""} onPress =
                         {() => go(x.id)}>{
                x.icon} { !collapsed &&<span>{x.label} </span> } {
                !collapsed &&x.id === "community" && <SBadge tone =
                                           "warning" > 18 </SBadge> } </SButton>)} </nav>
    <div className = "sbo-side-bottom"><SButton>
    <HelpCircle />{!collapsed && "帮助与文档"} </SButton> <SButton>
    <Activity />{!collapsed && "系统状态"} </SButton>
    <SButton onPress = {() => setCollapsed(!collapsed)}>
    <ChevronLeft className = {collapsed ? "flip" : ""} />{
        !collapsed && "收起侧栏"} </SButton>
    </div></aside><main className = "sbo-content">{
        module === "dashboard" &&<Dashboard onDetail = {setDetail} />} {
  module === "quota" &&<Quota onConfigure = {() => setQuotaOpen(true)} />
}
{
  module === "community" &&<Community showToast = {setToast} />
}
{module === "settings" &&<SettingsPage showToast = {setToast} />} </main>
    <QuotaDrawer open = {quotaOpen} onClose =
         {() => setQuotaOpen(false)} showToast = {setToast} /> <SDrawer open = {Boolean(detail)} onClose = {() => setDetail(
                                                           null)} title = {`${
    detail ?.label ?? "" } 数据下钻`} footer =
        {<><SButton onPress = {() => setDetail(null)}> 关闭</SButton>
         <SButton kind = "primary">
             查看完整报告</SButton></>} >
        <div className = "sbo-detail"><span> 播放量</span><strong>{
            detail ?.value.toLocaleString() } </strong>
            <div className = "sbo-warning"><AlertCircle /><div><b>
                    检测到异常增长</b>
                <p>
                    首页推荐流量较日均高 28 %，主要来自 3 个科技类视频。</p>
                </div></div>
                <Bars title =
                     "来源拆解" data = {[{label : "首页", value : 82},
                                         {label : "搜索", value : 48},
                                         {label : "关注", value : 31},
                                         {label : "外链", value : 18}]} />
                </div></SDrawer>
                <SModal open = {dangerOpen} onClose =
                     {() => setDangerOpen(false)} title = "确认危险操作"><p>
                    输入组织名称后才能继续。</p>
                <SInput label = "组织名称" value = "" onChange = {() => {}} />
            <SButton kind = "danger">
                确认删除</SButton></SModal><SToast message = {toast} />{
                    mobile &&<div className = "sbo-mobile-overlay" onClick =
                                  {() => setMobile(false)} />} </div>
}
