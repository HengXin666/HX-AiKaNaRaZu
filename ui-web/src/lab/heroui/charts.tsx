import { useMemo, useState, type ReactNode } from "react";
import { Alert, Button, Card, Chip, Tooltip } from "@heroui/react";
import { AlertCircle, RotateCcw, TrendingUp } from "lucide-react";

export type ChartPoint = { label: string; value: number; secondary?: number };

export function MetricCard({ label, value, delta, points, icon }: { label: string; value: string; delta: string; points: number[]; icon: ReactNode }) {
  const max = Math.max(...points); const min = Math.min(...points);
  const line = points.map((point, index) => `${index * 25},${38 - ((point - min) / Math.max(1, max - min)) * 30}`).join(" ");
  return <Card className="bo-metric-card"><Card.Header><span className="bo-muted">{label}</span><span className="bo-metric-icon">{icon}</span></Card.Header><Card.Content><strong>{value}</strong><span className="bo-positive"><TrendingUp size={13}/>{delta}</span><svg viewBox="0 0 150 42" role="img" aria-label={`${label}迷你趋势图`}><polyline points={line} fill="none" stroke="#990099" strokeWidth="3" strokeLinecap="round"/></svg></Card.Content></Card>;
}

export function ChartError({ msg, onRetry }: { msg: string; onRetry: () => void }) {
  return <Alert status="danger"><Alert.Indicator><AlertCircle size={18}/></Alert.Indicator><Alert.Content><Alert.Title>图表加载失败</Alert.Title><Alert.Description>{msg}</Alert.Description><Button size="sm" variant="outline" onPress={onRetry}><RotateCcw size={13}/>重试</Button></Alert.Content></Alert>;
}

export function AreaChart({ title, subtitle, data, series = ["播放", "互动"], error, onRetry, onDrilldown }: { title: string; subtitle?: string; data: ChartPoint[]; series?: string[]; error?: string; onRetry?: () => void; onDrilldown?: (point: ChartPoint) => void }) {
  const [hovered,setHovered]=useState<number|null>(null); const [visible,setVisible]=useState([true,true]);
  const max=useMemo(()=>Math.max(...data.flatMap((item)=>[item.value,item.secondary??0])),[data]);
  const coords=(key:"value"|"secondary")=>data.map((item,index)=>`${18+index*(462/Math.max(1,data.length-1))},${178-((item[key]??0)/max)*145}`).join(" ");
  if(error) return <ChartError msg={error} onRetry={onRetry??(()=>{})}/>;
  return <Card className="bo-chart-card"><Card.Header className="bo-card-head"><div><Card.Title>{title}</Card.Title><Card.Description>{subtitle}</Card.Description></div><div className="bo-chart-legend">{series.map((label,index)=><Button size="sm" variant={visible[index]?"secondary":"ghost"} key={label} onPress={()=>setVisible((old)=>old.map((value,i)=>i===index?!value:value))}><i className={`bo-legend-dot dot-${index}`}/>{label}</Button>)}</div></Card.Header><Card.Content><div className="bo-area-wrap" onMouseLeave={()=>setHovered(null)}><svg viewBox="0 0 500 210" role="img" aria-label={`${title}趋势图`} onMouseMove={(event)=>{const rect=event.currentTarget.getBoundingClientRect();setHovered(Math.max(0,Math.min(data.length-1,Math.round(((event.clientX-rect.left)/rect.width)*(data.length-1)))));}} onClick={()=>hovered!==null&&onDrilldown?.(data[hovered])}>
    <defs><linearGradient id={`area-${title}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#990099" stopOpacity=".34"/><stop offset="1" stopColor="#990099" stopOpacity="0"/></linearGradient></defs>
    {[42,88,134,180].map((y)=><line key={y} x1="18" x2="482" y1={y} y2={y} className="bo-grid-line"/>)}
    {visible[0]&&<><polygon points={`18,178 ${coords("value")} 480,178`} fill={`url(#area-${title})`}/><polyline points={coords("value")} className="bo-line-primary"/></>}{visible[1]&&<polyline points={coords("secondary")} className="bo-line-secondary"/>}
    {hovered!==null&&<><line x1={18+hovered*(462/Math.max(1,data.length-1))} x2={18+hovered*(462/Math.max(1,data.length-1))} y1="28" y2="180" className="bo-crosshair"/><circle cx={18+hovered*(462/Math.max(1,data.length-1))} cy={178-(data[hovered].value/max)*145} r="5" className="bo-point"/></>}
  </svg>{hovered!==null&&<div className="bo-chart-tooltip"><b>{data[hovered].label}</b><span>{series[0]} {data[hovered].value.toLocaleString()}</span><span>{series[1]} {(data[hovered].secondary??0).toLocaleString()}</span><small>点击下钻详情</small></div>}</div><div className="bo-brush"><span/><i/></div></Card.Content></Card>;
}

export function DonutChart({ title, data }: { title: string; data: Array<{label:string;value:number;color:string}> }) {
  const [active,setActive]=useState(0); const total=data.reduce((sum,item)=>sum+item.value,0); let start=0;
  const gradient=data.map((item)=>{const from=start;start+=item.value/total*100;return `${item.color} ${from}% ${start}%`;}).join(",");
  return <Card className="bo-chart-card"><Card.Header><Card.Title>{title}</Card.Title><Chip size="sm" color="accent">实时</Chip></Card.Header><Card.Content className="bo-donut-layout"><div className="bo-donut" style={{background:`conic-gradient(${gradient})`}}><div><strong>{data[active].value}%</strong><span>{data[active].label}</span></div></div><div className="bo-donut-legend">{data.map((item,index)=><Button key={item.label} variant={active===index?"secondary":"ghost"} size="sm" onPress={()=>setActive(index)}><i style={{background:item.color}}/>{item.label}<b>{item.value}%</b></Button>)}</div></Card.Content></Card>;
}

export function BarChart({ title, data }: { title: string; data: Array<{label:string;value:number;secondary?:number}> }) {
  const max=Math.max(...data.map((item)=>item.value));return <Card className="bo-chart-card"><Card.Header><Card.Title>{title}</Card.Title><Chip size="sm" variant="soft" color="accent">占比</Chip></Card.Header><Card.Content className="bo-bars">{data.map((item)=><Tooltip key={item.label}><Tooltip.Trigger><div className="bo-bar-row"><span>{item.label}</span><div><i style={{width:`${item.value/max*100}%`}}/><em style={{width:`${(item.secondary??0)/max*100}%`}}/></div><b>{item.value}</b></div></Tooltip.Trigger><Tooltip.Content showArrow>{item.label}：{item.value.toLocaleString()}，对比 {item.secondary??0}</Tooltip.Content></Tooltip>)}</Card.Content></Card>;
}

export function Heatmap({ title, values, onSelect }: { title: string; values: number[]; onSelect?: (index:number)=>void }) {
  return <Card className="bo-chart-card"><Card.Header><Card.Title>{title}</Card.Title><Card.Description>星期 × 时段</Card.Description></Card.Header><Card.Content><div className="bo-heatmap">{values.map((value,index)=><Tooltip key={index}><Tooltip.Trigger><Button aria-label={`热力值 ${value}`} className="bo-heat-cell" style={{background:`rgba(153,0,153,${.12+value/120})`}} onPress={()=>onSelect?.(index)} /></Tooltip.Trigger><Tooltip.Content showArrow>{["一","二","三","四","五","六","日"][Math.floor(index/6)]} 周 · {index%6*4}:00，活跃 {value}</Tooltip.Content></Tooltip>)}</div><div className="bo-heat-labels"><span>00:00</span><span>08:00</span><span>16:00</span><span>24:00</span></div></Card.Content></Card>;
}

export function FunnelChart({ title, data }: { title: string; data: Array<{label:string;value:number}> }) {
  const [active,setActive]=useState(0); const max=data[0]?.value??1;return <Card className="bo-chart-card"><Card.Header><Card.Title>{title}</Card.Title><Chip size="sm">转化 {Math.round(data.at(-1)!.value/max*100)}%</Chip></Card.Header><Card.Content className="bo-funnel">{data.map((item,index)=><Button key={item.label} variant={active===index?"secondary":"ghost"} onPress={()=>setActive(index)} style={{width:`${42+item.value/max*58}%`}}><span>{item.label}</span><b>{item.value.toLocaleString()}</b></Button>)}</Card.Content></Card>;
}

export function RadialGauge({ title, value, label }: { title:string;value:number;label:string }) {
  return <Card className="bo-chart-card"><Card.Header><Card.Title>{title}</Card.Title></Card.Header><Card.Content className="bo-radial-wrap"><div className="bo-radial" style={{background:`conic-gradient(#990099 ${value}%,var(--bo-soft) 0)`}}><div><strong>{value}%</strong><span>{label}</span></div></div></Card.Content></Card>;
}

export function ScatterChart({ title, data }: { title:string;data:Array<{x:number;y:number;label:string}> }) {
  return <Card className="bo-chart-card"><Card.Header><Card.Title>{title}</Card.Title><Card.Description>延迟 × 成功率</Card.Description></Card.Header><Card.Content><svg className="bo-scatter" viewBox="0 0 300 180" role="img" aria-label={title}>{[40,80,120,160].map((y)=><line key={y} x1="15" x2="290" y1={y} y2={y} className="bo-grid-line"/>)}{data.map((item)=><Tooltip key={item.label}><Tooltip.Trigger><circle cx={20+item.x*2.4} cy={165-item.y*1.4} r="7" className="bo-scatter-point"/></Tooltip.Trigger><Tooltip.Content showArrow>{item.label} · {item.x}ms · {item.y}%</Tooltip.Content></Tooltip>)}</svg></Card.Content></Card>;
}
