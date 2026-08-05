import { useState } from "react";

type Tab = "general" | "contact" | "delivery" | "notifications" | "language";

const tabs: { key: Tab; label: string }[] = [
  { key: "general", label: "Général" },
  { key: "contact", label: "Contact" },
  { key: "delivery", label: "Livraison" },
  { key: "notifications", label: "Notifications" },
  { key: "language", label: "Langue" },
];

export default function Settings() {
  const [tab, setTab] = useState<Tab>("general");
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-7 py-5 bg-card" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-xl" style={{ letterSpacing: "-0.01em" }}>Paramètres</h1>
          {saved && (
            <span className="text-xs font-medium px-2.5 py-1 rounded" style={{ backgroundColor: "#ECFDF5", color: "#065F46", border: "1px solid #6EE7B7" }}>
              Enregistré
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Tab sidebar */}
        <div
          className="w-44 shrink-0 py-3 px-2 flex flex-col gap-0.5"
          style={{ borderRight: "1px solid var(--border)", backgroundColor: "var(--background)" }}
        >
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="px-3 py-2 rounded text-sm text-left transition-colors"
              style={{
                backgroundColor: tab === t.key ? "var(--card)" : "transparent",
                color: tab === t.key ? "var(--foreground)" : "var(--muted-foreground)",
                fontWeight: tab === t.key ? 500 : 400,
                border: tab === t.key ? "1px solid var(--border)" : "1px solid transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-8 py-6">
          <form onSubmit={handleSave} className="max-w-xl flex flex-col gap-6">
            {tab === "general" && (
              <>
                <SettingsSection title="Informations du magasin">
                  <FormField label="Nom du magasin">
                    <input defaultValue="LUMA Cosmetics" className="settings-input" />
                  </FormField>
                  <FormField label="Adresse e-mail">
                    <input type="email" defaultValue="contact@luma.dz" className="settings-input" />
                  </FormField>
                  <FormField label="Téléphone">
                    <input defaultValue="+213 XX XX XX XX" className="settings-input" />
                  </FormField>
                  <FormField label="Wilaya principale">
                    <select defaultValue="Alger" className="settings-input">
                      <option>Alger</option>
                      <option>Oran</option>
                      <option>Constantine</option>
                      <option>Annaba</option>
                    </select>
                  </FormField>
                </SettingsSection>
                <SettingsSection title="Logo">
                  <div
                    className="flex items-center gap-4 p-4 rounded"
                    style={{ border: "1.5px dashed var(--border)" }}
                  >
                    <div
                      className="w-14 h-14 rounded flex items-center justify-center"
                      style={{ backgroundColor: "var(--primary)" }}
                    >
                      <span className="font-serif text-white text-2xl" style={{ letterSpacing: "-0.02em" }}>L</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Logo actuel</div>
                      <button type="button" className="text-xs mt-1 hover:underline" style={{ color: "var(--primary)" }}>
                        Télécharger un nouveau logo
                      </button>
                    </div>
                  </div>
                </SettingsSection>
              </>
            )}

            {tab === "contact" && (
              <SettingsSection title="Canaux de contact">
                <FormField label="WhatsApp">
                  <input placeholder="+213 XX XX XX XX" className="settings-input" />
                </FormField>
                <FormField label="Instagram">
                  <input placeholder="@luma_cosmetics_dz" className="settings-input" />
                </FormField>
                <FormField label="Messenger (Page ID)">
                  <input placeholder="ID de la page Facebook" className="settings-input" />
                </FormField>
              </SettingsSection>
            )}

            {tab === "delivery" && (
              <SettingsSection title="Agences de livraison">
                <p className="text-sm mb-4" style={{ color: "var(--muted-foreground)" }}>
                  Configurez vos partenaires de livraison. Les intégrations API seront disponibles prochainement.
                </p>
                <div className="flex flex-col gap-3">
                  {["Yalidine", "Zr Express", "Procolis", "Autre agence"].map((name) => (
                    <div
                      key={name}
                      className="flex items-center justify-between p-3 rounded"
                      style={{ border: "1px solid var(--border)", backgroundColor: "var(--background)" }}
                    >
                      <div>
                        <div className="text-sm font-medium">{name}</div>
                        <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                          API non connectée
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: "#F9FAFB", color: "#6B7280", border: "1px solid #E5E7EB" }}
                        >
                          Bientôt
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </SettingsSection>
            )}

            {tab === "notifications" && (
              <SettingsSection title="Notifications">
                {[
                  { key: "newOrder", label: "Nouvelle commande reçue", desc: "Notification quand une commande arrive" },
                  { key: "noAnswer", label: "Sans réponse — rappel", desc: "Rappeler pour les commandes sans réponse" },
                  { key: "lowStock", label: "Stock faible", desc: "Alerte quand un produit atteint le seuil" },
                  { key: "sound", label: "Activer le son", desc: "Son pour les nouvelles commandes" },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid var(--border)" }}>
                    <div>
                      <div className="text-sm font-medium">{label}</div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{desc}</div>
                    </div>
                    <Toggle defaultChecked={key !== "sound"} />
                  </div>
                ))}
              </SettingsSection>
            )}

            {tab === "language" && (
              <SettingsSection title="Langue de l'interface">
                <div className="flex flex-col gap-2">
                  {[
                    { code: "fr", label: "Français", sub: "Interface principale" },
                    { code: "ar", label: "العربية", sub: "Avec support RTL" },
                    { code: "en", label: "English", sub: "" },
                  ].map((lang) => (
                    <label
                      key={lang.code}
                      className="flex items-center gap-3 p-3 rounded cursor-pointer"
                      style={{ border: `1px solid ${lang.code === "fr" ? "var(--primary)" : "var(--border)"}`, backgroundColor: lang.code === "fr" ? "var(--secondary)" : "transparent" }}
                    >
                      <input
                        type="radio"
                        name="lang"
                        defaultChecked={lang.code === "fr"}
                        style={{ accentColor: "var(--primary)" }}
                      />
                      <div>
                        <div className="text-sm font-medium">{lang.label}</div>
                        {lang.sub && <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{lang.sub}</div>}
                      </div>
                    </label>
                  ))}
                </div>
              </SettingsSection>
            )}

            <button
              type="submit"
              className="px-5 py-2.5 rounded text-sm font-medium w-fit hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "var(--primary)", color: "#fff" }}
            >
              Enregistrer les modifications
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .settings-input {
          width: 100%;
          border: 1px solid var(--border);
          border-radius: 5px;
          padding: 7px 10px;
          font-size: 13px;
          font-family: 'DM Sans', system-ui, sans-serif;
          background-color: var(--background);
          color: var(--foreground);
          outline: none;
          transition: border-color 0.1s;
        }
        .settings-input:focus { border-color: var(--primary); }
      `}</style>
    </div>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3
        className="text-xs font-semibold mb-4"
        style={{ color: "var(--muted-foreground)", letterSpacing: "0.06em", textTransform: "uppercase" }}
      >
        {title}
      </h3>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>{label}</label>
      {children}
    </div>
  );
}

function Toggle({ defaultChecked }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked ?? false);
  return (
    <div
      className="relative w-9 h-5 rounded-full transition-colors cursor-pointer shrink-0"
      style={{ backgroundColor: on ? "var(--primary)" : "var(--muted)" }}
      onClick={() => setOn((v) => !v)}
    >
      <div
        className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm"
        style={{ transform: on ? "translateX(18px)" : "translateX(2px)" }}
      />
    </div>
  );
}
