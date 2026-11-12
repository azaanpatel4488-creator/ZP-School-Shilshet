"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SchoolLogo } from "@/components/ui/SchoolLogo";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { facultyMembers, galleryItems } from "@/lib/mockData";
import { GalleryItem } from "@/types";
import { NoticeBoard } from "@/components/NoticeBoard";
import {
  ShieldCheck,
  BookOpen,
  Send,
  Users,
  Award,
  ChevronDown,
  ArrowRight,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Mail,
  Image as ImageIcon,
  LogIn,
  UserCheck,
  X,
} from "lucide-react";

export default function HomePage() {
  const { t, language } = useLanguage();
  const { isAuthenticated, isFaculty, isParent, user } = useAuth();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      q_en: "How does the digital portal protect physical student registers from damage?",
      q_mr: "हे डिजिटल पोर्टल कागदी नोंदवह्यांचे ओलावा व वाळवीपासून कसे संरक्षण करते?",
      a_en: "Rural schools historically faced loss of records due to monsoon humidity, termites, and paper decay. The ZP Shilshet portal creates redundant cloud backups of General Register (GR) numbers, Aadhaar, PEN IDs, and admission records, ensuring permanent availability without physical degradation.",
      a_mr: "मोखाडा व ग्रामीण भागातील शाळांमध्ये पावसाळ्यातील ओलावा, वाळवी आणि कागद जीर्ण झाल्यामुळे जुन्या नोंदवह्यांचे नुकसान होण्याची भीती असते. हे पोर्टल जनरल रजिस्टर (GR), आधार, आणि पेन (PEN) आयडी सुरक्षित डिजिटल स्वरूपात साठवून कायमस्वरूपी सुरक्षितता प्रदान करते.",
    },
    {
      q_en: "How do parents log in to view their child's assignments and progress?",
      q_mr: "पालक आपल्या पाल्याचा गृहपाठ आणि प्रगती पाहण्यासाठी कसे लॉगिन करू शकतात?",
      a_en: "Parents click 'Sign In', choose the Student/Parent tab, enter their child's General Register (GR) Number, and verify with the last 6 digits of their registered mobile number. Once set, they can log in anytime with their personal password.",
      a_mr: "पालक 'प्रवेश (Sign In)' बटणावर क्लिक करून विद्यार्थी/पालक टॅब निवडतात, पाल्याचा GR नंबर आणि मोबाईलचे शेवटचे ६ अंक टाकून एकदा पासवर्ड तयार करतात. त्यानंतर कधीही थेट लॉगिन करू शकतात.",
    },
    {
      q_en: "What documents are required for admission into Classes 1 to 5?",
      q_mr: "इयत्ता १ ली ते ५ वी मध्ये प्रवेशासाठी कोणती कागदपत्रे लागतात?",
      a_en: "For Class 1: Child's Birth Certificate, Aadhaar Card, Passport Photograph, and Parent Contact Number. For Classes 2 to 5: Original Transfer Certificate (TC/LC) from the previous school, Student Aadhaar Card, and Bank Passbook copy for DBT scholarship linking.",
      a_mr: "इयत्ता पहिलीसाठी: बालकाचा जन्मदाखला, आधार कार्ड, पासपोर्ट फोटो व पालकांचा मोबाईल नंबर. इयत्ता २ री ते ५ वी साठी: मागील शाळेचा शाळा सोडल्याचा दाखला (दाखला/TC), आधार कार्ड, आणि शिष्यवृत्तीसाठी बँक पासबुक झेरॉक्स.",
    },
    {
      q_en: "Are student Aadhaar and bank details kept confidential?",
      q_mr: "विद्यार्थ्यांचे आधार व बँक तपशील सुरक्षित आणि गोपनीय राहतात का?",
      a_en: "Yes. All student mutations and banking identifiers are locked behind strict faculty authentication and database row-level security (RLS). Only authenticated teachers and the Headmaster possess access to sensitive DBT scholarship registers.",
      a_mr: "होय. सर्व बँक खाती, आधार आणि गोपनीय माहिती सुरक्षित डेटाबेस व रो-लेव्हल सिक्युरिटी (RLS) ने संरक्षित आहे. केवळ अधिकृत शिक्षकच या नोंदी तपासू आणि संपादित करू शकतात.",
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#6C151E] via-[#591118] to-[#4D0E15] text-white pt-10 pb-20 md:pb-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F5DABF_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
            {/* Government Authority Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F2]/10 backdrop-blur-md border border-[#F5DABF]/30 text-[#F5DABF] text-xs font-semibold shadow-inner">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>{t.heroBadge}</span>
            </div>

            {/* School Emblem Large Center */}
            <div className="pt-2">
              <SchoolLogo size="xl" className="border-4 border-[#D4AF37] shadow-2xl" />
            </div>

            {/* Above-the-fold value proposition heading */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
                {t.heroTitle}
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-[#F5DABF]/95 font-medium max-w-3xl mx-auto leading-relaxed">
                {t.heroDesc}
              </p>
            </div>

            {/* Dynamic CTAs based on login state */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3 w-full">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/students"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#F5DABF] text-[#6C151E] font-bold text-sm hover:bg-white active:scale-95 transition-all shadow-lg hover:shadow-xl"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{isFaculty ? "Open Class Registers" : "View My Child's Dossier"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/assignments"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#0F3D3A] text-white font-bold text-sm hover:bg-[#165551] border border-[#D4AF37]/40 active:scale-95 transition-all shadow-md"
                  >
                    <Send className="w-4 h-4 text-[#F5DABF]" />
                    <span>{isFaculty ? "Dispatch Materials" : "Class Assignments"}</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#F5DABF] text-[#6C151E] font-bold text-sm hover:bg-white active:scale-95 transition-all shadow-lg hover:shadow-xl"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{language === "mr" ? "पोर्टलमध्ये प्रवेश करा (Sign In)" : "Sign In / Log In to Portal"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href="#faculty-section"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF7F2] font-semibold text-sm border border-white/20 active:scale-95 transition-all"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>{language === "mr" ? "शिक्षकवृंद पहा" : "View Faculty Profiles"}</span>
                  </a>

                  <a
                    href="#gallery-section"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF7F2] font-semibold text-sm border border-white/20 active:scale-95 transition-all"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>{language === "mr" ? "शालेय गॅलरी" : "Campus Gallery"}</span>
                  </a>
                </>
              )}
            </div>

            {/* Quick trust metrics */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-[#F5DABF]/80 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                U-DISE 27361809501
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                Classes 1st to 5th
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                {language === "mr" ? "डीबीटी व आधार संलग्नित" : "Aadhaar & DBT Validated"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BANNER */}
      <section className="container mx-auto px-4 max-w-7xl -mt-14 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-2xl shadow-xl border-2 border-[#E8CFB5] p-6 text-center">
          <div className="p-2 space-y-1">
            <span className="text-3xl md:text-4xl font-extrabold text-[#6C151E] block font-mono">
              200+
            </span>
            <span className="text-xs font-semibold text-stone-600 block">
              {t.statStudents}
            </span>
          </div>

          <div className="p-2 space-y-1 border-l border-stone-200">
            <span className="text-3xl md:text-4xl font-extrabold text-[#0F3D3A] block font-mono">
              1–5
            </span>
            <span className="text-xs font-semibold text-stone-600 block">
              {t.statClasses}
            </span>
          </div>

          <div className="p-2 space-y-1 border-l border-stone-200">
            <span className="text-3xl md:text-4xl font-extrabold text-[#6C151E] block font-mono">
              100%
            </span>
            <span className="text-xs font-semibold text-stone-600 block">
              {t.statDigitized}
            </span>
          </div>

          <div className="p-2 space-y-1 border-l border-stone-200">
            <span className="text-3xl md:text-4xl font-extrabold text-[#0F3D3A] block font-mono">
              4
            </span>
            <span className="text-xs font-semibold text-stone-600 block">
              {t.statFaculty}
            </span>
          </div>
        </div>
      </section>

      {/* 2.5 LIVE DIGITAL NOTICE BOARD */}
      <section className="container mx-auto px-4 max-w-7xl">
        <NoticeBoard />
      </section>

      {/* 3. CORE INSTITUTIONAL PILLARS */}
      <section className="container mx-auto px-4 max-w-7xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#6C151E] uppercase tracking-wider">
            {language === "mr" ? "शासकीय निकष व गुणवत्ता" : "Institutional Excellence"}
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
            {language === "mr"
              ? "पारंपरिक कागदी कारभाराला आधुनिक डिजिटल संरक्षण"
              : "Why Digitizing Shilshet's Registers Matters"}
          </h2>
          <p className="text-xs md:text-sm text-stone-600">
            {language === "mr"
              ? "विद्यार्थ्यांच्या भविष्यासाठी कायमस्वरूपी कागदपत्रांची डिजिटल सुरक्षा व पालकांशी अखंड संवाद."
              : "Eliminating physical record wear, loss of school leaving certificates, and delays in government welfare schemes."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border-2 border-stone-200/90 hover:border-[#6C151E] shadow-xs hover:shadow-lg transition-all duration-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] text-[#6C151E] border border-[#E8CFB5] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">{t.feature1Title}</h3>
            <p className="text-xs text-stone-600 leading-relaxed">{t.feature1Desc}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-stone-200/90 hover:border-[#0F3D3A] shadow-xs hover:shadow-lg transition-all duration-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#E8F2F1] text-[#0F3D3A] border border-[#0F3D3A]/20 flex items-center justify-center">
              <Send className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">{t.feature2Title}</h3>
            <p className="text-xs text-stone-600 leading-relaxed">{t.feature2Desc}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-stone-200/90 hover:border-[#C69214] shadow-xs hover:shadow-lg transition-all duration-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FBF4DE] text-[#8C6B0D] border border-[#C69214]/30 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">{t.feature3Title}</h3>
            <p className="text-xs text-stone-600 leading-relaxed">{t.feature3Desc}</p>
          </div>
        </div>
      </section>

      {/* 4. PUBLIC SPECTATOR SECTION: FACULTY PROFILES (Accessible without login) */}
      <section id="faculty-section" className="container mx-auto px-4 max-w-7xl space-y-6 pt-4">
        <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#6C151E] uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4 text-[#6C151E]" />
              <span>{language === "mr" ? "आमचे समर्पित शिक्षकवृंद" : "Dedicated Faculty"}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
              {t.facultyTitle}
            </h2>
            <p className="text-xs md:text-sm text-stone-600 mt-1">
              {t.facultySubtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facultyMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-stone-200/90 hover:border-[#6C151E] shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col group"
            >
              <div className="relative h-60 w-full bg-stone-100 overflow-hidden">
                <Image
                  src={member.photo_url}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6C151E] uppercase tracking-wide">
                    {member.qualification}
                  </span>
                  <p className="text-xs font-medium text-stone-200 mt-1">
                    {member.experienceYears} {language === "mr" ? "वर्षे अनुभव" : "Years Experience"}
                  </p>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm md:text-base leading-snug group-hover:text-[#6C151E] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs text-[#0F3D3A] font-semibold mt-0.5">
                    {language === "mr" ? member.designation_mr : member.designation}
                  </p>
                </div>

                {member.email && (
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-stone-500">Contact:</span>
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-50 hover:bg-[#6C151E]/10 text-stone-700 hover:text-[#6C151E] text-[11px] font-medium transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#6C151E]" />
                      <span>{member.email.split("@")[0]}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PUBLIC SPECTATOR SECTION: CAMPUS GALLERY (Accessible without login) */}
      <section id="gallery-section" className="container mx-auto px-4 max-w-7xl space-y-6 pt-4">
        <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0F3D3A] uppercase tracking-wider mb-1">
              <ImageIcon className="w-4 h-4 text-[#0F3D3A]" />
              <span>{language === "mr" ? "शालेय परिसर व उपक्रम" : "Campus Moments"}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
              {t.galleryTitle}
            </h2>
            <p className="text-xs md:text-sm text-stone-600 mt-1">
              {t.gallerySubtitle}
            </p>
          </div>
          <Link
            href="/gallery"
            className="text-xs font-bold text-[#0F3D3A] hover:underline inline-flex items-center gap-1"
          >
            <span>{language === "mr" ? "संपूर्ण गॅलरी पहा" : "View Full Gallery"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.slice(0, 6).map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              role="button"
              tabIndex={0}
              className="group bg-white rounded-2xl border border-stone-200/90 hover:border-[#6C151E] shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer flex flex-col"
            >
              <div className="relative h-52 w-full bg-stone-100 overflow-hidden">
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#0F3D3A]/90 text-white backdrop-blur-xs">
                    {language === "mr" ? item.category_mr : item.category}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="font-bold text-stone-900 text-sm leading-snug group-hover:text-[#6C151E] transition-colors">
                    {language === "mr" ? item.title_mr : item.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {language === "mr" ? item.description_mr : item.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3 h-3" />
                    {item.date}
                  </span>
                  <span className="text-[#6C151E] font-semibold group-hover:underline text-[11px]">
                    {language === "mr" ? "पहा ›" : "Expand ›"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox for Gallery */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-3xl w-full border border-stone-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full bg-black">
              <Image
                src={activePhoto.image_url}
                alt={activePhoto.title}
                fill
                className="object-contain"
              />
              <button
                type="button"
                onClick={() => setActivePhoto(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#0F3D3A] text-white">
                {language === "mr" ? activePhoto.category_mr : activePhoto.category} • {activePhoto.date}
              </span>
              <h3 className="text-lg font-bold text-stone-900">
                {language === "mr" ? activePhoto.title_mr : activePhoto.title}
              </h3>
              <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
                {language === "mr" ? activePhoto.description_mr : activePhoto.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 6. EXPANDABLE FAQ ACCORDION */}
      <section className="container mx-auto px-4 max-w-4xl space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#6C151E] uppercase tracking-wider">
            {language === "mr" ? "वारंवार विचारले जाणारे प्रश्न" : "Got Questions?"}
          </span>
          <h2 className="text-2xl font-extrabold text-stone-900">{t.faqTitle}</h2>
          <p className="text-xs md:text-sm text-stone-600">{t.faqSubtitle}</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-stone-200/90 overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 md:p-5 text-left font-bold text-xs md:text-sm text-stone-900 flex items-center justify-between gap-4 hover:bg-stone-50"
                  aria-expanded={isOpen}
                >
                  <span>{language === "mr" ? faq.q_mr : faq.q_en}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#6C151E]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 md:px-5 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                    {language === "mr" ? faq.a_mr : faq.a_en}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. INSTITUTIONAL CALL TO ACTION */}
      <section className="container mx-auto px-4 max-w-7xl">
        <div className="bg-[#0F3D3A] text-white rounded-3xl p-8 md:p-12 shadow-xl border-4 border-[#D4AF37]/40 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F5DABF]">
              {language === "mr" ? "अधिकृत डिजिटल पोर्टल" : "ZP Shilshet Digital Campus"}
            </span>
            <h2 className="text-2xl md:text-3xl font-black">
              {language === "mr"
                ? "शालेय कामकाज व विद्यार्थी नोंदींसाठी पोर्टलमध्ये प्रवेश करा"
                : "Access Registers & Homework Broadcasts"}
            </h2>
            <p className="text-xs md:text-sm text-stone-200">
              {language === "mr"
                ? "शिक्षकांसाठी संपूर्ण नोंदवही संपादन आणि पालकांसाठी गृहपाठ व शैक्षणिक प्रगती पाहण्याची सुविधा."
                : "Faculty-exclusive registers with permanent records and parent access for homework & progress tracking."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/login"
              className="px-7 py-3.5 rounded-xl bg-[#F5DABF] text-[#6C151E] font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{language === "mr" ? "प्रवेश (Sign In)" : "Sign In / Register"}</span>
            </Link>
            <Link
              href="/inquiries"
              className="px-6 py-3.5 rounded-xl bg-[#165551] text-white border border-[#D4AF37]/50 font-bold text-xs uppercase tracking-wider hover:bg-[#1f726d] transition-all flex items-center justify-center gap-2"
            >
              <span>{language === "mr" ? "नवीन प्रवेश अर्ज" : "Apply For Admission"}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
