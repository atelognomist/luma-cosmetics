import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { ChevronRight, Info, Minus, Plus, Check, MessageCircle, Truck, Package } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Chip } from "../components/ui/Chip";
import { fmtPrice } from "../lib/utils";
import { ProductCard } from "../components/product/ProductCard";
import { useProducts } from "../hooks/useProducts";
import { useI18n } from "../context/I18nContext";

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, loading } = useProducts();
  const { t } = useI18n();
  
  const product = products.find((p) => p.id === id);
  const mediaList = product?.media && product.media.length > 0 
    ? [...product.media].sort((a, b) => a.sortOrder - b.sortOrder) 
    : [];
  
  const [selectedMedia, setSelectedMedia] = useState(mediaList.find(m => m.isPrimary) || mediaList[0] || null);
  
  useEffect(() => {
    setSelectedMedia(mediaList.find(m => m.isPrimary) || mediaList[0] || null);
  }, [id, product?.media]);

  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("desc");
  const [ticked, setTicked] = useState(false);

  if (loading) {
    return <div className="max-w-screen-xl mx-auto px-4 py-24 text-center">Chargement...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-24 text-center">
        <p className="font-medium text-lg mb-4">{t("product.not_found")}</p>
        <button onClick={() => navigate("/shop")} className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 hover:bg-primary/85 transition-colors">
          {t("product.back_shop")}
        </button>
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const doAdd = () => {
    addToCart(product as any, qty);
    setTicked(true);
    setTimeout(() => setTicked(false), 2000);
  };

  const tabs = [
    { id: "desc", label: t("product.tab.desc") },
    { id: "benefits", label: t("product.tab.benefits") },
    { id: "usage", label: t("product.tab.usage") },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-8">
        <Link to="/" className="hover:text-foreground">Accueil</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/shop" className="hover:text-foreground">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground truncate max-w-[180px]">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
          <div className="aspect-[3/4] overflow-hidden bg-muted relative border border-border">
            {selectedMedia ? (
              selectedMedia.type === "video" ? (
                <video 
                  src={selectedMedia.url} 
                  controls 
                  playsInline 
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src={selectedMedia.url} 
                  alt={`${product.brand} ${product.name}`} 
                  className="w-full h-full object-cover" 
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Aucun média</div>
            )}
          </div>
          
          {mediaList.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar">
              {mediaList.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMedia(m)}
                  className={`relative w-20 h-24 flex-shrink-0 snap-start overflow-hidden border-2 transition-colors ${selectedMedia?.id === m.id ? "border-[#C4855A]" : "border-transparent opacity-70 hover:opacity-100"}`}
                >
                  {m.type === "video" ? (
                    <div className="w-full h-full bg-black/80 flex items-center justify-center text-white">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    </div>
                  ) : (
                    <img src={m.url} alt="" className="w-full h-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex gap-2 mb-3 flex-wrap">
            {(product.flags?.bestSeller || (product as any).isBestSeller) && <Chip>{t("product.badge.bestseller")}</Chip>}
            {(product.flags?.newArrival || (product as any).isNew) && <Chip variant="new">{t("product.badge.new")}</Chip>}
            {((product as any).available === false || product.stock === 0) && <Chip variant="out">{t("product.badge.soldout")}</Chip>}
          </div>

          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">{product.brand}</p>
          <h1 className="font-playfair text-2xl md:text-3xl font-medium mb-2">{product.name}</h1>
          <p className="text-muted-foreground text-sm mb-5">{product.characteristic}</p>

          <div className="flex items-baseline gap-3 mb-5">
            {product.salePrice ? (
              <>
                <span className="text-2xl font-semibold text-[#C4855A]">{fmtPrice(product.salePrice)}</span>
                <span className="text-base text-muted-foreground line-through">{fmtPrice(product.price)}</span>
              </>
            ) : (
              <span className="text-2xl font-semibold">{fmtPrice(product.price)}</span>
            )}
          </div>

          {product.suitableFor && (
            <p className="text-[11px] text-muted-foreground mb-4 flex items-center gap-1.5">
              <Info className="w-3 h-3" /> {t("product.recommended")} {product.suitableFor}
            </p>
          )}

          {((product as any).available !== false && product.stock !== 0) && (
            <div className="flex items-center gap-4 mb-5">
              <p className="text-sm font-medium">{t("product.qty")}</p>
              <div className="flex items-center border border-border">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 flex items-center justify-center hover:bg-muted transition-colors" aria-label="Moins">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-9 text-center text-sm font-medium">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock ?? 99, qty + 1))} className="w-9 h-9 flex items-center justify-center hover:bg-muted transition-colors" aria-label="Plus">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2.5 mb-7">
            {((product as any).available !== false && product.stock !== 0) ? (
              <>
                <button
                  onClick={doAdd}
                  className="w-full flex items-center justify-center gap-2 bg-[#C4855A] text-white text-sm font-medium py-3.5 hover:opacity-90 transition-opacity"
                >
                  {ticked ? <><Check className="w-4 h-4" /> {t("product.added")}</> : t("product.add_cart")}
                </button>
                <button
                  onClick={() => { doAdd(); navigate("/cart"); }}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm font-medium py-3.5 hover:bg-primary/85 transition-colors"
                >
                  {t("product.buy_now")}
                </button>
              </>
            ) : (
              <div className="bg-muted px-4 py-3 text-sm text-muted-foreground">
                {t("product.out_of_stock")}
              </div>
            )}
          </div>

          {/* Contact options */}
          <div className="border border-border p-4 mb-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-3">{t("product.order_via")}</p>
            <div className="flex gap-2">
              {[
                { href: "https://wa.me/213XXXXXXXXX", label: "WhatsApp", color: "#25D366" },
                { href: "https://instagram.com", label: "Instagram", color: "#e6683c", gradient: true },
                { href: "https://m.me", label: "Messenger", color: "#0084FF" },
              ].map(({ href, label, color, gradient }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 text-white text-[11px] font-medium py-2.5 hover:opacity-85 transition-opacity"
                  style={gradient ? { background: "linear-gradient(135deg, #f09433, #dc2743)" } : { backgroundColor: color }}
                >
                  <MessageCircle className="w-3.5 h-3.5" /> {label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 text-[11px] text-muted-foreground border-t border-border pt-4">
            <Truck className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <p>{t("product.delivery_info")}</p>
          </div>
          {product.size && (
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" /> {t("product.size")} {product.size}
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16 border-t border-border pt-12">
        <div className="flex gap-8 border-b border-border mb-7">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`text-sm pb-3 -mb-px border-b-2 transition-colors ${tab === t.id ? "border-foreground font-semibold" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="max-w-2xl">
          {tab === "desc" && <p className="text-sm leading-relaxed text-foreground/80">{product.description}</p>}
          {tab === "benefits" && product.benefits && (
            <ul className="space-y-2.5">
              {(Array.isArray(product.benefits) ? product.benefits : product.benefits.split('.').filter(Boolean)).map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm">
                  <Check className="w-4 h-4 text-[#C4855A] flex-shrink-0 mt-0.5" /> {b.trim()}
                </li>
              ))}
            </ul>
          )}
          {tab === "usage" && (
            <p className="text-sm leading-relaxed text-foreground/80">
              {product.howToUse || t("product.usage.empty")}
            </p>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="font-playfair text-2xl font-medium mb-8">{t("product.related")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
