import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DEMO_PRODUCTS, formatPrice, type Product } from "@/lib/data";

type Filter = "all" | "published" | "draft" | "hidden" | "archived";

function StockPill({ product }: { product: Product }) {
  if (product.stock === 0)
    return <span className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA" }}>Rupture</span>;
  if (product.stock <= product.lowStockThreshold)
    return <span className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "#FFFBEB", color: "#92400E", border: "1px solid #FDE68A" }}>{product.stock}</span>;
  return <span className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "#F0FDF4", color: "#14532D", border: "1px solid #BBF7D0" }}>{product.stock}</span>;
}

function Flag({ label, active }: { label: string; active: boolean }) {
  if (!active) return null;
  return (
    <span
      className="text-[10px] font-mono px-1.5 py-0.5 rounded"
      style={{ backgroundColor: "var(--secondary)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}
    >
      {label}
    </span>
  );
}

export default function Products() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const filtered = DEMO_PRODUCTS.filter((p) => {
    const matchFilter = filter === "all" || p.status === filter;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div
        className="px-7 py-5 bg-card"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-serif text-xl" style={{ letterSpacing: "-0.01em" }}>Produits</h1>
          <button
            onClick={() => navigate("/products/new")}
            className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--primary)", color: "#fff" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nouveau produit
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--muted-foreground)" }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit…"
              className="w-full rounded pl-8 pr-4 py-1.5 text-sm outline-none"
              style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>
          <div className="flex gap-0.5">
            {(["all", "published", "draft", "hidden", "archived"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
                style={{
                  backgroundColor: filter === f ? "var(--primary)" : "transparent",
                  color: filter === f ? "#fff" : "var(--muted-foreground)",
                }}
              >
                {f === "all" ? "Tous" : f === "published" ? "Publiés" : f === "draft" ? "Brouillons" : f === "hidden" ? "Masqués" : "Archivés"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Aucun produit trouvé</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card z-10">
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["", "Produit", "Catégorie", "Prix", "Stock", "Statut", "Badges", ""].map((h, i) => (
                  <th
                    key={i}
                    className="px-4 py-2.5 text-left font-medium"
                    style={{ color: "var(--muted-foreground)", fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr
                  key={p.id}
                  className="cursor-pointer hover:bg-secondary transition-colors"
                  style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : undefined }}
                  onClick={() => navigate(`/products/${p.id}`)}
                >
                  <td className="px-4 py-3">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-10 h-10 rounded object-cover"
                      style={{ border: "1px solid var(--border)" }}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{p.brand}</div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {p.category}
                    {p.subcategory && <div>{p.subcategory}</div>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs font-medium whitespace-nowrap">
                    {formatPrice(p.price)}
                    {p.originalPrice && (
                      <div className="text-[10px] line-through" style={{ color: "var(--muted-foreground)" }}>
                        {formatPrice(p.originalPrice)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StockPill product={p} />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded font-medium"
                      style={{
                        backgroundColor:
                          p.status === "published"
                            ? "#F0FDF4"
                            : p.status === "draft"
                            ? "#FFFBEB"
                            : p.status === "hidden"
                            ? "#F9FAFB"
                            : "#F3F4F6",
                        color:
                          p.status === "published"
                            ? "#14532D"
                            : p.status === "draft"
                            ? "#92400E"
                            : "#374151",
                        border: `1px solid ${p.status === "published" ? "#BBF7D0" : p.status === "draft" ? "#FDE68A" : "#E5E7EB"}`,
                      }}
                    >
                      {p.status === "published" ? "Publié" : p.status === "draft" ? "Brouillon" : p.status === "hidden" ? "Masqué" : "Archivé"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <Flag label="Meilleure vente" active={p.flags.bestSeller} />
                      <Flag label="Nouveau" active={p.flags.newArrival} />
                      <Flag label="Vedette" active={p.flags.featured} />
                      <Flag label="Promo" active={p.flags.onSale} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="text-xs px-2.5 py-1 rounded font-medium"
                      style={{ backgroundColor: "var(--secondary)", color: "var(--secondary-foreground)" }}
                      onClick={(e) => { e.stopPropagation(); navigate(`/products/${p.id}`); }}
                    >
                      Modifier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
