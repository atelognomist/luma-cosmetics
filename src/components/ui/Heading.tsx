import React from "react";

export function Heading({
  eyebrow,
  title,
  sub,
  center = false,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <div className={center ? "text-center" : ""}>
      {eyebrow && (
        <p className={`text-[10px] font-bold uppercase tracking-[0.22em] mb-2 ${light ? "text-[#C4855A]" : "text-[#C4855A]"}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`font-playfair text-2xl md:text-3xl lg:text-[2.25rem] font-medium leading-tight mb-3 ${light ? "text-primary-foreground" : "text-foreground"}`}>
        {title}
      </h2>
      {sub && (
        <p className={`text-sm md:text-base leading-relaxed max-w-md ${center ? "mx-auto" : ""} ${light ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
          {sub}
        </p>
      )}
    </div>
  );
}
