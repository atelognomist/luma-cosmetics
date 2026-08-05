import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import StatusBadge from "../components/ui/StatusBadge";
import { STATUS_LABELS, formatPrice, relativeTime, orderTotal } from "../lib/data";
import { getOrders } from "@/lib/api/orders";
import type { OrderStatus, Order } from "@/lib/api/types";

type Tab = "all" | "new" | "calling" | "follow_up" | "confirmed" | "preparing" | "delivery" | "completed" | "cancelled";

const tabs: { key: Tab; label: string }[] = [
  { key: "all", label: "Toutes" },
  { key: "new", label: "Nouvelles" },
  { key: "calling", label: "En cours" },
  { key: "follow_up", label: "Relance" },
  { key: "confirmed", label: "Confirmées" },
  { key: "preparing", label: "Préparation" },
  { key: "delivery", label: "Livraison" },
  { key: "completed", label: "Livrées" },
  { key: "cancelled", label: "Annulées" },
];

function matchTab(status: OrderStatus, tab: Tab): boolean {
  if (tab === "all") return true;
  if (tab === "new") return status === "new";
  if (tab === "calling") return status === "calling";
  if (tab === "follow_up") return status === "no_answer";
  if (tab === "confirmed") return status === "confirmed";
  if (tab === "preparing") return status === "preparing" || status === "ready";
  if (tab === "delivery") return ["sent", "picked_up", "out_for_delivery"].includes(status);
  if (tab === "completed") return status === "delivered";
  if (tab === "cancelled") return ["cancelled", "rejected", "failed", "returned"].includes(status);
  return false;
}

export default function Orders() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const filtered = orders.filter((o) => {
    const matchSearch = !search || [o.id, o.customer.name, o.customer.phone, o.customer.wilaya]
      .some((v) => v.toLowerCase().includes(search.toLowerCase()));
    return matchTab(o.status, tab) && matchSearch;
  });

  function tabCount(t: Tab) {
    return orders.filter((o) => matchTab(o.status, t)).length;
  }

  if (loading) return <div className="p-8 text-muted-foreground text-sm">Chargement...</div>;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div
        className="px-7 py-5 bg-card"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-serif text-xl" style={{ letterSpacing: "-0.01em" }}>Commandes</h1>
          <span className="text-xs font-mono px-2 py-1 rounded" style={{ backgroundColor: "var(--secondary)", color: "var(--muted-foreground)" }}>
            {orders.length} commandes · Données démo
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--muted-foreground)" }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par commande, client, téléphone, wilaya…"
            className="w-full rounded pl-9 pr-4 py-2 text-sm outline-none"
            style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
            onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-0.5 overflow-x-auto">
          {tabs.map((t) => {
            const cnt = tabCount(t.key);
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors"
                style={{
                  backgroundColor: active ? "var(--primary)" : "transparent",
                  color: active ? "#fff" : "var(--muted-foreground)",
                }}
              >
                {t.label}
                {cnt > 0 && (
                  <span
                    className="font-mono rounded-full px-1 leading-none"
                    style={{
                      backgroundColor: active ? "rgba(255,255,255,0.25)" : "var(--muted)",
                      color: active ? "#fff" : "var(--muted-foreground)",
                      fontSize: 9,
                      minWidth: 16,
                      textAlign: "center",
                      paddingTop: 2,
                      paddingBottom: 2,
                    }}
                  >
                    {cnt}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--muted-foreground)" }}>
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            </svg>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Aucune commande trouvée</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card z-10">
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["ID", "Client", "Téléphone", "Wilaya", "Articles", "Total", "Statut", "Heure", "Livraison", ""].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left font-medium whitespace-nowrap"
                    style={{ color: "var(--muted-foreground)", fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => {
                const attempts = o.calls.length;
                return (
                  <tr
                    key={o.id}
                    className="cursor-pointer hover:bg-secondary transition-colors"
                    style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : undefined }}
                    onClick={() => navigate(`/orders/${o.id}`)}
                  >
                    <td className="px-4 py-3 font-mono text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                      #{o.num}
                    </td>
                    <td className="px-4 py-3 font-medium">{o.customer.name}</td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>
                      {o.customer.phone}
                    </td>
                    <td className="px-4 py-3 text-xs">{o.customer.wilaya}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>
                      {o.items.length} article{o.items.length > 1 ? "s" : ""}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-medium whitespace-nowrap">
                      {formatPrice(orderTotal(o))}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <StatusBadge status={o.status} />
                        {attempts > 0 && o.status === "no_answer" && (
                          <span className="font-mono text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                            Tentative {attempts}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs whitespace-nowrap" style={{ color: "var(--muted-foreground)" }}>
                      {relativeTime(o.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>
                      {o.deliveryAgency ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        className="text-xs px-2.5 py-1 rounded font-medium transition-colors hover:opacity-80"
                        style={{ backgroundColor: "var(--secondary)", color: "var(--secondary-foreground)" }}
                        onClick={(e) => { e.stopPropagation(); navigate(`/orders/${o.id}`); }}
                      >
                        Ouvrir
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
