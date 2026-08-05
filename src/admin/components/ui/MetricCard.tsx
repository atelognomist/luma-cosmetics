interface Props {
  label: string;
  value: string | number;
  sub?: string;
  trend?: { value: string; up: boolean };
  accent?: boolean;
}

export default function MetricCard({ label, value, sub, trend, accent }: Props) {
  return (
    <div
      className="bg-card rounded p-4 flex flex-col gap-2"
      style={{
        border: "1px solid var(--border)",
        outline: accent ? "2px solid var(--primary)" : undefined,
        outlineOffset: accent ? "-1px" : undefined,
      }}
    >
      <div className="text-xs font-medium" style={{ color: "var(--muted-foreground)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
        {label}
      </div>
      <div className="font-serif" style={{ fontSize: 26, lineHeight: 1.1, color: accent ? "var(--primary)" : "var(--foreground)" }}>
        {value}
      </div>
      <div className="flex items-center gap-2">
        {sub && (
          <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            {sub}
          </span>
        )}
        {trend && (
          <span
            className="text-xs font-mono font-medium"
            style={{ color: trend.up ? "#059669" : "#DC2626" }}
          >
            {trend.up ? "▲" : "▼"} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
