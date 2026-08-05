import { useState, useEffect } from "react";
import { getOrders } from "@/lib/api/orders";
import { getDeliveryAgencies } from "@/lib/api/delivery";
import type { Order, DeliveryAgency } from "@/lib/api/types";
import StatusBadge from "../components/ui/StatusBadge";

export default function Delivery() {
  const [activeAgency, setActiveAgency] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [agencies, setAgencies] = useState<DeliveryAgency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getOrders(), getDeliveryAgencies()]).then(([oData, aData]) => {
      setOrders(oData);
      setAgencies(aData);
      setLoading(false);
    });
  }, []);

  const agency = activeAgency ? agencies.find((a) => a.id === activeAgency) : null;

  const inTransitOrders = orders.filter((o) =>
    ["sent", "picked_up", "out_for_delivery"].includes(o.status)
  );

  if (loading) return <div className="p-8 text-muted-foreground text-sm">Chargement...</div>;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-7 py-5 bg-card" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-xl" style={{ letterSpacing: "-0.01em" }}>Livraison</h1>
          <span
            className="text-xs font-mono px-2 py-1 rounded"
            style={{ backgroundColor: "#FFF7ED", color: "#92400E", border: "1px solid #FDE68A" }}
          >
            APIs non connectées — Mode démo
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-7 py-6 flex flex-col gap-6">
        {/* Overview table */}
        <div>
          <h2 className="text-xs font-semibold mb-3" style={{ color: "var(--muted-foreground)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Agences de livraison
          </h2>
          <div className="bg-card rounded overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Agence", "Statut", "API", "En attente", "En transit", "Livrées", "Échouées", "Retournées", ""].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left font-medium" style={{ color: "var(--muted-foreground)", fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {agencies.map((a, i) => (
                  <tr
                    key={a.id}
                    className="hover:bg-secondary transition-colors"
                    style={{ borderBottom: i < agencies.length - 1 ? "1px solid var(--border)" : undefined }}
                  >
                    <td className="px-4 py-3 font-medium">{a.name}</td>
                    <td className="px-4 py-3">
                      <span
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: a.active ? "#ECFDF5" : "#F9FAFB",
                          color: a.active ? "#065F46" : "#374151",
                          border: `1px solid ${a.active ? "#6EE7B7" : "#E5E7EB"}`,
                        }}
                      >
                        {a.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: a.apiConnected ? "#ECFDF5" : "#F9FAFB",
                          color: a.apiConnected ? "#065F46" : "#6B7280",
                          border: `1px solid ${a.apiConnected ? "#6EE7B7" : "#E5E7EB"}`,
                        }}
                      >
                        {a.apiConnected ? "Connectée" : "Non connectée"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-sm">{a.stats.pending}</td>
                    <td className="px-4 py-3 font-mono text-sm">{a.stats.inTransit}</td>
                    <td className="px-4 py-3 font-mono text-sm font-medium" style={{ color: "#059669" }}>{a.stats.delivered}</td>
                    <td className="px-4 py-3 font-mono text-sm" style={{ color: "#DC2626" }}>{a.stats.failed}</td>
                    <td className="px-4 py-3 font-mono text-sm" style={{ color: "#D97706" }}>{a.stats.returned}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setActiveAgency(a.id === activeAgency ? null : a.id)}
                        className="text-xs px-2.5 py-1 rounded font-medium"
                        style={{
                          backgroundColor: a.id === activeAgency ? "var(--primary)" : "var(--secondary)",
                          color: a.id === activeAgency ? "#fff" : "var(--secondary-foreground)",
                        }}
                      >
                        {a.id === activeAgency ? "Masquer" : "Détails"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Agency detail */}
        {agency && (
          <div className="bg-card rounded" style={{ border: "1px solid var(--border)" }}>
            <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
              <div>
                <h3 className="font-semibold">{agency.name}</h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                  Configuration et statut de l'intégration
                </p>
              </div>
              <div
                className="px-3 py-1.5 rounded text-xs"
                style={{ backgroundColor: "#FFF7ED", color: "#92400E", border: "1px solid #FDE68A" }}
              >
                Intégration API future — non connectée
              </div>
            </div>
            <div className="p-4 grid grid-cols-3 gap-4">
              <div className="col-span-2 flex flex-col gap-4">
                <div>
                  <div className="text-xs font-medium mb-2" style={{ color: "var(--muted-foreground)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    Capacités API prévues
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {["Calcul du tarif", "Créer la commande livraison", "Recevoir le numéro de suivi", "Suivi en temps réel", "Mises à jour automatiques", "Gestion des retours"].map((cap) => (
                      <div
                        key={cap}
                        className="flex items-center gap-2 text-xs px-3 py-2 rounded"
                        style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)" }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--muted-foreground)" }}>
                          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {cap}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium mb-2" style={{ color: "var(--muted-foreground)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    Wilayas desservies ({agency.wilayas.length})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {agency.wilayas.map((w) => (
                      <span
                        key={w}
                        className="font-mono text-[10px] px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: "var(--secondary)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}
                      >
                        W{w.toString().padStart(2, "0")}
                      </span>
                    ))}
                    {agency.wilayas.length === 0 && (
                      <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>Aucune wilaya configurée</span>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xs font-medium mb-2" style={{ color: "var(--muted-foreground)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  Statistiques
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    ["En attente", agency.stats.pending, "var(--foreground)"],
                    ["En transit", agency.stats.inTransit, "#0284C7"],
                    ["Livrées", agency.stats.delivered, "#059669"],
                    ["Échouées", agency.stats.failed, "#DC2626"],
                    ["Retournées", agency.stats.returned, "#D97706"],
                  ].map(([label, val, color]) => (
                    <div key={label as string} className="flex items-center justify-between text-sm">
                      <span style={{ color: "var(--muted-foreground)", fontSize: 12 }}>{label as string}</span>
                      <span className="font-mono font-semibold" style={{ color: color as string }}>{val as number}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* In-transit orders */}
        <div>
          <h2 className="text-xs font-semibold mb-3" style={{ color: "var(--muted-foreground)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Commandes en cours de livraison
          </h2>
          {inTransitOrders.length === 0 ? (
            <div
              className="bg-card rounded p-8 text-center text-sm"
              style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
            >
              Aucune commande en transit actuellement
            </div>
          ) : (
            <div className="bg-card rounded" style={{ border: "1px solid var(--border)" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Commande", "Client", "Wilaya", "Agence", "Suivi", "Statut"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left font-medium" style={{ color: "var(--muted-foreground)", fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {inTransitOrders.map((o, i) => (
                    <tr key={o.id} style={{ borderBottom: i < inTransitOrders.length - 1 ? "1px solid var(--border)" : undefined }}>
                      <td className="px-4 py-3 font-mono text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>#{o.num}</td>
                      <td className="px-4 py-3 font-medium">{o.customer.name}</td>
                      <td className="px-4 py-3 text-xs">{o.customer.wilaya}</td>
                      <td className="px-4 py-3 text-xs">{o.deliveryAgency ?? "—"}</td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>
                        {o.trackingNumber ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={o.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
