import React, { useState } from "react";
import { Filter, Package } from "lucide-react";
import { ProductCard } from "../components/product/ProductCard";
import { Btn } from "../components/ui/Btn";
import { useLocation } from "react-router";
import { useProducts } from "../hooks/useProducts";
import { useI18n } from "../context/I18nContext";
import type { Product } from "../lib/api/types";

export function Shop({ title, filterType = "all" }: { title?: string; filterType?: "all" | "best-sellers" | "new" | "offers" }) {
  const location = useLocation();
  const initialCat = location.state?.activeCat || null;
  const { products, loading } = useProducts();
  const { t } = useI18n();
  
  const [cat, setCat] = useState<string | null>(initialCat);
  const [sort, setSort] = useState("best-selling");
  const [budget, setBudget] = useState<number | null>(null);
  const [avail, setAvail] = useState<"all" | "available">("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  const baseFilter = (p: Product) => {
    if (filterType === "best-sellers") return !!p.flags?.bestSeller || !!(p as any).isBestSeller;
    if (filterType === "new") return !!p.flags?.newArrival || !!(p as any).isNew;
    if (filterType === "offers") return !!(p.flags?.onSale || ((p as any).isOffer && p.salePrice));
    return true;
  };

  const base = products.filter(baseFilter);
  let filtered = base;
  if (cat) filtered = filtered.filter((p) => p.category === cat);
  if (avail === "available") filtered = filtered.filter((p) => p.stock > 0 || (p as any).available);
  if (budget) filtered = filtered.filter((p) => (p.salePrice || p.price) <= budget);

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return (a.salePrice || a.price) - (b.salePrice || b.price);
    if (sort === "price-desc") return (b.salePrice || b.price) - (a.salePrice || a.price);
    if (sort === "newest") return ((b.flags?.newArrival || (b as any).isNew) ? 1 : 0) - ((a.flags?.newArrival || (a as any).isNew) ? 1 : 0);
    return ((b.flags?.bestSeller || (b as any).isBestSeller) ? 1 : 0) - ((a.flags?.bestSeller || (a as any).isBestSeller) ? 1 : 0);
  });

  const cats = [...new Set(products.map((p) => p.category))];
  const hasFilters = !!(cat || budget || avail !== "all");

  const Sidebar = () => (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-4">{t("shop.filter.category")}</p>
        <ul className="space-y-2">
          <li>
            <button onClick={() => setCat(null)} className={`text-sm w-full text-start py-0.5 ${!cat ? "font-semibold text-[#C4855A]" : "text-muted-foreground hover:text-foreground"}`}>
              {t("shop.filter.all")} ({base.length})
            </button>
          </li>
          {cats.map((c) => (
            <li key={c}>
              <button onClick={() => setCat(c === cat ? null : c)} className={`text-sm w-full text-start py-0.5 ${cat === c ? "font-semibold text-[#C4855A]" : "text-muted-foreground hover:text-foreground"}`}>
                {c} ({base.filter((p) => p.category === c).length})
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-4">{t("shop.filter.availability")}</p>
        {(["all", "available"] as const).map((v) => (
          <button key={v} onClick={() => setAvail(v)} className={`flex items-center gap-2 text-sm py-1 w-full ${avail === v ? "text-[#C4855A] font-semibold" : "text-muted-foreground hover:text-foreground"}`}>
            <div className={`w-3.5 h-3.5 border rounded-full flex items-center justify-center flex-shrink-0 ${avail === v ? "border-[#C4855A]" : "border-border"}`}>
              {avail === v && <div className="w-1.5 h-1.5 bg-[#C4855A] rounded-full" />}
            </div>
            {v === "all" ? t("shop.filter.all") : t("shop.filter.instock")}
          </button>
        ))}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-4">{t("shop.filter.budget")}</p>
        {[
          { l: t("shop.filter.price.all"), v: null },
          { l: t("shop.filter.price.under2k"), v: 2000 },
          { l: t("shop.filter.price.under5k"), v: 5000 },
          { l: t("shop.filter.price.under10k"), v: 10000 },
        ].map(({ l, v }) => (
          <button key={l} onClick={() => setBudget(v)} className={`block text-sm py-1 w-full text-start ${budget === v ? "font-semibold text-[#C4855A]" : "text-muted-foreground hover:text-foreground"}`}>
            {l}
          </button>
        ))}
      </div>
      {hasFilters && (
        <button onClick={() => { setCat(null); setBudget(null); setAvail("all"); }} className="text-xs underline text-muted-foreground hover:text-foreground">
          {t("shop.filter.clear")}
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-playfair text-3xl md:text-4xl font-medium">{title || t("shop.title.all")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{sorted.length} produit{sorted.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setFiltersOpen(true)} className="md:hidden flex items-center gap-1.5 text-sm border border-border px-3 py-2 hover:bg-muted transition-colors">
            <Filter className="w-4 h-4" /> {t("shop.btn.filters")}
          </button>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="text-sm border border-border px-3 py-2 bg-background focus:outline-none focus:border-foreground cursor-pointer">
            <option value="best-selling">{t("shop.sort.bestselling")}</option>
            <option value="newest">{t("shop.sort.newest")}</option>
            <option value="price-asc">{t("shop.sort.price_asc")}</option>
            <option value="price-desc">{t("shop.sort.price_desc")}</option>
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden md:block w-48 flex-shrink-0"><Sidebar /></aside>
        <div className="flex-1">
          {sorted.length === 0 ? (
            <div className="text-center py-24">
              <Package className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <p className="font-medium mb-2">{t("shop.empty")}</p>
              <p className="text-sm text-muted-foreground mb-6">{t("shop.empty_sub")}</p>
              <Btn variant="outline" onClick={() => { setCat(null); setBudget(null); setAvail("all"); }}>{t("shop.filter.clear")}</Btn>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {sorted.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
          <div className="absolute bottom-0 inset-x-0 bg-background p-6 max-h-[80vh] overflow-y-auto" style={{ borderRadius: "16px 16px 0 0" }}>
            <div className="flex items-center justify-between mb-6">
              <p className="font-semibold">{t("shop.btn.filters")}</p>
              <button onClick={() => setFiltersOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <Sidebar />
            <Btn variant="primary" className="w-full mt-8" onClick={() => setFiltersOpen(false)}>
              {t("shop.btn.view_products")} ({sorted.length})
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}
