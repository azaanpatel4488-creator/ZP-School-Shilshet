"use client";

import React, { useState } from "react";
import Image from "next/image";
import { galleryItems, facultyMembers } from "@/lib/mockData";
import { useLanguage } from "@/context/LanguageContext";
import { GalleryItem, FacultyMember } from "@/types";
import {
  Image as ImageIcon,
  Users,
  Award,
  Phone,
  Mail,
  GraduationCap,
  Sparkles,
  Calendar,
  X,
  ChevronRight,
} from "lucide-react";

export default function GalleryPage() {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const categories = [
    { id: "All", en: "All Activities", mr: "सर्व उपक्रम" },
    { id: "Sports", en: "Sports & Drill", mr: "क्रीडा व कवायत" },
    { id: "Academic", en: "Science & Academics", mr: "विज्ञान व अभ्यास" },
    { id: "Campus", en: "Campus & Nature", mr: "शाळा परिसर व निसर्ग" },
    { id: "Celebration", en: "Festivals & Days", mr: "सण व उत्सव" },
  ];

  const filteredGallery = galleryItems.filter(
    (item) => selectedCategory === "All" || item.category === selectedCategory
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-16">
      {/* SECTION 1: FACULTY SHOWCASE */}
      <section className="space-y-6">
        <div className="border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#6C151E] uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4 text-[#6C151E]" />
            <span>{language === "mr" ? "शासकीय मान्यताप्राप्त शिक्षकवृंद" : "Certified Faculty Team"}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
            {t.facultyTitle}
          </h1>
          <p className="text-xs md:text-sm text-stone-600 mt-1 max-w-2xl">
            {t.facultySubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facultyMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-stone-200/90 hover:border-[#6C151E] shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col group"
            >
              {/* Photo */}
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
                    {member.experienceYears} {language === "mr" ? "वर्षे अध्यापन अनुभव" : "Years Experience"}
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm md:text-base leading-snug group-hover:text-[#6C151E] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs text-[#0F3D3A] font-semibold mt-0.5">
                    {language === "mr" ? member.designation_mr : member.designation}
                  </p>
                </div>

                {/* Direct Contact links */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  {member.phone && (
                    <a
                      href={`tel:${member.phone}`}
                      className="inline-flex items-center gap-1.5 text-stone-700 hover:text-[#6C151E] font-medium"
                      title="Call teacher"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#6C151E]" />
                      <span>{member.phone}</span>
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="p-1.5 rounded-md hover:bg-stone-100 text-stone-600 hover:text-[#6C151E]"
                      title="Email teacher"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: SCHOOL LIFE & CAMPUS GALLERY */}
      <section className="space-y-6">
        <div className="border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0F3D3A] uppercase tracking-wider mb-1">
            <ImageIcon className="w-4 h-4 text-[#0F3D3A]" />
            <span>{language === "mr" ? "शालेय उपक्रम व क्षणचित्रे" : "School Events & Campus Moments"}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
            {t.galleryTitle}
          </h2>
          <p className="text-xs md:text-sm text-stone-600 mt-1 max-w-2xl">
            {t.gallerySubtitle}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? "bg-[#0F3D3A] text-white border-[#0F3D3A] shadow-xs"
                  : "bg-white text-stone-700 border-stone-300 hover:border-[#0F3D3A]"
              }`}
            >
              {language === "mr" ? cat.mr : cat.en}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActivePhoto(item);
                }
              }}
              className="group bg-white rounded-2xl border border-stone-200/90 hover:border-[#6C151E] shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer flex flex-col"
            >
              <div className="relative h-56 w-full bg-stone-100 overflow-hidden">
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
                  <h3 className="font-bold text-stone-900 text-sm md:text-base leading-snug group-hover:text-[#6C151E] transition-colors">
                    {language === "mr" ? item.title_mr : item.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {language === "mr" ? item.description_mr : item.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.date}
                  </span>
                  <span className="text-[#6C151E] font-semibold group-hover:underline">
                    {language === "mr" ? "पहा ›" : "Expand ›"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
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
    </div>
  );
}

