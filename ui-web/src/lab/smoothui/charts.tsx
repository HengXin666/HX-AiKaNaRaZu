import{useMemo, useState, type ReactNode} from "react";
import{motion} from "motion/react";
import{TrendingUp} from "lucide-react";
import{SBadge, SButton, SCard, SMetricButton} from "./ui";

export type Point = {label : string;
value : number;
secondary ?: number
}
;
export function Metric({label, value, delta, points, icon, onPress} : {
label:
  string;
value:
  string;
delta:
  string;
points:
  number[];
icon:
  ReactNode;
  onPress ?: () => void
}) {
  const max = Math.max(... points), min = Math.min(... points);
  const line = points
                   .map((v, i) => `${i * 25},
                        ${38 - (v - min) / Math.max(1, max - min) * 30}`)
                   .join(" ");
  return <SCard className = "sbo-metric"><SMetricButton onPress = {onPress}><header>
         <span>{label} </span> <i>{icon} </i> </header><strong>{value} </strong> <small><TrendingUp />{delta} </small>
         <svg viewBox = "0 0 150 42" role =
              "img" aria-label = {`${label} 趋势`}>
         <motion.polyline points = {line} fill = "none" stroke =
              "#990099" strokeWidth = "3" strokeLinecap = "round" initial =
         { {pathLength : 0} } animate = {{pathLength : 1}} /></svg></SMetricButton>
         </SCard>;
}
export function Area({title, data, onPoint} : {
title:
  string;
data:
  Point[];
  onPoint ?: (p : Point) => void
}) {
  const[hover, setHover] = useState<number | null>(null),
               [ visible, setVisible ] = useState([ true, true ]);const max=useMemo(() => Math.max(...data.flatMap(x => [x.value,x.secondary??0])),[data]);const coords=(key:"value"|"secondary") => data.map((p,i) => `${18+i*464/(data.length-1)},${178-(p[key]??0)/max*145}`).join(" ");
  return <SCard className = "sbo-chart wide"><header><div><h3>{title} </h3>
             <p> 移动查看十字线，点击数据下钻</p></div>
             <div className = "sbo-legend">{["主序列", "对比"].map(
                 (x, i) =>
                     <SButton key = {x} className = {visible[i] ? "active"
                                                                : ""} onPress =
                          {() => setVisible(v => v.map((n, j) => j === i ? !n : n))}>
                     <i className = {`dot-${i}`} />{x} </SButton>)} </div> </header>
             <div className =
                  "sbo-area" onMouseLeave = {() => setHover(null)}> <svg viewBox = "0 0 500 210" tabIndex = {0} role =
             "img" aria-label = {title} onMouseMove = {
               e => {const r = e.currentTarget.getBoundingClientRect();
  setHover(Math.max(
      0, Math.min(data.length - 1, Math.round((e.clientX - r.left) / r.width *
                                              (data.length - 1)))));
}
}
onClick = {
    () => hover !== null && onPoint ?.(data[hover]) } > <defs>
    <linearGradient id = {`sbo-${title}`} x1 = "0" y1 = "0" x2 = "0" y2 = "1">
    <stop stopColor = "#990099" stopOpacity = ".32" />
    <stop offset = "1" stopColor = "#990099" stopOpacity = "0" />
    </linearGradient></defs>{[42, 88, 134, 180].map(
        y => <line key = {y} x1 = "18" x2 = "482" y1 = {y} y2 = {y} className =
                   "grid" />)} {
  visible[0] && <><polygon points = {`18, 178 ${coords("value")} 482,
                                     178`} fill = {`url(#sbo-${title})`} />
      <polyline points = {coords("value")} className = "primary" /></>
}
{
  visible[1]
      &&<polyline points = {coords("secondary")} className = "secondary" />
}
{hover !== null &&
   <><line className = "cross" x1 = {18 + hover * 464 / (data.length - 1)} x2 =
          {18 + hover * 464 / (data.length - 1)} y1 = "25" y2 = "180" />
   <circle className = "point" cx = {18 + hover * 464 / (data.length - 1)} cy =
        {178 - data[hover].value / max * 145} r = "5" /></>} </svg>{hover !== null &&<div className = "sbo-tooltip">
                      <b>{data[hover].label} </b>
                      <span>{data[hover].value.toLocaleString()} </span>
                      <small> 点击查看详情</small></div>} </div> <div className = "sbo-brush"><span /><i /></div></SCard>
}
export function Donut({title, data} : {
title:
  string;
data:
  Array < {
  label:
    string;
  value:
    number;
  color:
    string
  }
  >
}) {
  const[active, setActive] = useState(0);
  let sum = 0;
  const gradient = data.map(x =>                                 {
                                  const s = sum;
                                  sum += x.value;
                                  return `${x.color} ${s}% ${sum}%`
                                })
                       .join(",");
  return <SCard className = "sbo-chart"><header><h3>{title} </h3>
         <SBadge> 实时</SBadge></header><div className = "sbo-donut-layout">
             <div className = "sbo-donut" style =
                  {{background :`conic - gradient(${gradient})`}}><div>
             <strong>{data[active].value}% </strong>
             <span>{data[active].label} </span> </div></div>
         <div>{data.map(
             (x, i) => <SButton key = {x.label} className =
                        {i === active ? "active"
                                       : ""} onPress = {() => setActive(i)}>
                 <i style = {{background : x.color}} />{x.label} <b >
                 {x.value}% </b></SButton>)} </div>
         </div></SCard>
}
export function Bars({title, data} : {
title:
  string;
data:
  Array < {
  label:
    string;
  value:
    number;
    secondary ?: number
  }
  >
}) {
  const max = Math.max(... data.map(x => x.value));return <SCard className="sbo-chart"><header><h3>{title}</h3><SBadge>占比</SBadge></header><div className="sbo-bars">{data.map(x => <div key={x.label} title={`${x.label}：${x.value}`}><span>{x.label}</span><div><motion.i initial={
  {width : 0}} animate={{width:`${x.value/max*100}%`}}/><em style={{width:`${(x.secondary??0)/max*100}%`}}/></div><b>{x.value}</b></div>)}</div></SCard>
}
export function GaugeChart({title, value, label} : {
title:
  string;
value:
  number;
label:
  string
}) {
  return <SCard className = "sbo-chart"><header><h3>{title} </h3>
         </header><div className = "sbo-gauge" style =
                    { {
                      background :`conic -
                      gradient(#990099 ${value}%, var(--sbo-soft) 0)`
                    } }><div>
             <strong>{value}% </strong><span>{label} </span> </div></div></SCard>
}
export function Heatmap({title, values} : {
title:
  string;
values:
  number[]
}) {
  const[active, setActive] = useState<number | null>(null);
  return <SCard className = "sbo-chart"><header><div><h3>{title} </h3>
         <p> 星期 × 时段</p></div></header>
         <div className = "sbo-heatmap">{values.map(
             (v, i) => <motion.button key = {i} aria-label = {`热力值 ${
                                            v}`} title = {`活跃 ${v}`} onClick =
                                            {() => setActive(i)} whileHover =
                    { {scale : 1.14} } style =
                    {
                      {
                      background:
                        `rgba(153, 0, 153, ${.1 + v / 120})`
                      }
                    } className = {active === i ? "active" : ""} />)} </div>
         <div className = "sbo-heat-label"> <span > 00 : 00 </span> <span >
         12 : 00 </span> <span > 24 : 00 </span> </div></SCard>
}
export function Funnel({title} : {title : string}) {
  const data = [
    [ '曝光', 128.4, 100 ], [ '播放', 81.2, 80 ], [ '互动', 28.6, 60 ],
    [ '关注', 9.84, 43 ]
  ];
  const[active, setActive] = useState(0);
  return <SCard className = "sbo-chart"><header><h3>{title} </h3>
         <SBadge> 转化 8 % </SBadge></header>
             <div className = "sbo-funnel">{data.map(
                 (x, i) => <SButton key = {x[0]} className =
                                 {active === i ? "active" : ""} onPress =
                                     {() => setActive(i)}>
                          <span style = {{width :`${x[2]}%`}}><b>{x[0]} </b>
                          <small>{x[1]} 万</small></span></SButton>)} </div> </SCard>
}
