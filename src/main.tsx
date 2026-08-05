import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./styles/index.css";
import App from "./app/App";
import { CartProvider } from "./context/CartContext";
import { I18nProvider } from "./context/I18nContext";

import { Home } from "./pages/Home";
import { Shop } from "./pages/Shop";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import { Order } from "./pages/Order";
import { Category } from "./pages/Category";
import { AboutPage, ContactPage, DeliveryPage, FAQPage, LegalPage } from "./pages/InfoPages";

import React from "react";

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {error: any}> {
  constructor(props: any) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error: any) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 20, color: 'red', background: '#fee', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h2>React Runtime Error:</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error.message}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: 10 }}>{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
    <I18nProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="best-sellers" element={<Shop title="Best Sellers" filterType="best-sellers" />} />
              <Route path="new-arrivals" element={<Shop title="Nouveautés" filterType="new" />} />
              <Route path="offers" element={<Shop title="Offres & Promotions" filterType="offers" />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="category" element={<Category />} />
              <Route path="cart" element={<Cart />} />
              <Route path="order" element={<Order />} />
              
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="delivery" element={<DeliveryPage />} />
              <Route path="faq" element={<FAQPage />} />
              <Route path="privacy" element={
                <LegalPage
                  eyebrow="Légal"
                  title="Politique de Confidentialité"
                  paras={[
                    "LUMA respecte votre vie privée et s'engage à protéger vos données personnelles.",
                    "Les informations que vous fournissez lors d'une commande (nom, téléphone, adresse) sont utilisées uniquement pour traiter et livrer votre commande. Elles ne sont jamais partagées avec des tiers à des fins commerciales.",
                    "Nous ne collectons pas de données via des cookies de tracking publicitaire. Notre site utilise uniquement les ressources techniques nécessaires à son bon fonctionnement.",
                    "Cette politique peut être mise à jour. La version en vigueur est toujours celle publiée sur ce site.",
                    "Pour toute question relative à vos données personnelles, contactez-nous via WhatsApp, Instagram ou Messenger.",
                  ]}
                />
              } />
              <Route path="terms" element={
                <LegalPage
                  eyebrow="Légal"
                  title="Conditions Générales de Vente"
                  paras={[
                    "En passant commande sur LUMA, vous acceptez les présentes conditions générales de vente.",
                    "Les prix affichés sont en dinars algériens (DA). Le prix de livraison s'ajoute au prix des produits et est communiqué lors de la confirmation de commande.",
                    "Le paiement s'effectue à la livraison (contre-remboursement). LUMA ne demande aucun paiement anticipé.",
                    "LUMA se réserve le droit d'annuler toute commande en cas d'indisponibilité produit. Le client en sera immédiatement informé.",
                    "Pour toute réclamation ou litige, contactez-nous via WhatsApp, Instagram ou Messenger. Nous nous engageons à répondre dans les meilleurs délais.",
                  ]}
                />
              } />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </I18nProvider>
    </ErrorBoundary>
  </StrictMode>
);