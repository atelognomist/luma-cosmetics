import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { formatPrice } from "../lib/data";
import { getProduct, updateProduct, createProduct, deleteProduct } from "@/lib/api/products";
import type { Product, ProductMedia } from "@/lib/api/types";
import { ArrowUp, ArrowDown, Trash2, Image as ImageIcon, Video, Star } from "lucide-react";

export default function ProductEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [existing, setExisting] = useState<Product | null>(null);
  const [loading, setLoading] = useState(!isNew);
  
  const [form, setForm] = useState({
    name: "",
    brand: "LUMA",
    category: "",
    subcategory: "",
    description: "",
    price: 0,
    originalPrice: 0,
    stock: 0,
    lowStockThreshold: 10,
    status: "draft" as "published" | "draft" | "hidden" | "archived",
    bestSeller: false,
    newArrival: false,
    featured: false,
    onSale: false,
    benefits: "",
    ingredients: "",
    howToUse: "",
    suitableFor: "",
    warnings: "",
    size: "",
    media: [] as ProductMedia[]
  });

  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isNew) return;
    getProduct(id!, { adminAll: true }).then(data => {
      if (data) {
        setExisting(data);
        setForm({
          name: data.name,
          brand: data.brand || "LUMA",
          category: data.category || "",
          subcategory: data.subcategory || "",
          description: data.description || "",
          price: data.price,
          originalPrice: data.originalPrice || 0,
          stock: data.stock || 0,
          lowStockThreshold: data.lowStockThreshold || 10,
          status: data.status,
          bestSeller: data.flags?.bestSeller || false,
          newArrival: data.flags?.newArrival || false,
          featured: data.flags?.featured || false,
          onSale: data.flags?.onSale || false,
          benefits: data.benefits || "",
          ingredients: data.ingredients || "",
          howToUse: data.howToUse || "",
          suitableFor: data.suitableFor || "",
          warnings: data.warnings || "",
          size: data.size || "",
          media: data.media || []
        });
      }
      setLoading(false);
    });
  }, [id, isNew]);

  async function handleSave(e?: React.FormEvent | React.MouseEvent) {
    if (e) e.preventDefault();
    
    // Validation
    setErrorMsg("");
    const nameStr = form.name.trim();
    if (!nameStr) {
      setErrorMsg("Le nom du produit est requis.");
      return;
    }
    if (form.price < 0) {
      setErrorMsg("Le prix ne peut pas être négatif.");
      return;
    }
    if (form.stock < 0) {
      setErrorMsg("Le stock ne peut pas être négatif.");
      return;
    }
    
    const validMedia = form.media
      .filter(m => {
        const urlStr = m.url.trim();
        if (!urlStr) return false;
        if (urlStr.length > 500) return false; // Basic length limit
        if (!urlStr.startsWith("http") && !urlStr.startsWith("/")) return false; // Basic format validation
        return true;
      })
      .map((m, idx) => ({ ...m, url: m.url.trim(), sortOrder: idx }));

    const productData: Partial<Product> = {
      name: form.name,
      brand: form.brand,
      category: form.category,
      subcategory: form.subcategory,
      description: form.description,
      price: form.price,
      originalPrice: form.originalPrice || undefined,
      stock: form.stock,
      lowStockThreshold: form.lowStockThreshold,
      status: form.status,
      flags: {
        bestSeller: form.bestSeller,
        newArrival: form.newArrival,
        featured: form.featured,
        onSale: form.onSale
      },
      benefits: form.benefits,
      ingredients: form.ingredients,
      howToUse: form.howToUse,
      suitableFor: form.suitableFor,
      warnings: form.warnings,
      size: form.size,
      media: validMedia
    };

    // Ensure exactly one primary image if images exist
    const hasImages = productData.media!.some(m => m.type === "image");
    if (hasImages) {
      const primaryCount = productData.media!.filter(m => m.type === "image" && m.isPrimary).length;
      if (primaryCount !== 1) {
        // Reset all primary flags
        productData.media!.forEach(m => { m.isPrimary = false; });
        // Set first image as primary
        const firstImg = productData.media!.find(m => m.type === "image");
        if (firstImg) firstImg.isPrimary = true;
      }
    } else {
      productData.media!.forEach(m => { m.isPrimary = false; });
    }

    if (isNew) {
      await createProduct(productData as Omit<Product, "id">);
      navigate("/products");
    } else {
      await updateProduct(id!, productData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  async function handleDeleteProduct() {
    if (!id || isNew) return;
    setLoading(true);
    await deleteProduct(id);
    navigate("/products");
  }

  if (loading) return <div className="p-8 text-muted-foreground text-sm">Chargement...</div>;

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
        {errorMsg && (
          <span className="text-xs font-medium px-2.5 py-1 rounded" style={{ backgroundColor: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA" }}>
            {errorMsg}
          </span>
        )}
        {saved && !errorMsg && (
          <span className="text-xs font-medium px-2.5 py-1 rounded" style={{ backgroundColor: "#ECFDF5", color: "#065F46", border: "1px solid #6EE7B7" }}>
            Enregistré
          </span>
        )}
        {!isNew && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            type="button"
            className="p-2 rounded hover:bg-muted text-destructive transition-colors"
            title="Supprimer le produit"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={handleSave}
          type="button"
          disabled={loading}
          className="px-4 py-2 rounded text-sm font-medium transition-opacity hover:opacity-90 flex items-center justify-center min-w-[120px] disabled:opacity-50"
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
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Galerie ({form.media.length})</div>
                    <button
                      type="button"
                      onClick={() => setForm(f => ({
                        ...f,
                        media: [...f.media, { id: `m_${Date.now()}`, type: "image", url: "", sortOrder: f.media.length, isPrimary: f.media.length === 0 }]
                      }))}
                      className="text-xs px-3 py-1.5 rounded font-medium transition-colors hover:bg-secondary"
                      style={{ color: "var(--primary)", border: "1px solid var(--primary)" }}
                    >
                      + Ajouter un média
                    </button>
                  </div>
                  
                  {form.media.length === 0 ? (
                    <div className="text-sm text-center py-8 bg-muted rounded border border-dashed border-border" style={{ color: "var(--muted-foreground)" }}>
                      Aucun média ajouté.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {form.media.map((m, i) => (
                        <div key={m.id} className="flex gap-3 p-3 rounded bg-secondary/30 border border-border items-start">
                          <div className="flex flex-col gap-1 mt-1">
                            <button
                              type="button"
                              onClick={() => {
                                if (i === 0) return;
                                const newMedia = [...form.media];
                                [newMedia[i - 1], newMedia[i]] = [newMedia[i], newMedia[i - 1]];
                                setForm(f => ({ ...f, media: newMedia }));
                              }}
                              disabled={i === 0}
                              className={`p-1 rounded ${i === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-muted"}`}
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (i === form.media.length - 1) return;
                                const newMedia = [...form.media];
                                [newMedia[i + 1], newMedia[i]] = [newMedia[i], newMedia[i + 1]];
                                setForm(f => ({ ...f, media: newMedia }));
                              }}
                              disabled={i === form.media.length - 1}
                              className={`p-1 rounded ${i === form.media.length - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-muted"}`}
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          
                          <div className="w-16 h-16 rounded bg-muted flex-shrink-0 border border-border flex items-center justify-center overflow-hidden">
                            {m.url ? (
                              m.type === "image" ? <img src={m.url} alt="" className="w-full h-full object-cover" /> : <div className="text-[10px] text-center px-1"><Video className="w-6 h-6 mx-auto mb-1 text-muted-foreground"/>Vidéo</div>
                            ) : (
                              m.type === "image" ? <ImageIcon className="w-5 h-5 text-muted-foreground opacity-50" /> : <Video className="w-5 h-5 text-muted-foreground opacity-50" />
                            )}
                          </div>

                          <div className="flex-1 flex flex-col gap-2">
                            <div className="flex gap-2">
                              <select
                                value={m.type}
                                onChange={(e) => {
                                  const val = e.target.value as "image"|"video";
                                  setForm(f => ({
                                    ...f,
                                    media: f.media.map((x, idx) => idx === i ? { ...x, type: val, isPrimary: val === "video" ? false : x.isPrimary } : x)
                                  }));
                                }}
                                className="input-base !w-24 !py-1.5"
                              >
                                <option value="image">Image</option>
                                <option value="video">Vidéo</option>
                              </select>
                              <input
                                value={m.url}
                                onChange={(e) => {
                                  setForm(f => ({
                                    ...f,
                                    media: f.media.map((x, idx) => idx === i ? { ...x, url: e.target.value } : x)
                                  }));
                                }}
                                placeholder="URL du média..."
                                className="input-base !py-1.5 flex-1"
                              />
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              {m.type === "image" ? (
                                <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                                  <input
                                    type="radio"
                                    name="primaryMedia"
                                    checked={m.isPrimary}
                                    onChange={() => {
                                      setForm(f => ({
                                        ...f,
                                        media: f.media.map((x, idx) => ({ ...x, isPrimary: idx === i }))
                                      }));
                                    }}
                                    className="accent-[#C4855A]"
                                  />
                                  <Star className={`w-3.5 h-3.5 ${m.isPrimary ? "fill-[#C4855A] text-[#C4855A]" : "text-muted-foreground"}`} />
                                  Image principale
                                </label>
                              ) : (
                                <span className="text-xs text-muted-foreground">Les vidéos ne peuvent pas être l'image principale.</span>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setForm(f => ({
                                    ...f,
                                    media: f.media.filter((_, idx) => idx !== i)
                                  }));
                                }}
                                className="text-destructive hover:text-destructive/80 p-1 rounded"
                                title="Supprimer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                  {form.media.some(m => m.isPrimary && m.url) ? (
                    <img src={form.media.find(m => m.isPrimary && m.url)?.url} alt={form.name} className="w-full rounded object-cover mb-3" style={{ height: 140, border: "1px solid var(--border)" }} />
                  ) : form.media.some(m => m.url && m.type === "image") ? (
                    <img src={form.media.find(m => m.url && m.type === "image")?.url} alt={form.name} className="w-full rounded object-cover mb-3" style={{ height: 140, border: "1px solid var(--border)" }} />
                  ) : null}
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={(e) => e.target === e.currentTarget && setShowDeleteConfirm(false)}
        >
          <div
            className="bg-card rounded-lg w-full max-w-[400px] p-6"
            style={{ border: "1px solid var(--border)", boxShadow: "0 8px 32px rgba(0,0,0,0.16)" }}
          >
            <h3 className="font-semibold text-lg text-foreground mb-2">Supprimer le produit ?</h3>
            <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>
              Êtes-vous sûr de vouloir supprimer "{existing?.name}" ? Cette action est irréversible (le produit sera archivé).
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded text-sm"
                style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteProduct}
                className="px-4 py-2 rounded text-sm font-medium transition-opacity"
                style={{ backgroundColor: "#DC2626", color: "#fff" }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
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
