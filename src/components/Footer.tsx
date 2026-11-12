"use client";

import React from "react";
import Link from "next/link";
import { SchoolLogo } from "./ui/SchoolLogo";
import { useLanguage } from "@/context/LanguageContext";
import { Phone, Mail, MapPin, ExternalLink, ShieldCheck, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0F3D3A] text-stone-200 border-t-4 border-[#6C151E] mt-auto">
      {/* Upper Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Institutional Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <SchoolLogo size="md" />
              <div>
                <h3 className="font-extrabold text-white text-base leading-snug">
                  {language === "mr" ? "जि.प. प्राथमिक शाळा शिलशेत" : "ZP Primary School Shilshet"}
                </h3>
                <p className="text-xs text-[#F5DABF]">
                  {language === "mr" ? "ता. मोखाडा, जि. पालघर - ४०१६०४" : "Tal. Mokhada, Dist. Palghar - 401604"}
                </p>
              </div>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              {t.schoolTagline}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#165551] text-[#F5DABF] text-[11px] font-mono border border-emerald-900/50">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>U-DISE: 27361809501</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-bold text-[#F5DABF] text-sm uppercase tracking-wider mb-3 pb-1 border-b border-[#165551]">
              {language === "mr" ? "महत्त्वाचे विभाग" : "Portal Sections"}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white hover:underline transition-colors flex items-center gap-1.5">
                  <span>›</span> {t.navHome}
                </Link>
              </li>
              <li>
                <Link href="/students" className="hover:text-white hover:underline transition-colors flex items-center gap-1.5">
                  <span>›</span> {t.navStudents} (Classes 1–5)
                </Link>
              </li>
              <li>
                <Link href="/assignments" className="hover:text-white hover:underline transition-colors flex items-center gap-1.5">
                  <span>›</span> {t.navAssignments}
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white hover:underline transition-colors flex items-center gap-1.5">
                  <span>›</span> {t.navGallery}
                </Link>
              </li>
              <li>
                <Link href="/inquiries" className="hover:text-white hover:underline transition-colors flex items-center gap-1.5">
                  <span>›</span> {t.navInquiries}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#F5DABF] hover:underline transition-colors flex items-center gap-1.5 font-semibold text-[#F5DABF]">
                  <span>›</span> {t.navLogin}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Standards */}
          <div>
            <h4 className="font-bold text-[#F5DABF] text-sm uppercase tracking-wider mb-3 pb-1 border-b border-[#165551]">
              {language === "mr" ? "वर्गवार नोंदी" : "Class Rosters"}
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/students?class=1" className="hover:text-white transition-colors">
                  {t.class1} - {language === "mr" ? "पायाभूत वाचन व अंकज्ञान" : "Foundational Literacy"}
                </Link>
              </li>
              <li>
                <Link href="/students?class=2" className="hover:text-white transition-colors">
                  {t.class2} - {language === "mr" ? "भाषा व प्राथमिक गणित" : "Language & Numeracy"}
                </Link>
              </li>
              <li>
                <Link href="/students?class=3" className="hover:text-white transition-colors">
                  {t.class3} - {language === "mr" ? "परिसर अभ्यास व लेखन" : "Environmental Studies"}
                </Link>
              </li>
              <li>
                <Link href="/students?class=4" className="hover:text-white transition-colors">
                  {t.class4} - {language === "mr" ? "वैदिक गणित व प्रयोग" : "Applied Science & Math"}
                </Link>
              </li>
              <li>
                <Link href="/students?class=5" className="hover:text-white transition-colors">
                  {t.class5} - {language === "mr" ? "शिष्यवृत्ती व माध्यमिक तयारी" : "Scholarship & Exam Prep"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Contact & Governance */}
          <div>
            <h4 className="font-bold text-[#F5DABF] text-sm uppercase tracking-wider mb-3 pb-1 border-b border-[#165551]">
              {language === "mr" ? "संपर्क व प्रशासन" : "Official Contact"}
            </h4>
            <div className="space-y-2.5 text-xs text-stone-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F5DABF] shrink-0 mt-0.5" />
                <span>
                  {language === "mr"
                    ? "जि.प. प्राथमिक शाळा, मु. पो. शिलशेत, ता. मोखाडा, जि. पालघर - ४०१६०४"
                    : "ZP Primary School, At Post Shilshet, Taluka Mokhada, District Palghar, Maharashtra - 401604"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F5DABF] shrink-0" />
                <a href="mailto:headmaster@zpshilshet.edu.in" className="hover:text-white hover:underline truncate">
                  headmaster@zpshilshet.edu.in
                </a>
              </div>
              <div className="pt-2">
                <a
                  href="https://education.maharashtra.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] text-[#F5DABF] hover:underline"
                >
                  <span>Maha Education Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Footer / Legal & Copyright */}
      <div className="bg-[#092523] border-t border-[#165551] py-4 text-xs text-stone-400">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <p>
            © {currentYear} {t.footerRights}
          </p>
          <p className="text-[11px] text-stone-400 flex items-center justify-center gap-1">
            <span>{t.footerGovtNote}</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

