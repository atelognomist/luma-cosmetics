import React from "react";
import { Link, useNavigate } from "react-router";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useI18n } from "../context/I18nContext";
import { fmtPrice, getPrimaryImage } from "../lib/utils";
import { Btn } from "../components/ui/Btn";

export function Cart() {
  const { cart, total, updateQuantity, removeFromCart } = useCart();
  const { t } = useI18n();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-playfair text-2xl font-medium mb-2">{t("cart.empty.title")}</h2>
        <p className="text-muted-foreground text-sm mb-8">{t("cart.empty.sub")}</p>
        <Btn variant="primary" size="lg" onClick={() => navigate("/shop")}>{t("cart.empty.cta")}</Btn>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-12">
      <h1 className="font-playfair text-3xl font-medium mb-8">{t("cart.title")}</h1>
      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 divide-y divide-border">
          {cart.map((item) => (
            <div key={item.product.id} className="flex gap-4 py-6">
              <Link to={`/product/${item.product.id}`} className="w-24 h-28 bg-muted flex-shrink-0 overflow-hidden block">
                <img src={getPrimaryImage(item.product)} alt={item.product.name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{item.product.brand}</p>
                <h3 className="font-medium text-sm mb-0.5">{item.product.name}</h3>
                <p className="text-[11px] text-muted-foreground mb-4 line-clamp-1">{item.product.characteristic}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-border">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"><Minus className="w-3 h-3" /></button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, Math.min(item.product.stock ?? 99, item.quantity + 1))} className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"><Plus className="w-3 h-3" /></button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold">{fmtPrice((item.product.salePrice || item.product.price) * item.quantity)}</span>
                    <button onClick={() => removeFromCart(item.product.id)} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Supprimer"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="border border-border p-6 sticky top-24">
            <h2 className="font-semibold mb-5">{t("cart.summary.title")}</h2>
            <div className="space-y-2.5 mb-5">
              {cart.map((i) => (
                <div key={i.product.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate me-2">{i.product.name} × {i.quantity}</span>
                  <span className="flex-shrink-0">{fmtPrice((i.product.salePrice || i.product.price) * i.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 mb-1.5">
              <div className="flex justify-between font-semibold">
                <span>{t("cart.summary.total_products")}</span>
                <span>{fmtPrice(total)}</span>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mb-6">{t("cart.summary.delivery_note")}</p>
            <button onClick={() => navigate("/order")} className="w-full flex items-center justify-center bg-[#C4855A] text-white text-sm font-medium py-3.5 hover:opacity-90 transition-opacity mb-2">
              {t("cart.btn.checkout")}
            </button>
            <Btn variant="ghost" size="sm" className="w-full" onClick={() => navigate("/shop")}>{t("cart.btn.continue")}</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
