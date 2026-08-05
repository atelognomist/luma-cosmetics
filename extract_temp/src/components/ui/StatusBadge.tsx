import type { OrderStatus } from "@/lib/data";
import { STATUS_LABELS, STATUS_CSS } from "@/lib/data";

interface Props {
  status: OrderStatus;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "sm" }: Props) {
  const cls = STATUS_CSS[status] ?? "bg-neutral-100 text-neutral-600 border border-neutral-200";
  const label = STATUS_LABELS[status] ?? status;
  return (
    <span
      className={`inline-flex items-center rounded font-mono font-medium ${cls} ${
        size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1"
      }`}
      style={{ letterSpacing: "0.03em", whiteSpace: "nowrap" }}
    >
      {label}
    </span>
  );
}
