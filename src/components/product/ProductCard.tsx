import React, { useState } from "react";
import { Heart, Check } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Product } from "../../types";
import { Chip } from "../ui/Chip";
import { fmtPrice, getPrimaryImage } from "../../lib/utils";
import { useCart } from "../../context/CartContext";

export function ProductCard({ product }: { product: Product }) {
  const [loved, setLoved] = useState(false);
  const [ticked, setTicked] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const imageSrc = getPrimaryImage(product);

  const doAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setTicked(true);
    setTimeout(() => setTicked(false), 1800);
  };

  return (
    <Link to={`/product/${product.id}`} className="group cursor-pointer block">
      <div className="relative overflow-hidden bg-muted aspect-[3/4] mb-3">
        <img
          src={imageSrc}
          alt={`${product.brand} — ${product.name}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-2 start-2 flex flex-col gap-1 items-start">
          {product.isBestSeller && <Chip>Best Seller</Chip>}
          {product.isNew && <Chip variant="new">Nouveau</Chip>}
          {product.isOffer && product.salePrice && <Chip variant="sale">Promo</Chip>}
          {!product.available && <Chip variant="out">Épuisé</Chip>}
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setLoved(!loved);
          }}
          className="absolute top-2 end-2 w-8 h-8 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          aria-label="Favoris"
        >
          <Heart className={`w-3.5 h-3.5 ${loved ? "fill-[#C4855A] text-[#C4855A]" : "text-foreground"}`} />
        </button>
        {product.available && (
          <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={doAdd}
              className="w-full bg-primary text-primary-foreground text-[10px] font-semibold tracking-[0.12em] uppercase py-3 hover:bg-primary/85 transition-colors"
            >
              {ticked ? (
                <span className="flex items-center justify-center gap-1.5">
                  <Check className="w-3 h-3" /> Ajouté
                </span>
              ) : (
                "Ajouter à la sélection"
              )}
            </button>
          </div>
        )}
      </div>
      <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] mb-0.5">{product.brand}</p>
      <h3 className="text-sm font-medium leading-snug mb-0.5 group-hover:text-[#C4855A] transition-colors line-clamp-1">
        {product.name}
      </h3>
      <p className="text-[11px] text-muted-foreground mb-1.5 line-clamp-1">{product.characteristic}</p>
      <div className="flex items-baseline gap-2">
        {product.salePrice ? (
          <>
            <span className="text-sm font-semibold text-[#C4855A]">{fmtPrice(product.salePrice)}</span>
            <span className="text-xs text-muted-foreground line-through">{fmtPrice(product.price)}</span>
          </>
        ) : (
          <span className="text-sm font-medium">{fmtPrice(product.price)}</span>
        )}
      </div>
    </Link>
  );
}
