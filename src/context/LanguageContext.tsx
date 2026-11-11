"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, DictionaryStrings, dictionary } from "@/lib/dictionary";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: DictionaryStrings;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: dictionary.en,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("zp_lang") as Language;
    if (saved && (saved === "en" || saved === "mr")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("zp_lang", lang);
    }
  };

  const currentStrings = mounted ? dictionary[language] : dictionary.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: currentStrings }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

