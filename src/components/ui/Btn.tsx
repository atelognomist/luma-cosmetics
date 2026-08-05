import React from "react";
import { ACCENT } from "../../lib/utils";

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "accent";
  size?: "sm" | "md" | "lg";
}

export function Btn({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  ...props
}: BtnProps) {
  const base = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none whitespace-nowrap";
  const v = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/85",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-muted text-foreground",
    outline: "border border-border text-foreground hover:bg-muted",
    accent: `bg-[#C4855A] text-white hover:opacity-90`,
  };
  const s = {
    sm: "text-xs px-3 py-1.5 h-8",
    md: "text-sm px-5 py-2.5 h-10",
    lg: "text-sm px-7 py-3.5 h-12 tracking-wide",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${v[variant]} ${s[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
