import { useState, type AriaRole, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";

export function AceternityButton({children,className="",onPress,type="button",disabled=false,role,ariaChecked,ariaSelected,ariaHaspopup,ariaExpanded}:{children:ReactNode;className?:string;onPress?:()=>void;type?:"button"|"submit";disabled?:boolean;role?:AriaRole;ariaChecked?:boolean;ariaSelected?:boolean;ariaHaspopup?:"listbox";ariaExpanded?:boolean}) {
  return <motion.button type={type} className={className} onClick={onPress} disabled={disabled} role={role} aria-checked={ariaChecked} aria-selected={ariaSelected} aria-haspopup={ariaHaspopup} aria-expanded={ariaExpanded} whileHover={disabled?undefined:{y:-2}} whileTap={disabled?undefined:{scale:.97}}>{children}</motion.button>;
}
export function AceternityLinkButton({children,className="",href}:{children:ReactNode;className?:string;href:string}) {
  return <motion.a className={className} href={href} target={href.startsWith("http")?"_blank":undefined} rel={href.startsWith("http")?"noreferrer":undefined} whileHover={{y:-2}} whileTap={{scale:.98}}>{children}</motion.a>;
}
export function AceternityTextField({label,name,defaultValue,placeholder,type="text"}:{label:string;name:string;defaultValue?:string;placeholder?:string;type?:"text"|"email"}) {
  return <label className="ac-ui-field"><span>{label}</span><input name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} required/></label>;
}
export function AceternityTextarea({label,name,value,onChange,placeholder}:{label:string;name:string;value:string;onChange:(value:string)=>void;placeholder?:string}) {
  return <label className="ac-ui-field"><span>{label}</span><textarea name={name} value={value} onChange={(event)=>onChange(event.target.value)} placeholder={placeholder} rows={3}/></label>;
}
export function AceternitySelect({label,value,options,onChange}:{label:string;value:string;options:Array<{value:string;label:string}>;onChange:(value:string)=>void}) {
  const [open,setOpen]=useState(false);const selected=options.find((item)=>item.value===value)?.label;
  return <div className="ac-ui-field ac-ui-select"><span>{label}</span><AceternityButton className="ac-ui-select-trigger" ariaHaspopup="listbox" ariaExpanded={open} onPress={()=>setOpen(!open)}>{selected}<ChevronDown size={15}/></AceternityButton><AnimatePresence>{open&&<motion.div className="ac-ui-select-menu" role="listbox" initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}>{options.map((option)=><AceternityButton role="option" ariaSelected={option.value===value} key={option.value} className={option.value===value?"selected":""} onPress={()=>{onChange(option.value);setOpen(false)}}><span>{option.label}</span>{option.value===value&&<Check size={14}/>}</AceternityButton>)}</motion.div>}</AnimatePresence></div>;
}
export function AceternityRadioGroup({label,value,options,onChange}:{label:string;value:string;options:Array<{value:string;label:string}>;onChange:(value:string)=>void}) {
  return <div className="ac-ui-field"><span>{label}</span><div className="ac-ui-radio" role="radiogroup" aria-label={label}>{options.map((option)=><AceternityButton role="radio" ariaChecked={option.value===value} key={option.value} className={option.value===value?"selected":""} onPress={()=>onChange(option.value)}><i/>{option.label}</AceternityButton>)}</div></div>;
}
export function AceternitySwitch({checked,onChange,children}:{checked:boolean;onChange:(value:boolean)=>void;children:ReactNode}) {
  return <AceternityButton role="switch" ariaChecked={checked} className="ac-ui-switch-row" onPress={()=>onChange(!checked)}><span className={`ac-ui-switch ${checked?"checked":""}`}><i/></span>{children}</AceternityButton>;
}
export function AceternityAsyncButton({state,children}:{state:string;children:ReactNode}) {
  return <AceternityButton type="submit" disabled={state==="pending"} className={`ac-ui-async ac-request-button--${state}`}>{children}</AceternityButton>;
}
export function AceternityDataTable({columns,rows}:{columns:string[];rows:ReactNode[][]}) {
  return <div className="ac-table-wrap"><table><thead><tr>{columns.map((column)=><th key={column}>{column}</th>)}</tr></thead><tbody>{rows.map((row,index)=><tr key={index}>{row.map((cell,cellIndex)=><td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>;
}
