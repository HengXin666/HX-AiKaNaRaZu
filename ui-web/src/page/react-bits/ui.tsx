import { useState, type AriaRole, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";

export function BitsButton({ children, className = "", onPress, disabled = false, type = "button", role, ariaChecked, ariaSelected, ariaHaspopup, ariaExpanded }: {
  children: ReactNode; className?: string; onPress?: () => void; disabled?: boolean; type?: "button" | "submit"; role?: AriaRole; ariaChecked?: boolean; ariaSelected?: boolean; ariaHaspopup?: "listbox"; ariaExpanded?: boolean;
}) {
  return <motion.button type={type} className={className} onClick={onPress} disabled={disabled} role={role} aria-checked={ariaChecked} aria-selected={ariaSelected} aria-haspopup={ariaHaspopup} aria-expanded={ariaExpanded} whileTap={disabled ? undefined : { scale: .97 }}>{children}</motion.button>;
}

export function BitsLinkButton({ children, className = "", to, href, label }: {
  children: ReactNode; className?: string; to?: string; href?: string; label?: string;
}) {
  if (to) return <Link className={className} to={to} aria-label={label}>{children}</Link>;
  return <a className={className} href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel={href?.startsWith("http") ? "noreferrer" : undefined} aria-label={label}>{children}</a>;
}

export function BitsTextField({ label, name, defaultValue, placeholder, type = "text" }: {
  label: string; name: string; defaultValue?: string; placeholder?: string; type?: "text" | "email";
}) {
  return <label className="rb-ui-field"><span>{label}</span><input name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} required /></label>;
}

export function BitsTextarea({ label, name, placeholder }: { label: string; name: string; placeholder?: string }) {
  return <label className="rb-ui-field"><span>{label}</span><textarea name={name} placeholder={placeholder} rows={3} /></label>;
}

export function BitsSelect({ label, value, options, onChange }: {
  label: string; value: string; options: Array<{ value: string; label: string }>; onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value)?.label;
  return <div className="rb-ui-field rb-ui-select"><span>{label}</span><BitsButton className="rb-ui-select-trigger" ariaHaspopup="listbox" ariaExpanded={open} onPress={() => setOpen(!open)}>{selected}<ChevronDown size={15}/></BitsButton>
    <AnimatePresence>{open && <motion.div className="rb-ui-select-menu" role="listbox" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
      {options.map((option) => <BitsButton role="option" ariaSelected={option.value === value} className={option.value === value ? "selected" : ""} key={option.value} onPress={() => { onChange(option.value); setOpen(false); }}><span>{option.label}</span>{option.value === value && <Check size={14}/>}</BitsButton>)}
    </motion.div>}</AnimatePresence></div>;
}

export function BitsRadioGroup({ label, value, options, onChange }: {
  label: string; value: string; options: Array<{ value: string; label: string }>; onChange: (value: string) => void;
}) {
  return <div className="rb-ui-field"><span>{label}</span><div className="rb-ui-radio-group" role="radiogroup" aria-label={label}>{options.map((option) => <BitsButton role="radio" ariaChecked={option.value === value} key={option.value} className={option.value === value ? "selected" : ""} onPress={() => onChange(option.value)}><i />{option.label}</BitsButton>)}</div></div>;
}

export function BitsSwitch({ checked, onChange, children }: { checked: boolean; onChange: (checked: boolean) => void; children: ReactNode }) {
  return <BitsButton role="switch" ariaChecked={checked} className="rb-ui-switch-row" onPress={() => onChange(!checked)}><span className={`rb-ui-switch ${checked ? "checked" : ""}`}><i /></span>{children}</BitsButton>;
}

export function BitsAsyncButton({ children, disabled = false }: { children: ReactNode; disabled?: boolean }) {
  return <BitsButton className="rb-star-button" type="submit" disabled={disabled}><span className="rb-star-glow" aria-hidden="true"/><span className="rb-star-content">{children}</span></BitsButton>;
}

export function BitsDataTable({ columns, rows }: { columns: string[]; rows: ReactNode[][] }) {
  return <div className="rb-table-wrap"><table><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>;
}
