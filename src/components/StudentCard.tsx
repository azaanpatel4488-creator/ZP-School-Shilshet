"use client";

import React from "react";
import Image from "next/image";
import { Student } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { Award, Phone, User } from "lucide-react";

interface StudentCardProps {
  student: Student;
  onClick: () => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, onClick }) => {
  const { language } = useLanguage();

  // Helper color for Study IQ metric
  const getMetricColor = (score: number) => {
    if (score >= 85) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (score >= 70) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-rose-700 bg-rose-50 border-rose-200";
  };

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="group bg-white rounded-xl border border-stone-200/90 hover:border-[#6C151E] shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer flex flex-col focus:outline-none focus:ring-2 focus:ring-[#6C151E]"
    >
      {/* Top Header Strip with Class & GR Number */}
      <div className="bg-[#FAF7F2] px-4 py-2 border-b border-stone-200 flex items-center justify-between text-xs">
        <span className="font-bold text-[#6C151E] tracking-wide">
          {language === "mr" ? `वर्ग ${student.class_standard}` : `Class ${student.class_standard}`}
        </span>
        <span className="font-mono bg-white px-2 py-0.5 rounded border border-stone-200 text-stone-700 font-semibold text-[11px]">
          GR #{student.register_number}
        </span>
      </div>

      <div className="p-4 flex items-start gap-3.5 flex-1">
        {/* Passport Thumbnail */}
        <div className="relative w-16 h-20 rounded-md overflow-hidden bg-stone-100 border-2 border-stone-200 shrink-0 group-hover:border-[#6C151E] transition-colors shadow-xs">
          {student.photo_url ? (
            <Image
              src={student.photo_url}
              alt={student.full_name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="64px"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400">
              <User className="w-8 h-8" />
              <span className="text-[9px] font-medium">No Photo</span>
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="font-bold text-stone-900 text-sm leading-snug group-hover:text-[#6C151E] transition-colors truncate">
            {student.full_name}
          </h3>
          <p className="text-xs text-stone-500 truncate">
            <span className="font-medium text-stone-600">
              {language === "mr" ? "आई:" : "Mother:"}
            </span>{" "}
            {student.mother_name}
          </p>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded bg-[#F5DABF]/50 text-stone-800 border border-[#E8CFB5]">
              {student.caste_category}
            </span>
            <span className="inline-block px-1.5 py-0.5 text-[10px] font-mono text-stone-600 bg-stone-100 rounded">
              PEN: ...{student.pen_id.slice(-4)}
            </span>
          </div>
        </div>
      </div>

      {/* Quick-view Study Metric & Action Footer */}
      <div className="px-4 py-2.5 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between text-xs mt-auto">
        <div className="flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-[#0F3D3A]" />
          <span className="text-[11px] text-stone-600 font-medium">
            {language === "mr" ? "बुद्ध्यांक / IQ:" : "Study Metric:"}
          </span>
          <span
            className={`px-1.5 py-0.5 text-[11px] font-bold rounded border ${getMetricColor(
              student.study_iq_score
            )}`}
          >
            {student.study_iq_score}/100
          </span>
        </div>

        <span className="text-[11px] font-semibold text-[#6C151E] group-hover:underline">
          {language === "mr" ? "तपशील ›" : "View Dossier ›"}
        </span>
      </div>
    </div>
  );
};
