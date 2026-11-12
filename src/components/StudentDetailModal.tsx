"use client";

import React from "react";
import Image from "next/image";
import { Student } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  X,
  Phone,
  CreditCard,
  Hash,
  ShieldCheck,
  Calendar,
  Building2,
  Edit3,
  Trash2,
  User,
  ExternalLink,
  Award,
} from "lucide-react";

interface StudentDetailModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  onOpenReportCard?: (student: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onOpenReportCard,
}) => {
  const { t, language } = useLanguage();
  const { isAuthenticated, isFaculty } = useAuth();

  if (!isOpen || !student) return null;

  // Format Aadhaar: XXXX-XXXX-XXXX
  const formatAadhaar = (val: string) => {
    const clean = val.replace(/\D/g, "");
    if (clean.length === 12) {
      return `${clean.slice(0, 4)}-${clean.slice(4, 8)}-${clean.slice(8, 12)}`;
    }
    return val;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border-2 border-[#E8CFB5] w-full max-w-2xl max-h-[92vh] overflow-y-auto text-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#6C151E] text-white p-5 rounded-t-2xl flex items-center justify-between sticky top-0 z-10 border-b-2 border-[#D4AF37]/50">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-[#0F3D3A] text-[#F5DABF] text-xs font-bold font-mono">
              GR #{student.register_number}
            </span>
            <div>
              <h2 className="text-lg font-bold leading-tight">
                {t.studentDetailsTitle}
              </h2>
              <p className="text-xs text-[#F5DABF]">
                {language === "mr" ? `इयत्ता ${student.class_standard} वी` : `Class ${student.class_standard} Standard`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Identity Grid */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-stone-200">
            {/* Expanded Passport Photo */}
            <div className="relative w-32 h-40 rounded-xl overflow-hidden bg-stone-100 border-2 border-[#6C151E] shadow-md shrink-0">
              {student.photo_url ? (
                <Image
                  src={student.photo_url}
                  alt={student.full_name}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
                  <User className="w-12 h-12" />
                  <span className="text-xs mt-1">No Photo</span>
                </div>
              )}
            </div>

            {/* Core Info */}
            <div className="flex-1 w-full space-y-2.5 text-center sm:text-left">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-stone-400">
                  {t.studentNameLabel}
                </span>
                <h3 className="text-xl font-extrabold text-stone-900 leading-tight">
                  {student.full_name}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 font-medium block">
                    {t.motherNameLabel}:
                  </span>
                  <span className="font-semibold text-stone-800 text-sm">
                    {student.mother_name}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 font-medium block">
                    {t.casteLabel}:
                  </span>
                  <span className="font-bold text-[#6C151E] text-sm">
                    {student.caste_category}
                  </span>
                </div>
              </div>

              {/* Clickable Mobile */}
              <div className="pt-1">
                <a
                  href={`tel:${student.mobile_number}`}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#0F3D3A] text-white text-xs font-semibold hover:bg-[#165551] transition-colors shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 text-[#F5DABF]" />
                  <span>
                    {t.clickToCall}: +91 {student.mobile_number}
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Academic Study IQ Metric */}
          <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E8CFB5] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#0F3D3A]">{t.academicProgress}</span>
              <span className="px-2 py-0.5 rounded bg-white border border-[#E8CFB5] text-[#6C151E]">
                {student.study_iq_score} / 100
              </span>
            </div>
            {/* Visual Meter Bar */}
            <div className="w-full bg-stone-200 h-3.5 rounded-full overflow-hidden p-0.5 border border-stone-300">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  student.study_iq_score >= 85
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                    : student.study_iq_score >= 70
                    ? "bg-gradient-to-r from-amber-500 to-yellow-600"
                    : "bg-gradient-to-r from-rose-500 to-red-600"
                }`}
                style={{ width: `${student.study_iq_score}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-stone-500 font-medium">
              <span>0 (Foundational)</span>
              <span>50 (Proficient)</span>
              <span>100 (Exemplary)</span>
            </div>
          </div>

          {/* Government Identification Numbers */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-extrabold text-[#6C151E] tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#6C151E]" />
              <span>Government Identity & U-DISE Records</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-stone-500 block mb-0.5 font-medium">{t.aadhaarLabel}</span>
                <span className="font-mono font-bold text-stone-900 text-sm tracking-wider">
                  {formatAadhaar(student.aadhaar_number)}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-stone-500 block mb-0.5 font-medium">{t.penIdLabel}</span>
                <span className="font-mono font-bold text-[#0F3D3A] text-sm tracking-wider">
                  {student.pen_id}
                </span>
              </div>
            </div>
          </div>

          {/* Bank Account Details */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-extrabold text-[#0F3D3A] tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#0F3D3A]" />
              <span>Scholarship & Direct Benefit Transfer (DBT) Bank Dossier</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-stone-500 block mb-0.5 font-medium">{t.bankNameLabel}</span>
                <span className="font-semibold text-stone-900 truncate block">
                  {student.bank_name || "Bank of Maharashtra"}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-stone-500 block mb-0.5 font-medium">{t.bankAccLabel}</span>
                <span className="font-mono font-semibold text-stone-900 truncate block">
                  {student.bank_account_no || "60XXXXXXXXXX"}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-stone-500 block mb-0.5 font-medium">{t.ifscLabel}</span>
                <span className="font-mono font-semibold text-stone-900 truncate block">
                  {student.bank_ifsc || "MAHB0000412"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 bg-stone-50 rounded-b-2xl border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg text-stone-700 hover:bg-stone-200 transition-colors"
          >
            {t.cancel}
          </button>

          <div className="flex items-center gap-2">
            {onOpenReportCard && (
              <button
                type="button"
                onClick={() => {
                  onOpenReportCard(student);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-[#D4AF37] hover:bg-[#C69214] text-stone-900 active:scale-95 transition-all shadow-sm"
              >
                <Award className="w-3.5 h-3.5" />
                <span>{language === "mr" ? "प्रगती पुस्तक (Report Card)" : "View Report Card"}</span>
              </button>
            )}

            {isFaculty && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(t.confirmDelete)) {
                      onDelete(student.id);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t.deleteStudent}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onEdit(student)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-[#6C151E] text-white hover:bg-[#851C27] active:scale-95 transition-all shadow-sm"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{t.editStudent}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

