import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Search, ShoppingBag, Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { CATEGORIES } from "../../data/categories";
import { useCart } from "../../context/CartContext";
import { fmtPrice } from "../../lib/utils";
import { useProducts } from "../../hooks/useProducts";
import { useI18n } from "../../context/I18nContext";

export function Header() {
  const [mob, setMob] = useState(false);
  const [srch, setSrch] = useState(false);
  const [mega, setMega] = useState(false);
  const [q, setQ] = useState("");
  const { cartCount } = useCart();
  const { products } = useProducts();
  const { t, language, setLanguage } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();

  const currentPage = location.pathname.substring(1) || "home";

  const navItems = [
    { label: t("nav.shop"), path: "/shop", match: "shop" },
    { label: t("nav.categories"), path: "/category", match: "category", isCat: true },
    { label: t("nav.bestsellers"), path: "/best-sellers", match: "best-sellers" },
    { label: t("nav.offers"), path: "/offers", match: "offers" },
    { label: t("nav.about"), path: "/about", match: "about" },
  ];

  const results = q.length > 0
    ? products.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.brand.toLowerCase().includes(q.toLowerCase()) ||
        p.category.toLowerCase().includes(q.toLowerCase())
      ).slice(0, 6)
    : [];

  return (
    <>
      {/* Promo bar */}
      <div className="bg-primary text-primary-foreground text-center text-[11px] tracking-wide py-2 px-4">
        {t("promo.banner")}
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="relative">
          <div className="max-w-screen-xl mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/" className="font-playfair text-xl md:text-2xl font-medium tracking-[0.15em] text-foreground flex items-center focus:outline-none">
                LUMA<span className="text-[#C4855A] ms-0.5">·</span>
              </Link>

              {/* Desktop nav */}
              <nav className="hidden md:flex items-center gap-7">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setMega(false)}
                    onMouseEnter={() => item.isCat ? setMega(true) : setMega(false)}
                    className={`text-sm font-medium tracking-wide transition-colors flex items-center gap-0.5 pb-0.5 border-b-2 ${currentPage === item.match ? "border-[#C4855A] text-foreground" : "border-transparent text-foreground/65 hover:text-foreground"}`}
                  >
                    {item.label}
                    {item.isCat && <ChevronDown className="w-3 h-3 mt-0.5" />}
                  </Link>
                ))}
              </nav>

              {/* Icons */}
              <div className="flex items-center gap-1 md:gap-3">
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="bg-transparent text-[11px] font-medium tracking-widest uppercase cursor-pointer outline-none focus:outline-none text-foreground/70 hover:text-foreground hidden md:block"
                >
                  <option value="fr">FR</option>
                  <option value="en">EN</option>
                  <option value="ar">AR</option>
                </select>
                <button onClick={() => setSrch(true)} className="p-2 text-foreground/70 hover:text-foreground transition-colors" aria-label="Rechercher">
                  <Search className="w-5 h-5" />
                </button>
                <Link to="/cart" className="relative p-2 text-foreground/70 hover:text-foreground transition-colors" aria-label={`Sélection (${cartCount})`}>
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -end-0.5 w-4 h-4 bg-[#C4855A] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </Link>
                <button className="md:hidden p-2 text-foreground/70" onClick={() => setMob(true)} aria-label="Menu">
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Mega menu */}
          {mega && (
            <div
              className="absolute top-full inset-x-0 bg-background border-b border-border shadow-lg z-50"
              onMouseLeave={() => setMega(false)}
              onMouseEnter={() => setMega(true)}
            >
              <div className="max-w-screen-xl mx-auto px-8 py-8 grid grid-cols-6 gap-5">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category`}
                    state={{ activeCat: cat.name }}
                    onClick={() => setMega(false)}
                    className="text-start group"
                  >
                    <div className="aspect-square overflow-hidden bg-muted mb-2.5">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-foreground group-hover:text-[#C4855A] transition-colors">
                      {cat.name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Search overlay */}
      {srch && (
        <div className="fixed inset-0 bg-background z-[60] flex flex-col" onClick={() => setSrch(false)}>
          <div className="max-w-screen-md mx-auto w-full px-6 pt-16" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-4 border-b-2 border-foreground pb-4 mb-8">
              <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <input
                autoFocus
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("search.placeholder")}
                className="flex-1 text-xl font-light bg-transparent outline-none placeholder:text-muted-foreground/40"
              />
              <button onClick={() => setSrch(false)} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {q.length === 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-4">{t("search.popular")}</p>
                <div className="flex flex-wrap gap-2">
                  {["Sérum vitamine C", "Rouge à lèvres", "Fond de teint", "Parfum", "Crème visage", "Palette yeux"].map((t) => (
                    <button key={t} onClick={() => setQ(t)} className="px-3 py-1.5 border border-border text-sm hover:border-[#C4855A] hover:text-[#C4855A] transition-colors">
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {results.length > 0 && (
              <div>
                {results.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { navigate(`/product/${p.id}`); setSrch(false); }}
                    className="flex items-center gap-4 w-full text-start py-3 border-b border-border hover:text-[#C4855A] transition-colors"
                  >
                    <img src={p.image || p.images?.[0]} alt={p.name} className="w-11 h-14 object-cover bg-muted flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{p.brand}</p>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-sm text-[#C4855A]">{fmtPrice(p.salePrice || p.price)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {q.length > 0 && results.length === 0 && (
              <p className="text-muted-foreground text-sm">{t("search.no_results")} « {q} ».</p>
            )}
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {mob && (
        <div className="fixed inset-0 z-[60] bg-background flex flex-col">
          <div className="flex items-center justify-between px-4 h-16 border-b border-border">
            <span className="font-playfair text-xl font-medium tracking-[0.15em]">LUMA<span className="text-[#C4855A]">·</span></span>
            <div className="flex items-center gap-4">
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent text-sm font-medium tracking-widest uppercase cursor-pointer outline-none focus:outline-none"
              >
                <option value="fr">FR</option>
                <option value="en">EN</option>
                <option value="ar">AR</option>
              </select>
              <button onClick={() => setMob(false)}><X className="w-5 h-5" /></button>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto px-6 py-6">
            {navItems.map((item) => (
              <Link key={item.label} to={item.path} onClick={() => setMob(false)} className="flex items-center justify-between w-full py-4 border-b border-border text-base font-medium hover:text-[#C4855A] transition-colors">
                {item.label} <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            ))}
            <div className="mt-8 space-y-4">
              {[
                { label: "Contact", path: "/contact" },
                { label: "Livraison", path: "/delivery" },
                { label: "FAQ", path: "/faq" },
              ].map((p) => (
                <Link key={p.path} to={p.path} onClick={() => setMob(false)} className="block text-sm text-muted-foreground hover:text-foreground text-start">
                  {p.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
