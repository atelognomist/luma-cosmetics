import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import StatusBadge from "../components/ui/StatusBadge";
import { STATUS_LABELS, formatPrice, formatDate, orderTotal } from "../lib/data";
import { getOrder, updateOrderStatus, addOrderCall } from "@/lib/api/orders";
import type { Order, OrderStatus } from "@/lib/api/types";

type CallOutcome = "confirmed" | "rejected" | "no_answer" | "unavailable" | "wrong_number" | "callback";

const outcomeLabels: Record<CallOutcome, string> = {
  confirmed: "Confirmée",
  rejected: "Rejetée",
  no_answer: "Sans réponse",
  unavailable: "Hors service",
  wrong_number: "Mauvais numéro",
  callback: "Rappel demandé",
};

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const [showCallModal, setShowCallModal] = useState(false);
  const [callOutcome, setCallOutcome] = useState<CallOutcome | null>(null);
  const [callNote, setCallNote] = useState("");

  const refreshOrder = async () => {
    if (!id) return;
    const data = await getOrder(id);
    setOrder(data);
    setLoading(false);
  };

  useEffect(() => {
    refreshOrder();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-muted-foreground text-sm">Chargement...</div>;
  }

  if (!order) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 flex-col gap-3">
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Commande introuvable</p>
        <button onClick={() => navigate("/orders")} className="text-sm underline" style={{ color: "var(--primary)" }}>
          Retour aux commandes
        </button>
      </div>
    );
  }

  const status = order.status;
  const total = orderTotal(order as any);
  const subtotal = order.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const attempts = order.calls.length;

  async function handleCallSubmit() {
    if (!callOutcome || !id) return;
    
    await addOrderCall(id, {
      at: new Date().toISOString(),
      outcome: callOutcome as any,
      note: callNote
    });

    if (callOutcome === "confirmed") await updateOrderStatus(id, "confirmed");
    if (callOutcome === "rejected") await updateOrderStatus(id, "rejected");
    if (callOutcome === "no_answer") await updateOrderStatus(id, "no_answer");

    setShowCallModal(false);
    setCallOutcome(null);
    setCallNote("");
    refreshOrder();
  }

  const canAdvance = ["confirmed", "preparing", "ready"].includes(status);

  async function advanceStatus() {
    if (!id) return;
    const flow: Partial<Record<OrderStatus, OrderStatus>> = {
      confirmed: "preparing",
      preparing: "ready",
      ready: "sent",
    };
    if (flow[status]) {
      await updateOrderStatus(id, flow[status]!);
      refreshOrder();
    }
  }

  const advanceLabel: Partial<Record<OrderStatus, string>> = {
    confirmed: "Démarrer préparation",
    preparing: "Marquer prêt",
    ready: "Envoyer en livraison",
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div
        className="px-7 py-4 bg-card flex items-center gap-4"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-1.5 text-sm hover:underline"
          style={{ color: "var(--muted-foreground)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Commandes
        </button>
        <span style={{ color: "var(--border)" }}>/</span>
        <span className="font-mono text-sm font-medium">#{order.num}</span>
        <StatusBadge status={status} size="md" />
        {attempts > 0 && status === "no_answer" && (
          <span
            className="text-xs font-mono px-2 py-0.5 rounded"
            style={{ backgroundColor: "var(--status-no-answer-bg)", color: "var(--status-no-answer-fg)" }}
          >
            {attempts} tentative{attempts > 1 ? "s" : ""}
          </span>
        )}
        <div className="flex-1" />
        <span className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>
          {formatDate(order.createdAt)}
        </span>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-3 gap-0 h-full">
          {/* Left: Customer + Products */}
          <div className="col-span-2 border-r flex flex-col gap-0" style={{ borderColor: "var(--border)" }}>
            {/* CALL ACTION — most prominent */}
            <div
              className="px-7 py-5"
              style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--secondary)" }}
            >
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-xs font-medium mb-1" style={{ color: "var(--muted-foreground)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Action principale
                  </div>
                  <div className="text-base font-semibold">{order.customer.name}</div>
                  <div className="font-mono text-sm mt-0.5" style={{ color: "var(--foreground)" }}>
                    {order.customer.phone}
                  </div>
                </div>
                {["new", "calling", "no_answer"].includes(status) && (
                  <button
                    onClick={() => setShowCallModal(true)}
                    className="flex items-center gap-2.5 px-5 py-3 rounded font-semibold text-sm transition-opacity hover:opacity-90"
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "#fff",
                      fontSize: 15,
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.63a19.79 19.79 0 01-3.07-8.7A2 2 0 012.18 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.56-.56a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z" />
                    </svg>
                    Appeler — {order.customer.phone}
                  </button>
                )}
                {canAdvance && (
                  <button
                    onClick={advanceStatus}
                    className="px-4 py-2.5 rounded font-medium text-sm transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#059669", color: "#fff" }}
                  >
                    {advanceLabel[status]}
                  </button>
                )}
              </div>
            </div>

            {/* Customer info */}
            <div className="px-7 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
              <h3
                className="text-xs font-semibold mb-3"
                style={{ color: "var(--muted-foreground)", letterSpacing: "0.06em", textTransform: "uppercase" }}
              >
                Informations client
              </h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2.5 text-sm">
                <Field label="Nom" value={order.customer.name} />
                <Field label="Téléphone" value={order.customer.phone} mono />
                <Field label="Wilaya" value={order.customer.wilaya} />
                <Field label="Commune" value={order.customer.commune} />
                <div className="col-span-2">
                  <Field label="Adresse" value={order.customer.address} />
                </div>
                {order.customer.deliveryNotes && (
                  <div className="col-span-2">
                    <Field label="Notes livraison" value={order.customer.deliveryNotes} />
                  </div>
                )}
              </div>
            </div>

            {/* Order items */}
            <div className="px-7 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
              <h3
                className="text-xs font-semibold mb-3"
                style={{ color: "var(--muted-foreground)", letterSpacing: "0.06em", textTransform: "uppercase" }}
              >
                Articles commandés
              </h3>
              <div className="flex flex-col gap-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded object-cover shrink-0"
                      style={{ border: "1px solid var(--border)" }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{item.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                        {[item.shade, item.variant].filter(Boolean).join(" · ")}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-mono font-medium">{formatPrice(item.unitPrice)}</div>
                      <div className="text-xs font-mono mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                        × {item.qty}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div
                className="mt-4 pt-4 flex flex-col gap-1.5"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--muted-foreground)" }}>Sous-total</span>
                  <span className="font-mono">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--muted-foreground)" }}>Frais de livraison</span>
                  <span className="font-mono">{formatPrice(order.deliveryFee)}</span>
                </div>
                <div
                  className="flex justify-between pt-2 mt-1"
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  <span className="font-semibold">Total</span>
                  <span className="font-mono font-bold text-base" style={{ color: "var(--primary)" }}>
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery info if applicable */}
            {order.deliveryAgency && (
              <div className="px-7 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
                <h3
                  className="text-xs font-semibold mb-3"
                  style={{ color: "var(--muted-foreground)", letterSpacing: "0.06em", textTransform: "uppercase" }}
                >
                  Livraison
                </h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2.5 text-sm">
                  <Field label="Agence" value={order.deliveryAgency} />
                  {order.trackingNumber && (
                    <Field label="Numéro de suivi" value={order.trackingNumber} mono />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right: Timeline + Call log */}
          <div className="col-span-1 flex flex-col">
            <div className="px-5 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
              <h3
                className="text-xs font-semibold mb-4"
                style={{ color: "var(--muted-foreground)", letterSpacing: "0.06em", textTransform: "uppercase" }}
              >
                Historique
              </h3>
              <div className="flex flex-col gap-0">
                {order.timeline.map((ev, i) => (
                  <div key={i} className="flex gap-3 relative">
                    {i < order.timeline.length - 1 && (
                      <div
                        className="absolute left-2 top-4 bottom-0 w-px"
                        style={{ backgroundColor: "var(--border)" }}
                      />
                    )}
                    <div
                      className="w-4 h-4 rounded-full shrink-0 mt-0.5 flex items-center justify-center"
                      style={{ backgroundColor: i === order.timeline.length - 1 ? "var(--primary)" : "var(--muted)", zIndex: 1 }}
                    >
                      {i === order.timeline.length - 1 && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <div className="pb-4">
                      <div className="text-sm font-medium">{ev.label}</div>
                      {ev.sub && (
                        <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                          {ev.sub}
                        </div>
                      )}
                      <div className="text-xs font-mono mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                        {formatDate(ev.at)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Call attempts */}
            {order.calls.length > 0 && (
              <div className="px-5 py-5">
                <h3
                  className="text-xs font-semibold mb-3"
                  style={{ color: "var(--muted-foreground)", letterSpacing: "0.06em", textTransform: "uppercase" }}
                >
                  Appels
                </h3>
                <div className="flex flex-col gap-2">
                  {order.calls.map((c, i) => (
                    <div
                      key={i}
                      className="rounded p-3 text-sm"
                      style={{ backgroundColor: "var(--secondary)", border: "1px solid var(--border)" }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-xs">Tentative {i + 1}</span>
                        <span
                          className="text-xs font-mono"
                          style={{
                            color:
                              c.outcome === "confirmed"
                                ? "#059669"
                                : c.outcome === "rejected"
                                ? "#DC2626"
                                : "var(--muted-foreground)",
                          }}
                        >
                          {outcomeLabels[c.outcome as CallOutcome] ?? c.outcome}
                        </span>
                      </div>
                      {c.note && (
                        <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                          "{c.note}"
                        </p>
                      )}
                      <div className="text-xs font-mono mt-1" style={{ color: "var(--muted-foreground)" }}>
                        {formatDate(c.at)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Call Modal */}
      {showCallModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={(e) => e.target === e.currentTarget && setShowCallModal(false)}
        >
          <div
            className="bg-card rounded-lg w-full max-w-[420px]"
            style={{ border: "1px solid var(--border)", boxShadow: "0 8px 32px rgba(0,0,0,0.16)" }}
          >
            <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Résultat de l'appel</h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                    {order.customer.name} — {order.customer.phone}
                  </p>
                </div>
                <button
                  onClick={() => setShowCallModal(false)}
                  className="w-7 h-7 flex items-center justify-center rounded"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm mb-3 font-medium">Que s'est-il passé ?</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {(Object.keys(outcomeLabels) as CallOutcome[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setCallOutcome(key)}
                    className="px-3 py-2.5 rounded text-sm text-left transition-all"
                    style={{
                      border: `1px solid ${callOutcome === key ? "var(--primary)" : "var(--border)"}`,
                      backgroundColor: callOutcome === key ? "var(--secondary)" : "transparent",
                      color: callOutcome === key ? "var(--primary)" : "var(--foreground)",
                      fontWeight: callOutcome === key ? 600 : 400,
                    }}
                  >
                    {outcomeLabels[key]}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                  Note interne (optionnelle)
                </label>
                <textarea
                  value={callNote}
                  onChange={(e) => setCallNote(e.target.value)}
                  placeholder="Ex: Cliente disponible après 17h…"
                  rows={2}
                  className="w-full rounded px-3 py-2 text-sm resize-none outline-none"
                  style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>
            </div>
            <div
              className="px-5 py-3 flex gap-2 justify-end"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <button
                onClick={() => setShowCallModal(false)}
                className="px-4 py-2 rounded text-sm"
                style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
              >
                Annuler
              </button>
              <button
                onClick={handleCallSubmit}
                disabled={!callOutcome}
                className="px-4 py-2 rounded text-sm font-medium transition-opacity"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "#fff",
                  opacity: callOutcome ? 1 : 0.4,
                }}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-xs mb-0.5" style={{ color: "var(--muted-foreground)" }}>{label}</div>
      <div className={`text-sm font-medium ${mono ? "font-mono" : ""}`}>{value || "—"}</div>
    </div>
  );
}
