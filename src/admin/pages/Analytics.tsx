import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { getOrders } from "@/lib/api/orders";
import { getProducts } from "@/lib/api/products";
import { ANALYTICS_DAILY, formatPrice, orderTotal } from "../lib/data";
import type { Order, Product } from "@/lib/api/types";

type Period = "today" | "7d" | "30d";
const periods: { key: Period; label: string }[] = [
  { key: "today", label: "Aujourd'hui" },
  { key: "7d", label: "7 jours" },
  { key: "30d", label: "30 jours" },
];

export default function Analytics() {
  const [period, setPeriod] = useState<Period>("30d");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getOrders(), getProducts({ adminAll: true })]).then(([oData, pData]) => {
      setOrders(oData);
      setProducts(pData);
      setLoading(false);
    });
  }, []);

  const slice = period === "today" ? ANALYTICS_DAILY.slice(-1) : period === "7d" ? ANALYTICS_DAILY.slice(-7) : ANALYTICS_DAILY;

  const confirmedOrders = orders.filter((o) => ["confirmed", "preparing", "ready", "sent", "picked_up", "out_for_delivery", "delivered"].includes(o.status));
  const deliveredOrders = orders.filter((o) => o.status === "delivered");
  const rejectedOrders = orders.filter((o) => o.status === "rejected");
  const noAnswerOrders = orders.filter((o) => o.status === "no_answer");
  const cancelledOrders = orders.filter((o) => ["cancelled", "failed", "returned"].includes(o.status));

  const grossValue = orders.reduce((s, o) => s + orderTotal(o as any), 0);
  const confirmedValue = confirmedOrders.reduce((s, o) => s + orderTotal(o as any), 0);
  const deliveredValue = deliveredOrders.reduce((s, o) => s + orderTotal(o as any), 0);
  const cancelledValue = cancelledOrders.reduce((s, o) => s + orderTotal(o as any), 0);

  const confRate = orders.length > 0 ? ((confirmedOrders.length / orders.length) * 100).toFixed(1) : "0";
  const deliveryRate = confirmedOrders.length > 0 ? ((deliveredOrders.length / confirmedOrders.length) * 100).toFixed(1) : "0";

  const orderStatusData = [
    { name: "Confirmées", value: confirmedOrders.length, color: "#059669" },
    { name: "Rejetées", value: rejectedOrders.length, color: "#DC2626" },
    { name: "Sans réponse", value: noAnswerOrders.length, color: "#D97706" },
    { name: "Annulées", value: cancelledOrders.length, color: "#6B7280" },
  ];

  const revenueData = [
    { name: "Brut (reçu)", value: grossValue, color: "#94A3B8" },
    { name: "Confirmé", value: confirmedValue, color: "var(--primary)" },
    { name: "Livré", value: deliveredValue, color: "#059669" },
    { name: "Annulé/Retourné", value: cancelledValue, color: "#DC2626" },
  ];

  if (loading) return <div className="p-8 text-muted-foreground text-sm">Chargement...</div>;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-7 py-5 bg-card" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-xl" style={{ letterSpacing: "-0.01em" }}>Analytiques</h1>
          </div>
          <div className="flex gap-0.5 p-0.5 rounded" style={{ backgroundColor: "var(--secondary)" }}>
            {periods.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
                style={{
                  backgroundColor: period === p.key ? "#fff" : "transparent",
                  color: period === p.key ? "var(--foreground)" : "var(--muted-foreground)",
                  boxShadow: period === p.key ? "0 1px 3px rgba(0,0,0,0.08)" : undefined,
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-7 py-6 flex flex-col gap-6">
        {/* Revenue distinction */}
        <div>
          <h2 className="text-xs font-semibold mb-3" style={{ color: "var(--muted-foreground)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Ventilation du chiffre d'affaires
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {revenueData.map((d) => (
              <div
                key={d.name}
                className="bg-card rounded p-4"
                style={{ border: "1px solid var(--border)", borderLeft: `3px solid ${d.color}` }}
              >
                <div className="text-xs mb-2" style={{ color: "var(--muted-foreground)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  {d.name}
                </div>
                <div className="font-serif text-xl" style={{ color: d.color }}>
                  {formatPrice(d.value)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-3 gap-5">
          {/* Orders chart */}
          <div className="col-span-2 bg-card rounded" style={{ border: "1px solid var(--border)" }}>
            <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
              <h3 className="text-sm font-semibold">Commandes et confirmations</h3>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={slice} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gO" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gD" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284C7" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0284C7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 3" stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontFamily: "DM Mono" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontFamily: "DM Mono" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: 5, fontSize: 11 }} />
                  <Area type="monotone" dataKey="orders" stroke="var(--primary)" fill="url(#gO)" strokeWidth={1.5} name="Commandes" dot={false} />
                  <Area type="monotone" dataKey="confirmed" stroke="#059669" fill="url(#gC)" strokeWidth={1.5} name="Confirmées" dot={false} />
                  <Area type="monotone" dataKey="delivered" stroke="#0284C7" fill="url(#gD)" strokeWidth={1.5} name="Livrées" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie */}
          <div className="bg-card rounded" style={{ border: "1px solid var(--border)" }}>
            <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
              <h3 className="text-sm font-semibold">Résultats des commandes</h3>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: 5, fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-1.5 mt-1">
                {orderStatusData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: d.color, display: "inline-block" }} />
                      <span style={{ color: "var(--muted-foreground)" }}>{d.name}</span>
                    </div>
                    <span className="font-mono font-medium">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* KPIs row */}
        <div className="grid grid-cols-4 gap-3">
          <KpiCard label="Taux de confirmation" value={confRate + "%"} sub={`${confirmedOrders.length} / ${orders.length} commandes`} />
          <KpiCard label="Taux de livraison" value={deliveryRate + "%"} sub={`${deliveredOrders.length} livrées sur confirmées`} />
          <KpiCard label="Taux de rejet" value={orders.length > 0 ? ((rejectedOrders.length / orders.length) * 100).toFixed(1) + "%" : "—"} sub={`${rejectedOrders.length} rejetées`} />
          <KpiCard label="Sans réponse" value={orders.length > 0 ? ((noAnswerOrders.length / orders.length) * 100).toFixed(1) + "%" : "—"} sub={`${noAnswerOrders.length} sans réponse`} />
        </div>

        {/* Revenue bar */}
        <div className="bg-card rounded" style={{ border: "1px solid var(--border)" }}>
          <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
            <h3 className="text-sm font-semibold">Chiffre d'affaires journalier (DA)</h3>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={slice} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontFamily: "DM Mono" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontFamily: "DM Mono" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: 5, fontSize: 11 }}
                  formatter={(v) => formatPrice(Number(v))}
                />
                <Bar dataKey="revenue" fill="var(--primary)" radius={[3, 3, 0, 0]} name="Chiffre" maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top products */}
        <div>
          <h2 className="text-xs font-semibold mb-3" style={{ color: "var(--muted-foreground)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Produits les plus commandés
          </h2>
          <div className="bg-card rounded" style={{ border: "1px solid var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Rang", "Produit", "Catégorie", "Stock"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left font-medium" style={{ color: "var(--muted-foreground)", fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: i < 4 ? "1px solid var(--border)" : undefined }}>
                    <td className="px-4 py-3 font-mono text-xs font-bold" style={{ color: "var(--muted-foreground)" }}>
                      #{i + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img src={p.images?.[0] || p.image || ""} alt={p.name} className="w-8 h-8 rounded object-cover" style={{ border: "1px solid var(--border)" }} />
                        <span className="font-medium text-sm">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>{p.category}</td>
                    <td className="px-4 py-3 font-mono text-xs">{p.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-card rounded p-4" style={{ border: "1px solid var(--border)" }}>
      <div className="text-xs font-medium mb-2" style={{ color: "var(--muted-foreground)", letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</div>
      <div className="font-serif text-2xl" style={{ color: "var(--foreground)" }}>{value}</div>
      {sub && <div className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>{sub}</div>}
    </div>
  );
}
