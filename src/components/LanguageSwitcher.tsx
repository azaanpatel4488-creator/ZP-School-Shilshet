"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";

export const LanguageSwitcher: React.FC<{ variant?: "compact" | "full" }> = ({ variant = "full" }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center p-0.5 rounded-lg bg-stone-100/90 border border-stone-300 shadow-xs">
      <div className="flex items-center px-1.5 text-stone-500">
        <Globe className="w-3.5 h-3.5" />
      </div>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
          language === "en"
            ? "bg-[#6C151E] text-white shadow-xs"
            : "text-stone-700 hover:text-stone-900 hover:bg-stone-200/60"
        }`}
        aria-label="Switch language to English"
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLanguage("mr")}
        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
          language === "mr"
            ? "bg-[#6C151E] text-white shadow-xs"
            : "text-stone-700 hover:text-stone-900 hover:bg-stone-200/60"
        }`}
        aria-label="Switch language to Marathi"
      >
        मराठी
      </button>
    </div>
  );
};
