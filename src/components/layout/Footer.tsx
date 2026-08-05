import React from "react";
import { Link } from "react-router";
import { MessageCircle, Instagram } from "lucide-react";
import { useI18n } from "../../context/I18nContext";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        <div className="md:col-span-1">
          <div className="font-playfair text-2xl font-medium tracking-[0.15em] mb-4">LUMA<span className="text-[#C4855A]">·</span></div>
          <p className="text-primary-foreground/55 text-sm leading-relaxed mb-5">
            {t("footer.desc")}
          </p>
          <div className="flex gap-3">
            {[
              { href: "https://wa.me/213XXXXXXXXX", Icon: MessageCircle, label: "WhatsApp" },
              { href: "https://instagram.com", Icon: Instagram, label: "Instagram" },
              { href: "https://m.me", Icon: MessageCircle, label: "Messenger" },
            ].map(({ href, Icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-9 h-9 bg-primary-foreground/10 flex items-center justify-center hover:bg-[#C4855A] transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground/35 mb-5">{t("footer.links.shop")}</p>
          <ul className="space-y-3">
            <li><Link to="/shop" className="text-sm text-primary-foreground/55 hover:text-primary-foreground transition-colors">{t("nav.shop")}</Link></li>
            <li><Link to="/best-sellers" className="text-sm text-primary-foreground/55 hover:text-primary-foreground transition-colors">{t("nav.bestsellers")}</Link></li>
            <li><Link to="/new-arrivals" className="text-sm text-primary-foreground/55 hover:text-primary-foreground transition-colors">{t("nav.new-arrivals")}</Link></li>
            <li><Link to="/offers" className="text-sm text-primary-foreground/55 hover:text-primary-foreground transition-colors">{t("nav.offers")}</Link></li>
            <li><Link to="/category" className="text-sm text-primary-foreground/55 hover:text-primary-foreground transition-colors">{t("nav.categories")}</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground/35 mb-5">{t("footer.links.support")}</p>
          <ul className="space-y-3">
            <li><Link to="/contact" className="text-sm text-primary-foreground/55 hover:text-primary-foreground transition-colors">{t("footer.links.contact")}</Link></li>
            <li><Link to="/delivery" className="text-sm text-primary-foreground/55 hover:text-primary-foreground transition-colors">{t("footer.links.delivery")}</Link></li>
            <li><Link to="/faq" className="text-sm text-primary-foreground/55 hover:text-primary-foreground transition-colors">{t("footer.links.faq")}</Link></li>
            <li><Link to="/about" className="text-sm text-primary-foreground/55 hover:text-primary-foreground transition-colors">{t("footer.links.about")}</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground/35 mb-5">{t("footer.links.legal")}</p>
          <ul className="space-y-3">
            <li><Link to="/privacy" className="text-sm text-primary-foreground/55 hover:text-primary-foreground transition-colors">{t("footer.links.privacy")}</Link></li>
            <li><Link to="/terms" className="text-sm text-primary-foreground/55 hover:text-primary-foreground transition-colors">{t("footer.links.terms")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
          <p className="text-[11px] text-primary-foreground/35">© {new Date().getFullYear()} LUMA — {t("footer.rights")}</p>
          <p className="text-[11px] text-primary-foreground/25">Algérie</p>
        </div>
      </div>
    </footer>
  );
}
