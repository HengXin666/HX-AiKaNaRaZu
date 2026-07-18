import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function HomeButton({ children, className = "", onPress, label }: { children: ReactNode; className?: string; onPress?: () => void; label?: string }) {
  return <button type="button" className={className} onClick={onPress} aria-label={label}>{children}</button>;
}

export function HomeLink({ children, className = "", href, to }: { children: ReactNode; className?: string; href?: string; to?: string }) {
  if (to) return <Link className={className} to={to}>{children}</Link>;
  return <a className={className} href={href}>{children}</a>;
}
