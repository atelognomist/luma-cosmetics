import { useState } from "react";
import { DEMO_CAMPAIGNS, DEMO_PRODUCTS, type Campaign } from "@/lib/data";

const typeLabels: Record<Campaign["type"], string> = {
  collection: "Collection",
  offer: "Offre",
  seasonal: "Saisonnière",
  trending: "Tendance",
};

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState(DEMO_CAMPAIGNS);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newForm, setNewForm] = useState<Partial<Campaign>>({
    name: "",
    description: "",
    type: "collection",
    startDate: "",
    active: true,
    productIds: [],
  });

  function toggleActive(id: string) {
    setCampaigns((cs) => cs.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-7 py-5 bg-card" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-xl" style={{ letterSpacing: "-0.01em" }}>Campagnes</h1>
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium hover:opacity-90"
            style={{ backgroundColor: "var(--primary)", color: "#fff" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Nouvelle campagne
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-7 py-6">
        {campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Aucune campagne créée</p>
            <button onClick={() => setShowNew(true)} className="text-sm underline" style={{ color: "var(--primary)" }}>
              Créer une campagne
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {campaigns.map((c) => {
              const products = DEMO_PRODUCTS.filter((p) => c.productIds.includes(p.id));
              return (
                <div
                  key={c.id}
                  className="bg-card rounded flex flex-col overflow-hidden"
                  style={{ border: "1px solid var(--border)", opacity: c.active ? 1 : 0.6 }}
                >
                  {c.image && (
                    <div className="relative">
                      <img
                        src={c.image}
                        alt={c.name}
                        className="w-full object-cover"
                        style={{ height: 140 }}
                      />
                      <div className="absolute top-2 left-2 flex gap-1.5">
                        <span
                          className="text-[10px] font-mono px-2 py-0.5 rounded font-medium"
                          style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "#fff" }}
                        >
                          {typeLabels[c.type]}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span
                          className="text-[10px] font-mono px-2 py-0.5 rounded font-medium"
                          style={{
                            backgroundColor: c.active ? "#ECFDF5" : "#F3F4F6",
                            color: c.active ? "#065F46" : "#6B7280",
                            border: `1px solid ${c.active ? "#6EE7B7" : "#D1D5DB"}`,
                          }}
                        >
                          {c.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-4 flex flex-col gap-3 flex-1">
                    <div>
                      <h3 className="font-semibold">{c.name}</h3>
                      <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>{c.description}</p>
                    </div>
                    <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      <span>Début : {c.startDate}</span>
                      {c.endDate && <span> · Fin : {c.endDate}</span>}
                    </div>
                    <div>
                      <div className="text-xs font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                        Produits ({products.length})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {products.map((p) => (
                          <span
                            key={p.id}
                            className="text-xs px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: "var(--secondary)", color: "var(--secondary-foreground)" }}
                          >
                            {p.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-auto pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                      <button
                        onClick={() => toggleActive(c.id)}
                        className="text-xs px-3 py-1.5 rounded font-medium flex-1 transition-colors"
                        style={{
                          border: "1px solid var(--border)",
                          color: c.active ? "#991B1B" : "#065F46",
                          backgroundColor: c.active ? "#FEF2F2" : "#ECFDF5",
                        }}
                      >
                        {c.active ? "Désactiver" : "Activer"}
                      </button>
                      <button
                        onClick={() => setEditing(c)}
                        className="text-xs px-3 py-1.5 rounded font-medium"
                        style={{ backgroundColor: "var(--secondary)", color: "var(--secondary-foreground)" }}
                      >
                        Modifier
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New/Edit modal */}
      {showNew && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={(e) => e.target === e.currentTarget && setShowNew(false)}
        >
          <div
            className="bg-card rounded-lg w-full max-w-[500px] max-h-[90vh] overflow-y-auto"
            style={{ border: "1px solid var(--border)", boxShadow: "0 8px 32px rgba(0,0,0,0.16)" }}
          >
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
              <h3 className="font-semibold">Nouvelle campagne</h3>
              <button onClick={() => setShowNew(false)} style={{ color: "var(--muted-foreground)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="px-5 py-5 flex flex-col gap-4">
              <FormField label="Nom de la campagne">
                <input
                  value={newForm.name}
                  onChange={(e) => setNewForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded px-3 py-2 text-sm outline-none"
                  style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </FormField>
              <FormField label="Description">
                <textarea
                  value={newForm.description}
                  onChange={(e) => setNewForm((f) => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full rounded px-3 py-2 text-sm outline-none resize-none"
                  style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Type">
                  <select
                    value={newForm.type}
                    onChange={(e) => setNewForm((f) => ({ ...f, type: e.target.value as Campaign["type"] }))}
                    className="w-full rounded px-3 py-2 text-sm outline-none"
                    style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  >
                    {Object.entries(typeLabels).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Date de début">
                  <input
                    type="date"
                    value={newForm.startDate}
                    onChange={(e) => setNewForm((f) => ({ ...f, startDate: e.target.value }))}
                    className="w-full rounded px-3 py-2 text-sm outline-none"
                    style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                  />
                </FormField>
              </div>
              <FormField label="Produits inclus">
                <div className="flex flex-col gap-1.5 mt-1">
                  {DEMO_PRODUCTS.map((p) => (
                    <label key={p.id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newForm.productIds?.includes(p.id) ?? false}
                        onChange={(e) => {
                          setNewForm((f) => ({
                            ...f,
                            productIds: e.target.checked
                              ? [...(f.productIds ?? []), p.id]
                              : (f.productIds ?? []).filter((id) => id !== p.id),
                          }));
                        }}
                        style={{ accentColor: "var(--primary)" }}
                      />
                      {p.name}
                    </label>
                  ))}
                </div>
              </FormField>
            </div>
            <div className="px-5 py-3 flex gap-2 justify-end" style={{ borderTop: "1px solid var(--border)" }}>
              <button onClick={() => setShowNew(false)} className="px-4 py-2 rounded text-sm" style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
                Annuler
              </button>
              <button
                onClick={() => {
                  const c: Campaign = {
                    id: `c${Date.now()}`,
                    name: newForm.name ?? "",
                    description: newForm.description ?? "",
                    type: newForm.type ?? "collection",
                    startDate: newForm.startDate ?? "",
                    active: true,
                    productIds: newForm.productIds ?? [],
                  };
                  setCampaigns((cs) => [...cs, c]);
                  setShowNew(false);
                }}
                className="px-4 py-2 rounded text-sm font-medium hover:opacity-90"
                style={{ backgroundColor: "var(--primary)", color: "#fff" }}
              >
                Créer la campagne
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>{label}</label>
      {children}
    </div>
  );
}
