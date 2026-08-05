import React, { useState } from "react";
import { MessageCircle, Instagram, ChevronDown } from "lucide-react";

export function AboutPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-16">
      <div className="max-w-2xl mx-auto">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C4855A] mb-3">Notre histoire</p>
        <h1 className="font-playfair text-4xl font-medium mb-6">À propos de LUMA</h1>
        <div className="aspect-video overflow-hidden bg-muted mb-10">
          <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=600&fit=crop&auto=format" alt="LUMA Beauté" className="w-full h-full object-cover" />
        </div>
        <div className="space-y-4 text-sm text-foreground/75 leading-relaxed">
          <p>LUMA est une boutique beauté moderne dédiée à vous offrir les meilleures marques de cosmétiques, soins, parfums et accessoires beauté — livrés partout en Algérie.</p>
          <p>Notre mission est simple : rendre la beauté premium accessible à toutes les femmes d'Algérie, avec une sélection rigoureuse, des prix transparents et un service véritablement personnalisé.</p>
          <p>Chaque produit que nous proposons est soigneusement sélectionné. Nous privilégions l'authenticité, la qualité et la valeur réelle pour nos clientes.</p>
          <p>Commandez facilement via WhatsApp, Instagram ou Messenger — sans compte, sans complication. Nous confirmons chaque commande personnellement et livrons partout en Algérie.</p>
        </div>
      </div>
    </div>
  );
}

export function ContactPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-16">
      <div className="max-w-xl mx-auto">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C4855A] mb-3">Nous écrire</p>
        <h1 className="font-playfair text-4xl font-medium mb-4">Contact</h1>
        <p className="text-muted-foreground text-sm mb-10">Pour toute question, commande ou renseignement, contactez-nous via l'un de ces canaux.</p>
        <div className="space-y-3">
          {[
            { href: "https://wa.me/213XXXXXXXXX", label: "WhatsApp", sub: "+213 XX XXX XXXX · Réponse rapide", color: "#25D366", Icon: MessageCircle },
            { href: "https://instagram.com", label: "Instagram", sub: "@luma.beauty · DM ouvert", gradient: true, Icon: Instagram },
            { href: "https://m.me", label: "Messenger", sub: "Facebook Messenger", color: "#0084FF", Icon: MessageCircle },
          ].map(({ href, label, sub, color, gradient, Icon }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 border border-border hover:border-foreground/20 transition-colors group"
            >
              <div className="w-11 h-11 flex items-center justify-center flex-shrink-0 text-white"
                style={gradient ? { background: "linear-gradient(135deg, #f09433, #dc2743)" } : { backgroundColor: color }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 text-start">
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-[11px] text-muted-foreground">{sub}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right text-muted-foreground group-hover:text-foreground transition-colors"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DeliveryPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-16">
      <div className="max-w-2xl mx-auto">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C4855A] mb-3">Information</p>
        <h1 className="font-playfair text-4xl font-medium mb-4">Livraison</h1>
        <p className="text-muted-foreground text-sm mb-10">LUMA livre partout en Algérie. Voici comment fonctionne notre service de livraison.</p>
        <div className="space-y-6">
          {[
            { title: "Zone de livraison", desc: "Nous livrons dans les 48 wilayas d'Algérie, à domicile ou via point relais selon votre région." },
            { title: "Prix de livraison", desc: "Le prix dépend de votre wilaya et du prestataire disponible. Il vous est communiqué à la confirmation de commande." },
            { title: "Délai de livraison", desc: "Entre 2 et 5 jours ouvrables selon votre région. Le délai exact est confirmé à la commande." },
            { title: "Paiement à la livraison", desc: "Règlement à la réception de votre colis (contre-remboursement). Aucun paiement anticipé demandé." },
            { title: "Confirmation de commande", desc: "Après réception de votre commande via WhatsApp, Instagram ou Messenger, nous vous confirmons le total livraison inclus avant traitement." },
          ].map(({ title, desc }) => (
            <div key={title} className="border-s-2 border-[#C4855A] ps-5 text-start">
              <h3 className="font-semibold text-sm mb-1.5">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);
  const faqs = [
    { q: "Comment passer une commande ?", a: "Ajoutez les produits souhaités à votre sélection, cliquez sur « Finaliser la commande », remplissez vos informations, puis choisissez WhatsApp, Instagram ou Messenger pour nous envoyer votre commande. Nous vous confirmons rapidement." },
    { q: "Combien coûte la livraison ?", a: "Le prix dépend de votre wilaya. Il est communiqué lors de la confirmation de commande, avant tout traitement." },
    { q: "Les produits sont-ils authentiques ?", a: "Oui, nous ne vendons que des produits 100% authentiques, soigneusement sélectionnés auprès de fournisseurs fiables." },
    { q: "Puis-je modifier ou annuler ma commande ?", a: "Contactez-nous dès que possible. Nous ferons notre possible pour modifier ou annuler avant expédition." },
    { q: "Comment se passe le paiement ?", a: "Le paiement s'effectue à la livraison (contre-remboursement). Aucun paiement anticipé n'est demandé." },
    { q: "Livrez-vous partout en Algérie ?", a: "Oui, nous livrons dans toutes les 48 wilayas d'Algérie." },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-16">
      <div className="max-w-2xl mx-auto">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C4855A] mb-3">FAQ</p>
        <h1 className="font-playfair text-4xl font-medium mb-10">Questions Fréquentes</h1>
        <div className="divide-y divide-border">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full text-start py-5 flex items-start justify-between gap-4 hover:text-[#C4855A] transition-colors">
                <span className="font-medium text-sm">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && <div className="pb-5 text-start"><p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LegalPage({ eyebrow, title, paras }: { eyebrow: string; title: string; paras: string[] }) {
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-16">
      <div className="max-w-2xl mx-auto">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C4855A] mb-3">{eyebrow}</p>
        <h1 className="font-playfair text-4xl font-medium mb-8">{title}</h1>
        <div className="space-y-4 text-sm text-foreground/75 leading-relaxed text-start">
          {paras.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>
    </div>
  );
}
