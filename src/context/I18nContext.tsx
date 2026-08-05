import React, { createContext, useContext, useEffect, useState } from "react";
import { translations, TranslationKey } from "../lib/i18n/translations";

type Language = "fr" | "ar" | "en";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: "ltr" | "rtl";
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      return (localStorage.getItem("luma_lang") as Language) || "fr";
    } catch {
      return "fr";
    }
  });

  const dir = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    localStorage.setItem("luma_lang", language);
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.fr[key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, dir, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
