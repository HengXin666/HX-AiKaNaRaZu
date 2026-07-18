import { useState, type AriaRole, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";

export function SmoothButton({ children, className = "", onPress, type = "button", disabled = false, role, ariaChecked, ariaSelected, ariaHaspopup, ariaExpanded }: { children: ReactNode; className?: string; onPress?: () => void; type?: "button" | "submit"; disabled?: boolean; role?: AriaRole; ariaChecked?: boolean; ariaSelected?: boolean; ariaHaspopup?: "listbox"; ariaExpanded?: boolean }) {
  return <motion.button type={type} className={className} onClick={onPress} disabled={disabled} role={role} aria-checked={ariaChecked} aria-selected={ariaSelected} aria-haspopup={ariaHaspopup} aria-expanded={ariaExpanded} whileHover={disabled ? undefined : { y: -2 }} whileTap={disabled ? undefined : { scale: .97 }}>{children}</motion.button>;
}
export function SmoothLinkButton({ children, className = "", href }: { children: ReactNode; className?: string; href: string }) {
  return <motion.a className={className} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} whileHover={{ y: -2 }} whileTap={{ scale: .98 }}>{children}</motion.a>;
}
export function SmoothTextField({ label, name, type = "text", defaultValue, placeholder }: { label: string; name: string; type?: "text" | "email"; defaultValue?: string; placeholder?: string }) {
  return <label className="su-ui-field"><span>{label}</span><input name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} required /></label>;
}
export function SmoothTextarea({ label, name, placeholder }: { label: string; name: string; placeholder?: string }) {
  return <label className="su-ui-field"><span>{label}</span><textarea name={name} placeholder={placeholder} rows={3}/></label>;
}
export function SmoothSelect({ label, value, options, onChange }: { label: string; value: string; options: Array<{value:string;label:string}>; onChange: (value:string)=>void }) {
  const [open,setOpen]=useState(false); const selected=options.find((item)=>item.value===value)?.label;
  return <div className="su-ui-field su-ui-select"><span>{label}</span><SmoothButton className="su-ui-select-trigger" ariaHaspopup="listbox" ariaExpanded={open} onPress={()=>setOpen(!open)}>{selected}<ChevronDown size={15}/></SmoothButton><AnimatePresence>{open&&<motion.div className="su-ui-select-menu" role="listbox" initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}>{options.map((option)=><SmoothButton role="option" ariaSelected={option.value===value} key={option.value} className={option.value===value?"selected":""} onPress={()=>{onChange(option.value);setOpen(false)}}><span>{option.label}</span>{option.value===value&&<Check size={14}/>}</SmoothButton>)}</motion.div>}</AnimatePresence></div>;
}
export function SmoothRadioGroup({ label,value,options,onChange }:{label:string;value:string;options:Array<{value:string;label:string}>;onChange:(value:string)=>void}) {
  return <div className="su-ui-field"><span>{label}</span><div className="su-ui-radio" role="radiogroup" aria-label={label}>{options.map((option)=><SmoothButton role="radio" ariaChecked={option.value===value} key={option.value} className={option.value===value?"selected":""} onPress={()=>onChange(option.value)}><i/>{option.label}</SmoothButton>)}</div></div>;
}
export function SmoothSwitch({checked,onChange,children}:{checked:boolean;onChange:(value:boolean)=>void;children:ReactNode}) {
  return <SmoothButton role="switch" ariaChecked={checked} className="su-ui-switch-row" onPress={()=>onChange(!checked)}><span className={`su-ui-switch ${checked?"checked":""}`}><i/></span>{children}</SmoothButton>;
}
export function SmoothAsyncButton({state,icon,label}:{state:string;icon:ReactNode;label:string}) {
  return <SmoothButton type="submit" disabled={state==="pending"} className={`su-request su-request--${state}`}><AnimatePresence mode="wait" initial={false}><motion.span key={state} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}>{icon}{label}</motion.span></AnimatePresence></SmoothButton>;
}
export function SmoothDataTable({columns,rows}:{columns:string[];rows:ReactNode[][]}) {
  return <div className="su-table-scroll"><table><thead><tr>{columns.map((column)=><th key={column}>{column}</th>)}</tr></thead><tbody>{rows.map((row,index)=><tr key={index}>{row.map((cell,cellIndex)=><td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>;
}
