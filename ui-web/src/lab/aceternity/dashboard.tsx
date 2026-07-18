import { CircleDollarSign, Download, Ellipsis, Heart, RefreshCw, SlidersHorizontal, Sparkles, Users, Video } from "lucide-react";
import { useState } from "react";
import { AreaChart, BarChart, DonutChart, FunnelChart, Heatmap, MetricCard } from "./charts";
import { Button, Card, CardHead, Chip, DataTable, InlineAlert, PageHeader, Pagination, Select } from "./ui";
import { heatValues, trend, type AppError, type ChartPoint } from "./types";

const rows=[
  {title:"10 分钟看懂生成式 AI",author:"科技研习社",play:"86.4 万",rate:"68%",status:"增长"},
  {title:"城市夜行：上海篇",author:"镜头之外",play:"62.1 万",rate:"74%",status:"稳定"},
  {title:"独立游戏开发日志 #12",author:"像素工坊",play:"48.7 万",rate:"81%",status:"增长"},
  {title:"三分钟料理：夏日凉面",author:"阿满厨房",play:"31.5 万",rate:"57%",status:"关注"},
];

export default function DashboardRoute({onDetail}:{onDetail:(point:ChartPoint)=>void}) {
  const [error,setError]=useState<AppError|null>(null),[range,setRange]=useState("30d"),[sort,setSort]=useState<"default"|"play">("default"),[refreshing,setRefreshing]=useState(false);
  const refresh=()=>{setRefreshing(true);window.setTimeout(()=>setRefreshing(false),900)};
  const data=sort==="play"?[...rows].sort((a,b)=>b.play.localeCompare(a.play)):rows;
  return <div className="acl-page"><PageHeader eyebrow="CONTENT INTELLIGENCE" title="企业数据总览" description="围绕视频、用户与收入的全站运营态势。" actions={<><Button kind="outline"><Download/>导出</Button><Button kind="primary"><Sparkles/>生成报告</Button></>} toolbar={<><Select label="时间范围" value={range} onChange={setRange} options={[["7d","近 7 天"],["30d","近 30 天"],["90d","近 90 天"]]}/><Button kind="outline" onClick={refresh}><RefreshCw className={refreshing?"acl-spin":""}/>{refreshing?"刷新中":"刷新"}</Button></>}/>
    {error&&<InlineAlert error={error} onRetry={()=>setError(null)}/>}<section className="acl-kpis"><MetricCard label="总播放量" value="381.2 万" delta="12.8%" points={[22,28,26,36,41,47]} icon={<Video/>}/><MetricCard label="活跃用户" value="28.6 万" delta="8.4%" points={[18,21,29,27,35,39]} icon={<Users/>}/><MetricCard label="新增粉丝" value="42,891" delta="16.1%" points={[14,17,16,24,29,37]} icon={<Heart/>}/><MetricCard label="预估收入" value="¥ 862,430" delta="6.9%" points={[24,25,31,29,34,38]} icon={<CircleDollarSign/>}/></section>
    <section className="acl-primary-grid"><AreaChart title="播放与互动趋势" subtitle="切换图例、移动十字线并点击异常点下钻" data={trend} series={["播放","投币"]} error={error?.msg} onRetry={()=>setError(null)} onDrilldown={onDetail}/><DonutChart title="流量来源" data={[{label:"首页推荐",value:46,color:"#990099"},{label:"站内搜索",value:24,color:"#d23ad2"},{label:"关注动态",value:18,color:"#7750c7"},{label:"外部链接",value:12,color:"#6b7280"}]}/></section>
    <section className="acl-three-grid"><BarChart title="内容分区表现" data={[{label:"动画",value:82,secondary:61},{label:"游戏",value:74,secondary:66},{label:"知识",value:63,secondary:48},{label:"生活",value:51,secondary:44}]}/><Heatmap title="发布时间热力图" values={heatValues}/><FunnelChart title="用户留存漏斗" data={[{label:"曝光",value:1284000},{label:"播放",value:812000},{label:"互动",value:286000},{label:"关注",value:98400}]}/></section>
    <Card className="acl-table-card"><CardHead title="视频表现" subtitle="内容、完播和异常表现" action={<div className="acl-head-actions"><Button kind="outline" onClick={()=>setSort(sort==="play"?"default":"play")}><SlidersHorizontal/>播放排序</Button><Button kind="outline" onClick={()=>setError({code:"DASHBOARD_TIMEOUT",msg:"数据服务响应超时，请稍后重试。",requestId:"req_dash_9201",retryable:true})}>模拟错误</Button></div>}/><DataTable label="视频表现" columns={["视频","UP 主","播放","完播率","状态","操作"]} rows={data.map(row=>[<div className="acl-video"><i><Video/></i><b>{row.title}</b></div>,row.author,row.play,row.rate,<Chip tone={row.status==="关注"?"warning":"success"}>{row.status}</Chip>,<Button aria-label="更多操作"><Ellipsis/></Button>])}/><Pagination/></Card>
  </div>;
}
