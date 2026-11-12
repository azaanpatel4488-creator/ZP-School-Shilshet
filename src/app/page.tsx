"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SchoolLogo } from "@/components/ui/SchoolLogo";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { initialAssignments } from "@/lib/mockData";
import {
  ShieldCheck,
  BookOpen,
  Send,
  Users,
  Award,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  GraduationCap,
  Calendar,
  CheckCircle2,
  FileText,
  MapPin,
  ExternalLink,
} from "lucide-react";

export default function HomePage() {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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
      q_en: "What documents are required for admission into Classes 1 to 5?",
      q_mr: "इयत्ता १ ली ते ५ वी मध्ये प्रवेशासाठी कोणती कागदपत्रे लागतात?",
      a_en: "For Class 1: Child's Birth Certificate, Aadhaar Card, Passport Photograph, and Parent Contact Number. For Classes 2 to 5: Original Transfer Certificate (TC/LC) from the previous school, Student Aadhaar Card, and Bank Passbook copy for DBT scholarship linking.",
      a_mr: "इयत्ता पहिलीसाठी: बालकाचा जन्मदाखला, आधार कार्ड, पासपोर्ट फोटो व पालकांचा मोबाईल नंबर. इयत्ता २ री ते ५ वी साठी: मागील शाळेचा शाळा सोडल्याचा दाखला (दाखला/TC), आधार कार्ड, आणि शिष्यवृत्तीसाठी बँक पासबुक झेरॉक्स.",
    },
    {
      q_en: "How do parents receive homework and educational broadcasts?",
      q_mr: "पालकांना गृहपाठ आणि शैक्षणिक सूचना कशा प्राप्त होतात?",
      a_en: "Faculty dispatches homework sheets, YouTube lessons, and circulars directly from the Assignment Dispatcher. With one click, notices can be broadcast to village parent WhatsApp groups or reviewed on the public school portal without needing an app install.",
      a_mr: "शिक्षक आपल्या अभ्यास प्रसारक डॅशबोर्डवरून गृहपाठ, शैक्षणिक व्हिडिओ आणि परिपत्रके थेट प्रकाशित करतात. पालक कोणत्याही अतिरिक्त ॲपशिवाय एका क्लिकवर व्हॉट्सॲपवर किंवा शाळेच्या पोर्टलवर हा अभ्यास पाहू शकतात.",
    },
    {
      q_en: "Are student Aadhaar and bank details kept confidential?",
      q_mr: "विद्यार्थ्यांचे आधार व बँक तपशील सुरक्षित आणि गोपनीय राहतात का?",
      a_en: "Yes. All student mutations and banking identifiers are locked behind strict faculty authentication and database row-level security (RLS). Only authenticated teachers and the Headmaster possess access to sensitive DBT scholarship registers.",
      a_mr: "होय. सर्व बँक खाती, आधार आणि गोपनीय माहिती सुरक्षित डेटाबेस व रो-लेव्हल सिक्युरिटी (RLS) ने संरक्षित आहे. केवळ अधिकृत शिक्षक आणि मुख्याध्यापकच या नोंदी तपासू आणि संपादित करू शकतात.",
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION WITH CLEAR ABOVE-THE-FOLD VALUE PROPOSITION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#6C151E] via-[#591118] to-[#4D0E15] text-white pt-10 pb-20 md:pb-28">
        {/* Subtle patterned overlay */}
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

            {/* Primary, Secondary, Tertiary CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3 w-full">
              <Link
                href="/students"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#F5DABF] text-[#6C151E] font-bold text-sm hover:bg-white active:scale-95 transition-all shadow-lg hover:shadow-xl"
              >
                <BookOpen className="w-4 h-4" />
                <span>{t.heroPrimaryCta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/assignments"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#0F3D3A] text-white font-bold text-sm hover:bg-[#165551] border border-[#D4AF37]/40 active:scale-95 transition-all shadow-md"
              >
                <Send className="w-4 h-4 text-[#F5DABF]" />
                <span>{t.heroSecondaryCta}</span>
              </Link>

              <Link
                href="/inquiries"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF7F2] font-semibold text-sm border border-white/20 active:scale-95 transition-all"
              >
                <GraduationCap className="w-4 h-4" />
                <span>{t.heroTertiaryCta}</span>
              </Link>
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

      {/* 2. STATS BANNER - OVERLAPPING THE HERO */}
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
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border-2 border-stone-200/90 hover:border-[#6C151E] shadow-xs hover:shadow-lg transition-all duration-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] text-[#6C151E] border border-[#E8CFB5] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">{t.feature1Title}</h3>
            <p className="text-xs text-stone-600 leading-relaxed">{t.feature1Desc}</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border-2 border-stone-200/90 hover:border-[#0F3D3A] shadow-xs hover:shadow-lg transition-all duration-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#E8F2F1] text-[#0F3D3A] border border-[#0F3D3A]/20 flex items-center justify-center">
              <Send className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">{t.feature2Title}</h3>
            <p className="text-xs text-stone-600 leading-relaxed">{t.feature2Desc}</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border-2 border-stone-200/90 hover:border-[#C69214] shadow-xs hover:shadow-lg transition-all duration-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FBF4DE] text-[#8C6B0D] border border-[#C69214]/30 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">{t.feature3Title}</h3>
            <p className="text-xs text-stone-600 leading-relaxed">{t.feature3Desc}</p>
          </div>
        </div>
      </section>

      {/* 4. CLASS REGISTERS DIRECTORY SHORTCUTS */}
      <section className="container mx-auto px-4 max-w-7xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-200 pb-4">
          <div>
            <span className="text-xs font-bold text-[#6C151E] uppercase tracking-wider">
              {language === "mr" ? "वर्गवार वर्गवारी" : "Quick Access"}
            </span>
            <h2 className="text-2xl font-extrabold text-stone-900">
              {language === "mr" ? "इयत्ता १ ली ते ५ वी वर्ग नोंदवह्या" : "Classes 1 to 5 Digital Roster Hub"}
            </h2>
          </div>
          <Link
            href="/students"
            className="text-xs font-bold text-[#6C151E] hover:underline inline-flex items-center gap-1"
          >
            <span>{language === "mr" ? "सर्व नोंदवह्या पहा" : "View Entire Directory"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { cls: 1, nameEn: "Class 1", nameMr: "इयत्ता १ ली", descEn: "Foundational Literacy", descMr: "पायाभूत वाचन व अंकज्ञान" },
            { cls: 2, nameEn: "Class 2", nameMr: "इयत्ता २ री", descEn: "Basic Arithmetic & EVS", descMr: "अंकगणित व परिसर ओळख" },
            { cls: 3, nameEn: "Class 3", nameMr: "इयत्ता ३ री", descEn: "Reading Comprehension", descMr: "समजपूर्वक वाचन व लेखन" },
            { cls: 4, nameEn: "Class 4", nameMr: "इयत्ता ४ थी", descEn: "Science & Geometry", descMr: "विज्ञान व भूमिती संकल्पना" },
            { cls: 5, nameEn: "Class 5", nameMr: "इयत्ता ५ वी", descEn: "Scholarship & High School Prep", descMr: "शिष्यवृत्ती व माध्यमिक पूर्वतयारी" },
          ].map((item) => (
            <Link
              key={item.cls}
              href={`/students?class=${item.cls}`}
              className="group bg-white p-5 rounded-2xl border-2 border-stone-200 hover:border-[#6C151E] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#6C151E] text-white flex items-center justify-center font-extrabold text-lg mb-3 group-hover:scale-105 transition-transform">
                  {item.cls}
                </div>
                <h3 className="font-bold text-stone-900 text-sm group-hover:text-[#6C151E] transition-colors">
                  {language === "mr" ? item.nameMr : item.nameEn}
                </h3>
                <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                  {language === "mr" ? item.descMr : item.descEn}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-[11px] font-semibold text-[#6C151E]">
                <span>{language === "mr" ? "नोंदवही उघडा" : "Open Register"}</span>
                <span>›</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. LATEST BROADCASTS PREVIEW */}
      <section className="container mx-auto px-4 max-w-7xl">
        <div className="bg-[#FAF7F2] rounded-3xl border-2 border-[#E8CFB5] p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#0F3D3A] uppercase tracking-wider">
                {language === "mr" ? "सूचना व गृहपाठ फलक" : "Noticeboard"}
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold text-stone-900">
                {language === "mr" ? "अलिकडील शैक्षणिक प्रसारणे" : "Recent Assignment Dispatches"}
              </h2>
            </div>
            <Link
              href="/assignments"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F3D3A] hover:underline"
            >
              <span>{language === "mr" ? "सर्व अभ्यास पहा" : "View All Dispatches"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {initialAssignments.slice(0, 2).map((asg) => (
              <div
                key={asg.id}
                className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#6C151E] text-white">
                    {asg.target_class
                      ? (language === "mr" ? `इयत्ता ${asg.target_class}` : `Class ${asg.target_class}`)
                      : (language === "mr" ? "सर्व वर्ग" : "All Classes")}
                  </span>
                  <span className="text-[11px] text-stone-500 font-mono">Format: {asg.media_type}</span>
                </div>
                <h4 className="font-bold text-stone-900 text-sm leading-snug">{asg.title}</h4>
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">{asg.content_text}</p>
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-500">{asg.author_name}</span>
                  <Link href="/assignments" className="text-[#6C151E] font-semibold hover:underline">
                    {language === "mr" ? "तपशील पहा ›" : "Details ›"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
              {language === "mr" ? "प्रवेश सुरू आहे (२०२६-२७)" : "Admissions Open (2026-27)"}
            </span>
            <h2 className="text-2xl md:text-3xl font-black">
              {language === "mr"
                ? "आपल्या पाल्याच्या उज्ज्वल भविष्यासाठी शिलशेत शाळेत प्रवेश घ्या"
                : "Enroll Your Child at ZP Primary School Shilshet"}
            </h2>
            <p className="text-xs md:text-sm text-stone-200">
              {language === "mr"
                ? "डिजिटल वर्गखोल्या, मोफत गणवेश, पाठ्यपुस्तके, पोषण आहार आणि समर्पित शिक्षक."
                : "Free uniforms, textbooks, nutritious Mid-Day Meal, and tech-enabled primary classrooms."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/inquiries"
              className="px-6 py-3.5 rounded-xl bg-[#F5DABF] text-[#6C151E] font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-md active:scale-95"
            >
              {language === "mr" ? "ऑनलाईन प्रवेश अर्ज" : "Apply For Admission"}
            </Link>
            <a
              href="mailto:headmaster@zpshilshet.edu.in"
              className="px-5 py-3.5 rounded-xl bg-[#165551] text-white border border-[#D4AF37]/50 font-bold text-xs uppercase tracking-wider hover:bg-[#1f726d] transition-all flex items-center justify-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{language === "mr" ? "ई-मेल संपर्क" : "Office Email"}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
