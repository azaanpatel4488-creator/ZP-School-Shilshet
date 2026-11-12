"use client";

import React, { useState } from "react";
import { Phone, Mail, MessageSquare, X, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const FloatingContactButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {isOpen && (
        <div className="mb-3 p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-stone-200 w-72 text-sm text-stone-800 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
            <span className="font-bold text-[#6C151E]">
              {language === "mr" ? "शाळा कार्यालय संपर्क" : "School Office Contact"}
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-stone-400 hover:text-stone-700 rounded-md"
              aria-label="Close contact popup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2.5">
            <a
              href="/inquiries"
              className="flex items-center gap-2.5 p-2 rounded-lg bg-stone-50 hover:bg-[#F5DABF]/40 text-stone-800 hover:text-[#6C151E] transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#6C151E] text-white flex items-center justify-center shrink-0">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs">
                <p className="font-semibold">{language === "mr" ? "ऑनलाईन प्रवेश चौकशी" : "Admission Inquiry Desk"}</p>
                <p className="text-stone-500">{language === "mr" ? "थेट अर्ज सादर करा" : "Submit Query Directly"}</p>
              </div>
            </a>

            <a
              href="mailto:headmaster@zpshilshet.edu.in"
              className="flex items-center gap-2.5 p-2 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-800 hover:text-[#6C151E] transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-stone-700 text-white flex items-center justify-center shrink-0">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs">
                <p className="font-semibold">{language === "mr" ? "ई-मेल पत्रव्यवहार" : "Official Email"}</p>
                <p className="text-stone-500 text-[11px] truncate">headmaster@zpshilshet.edu.in</p>
              </div>
            </a>

            <div className="flex items-start gap-2 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
              <MapPin className="w-3.5 h-3.5 text-[#6C151E] shrink-0 mt-0.5" />
              <span>
                {language === "mr"
                  ? "मु. पो. शिलशेत, ता. मोखाडा, जि. पालघर - ४०१६०४"
                  : "At Post Shilshet, Tal. Mokhada, Dist. Palghar - 401604"}
              </span>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#0F3D3A] text-white shadow-lg hover:bg-[#165551] active:scale-95 transition-all text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F3D3A]"
        aria-label="Toggle contact helpdesk"
      >
        <Phone className="w-4 h-4 text-[#F5DABF]" />
        <span>{language === "mr" ? "संपर्क व मदत" : "Helpdesk"}</span>
      </button>
    </div>
  );
};

