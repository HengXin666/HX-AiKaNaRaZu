import{AnimatePresence, motion} from "motion/react";
import{ChevronDown, X} from "lucide-react";
import{Children, type CSSProperties, type ReactNode, useState} from "react";

export function SMetricButton({children,onPress}:{children:ReactNode;onPress?:()=>void}) {
  return <motion.button className="sbo-metric-button" onClick={onPress} whileHover={{y:-2}} whileTap={{scale:.99}}>{children}</motion.button>;
}

export function SNodeButton({children,style,title}:{children:ReactNode;style:CSSProperties;title:string}) {
  return <motion.button className="sbo-node-button" style={style} title={title} whileHover={{scale:1.08}} whileTap={{scale:.94}}>{children}</motion.button>;
}

export function SAvatarButton({children,label}:{children:ReactNode;label:string}) {
  return <motion.button className="sbo-avatar" aria-label={label} whileHover={{scale:1.05}} whileTap={{scale:.94}}>{children}</motion.button>;
}

function tableChildren(children:ReactNode) {
  return Children.toArray(children).filter((child)=>typeof child!=="string"||child.trim().length>0);
}
export function STable({children}:{children:ReactNode}) { return <table>{tableChildren(children)}</table>; }
export function STableHead({children}:{children:ReactNode}) { return <thead>{tableChildren(children)}</thead>; }
export function STableBody({children}:{children:ReactNode}) { return <tbody>{tableChildren(children)}</tbody>; }
export function STableRow({children}:{children:ReactNode}) { return <tr>{tableChildren(children)}</tr>; }
export function STableHeader({children}:{children:ReactNode}) { return <th>{children}</th>; }
export function STableCell({children}:{children:ReactNode}) { return <td>{children}</td>; }

export function SButton({children, onPress, kind = "ghost", className = "",
                         disabled = false, type = "button", title} : {
children:
  ReactNode;
  onPress ?: () => void;
  kind ?: "primary" | "ghost" | "outline" | "danger";
  className ?: string;
  disabled ?: boolean;
  type ?: "button" | "submit";
  title ?: string
}) {
  return <motion.button title = {title} type = {type} disabled =
              {disabled} onClick = {onPress} className =
                  {`sbo-button ${kind} ${className}`} whileHover =
          { disabled ? undefined : {y : -2}
          } whileTap = {disabled ? undefined : {scale : .97}}>{children} </motion.button>
      ;
}
export function SIconButton({children, onPress, label} : {
children:
  ReactNode;
  onPress ?: () => void;
label:
  string
}) {
  return <SButton className = "icon" onPress = {onPress} title = {label}>{
             children} </SButton>
      ;
}
export function SSearchInput({placeholder, onFocus, onBlur} : {
placeholder:
  string;
  onFocus ?: () => void;
  onBlur ?: () => void
}) {
  return <input aria-label = "全局搜索" placeholder = {
              placeholder} onFocus = {onFocus} onBlur = {onBlur} />;
}
export function SCard({children, className = ""} : {
children:
  ReactNode;
  className ?: string
}) {
  return <motion.section className = {`sbo-card ${className}`} initial =
          { {opacity : 0, y : 8} } animate =
          { {opacity : 1, y : 0} } transition = {{duration : .35}}>{children} </motion.section>
      ;
}
export function SBadge({children, tone = "accent"} : {
children:
  ReactNode;
  tone ?: "accent" | "success" | "warning" | "danger"
}) {
  return <span className = {`sbo-badge ${tone}`}>{children} </span> ;
}
export function SInput({label, value, onChange, placeholder, type = "text",
                        error} : {
label:
  string;
value:
  string;
onChange:
  (value : string) => void;
  placeholder ?: string;
  type ?: "text" | "number";
  error ?: string
}) {
  return <label className = "sbo-field"><span>{label} </span>
         <input type = {type} value = {value} placeholder =
              {placeholder} onChange = {e => onChange(e.target.value)} />{
             error && <small>{error} </small> } </label>
      ;
}
export function STextarea({label, value, onChange, placeholder, error} : {
label:
  string;
value:
  string;
onChange:
  (value : string) => void;
  placeholder ?: string;
  error ?: string
}) {
  return <label className = "sbo-field"><span>{label} </span>
         <textarea rows = {4} value = {value} placeholder =
              {placeholder} onChange = {e => onChange(e.target.value)} />{
             error && <small>{error} </small> } </label>
      ;
}
export function SSelect({label, value, onChange, options, compact = false} : {
label:
  string;
value:
  string;
onChange:
  (value : string) => void;
options:
  Array<[ string, string ]>;
  compact ?: boolean
}) {
  const[open, setOpen] = useState(false);
  const selected = options.find(([id]) => id === value) ?.[1];
  return <div className = {`sbo-select ${compact ? "compact" : ""}`}>
             <span>{label} </span>
             <SButton kind = "outline" onPress = {() => setOpen(!open)}>{
                 selected} <ChevronDown size =
             {14} /> </SButton>
             <AnimatePresence>{
                 open &&
                 <motion.div className = "sbo-select-menu" initial =
                      {{opacity : 0,
                        y : -6}} animate = {{opacity : 1, y : 0}} exit =
                          {{opacity : 0, y : -6}}>{options.map(
                     ([ id, text ]) => <SButton key = {id} className =
                                {id === value ? "selected" : ""} onPress =
                                    {() => {onChange(id); setOpen(false)}}>{
                             text} </SButton>)
}
</motion.div>
}
</AnimatePresence></div>;
}
export function SSwitch({checked, onChange, label, description} : {
checked:
  boolean;
onChange:
  (value : boolean) => void;
label:
  string;
  description ?: string
}) {
  return <SButton className =
              "sbo-switch-row" onPress = {() => onChange(!checked)}>
         <span className =
          {`sbo-switch ${checked ? "on" : ""}`}><i /></span><span>
         <b>{label} </b>{description && <small>{description} </small> } </span> </SButton>;
}
export function SAlert({error, onRetry} : {
error: {
code:
  string;
msg:
  string;
  requestId ?: string;
retryable:
  boolean
};
  onRetry ?: () => void
}) {
  return <motion.div className = "sbo-alert" initial =
          { {opacity : 0, height : 0}
          } animate = {{opacity : 1, height : "auto"}}><div>
         <strong>{error.code} </strong> <p>{error.msg} </p>{error.requestId &&
              <small> Request ID · {error.requestId} </small> } </div>{error.retryable &&
             <SButton kind = "outline" onPress = {onRetry}> 重试</SButton>} </motion.div> ;
}
export function SModal({open, title, children, onClose, footer} : {
open:
  boolean;
title:
  string;
children:
  ReactNode;
onClose:
  () => void;
  footer ?: ReactNode
}) {
  return <AnimatePresence>{
             open &&
             <><motion.div className = "sbo-overlay" initial =
                    {{opacity : 0}} animate = {{opacity : 1}} exit =
                        {{opacity : 0}} onClick = {onClose} /><motion.div
                     className = "sbo-modal" role = "dialog" aria-modal = "true" initial = {{
                   opacity : 0,
                   scale :
                       .95,
                   x : "-50%",
                   y : "-45%"
                 }} animate = {{
                   opacity : 1,
                   scale :
                       1,
                   x : "-50%",
                   y : "-50%"
                 }} exit = {{opacity : 0, scale : .96, x : "-50%", y : "-45%"}}>
                 <header><h2>{title} </h2>
                 <SIconButton label = "关闭" onPress = {onClose}><X />
                 </SIconButton></header>
                 <div className = "sbo-modal-body">{children} </div>{footer && <footer>{footer} </footer> } </motion.div> </>} </AnimatePresence>
      ;
}
export function SDrawer({open, title, children, onClose, footer} : {
open:
  boolean;
title:
  string;
children:
  ReactNode;
onClose:
  () => void;
  footer ?: ReactNode
}) {
  return <AnimatePresence>{
             open &&
             <><motion.div className = "sbo-overlay" initial =
                    {{opacity : 0}} animate = {{opacity : 1}} exit =
                        {{opacity : 0}} onClick = {onClose} />
                 <motion.aside className = "sbo-drawer" initial = {{
                    x : "100%"
                  }} animate = {{x : 0}} exit = {{x : "100%"}} transition =
                      {{type : "spring", damping : 30, stiffness : 320}}>
                 <header><h2>{title} </h2>
                 <SIconButton label = "关闭" onPress = {onClose}><X />
                 </SIconButton></header>
                 <div className = "sbo-drawer-body">{children} </div>{footer && <footer>{footer} </footer> } </motion.aside> </>} </AnimatePresence>
      ;
}
export function SToast({message} : {message : string}) {
  return <AnimatePresence>{message &&
                           <motion.div className = "sbo-toast" initial =
                                {{opacity : 0, y : 20, scale : .95}} animate =
                                    {{opacity : 1, y : 0, scale : 1}} exit =
                                        {{opacity : 0, y : 10}}><i />{message} </motion.div> } </AnimatePresence>
      ;
}
