import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { formatPrice } from "../lib/data";
import { getProducts } from "@/lib/api/products";
import type { Product } from "@/lib/api/types";

type StockFilter = "all" | "in_stock" | "low" | "out";

function stockStatus(p: Product): { label: string; css: string } {
  if (p.status === "archived") return { label: "Archivé", css: "bg-gray-100 text-gray-700 border border-gray-200" };
  if (p.stock === 0) return { label: "Rupture", css: "bg-red-50 text-red-700 border border-red-200" };
  if (p.stock <= p.lowStockThreshold) return { label: "Stock faible", css: "bg-amber-50 text-amber-700 border border-amber-200" };
  return { label: "En stock", css: "bg-green-50 text-green-700 border border-green-200" };
}

export default function Inventory() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<StockFilter>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ adminAll: true }).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const filtered = products.filter((p) => {
    if (filter === "out") return p.stock === 0;
    if (filter === "low") return p.stock > 0 && p.stock <= p.lowStockThreshold;
    if (filter === "in_stock") return p.stock > p.lowStockThreshold;
    return true;
  });

  const outCount = products.filter((p) => p.stock === 0).length;
  const lowCount = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length;

  if (loading) return <div className="p-8 text-muted-foreground text-sm">Chargement...</div>;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-7 py-5 bg-card" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-serif text-xl" style={{ letterSpacing: "-0.01em" }}>Inventaire</h1>
          <div className="flex items-center gap-2">
            {outCount > 0 && (
              <span className="text-xs font-mono px-2 py-1 rounded" style={{ backgroundColor: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA" }}>
                {outCount} rupture{outCount > 1 ? "s" : ""}
              </span>
            )}
            {lowCount > 0 && (
              <span className="text-xs font-mono px-2 py-1 rounded" style={{ backgroundColor: "#FFFBEB", color: "#92400E", border: "1px solid #FDE68A" }}>
                {lowCount} stock faible
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-0.5">
          {([
            ["all", "Tous", products.length],
            ["out", "Rupture", outCount],
            ["low", "Stock faible", lowCount],
            ["in_stock", "En stock", products.filter((p) => p.stock > p.lowStockThreshold).length],
          ] as [StockFilter, string, number][]).map(([key, label, cnt]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors"
              style={{
                backgroundColor: filter === key ? "var(--primary)" : "transparent",
                color: filter === key ? "#fff" : "var(--muted-foreground)",
              }}
            >
              {label}
              <span
                className="font-mono rounded-full px-1"
                style={{
                  backgroundColor: filter === key ? "rgba(255,255,255,0.25)" : "var(--muted)",
                  color: filter === key ? "#fff" : "var(--muted-foreground)",
                  fontSize: 9,
                  minWidth: 16,
                  textAlign: "center",
                  paddingTop: 2,
                  paddingBottom: 2,
                }}
              >
                {cnt}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card z-10">
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Produit", "Catégorie", "Stock actuel", "Seuil d'alerte", "Statut", "Prix", ""].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left font-medium" style={{ color: "var(--muted-foreground)", fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => {
              const ss = stockStatus(p);
              return (
                <tr
                  key={p.id}
                  className="cursor-pointer hover:bg-secondary transition-colors"
                  style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : undefined }}
                  onClick={() => navigate(`/products/${p.id}`)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0] || p.image || ""} alt={p.name} className="w-8 h-8 rounded object-cover" style={{ border: "1px solid var(--border)" }} />
                      <div>
                        <div className="font-medium text-sm">{p.name}</div>
                        <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{p.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>{p.category}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-mono font-bold text-sm ${p.stock === 0 ? "text-red-600" : p.stock <= p.lowStockThreshold ? "text-amber-600" : ""}`}
                    >
                      {p.stock}
                    </span>
                    <span className="text-xs ml-1" style={{ color: "var(--muted-foreground)" }}>unités</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {p.lowStockThreshold}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-medium ${ss.css}`}>
                      {ss.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs font-medium">{formatPrice(p.price)}</td>
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
