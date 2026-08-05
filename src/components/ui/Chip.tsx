import React from "react";

export function Chip({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "new" | "sale" | "out";
}) {
  const styles = {
    default: "bg-primary text-primary-foreground",
    new: "bg-[#2C6E49] text-white",
    sale: `bg-[#C4855A] text-white`,
    out: "bg-muted-foreground text-white",
  };
  return (
    <span className={`text-[9px] font-bold tracking-[0.18em] uppercase px-2 py-0.5 ${styles[variant]}`}>
      {children}
    </span>
  );
}
