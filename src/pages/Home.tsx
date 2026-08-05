import React from "react";
import { Link } from "react-router";
import { ArrowRight, Truck, MessageCircle, Shield, Phone, Star, Instagram } from "lucide-react";
import { Heading } from "../components/ui/Heading";
import { ProductCard } from "../components/product/ProductCard";
import { PRODUCTS } from "../data/products"; // Will remove soon
import { CATEGORIES } from "../data/categories";
import { Chip } from "../components/ui/Chip";
import { fmtPrice } from "../lib/utils";
import { useCart } from "../context/CartContext";
import { useProducts } from "../hooks/useProducts";
import { useI18n } from "../context/I18nContext";

export function Home() {
  const { addToCart } = useCart();
  const { products, bestSellers, newArrivals, offers, loading } = useProducts();
  const { t } = useI18n();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  return (
    <main>
      {/* HERO */}
      <section className="relative h-[72vh] min-h-[520px] max-h-[820px] overflow-hidden bg-primary">
        <img
          src="https://images.unsplash.com/photo-1487412947147-5cebf100d293?w=1800&h=900&fit=crop&auto=format"
          alt="LUMA — Collection beauté"
          className="absolute inset-0 w-full h-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/40 to-transparent" />
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-screen-xl mx-auto px-4 md:px-8 w-full">
            <div className="max-w-lg">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C4855A] mb-4">Collection Été 2025</p>
              <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-[1.1] mb-5">
                {t("home.hero.title")}<br />{t("home.hero.title2")}
              </h1>
              <p className="text-white/65 text-base md:text-lg mb-8 leading-relaxed">
                {t("home.hero.subtitle")}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/best-sellers"
                  className="inline-flex items-center justify-center gap-2 bg-[#C4855A] text-white text-sm font-medium px-7 py-3.5 hover:opacity-90 transition-opacity tracking-wide"
                >
                  {t("nav.bestsellers")}
                </Link>
                <Link
                  to="/category"
                  className="inline-flex items-center justify-center gap-2 border border-white/60 text-white text-sm font-medium px-7 py-3.5 hover:bg-white/10 transition-colors tracking-wide"
                >
                  {t("home.hero.cta")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <div className="border-b border-border bg-card">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 md:divide-x divide-border">
          {[
            { icon: <Truck className="w-4 h-4" />, label: t("home.features.delivery") + " · " + t("home.features.delivery_sub") },
            { icon: <MessageCircle className="w-4 h-4" />, label: "WhatsApp / Instagram" },
            { icon: <Shield className="w-4 h-4" />, label: t("home.features.natural") },
            { icon: <Phone className="w-4 h-4" />, label: t("home.features.cruelty") },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2.5 md:justify-center md:px-6">
              <span className="text-[#C4855A]">{icon}</span>
              <span className="text-[11px] font-medium text-foreground/65">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Best Sellers */}
      <section className="max-w-screen-xl mx-auto px-4 md:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <Heading eyebrow="Nos incontournables" title={t("home.bestsellers.title")} sub="Les produits les plus appréciés par nos clientes." />
          <Link to="/best-sellers" className="hidden md:flex items-center gap-1.5 text-sm font-medium text-[#C4855A] hover:opacity-70 transition-opacity">
            Voir tout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-secondary py-18">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-16">
          <div className="flex items-end justify-between mb-10">
            <Heading eyebrow="Découvrir" title={t("home.categories.title")} />
            <Link to="/category" className="hidden md:flex items-center gap-1.5 text-sm font-medium text-[#C4855A] hover:opacity-70 transition-opacity">
              Toutes les catégories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
            {CATEGORIES.map((cat) => (
              <Link key={cat.id} to="/category" state={{ activeCat: cat.name }} className="group text-center">
                <div className="aspect-square overflow-hidden bg-muted mb-2.5">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground group-hover:text-[#C4855A] transition-colors">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Offers */}
      {offers.length > 0 && (
        <section className="max-w-screen-xl mx-auto px-4 md:px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <Heading eyebrow="Promotions" title="Offres du Moment" />
            <Link to="/offers" className="hidden md:flex items-center gap-1.5 text-sm font-medium text-[#C4855A] hover:opacity-70 transition-opacity">
              Voir toutes les offres <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {offers.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="flex gap-4 border border-border hover:border-[#C4855A]/40 transition-colors cursor-pointer group p-4"
              >
                <div className="w-28 h-36 bg-muted flex-shrink-0 overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="flex-1 py-1">
                  <Chip variant="sale">Promo</Chip>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2">{p.brand}</p>
                  <h3 className="font-medium text-sm mt-0.5 mb-0.5">{p.name}</h3>
                  <p className="text-[11px] text-muted-foreground mb-3 line-clamp-1">{p.characteristic}</p>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-base font-semibold text-[#C4855A]">{fmtPrice(p.salePrice!)}</span>
                    <span className="text-sm text-muted-foreground line-through">{fmtPrice(p.price)}</span>
                  </div>
                  <button
                    className="inline-flex items-center gap-1.5 bg-[#C4855A] text-white text-xs font-medium px-4 py-2 hover:opacity-90 transition-opacity"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(p); }}
                  >
                    Ajouter
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Trending — dark section */}
      <section className="bg-primary py-20">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C4855A] mb-2">En Vogue</p>
              <h2 className="font-playfair text-2xl md:text-3xl lg:text-[2.25rem] font-medium leading-tight text-primary-foreground">Tendances du Moment</h2>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-1.5 text-sm font-medium text-primary-foreground/50 hover:text-primary-foreground transition-colors">
              Voir le shop <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 4).map((p) => (
              <Link to={`/product/${p.id}`} key={p.id} className="group cursor-pointer block">
                <div className="relative aspect-[3/4] overflow-hidden bg-primary-foreground/10 mb-3">
                  <img src={p.image || p.images?.[0]} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  {p.isNew && <div className="absolute top-2 left-2"><Chip variant="new">Nouveau</Chip></div>}
                </div>
                <p className="text-[10px] text-primary-foreground/35 uppercase tracking-[0.15em] mb-0.5">{p.brand}</p>
                <h3 className="text-sm font-medium text-primary-foreground leading-snug mb-1 group-hover:text-[#C4855A] transition-colors">{p.name}</h3>
                <p className="text-sm font-medium text-[#C4855A]">{fmtPrice(p.salePrice || p.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Picks */}
      <section className="max-w-screen-xl mx-auto px-4 md:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Heading eyebrow="Sélection Premium" title="Les Grands Noms de la Beauté" sub="Des produits d'exception des maisons les plus prestigieuses. Une qualité qui se voit, se sent, se ressent." />
            <Link to="/shop" className="mt-8 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-7 py-3.5 hover:bg-primary/85 transition-colors">
              Découvrir la sélection
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[products[0], products[1]].filter(Boolean).map((p) => (
              <Link to={`/product/${p.id}`} key={p.id} className="group cursor-pointer block">
                <div className="aspect-[3/4] overflow-hidden bg-muted mb-3">
                  <img src={p.image || p.images?.[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{p.brand}</p>
                <h3 className="text-sm font-medium mt-0.5 group-hover:text-[#C4855A] transition-colors">{p.name}</h3>
                <p className="text-sm font-medium mt-1">{fmtPrice(p.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why LUMA */}
      <section className="bg-secondary py-20">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          <Heading center eyebrow="Pourquoi LUMA" title="Une Boutique Beauté qui Vous Ressemble" sub="Chaque produit soigneusement sélectionné, des prix transparents, et un service personnalisé." />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-12">
            {[
              { Icon: Star, title: "Sélection Rigoureuse", desc: "Chaque produit est choisi avec soin parmi les meilleures marques de beauté disponibles." },
              { Icon: Truck, title: "Livraison Algérie", desc: "Livraison dans toutes les 48 wilayas. Prix et délai confirmés à la commande." },
              { Icon: MessageCircle, title: "Commande Simple", desc: "Via WhatsApp, Instagram ou Messenger. Aucun compte requis. Réponse rapide." },
              { Icon: Shield, title: "Prix Transparents", desc: "Tous les prix en DA affichés clairement. Aucune surprise à la commande." },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-10 h-10 bg-[#C4855A]/12 text-[#C4855A] flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-sm mb-2">{title}</h3>
                <p className="text-[12px] text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-screen-xl mx-auto px-4 md:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <Heading eyebrow="Vient d'arriver" title="Nouveautés" />
          <Link to="/new-arrivals" className="hidden md:flex items-center gap-1.5 text-sm font-medium text-[#C4855A] hover:opacity-70 transition-opacity">
            Voir tout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Reviews placeholder */}
      <section className="max-w-screen-xl mx-auto px-4 md:px-8 pb-16">
        <div className="border border-border p-10 text-center">
          <Star className="w-7 h-7 text-muted-foreground/40 mx-auto mb-4" />
          <p className="font-medium mb-1">Avis clients</p>
          <p className="text-sm text-muted-foreground">Les avis de nos clientes arriveront bientôt. Soyez la première à laisser votre avis !</p>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="max-w-screen-xl mx-auto px-4 md:px-8 pb-20">
        <div className="bg-primary px-8 py-14 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="font-playfair text-2xl md:text-3xl font-medium text-primary-foreground mb-2">Un produit en particulier ?</h2>
            <p className="text-primary-foreground/55 text-sm">Contactez-nous directement — nous sommes là pour vous aider.</p>
          </div>
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <a href="https://wa.me/213XXXXXXXXX" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-medium px-5 py-3 hover:bg-[#1FB559] transition-colors">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white text-sm font-medium px-5 py-3 hover:opacity-85 transition-opacity" style={{ background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743)" }}>
              <Instagram className="w-4 h-4" /> Instagram
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
