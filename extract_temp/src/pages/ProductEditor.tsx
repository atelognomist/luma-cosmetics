import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DEMO_PRODUCTS, formatPrice } from "@/lib/data";

export default function ProductEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const existing = id && id !== "new" ? DEMO_PRODUCTS.find((p) => p.id === id) : null;
  const isNew = !existing;

  const [form, setForm] = useState({
    name: existing?.name ?? "",
    brand: existing?.brand ?? "LUMA",
    category: existing?.category ?? "",
    subcategory: existing?.subcategory ?? "",
    description: existing?.description ?? "",
    price: existing?.price ?? 0,
    originalPrice: existing?.originalPrice ?? 0,
    stock: existing?.stock ?? 0,
    lowStockThreshold: existing?.lowStockThreshold ?? 10,
    status: existing?.status ?? "draft",
    bestSeller: existing?.flags.bestSeller ?? false,
    newArrival: existing?.flags.newArrival ?? false,
    featured: existing?.flags.featured ?? false,
    onSale: existing?.flags.onSale ?? false,
    benefits: existing?.benefits ?? "",
    ingredients: existing?.ingredients ?? "",
    howToUse: existing?.howToUse ?? "",
    suitableFor: existing?.suitableFor ?? "",
    warnings: existing?.warnings ?? "",
    size: existing?.size ?? "",
  });

  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const images = existing?.images ?? [];

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="px-7 py-4 bg-card flex items-center gap-4" style={{ borderBottom: "1px solid var(--border)" }}>
        <button onClick={() => navigate("/products")} className="flex items-center gap-1.5 text-sm hover:underline" style={{ color: "var(--muted-foreground)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          Produits
        </button>
        <span style={{ color: "var(--border)" }}>/</span>
        <span className="font-medium text-sm">{isNew ? "Nouveau produit" : existing?.name}</span>
        <div className="flex-1" />
        {saved && (
          <span className="text-xs font-medium px-2.5 py-1 rounded" style={{ backgroundColor: "#ECFDF5", color: "#065F46", border: "1px solid #6EE7B7" }}>
            Enregistré
          </span>
        )}
        <button
          form="product-form"
          type="submit"
          className="px-4 py-2 rounded text-sm font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--primary)", color: "#fff" }}
        >
          {isNew ? "Créer le produit" : "Enregistrer"}
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <form id="product-form" onSubmit={handleSave}>
          <div className="grid grid-cols-3 gap-0">
            {/* Main column */}
            <div className="col-span-2 border-r" style={{ borderColor: "var(--border)" }}>
              {/* Basic info */}
              <Section title="Informations de base">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Field label="Nom du produit" required>
                      <input
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        className="input-base"
                        placeholder="Ex: Fond de Teint Velours"
                        required
                      />
                    </Field>
                  </div>
                  <Field label="Marque">
                    <input value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} className="input-base" />
                  </Field>
                  <Field label="Catégorie">
                    <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="input-base">
                      <option value="">Sélectionner…</option>
                      <option>Teint</option>
                      <option>Yeux</option>
                      <option>Lèvres</option>
                      <option>Soin</option>
                      <option>Corps</option>
                    </select>
                  </Field>
                  <Field label="Sous-catégorie">
                    <input value={form.subcategory} onChange={(e) => setForm((f) => ({ ...f, subcategory: e.target.value }))} className="input-base" placeholder="Ex: Fond de teint" />
                  </Field>
                  <Field label="Taille / Contenance">
                    <input value={form.size} onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))} className="input-base" placeholder="Ex: 30ml" />
                  </Field>
                  <div className="col-span-2">
                    <Field label="Description">
                      <textarea
                        value={form.description}
                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                        rows={3}
                        className="input-base resize-none"
                        placeholder="Description du produit…"
                      />
                    </Field>
                  </div>
                </div>
              </Section>

              {/* Pricing */}
              <Section title="Tarification">
                <div className="grid grid-cols-3 gap-4">
                  <Field label="Prix (DA)" required>
                    <input
                      type="number"
                      value={form.price || ""}
                      onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                      className="input-base"
                      min={0}
                    />
                  </Field>
                  <Field label="Prix original (DA)">
                    <input
                      type="number"
                      value={form.originalPrice || ""}
                      onChange={(e) => setForm((f) => ({ ...f, originalPrice: Number(e.target.value) }))}
                      className="input-base"
                      placeholder="Avant remise"
                      min={0}
                    />
                  </Field>
                  <Field label="Remise">
                    <input
                      value={
                        form.price && form.originalPrice
                          ? `−${Math.round((1 - form.price / form.originalPrice) * 100)}%`
                          : "—"
                      }
                      readOnly
                      className="input-base"
                      style={{ color: "var(--muted-foreground)" }}
                    />
                  </Field>
                </div>
              </Section>

              {/* Inventory */}
              <Section title="Inventaire">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Quantité en stock">
                    <input
                      type="number"
                      value={form.stock}
                      onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))}
                      className="input-base"
                      min={0}
                    />
                  </Field>
                  <Field label="Seuil d'alerte stock faible">
                    <input
                      type="number"
                      value={form.lowStockThreshold}
                      onChange={(e) => setForm((f) => ({ ...f, lowStockThreshold: Number(e.target.value) }))}
                      className="input-base"
                      min={0}
                    />
                  </Field>
                </div>
              </Section>

              {/* Product info */}
              <Section title="Informations produit">
                <div className="flex flex-col gap-4">
                  <Field label="Bénéfices">
                    <textarea value={form.benefits} onChange={(e) => setForm((f) => ({ ...f, benefits: e.target.value }))} rows={2} className="input-base resize-none" />
                  </Field>
                  <Field label="Convient pour">
                    <input value={form.suitableFor} onChange={(e) => setForm((f) => ({ ...f, suitableFor: e.target.value }))} className="input-base" />
                  </Field>
                  <Field label="Mode d'emploi">
                    <textarea value={form.howToUse} onChange={(e) => setForm((f) => ({ ...f, howToUse: e.target.value }))} rows={2} className="input-base resize-none" />
                  </Field>
                  <Field label="Ingrédients">
                    <textarea value={form.ingredients} onChange={(e) => setForm((f) => ({ ...f, ingredients: e.target.value }))} rows={2} className="input-base resize-none" />
                  </Field>
                  <Field label="Avertissements">
                    <input value={form.warnings} onChange={(e) => setForm((f) => ({ ...f, warnings: e.target.value }))} className="input-base" />
                  </Field>
                </div>
              </Section>

              {/* Media */}
              <Section title="Médias">
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="text-xs font-medium mb-2" style={{ color: "var(--muted-foreground)" }}>Images</div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {images.map((src, i) => (
                        <div key={i} className="relative group">
                          <img src={src} alt="" className="w-20 h-20 rounded object-cover" style={{ border: "1px solid var(--border)" }} />
                          {i === 0 && (
                            <span
                              className="absolute bottom-1 left-1 text-[9px] font-mono px-1 rounded"
                              style={{ backgroundColor: "var(--primary)", color: "#fff" }}
                            >
                              Principale
                            </span>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        className="w-20 h-20 rounded flex flex-col items-center justify-center gap-1 transition-colors hover:bg-secondary"
                        style={{ border: "1.5px dashed var(--border)", color: "var(--muted-foreground)" }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        <span className="text-[10px]">Ajouter</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium mb-2" style={{ color: "var(--muted-foreground)" }}>Vidéo produit</div>
                    <button
                      type="button"
                      className="flex items-center gap-3 px-4 py-3 rounded transition-colors hover:bg-secondary w-full text-left"
                      style={{ border: "1.5px dashed var(--border)", color: "var(--muted-foreground)" }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                      </svg>
                      <div>
                        <div className="text-sm">Ajouter une vidéo</div>
                        <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>Démonstration, texture, tutoriel — MP4, MOV</div>
                      </div>
                    </button>
                  </div>
                </div>
              </Section>
            </div>

            {/* Right: Status + Flags */}
            <div className="col-span-1 px-5 py-5 flex flex-col gap-5">
              <div>
                <div className="text-xs font-semibold mb-3" style={{ color: "var(--muted-foreground)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Statut
                </div>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as "published" | "draft" }))}
                  className="input-base w-full"
                >
                  <option value="published">Publié</option>
                  <option value="draft">Brouillon</option>
                  <option value="hidden">Masqué</option>
                  <option value="archived">Archivé</option>
                </select>
              </div>

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20 }}>
                <div className="text-xs font-semibold mb-3" style={{ color: "var(--muted-foreground)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Badges & Mise en avant
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { key: "bestSeller", label: "Meilleure vente" },
                    { key: "newArrival", label: "Nouveau" },
                    { key: "featured", label: "Produit vedette" },
                    { key: "onSale", label: "En promotion" },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center justify-between cursor-pointer py-1.5">
                      <span className="text-sm">{label}</span>
                      <div
                        className="relative w-9 h-5 rounded-full transition-colors"
                        style={{ backgroundColor: form[key as keyof typeof form] ? "var(--primary)" : "var(--muted)" }}
                        onClick={() => setForm((f) => ({ ...f, [key]: !f[key as keyof typeof f] }))}
                      >
                        <div
                          className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm"
                          style={{ transform: form[key as keyof typeof form] ? "translateX(18px)" : "translateX(2px)" }}
                        />
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {existing && (
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20 }}>
                  <div className="text-xs font-semibold mb-3" style={{ color: "var(--muted-foreground)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    Aperçu
                  </div>
                  {images[0] && (
                    <img src={images[0]} alt={existing.name} className="w-full rounded object-cover mb-3" style={{ height: 140, border: "1px solid var(--border)" }} />
                  )}
                  <div className="text-sm font-medium">{form.name || "—"}</div>
                  <div className="text-xs font-mono mt-1" style={{ color: "var(--primary)" }}>
                    {form.price ? formatPrice(form.price) : "—"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      <style>{`
        .input-base {
          width: 100%;
          border: 1px solid var(--border);
          border-radius: 5px;
          padding: 7px 10px;
          font-size: 13px;
          font-family: 'DM Sans', system-ui, sans-serif;
          background-color: var(--background);
          color: var(--foreground);
          outline: none;
          transition: border-color 0.1s;
        }
        .input-base:focus { border-color: var(--primary); }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-7 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
      <h3
        className="text-xs font-semibold mb-4"
        style={{ color: "var(--muted-foreground)", letterSpacing: "0.06em", textTransform: "uppercase" }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>
        {label} {required && <span style={{ color: "#DC2626" }}>*</span>}
      </label>
      {children}
    </div>
  );
}
