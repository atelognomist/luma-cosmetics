import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Check, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { fmtPrice, getPrimaryImage } from "../lib/utils";
import { Btn } from "../components/ui/Btn";
import { getWilayas, getCommunesByWilaya, Wilaya, Commune } from "../lib/api/wilayas";
import { createOrder } from "../lib/api/orders";
import { useI18n } from "../context/I18nContext";

export function Order() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const { t } = useI18n();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", phone: "", wilaya: "", commune: "", address: "", notes: "" });
  const [errs, setErrs] = useState<Record<string, string>>({});

  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    getWilayas().then(setWilayas);
  }, []);

  const handleWilayaChange = async (wName: string) => {
    setForm({ ...form, wilaya: wName, commune: "" });
    const w = wilayas.find(x => x.name === wName);
    if (w) {
      const c = await getCommunesByWilaya(w.id);
      setCommunes(c);
    } else {
      setCommunes([]);
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    const nameStr = form.name.trim();
    const phoneStr = form.phone.trim();
    const addressStr = form.address.trim();

    if (!nameStr) e.name = t("order.err.name");
    else if (nameStr.length > 100) e.name = "Nom trop long";

    if (!phoneStr) e.phone = t("order.err.phone");
    else if (!/^(0)(5|6|7)[0-9]{8}$/.test(phoneStr)) e.phone = "Numéro de téléphone algérien invalide (ex: 0555123456)";

    if (!form.wilaya) e.wilaya = t("order.err.wilaya");
    
    if (!form.commune) e.commune = t("order.err.commune");
    else if (!communes.some(c => c.name === form.commune)) e.commune = "Commune invalide pour cette wilaya";

    if (addressStr.length > 255) e.address = "Adresse trop longue";
    if (form.notes.trim().length > 500) e.notes = "Notes trop longues";

    // Validate cart quantities
    for (const item of cart) {
      if (item.quantity <= 0) {
        e.form = "Quantité invalide détectée.";
      }
      if (item.product.stock !== undefined && item.quantity > item.product.stock) {
        e.form = `La quantité pour ${item.product.name} dépasse le stock disponible.`;
      }
    }

    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const submitOrder = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const deliveryFee = 600; // Mock fee, in a real app it comes from api.delivery
      const order = await createOrder({
        customer: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          wilaya: form.wilaya,
          commune: form.commune,
          address: form.address.trim(),
          deliveryNotes: form.notes.trim()
        },
        items: cart.map(i => ({
          productId: i.product.id,
          qty: i.quantity,
          shade: (i as any).shade,
          variant: (i as any).variant
        })),
        deliveryFee
      });
      setOrderId(order.id);
      clearCart();
      setStep(3);
    } catch (error) {
      console.error(error);
      setErrs({ form: t("order.err.submit") });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-24 text-center">
        <p className="font-medium mb-4">{t("cart.empty.title")}</p>
        <Btn variant="primary" onClick={() => navigate("/shop")}>{t("product.back_shop")}</Btn>
      </div>
    );
  }

  const input = (label: string, key: keyof typeof form, placeholder: string, type = "text") => (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        maxLength={key === "phone" ? 10 : 255}
        className={`w-full border px-3 py-2.5 text-sm bg-background outline-none focus:border-foreground transition-colors ${errs[key] ? "border-destructive" : "border-border"}`}
      />
      {errs[key] && <p className="text-xs text-destructive mt-1">{errs[key]}</p>}
    </div>
  );

  return (
    <div className="max-w-screen-md mx-auto px-4 md:px-8 py-12">
      <h1 className="font-playfair text-3xl font-medium mb-2">{t("order.title")}</h1>
      <p className="text-muted-foreground text-sm mb-8">
        {step === 3 ? t("order.subtitle.step3") : t("order.subtitle.step12")}
      </p>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-10">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div className={`w-7 h-7 flex items-center justify-center text-xs font-semibold ${step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {step > s ? <Check className="w-3.5 h-3.5" /> : s}
            </div>
            {s < 3 && <div className={`flex-1 h-px ${step > s ? "bg-primary" : "bg-border"}`} />}
          </React.Fragment>
        ))}
      </div>

      {step === 1 && (
        <div>
          <h2 className="font-semibold mb-5">{t("order.step1.title")}</h2>
          <div className="space-y-3 mb-6">
            {cart.map((item) => (
              <div key={item.product.id} className="flex gap-4 border border-border p-4">
                <img src={getPrimaryImage(item.product)} alt={item.product.name} className="w-14 h-18 object-cover bg-muted flex-shrink-0" style={{ height: "4.5rem" }} />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{item.product.brand}</p>
                  <p className="text-sm font-medium">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{t("order.step1.qty")} {item.quantity}</p>
                  <p className="text-sm font-semibold mt-1">{fmtPrice((item.product.salePrice || item.product.price) * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-semibold border-t border-border pt-4 mb-7">
            <span>{t("cart.summary.total_products")}</span><span>{fmtPrice(total)}</span>
          </div>
          <div className="flex gap-3">
            <Btn variant="outline" onClick={() => navigate("/cart")}>{t("order.step1.btn.edit")}</Btn>
            <button onClick={() => setStep(2)} className="inline-flex items-center gap-2 bg-[#C4855A] text-white text-sm font-medium px-7 py-2.5 hover:opacity-90 transition-opacity">{t("order.step1.btn.next")}</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="font-semibold mb-5">{t("order.step2.title")}</h2>
          <div className="space-y-4">
            {input(t("order.field.name"), "name", t("order.field.name_ph"))}
            {input(t("order.field.phone"), "phone", "0XX XXX XXXX", "tel")}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">{t("order.field.wilaya")}</label>
                <select
                  value={form.wilaya}
                  onChange={(e) => handleWilayaChange(e.target.value)}
                  className={`w-full border px-3 py-2.5 text-sm bg-background outline-none focus:border-foreground ${errs.wilaya ? "border-destructive" : "border-border"}`}
                >
                  <option value="">{t("order.field.select")}</option>
                  {wilayas.map((w) => <option key={w.id} value={w.name}>{w.code} - {w.name}</option>)}
                </select>
                {errs.wilaya && <p className="text-xs text-destructive mt-1">{errs.wilaya}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1.5">{t("order.field.commune")}</label>
                <select
                  value={form.commune}
                  onChange={(e) => setForm({ ...form, commune: e.target.value })}
                  disabled={!form.wilaya || communes.length === 0}
                  className={`w-full border px-3 py-2.5 text-sm bg-background outline-none focus:border-foreground ${errs.commune ? "border-destructive" : "border-border"}`}
                >
                  <option value="">{t("order.field.select")}</option>
                  {communes.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                {errs.commune && <p className="text-xs text-destructive mt-1">{errs.commune}</p>}
              </div>
            </div>

            {input(t("order.field.address"), "address", t("order.field.address_ph"))}
            <div>
              <label className="block text-sm font-medium mb-1.5">{t("order.field.notes")}</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder={t("order.field.notes_ph")}
                maxLength={500}
                rows={3}
                className="w-full border border-border px-3 py-2.5 text-sm bg-background outline-none focus:border-foreground resize-none"
              />
            </div>
          </div>
          {errs.form && <div className="mt-4 p-3 bg-destructive/10 text-destructive text-sm rounded border border-destructive/20">{errs.form}</div>}
          <div className="flex gap-3 mt-6">
            <Btn variant="outline" onClick={() => setStep(1)}>{t("order.btn.back")}</Btn>
            <button onClick={submitOrder} disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 bg-[#C4855A] text-white text-sm font-medium px-7 py-2.5 hover:opacity-90 transition-opacity min-w-[140px]">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : t("order.btn.submit")}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="text-center py-8 border border-border">
          <div className="w-16 h-16 bg-[#C4855A]/10 text-[#C4855A] rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8" />
          </div>
          <h2 className="font-playfair text-2xl font-medium mb-2">{t("order.success.title")}</h2>
          <p className="text-muted-foreground mb-6">{t("order.success.msg")}</p>
          <p className="text-xl font-bold mb-8">{orderId}</p>
          
          <div className="max-w-sm mx-auto space-y-3 px-4">
            <Btn variant="primary" className="w-full" onClick={() => navigate("/")}>{t("order.success.home")}</Btn>
            <p className="text-xs text-muted-foreground mt-6">
              {t("order.success.footer")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
