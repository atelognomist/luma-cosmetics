import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import { CATEGORIES } from "../data/categories";
import { PRODUCTS } from "../data/products";
import { ProductCard } from "../components/product/ProductCard";

export function Category() {
  const location = useLocation();
  const initialCat = location.state?.activeCat || null;
  const [active, setActive] = useState<string | null>(initialCat);
  const visible = active ? PRODUCTS.filter((p) => p.category === active) : [];

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-12">
      <h1 className="font-playfair text-3xl md:text-4xl font-medium mb-10">Catégories</h1>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActive(active === cat.name ? null : cat.name)}
            className={`group text-center transition-all duration-200 ${active === cat.name ? "ring-2 ring-foreground" : ""}`}
          >
            <div className="aspect-square overflow-hidden bg-muted mb-2.5">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
            </div>
            <p className={`text-[10px] font-bold uppercase tracking-[0.12em] transition-colors ${active === cat.name ? "text-[#C4855A]" : "text-foreground group-hover:text-[#C4855A]"}`}>
              {cat.name}
            </p>
          </button>
        ))}
      </div>

      {active && (
        <div>
          <h2 className="font-playfair text-2xl font-medium mb-7">{active}</h2>
          {visible.length === 0 ? (
            <p className="text-muted-foreground text-sm py-16 text-center">Aucun produit dans cette catégorie pour le moment.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {visible.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      )}
      {!active && (
        <p className="text-center text-muted-foreground text-sm py-8">Sélectionnez une catégorie pour découvrir les produits.</p>
      )}
    </div>
  );
}
