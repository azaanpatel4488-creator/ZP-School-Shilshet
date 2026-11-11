"use client";

import React from "react";
import Link from "next/link";
import { SchoolLogo } from "@/components/ui/SchoolLogo";
import { useLanguage } from "@/context/LanguageContext";
import { Home, Users, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const { language } = useLanguage();

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-[#FAF7F2]">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 md:p-10 rounded-2xl shadow-xl border-2 border-[#E8CFB5]">
        <div className="flex justify-center">
          <SchoolLogo size="lg" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-[#6C151E]/10 text-[#6C151E] font-bold text-xs tracking-wider uppercase">
            Error 404 • Page Not Found
          </span>
          <h1 className="text-3xl font-extrabold text-[#6C151E] tracking-tight">
            {language === "mr" ? "पृष्ठ आढळले नाही" : "Dossier Not Found"}
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            {language === "mr"
              ? "आपण शोधत असलेले पृष्ठ किंवा विद्यार्थी दस्तऐवज उपलब्ध नाही अथवा इतरत्र हलवले गेले आहे."
              : "The requested institutional record or URL path could not be located in the ZP Shilshet directory."}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#6C151E] text-white font-semibold text-xs hover:bg-[#851C27] active:scale-95 transition-all shadow-md"
          >
            <Home className="w-4 h-4" />
            <span>{language === "mr" ? "मुख्यपृष्ठावर जा" : "Return to Home"}</span>
          </Link>
          <Link
            href="/students"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#0F3D3A] text-white font-semibold text-xs hover:bg-[#165551] active:scale-95 transition-all shadow-md"
          >
            <Users className="w-4 h-4" />
            <span>{language === "mr" ? "विद्यार्थी नोंदी" : "Student Registers"}</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-stone-100 text-[11px] text-stone-400">
          <span>ZP Primary School Shilshet • U-DISE: 27211105401</span>
        </div>
      </div>
    </div>
  );
}
