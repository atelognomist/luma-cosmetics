import { useNavigate } from "react-router-dom";
import MetricCard from "@/components/ui/MetricCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { DEMO_ORDERS, DEMO_PRODUCTS, ANALYTICS_DAILY, formatPrice, relativeTime, orderTotal } from "@/lib/data";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const todayOrders = DEMO_ORDERS.filter((o) => new Date(o.createdAt) > new Date(Date.now() - 86400000));
const pending = DEMO_ORDERS.filter((o) => o.status === "new" || o.status === "no_answer" || o.status === "calling");
const confirmed = DEMO_ORDERS.filter((o) => ["confirmed", "preparing", "ready", "sent", "picked_up", "out_for_delivery", "delivered"].includes(o.status));
const delivered = DEMO_ORDERS.filter((o) => o.status === "delivered");
const revenue = delivered.reduce((s, o) => s + orderTotal(o), 0);
const confRate = DEMO_ORDERS.length > 0 ? Math.round((confirmed.length / DEMO_ORDERS.length) * 100) : 0;
const lowStock = DEMO_PRODUCTS.filter((p) => p.stock <= p.lowStockThreshold && p.stock > 0);
const outOfStock = DEMO_PRODUCTS.filter((p) => p.stock === 0);

const attentionOrders = DEMO_ORDERS.filter((o) =>
  ["new", "no_answer", "ready"].includes(o.status)
).slice(0, 6);

const recentDeliveries = DEMO_ORDERS.filter((o) =>
  ["sent", "picked_up", "out_for_delivery", "delivered"].includes(o.status)
).slice(0, 4);

export default function Dashboard() {
  const navigate = useNavigate();
  const now = new Date("2026-08-05T14:32:00");
  const dateStr = now.toLocaleDateString("fr-DZ", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const timeStr = now.toLocaleTimeString("fr-DZ", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex-1 overflow-auto">
      {/* Page header */}
      <div
        className="px-7 py-5 flex items-center justify-between sticky top-0 z-10 bg-card"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div>
          <h1 className="font-serif text-xl" style={{ letterSpacing: "-0.01em" }}>
            Tableau de bord
          </h1>
          <p className="text-xs mt-0.5 font-mono" style={{ color: "var(--muted-foreground)" }}>
            {dateStr} — {timeStr} · Données démo
          </p>
        </div>
        {pending.length > 0 && (
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "#DC2626", animation: "pulse 2s infinite" }}
            />
            {pending.length} commande{pending.length > 1 ? "s" : ""} en attente
          </button>
        )}
      </div>

      <div className="px-7 py-6 flex flex-col gap-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-6 gap-3">
          <MetricCard label="Commandes aujourd'hui" value={todayOrders.length} sub="vs hier" trend={{ value: "+4", up: true }} />
          <MetricCard label="En attente" value={pending.length} sub="nécessite attention" accent={pending.length > 0} />
          <MetricCard label="Confirmées" value={confirmed.length} sub="ce mois" />
          <MetricCard label="Livrées" value={delivered.length} sub="ce mois" trend={{ value: "+12%", up: true }} />
          <MetricCard label="Chiffre livré" value={formatPrice(revenue)} sub="commandes livrées" />
          <MetricCard label="Taux confirmation" value={confRate + "%"} sub="sur total" trend={{ value: "+3pt", up: true }} />
        </div>

        {/* Middle row */}
        <div className="grid grid-cols-3 gap-5">
          {/* Attention widget */}
          <div
            className="col-span-1 bg-card rounded flex flex-col"
            style={{ border: "1px solid var(--border)" }}
          >
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <h2 className="text-sm font-semibold">Commandes prioritaires</h2>
              <button
                onClick={() => navigate("/orders")}
                className="text-xs hover:underline"
                style={{ color: "var(--primary)" }}
              >
                Tout voir
              </button>
            </div>
            <div className="flex flex-col divide-y" style={{ "--tw-divide-opacity": 1 } as React.CSSProperties}>
              {attentionOrders.length === 0 ? (
                <div className="px-4 py-8 text-sm text-center" style={{ color: "var(--muted-foreground)" }}>
                  Aucune commande en attente
                </div>
              ) : (
                attentionOrders.map((o) => {
                  const attempts = o.calls.length;
                  return (
                    <button
                      key={o.id}
                      onClick={() => navigate(`/orders/${o.id}`)}
                      className="px-4 py-3 flex items-start gap-3 text-left hover:bg-secondary transition-colors w-full"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                            #{o.num}
                          </span>
                          <StatusBadge status={o.status} />
                          {attempts > 0 && (
                            <span className="font-mono text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                              · T{attempts}
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-medium truncate">{o.customer.name}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                            {o.customer.wilaya}
                          </span>
                          <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>·</span>
                          <span className="text-xs font-mono font-medium">{formatPrice(orderTotal(o))}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>
                          {relativeTime(o.updatedAt)}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chart */}
          <div
            className="col-span-2 bg-card rounded flex flex-col"
            style={{ border: "1px solid var(--border)" }}
          >
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <h2 className="text-sm font-semibold">Commandes — 9 derniers jours</h2>
              <span
                className="text-xs font-mono px-2 py-0.5 rounded"
                style={{ backgroundColor: "var(--secondary)", color: "var(--muted-foreground)" }}
              >
                Données démo
              </span>
            </div>
            <div className="flex-1 p-4" style={{ minHeight: 220 }}>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={ANALYTICS_DAILY} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gConf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 3" stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontFamily: "DM Mono" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontFamily: "DM Mono" }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: 5, fontSize: 11, fontFamily: "DM Sans" }}
                    labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="orders" stroke="var(--primary)" fill="url(#gOrders)" strokeWidth={1.5} name="Commandes" dot={false} />
                  <Area type="monotone" dataKey="confirmed" stroke="#059669" fill="url(#gConf)" strokeWidth={1.5} name="Confirmées" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div
              className="px-4 py-2.5 flex items-center gap-4"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded" style={{ backgroundColor: "var(--primary)", display: "inline-block" }} />
                <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>Commandes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded" style={{ backgroundColor: "#059669", display: "inline-block" }} />
                <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>Confirmées</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-3 gap-5">
          {/* Deliveries */}
          <div
            className="col-span-2 bg-card rounded"
            style={{ border: "1px solid var(--border)" }}
          >
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <h2 className="text-sm font-semibold">Livraisons récentes</h2>
              <button
                onClick={() => navigate("/delivery")}
                className="text-xs hover:underline"
                style={{ color: "var(--primary)" }}
              >
                Voir livraison
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Commande", "Client", "Wilaya", "Agence", "Statut"].map((h) => (
                    <th key={h} className="px-4 py-2 text-left text-xs font-medium" style={{ color: "var(--muted-foreground)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentDeliveries.map((o, i) => (
                  <tr
                    key={o.id}
                    className="cursor-pointer hover:bg-secondary transition-colors"
                    style={{ borderBottom: i < recentDeliveries.length - 1 ? "1px solid var(--border)" : undefined }}
                    onClick={() => navigate(`/orders/${o.id}`)}
                  >
                    <td className="px-4 py-2.5 font-mono text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                      #{o.num}
                    </td>
                    <td className="px-4 py-2.5 font-medium">{o.customer.name}</td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: "var(--muted-foreground)" }}>{o.customer.wilaya}</td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: "var(--muted-foreground)" }}>{o.deliveryAgency ?? "—"}</td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
                {recentDeliveries.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-sm text-center" style={{ color: "var(--muted-foreground)" }}>
                      Aucune livraison en cours
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Stock alerts */}
          <div
            className="col-span-1 bg-card rounded flex flex-col"
            style={{ border: "1px solid var(--border)" }}
          >
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <h2 className="text-sm font-semibold">Alertes stock</h2>
              <button
                onClick={() => navigate("/inventory")}
                className="text-xs hover:underline"
                style={{ color: "var(--primary)" }}
              >
                Inventaire
              </button>
            </div>
            <div className="flex flex-col divide-y">
              {outOfStock.map((p) => (
                <div
                  key={p.id}
                  className="px-4 py-3 flex items-center gap-3"
                >
                  <div
                    className="w-1 h-full min-h-[32px] rounded"
                    style={{ backgroundColor: "#DC2626", width: 3 }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{p.name}</div>
                    <div className="text-xs font-mono mt-0.5" style={{ color: "#DC2626" }}>Rupture de stock</div>
                  </div>
                </div>
              ))}
              {lowStock.map((p) => (
                <div
                  key={p.id}
                  className="px-4 py-3 flex items-center gap-3"
                >
                  <div
                    className="rounded"
                    style={{ backgroundColor: "#D97706", width: 3, minHeight: 32 }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{p.name}</div>
                    <div className="text-xs font-mono mt-0.5" style={{ color: "#D97706" }}>
                      Stock faible — {p.stock} restants
                    </div>
                  </div>
                </div>
              ))}
              {outOfStock.length === 0 && lowStock.length === 0 && (
                <div className="px-4 py-8 text-sm text-center" style={{ color: "var(--muted-foreground)" }}>
                  Tous les stocks sont normaux
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
