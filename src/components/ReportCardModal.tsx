"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Student, ReportCardData } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { getStudentReportCard } from "@/lib/reportCardHelper";
import { SchoolLogo } from "@/components/ui/SchoolLogo";
import {
  X,
  Printer,
  Edit3,
  Save,
  Check,
  Award,
  Sparkles,
  Download,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

interface ReportCardModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveReportCard?: (studentId: string, updated: ReportCardData) => void;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({
  student,
  isOpen,
  onClose,
  onSaveReportCard,
}) => {
  const { language } = useLanguage();
  const { isFaculty } = useAuth();

  if (!isOpen || !student) return null;

  const initialData = getStudentReportCard(student);
  const [reportData, setReportData] = useState<ReportCardData>(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedComments, setEditedComments] = useState(
    language === "mr" ? initialData.teacher_comments_mr : initialData.teacher_comments
  );
  const [langPreference, setLangPreference] = useState<"mr" | "en">(
    language === "mr" ? "mr" : "en"
  );

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    const updated: ReportCardData = {
      ...reportData,
      ...(langPreference === "mr"
        ? { teacher_comments_mr: editedComments }
        : { teacher_comments: editedComments }),
    };
    setReportData(updated);
    setIsEditing(false);
    if (onSaveReportCard) {
      onSaveReportCard(student.id, updated);
    }
    toast.success(
      language === "mr" ? "प्रगती पत्रक जतन केले!" : "Report card remarks updated!"
    );
  };

  const isMr = langPreference === "mr";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200 print:p-0 print:bg-white print:fixed-none"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[96vh] flex flex-col overflow-hidden text-stone-900 border border-stone-300 print:shadow-none print:border-none print:max-w-none print:max-h-none print:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden when printing) */}
        <div className="bg-[#6C151E] text-white px-5 py-3 flex items-center justify-between shrink-0 print:hidden shadow-md">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#F5DABF]" />
            <h3 className="font-bold text-sm tracking-wide">
              {isMr ? "विद्यार्थी प्रगती पुस्तक" : "Official Student Report Card"}
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#4D0E15] text-[#F5DABF] border border-[#851C27]">
              GR #{student.register_number}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Language toggle inside report card */}
            <div className="flex bg-[#4D0E15] rounded-lg p-0.5 border border-[#851C27] text-xs">
              <button
                type="button"
                onClick={() => setLangPreference("mr")}
                className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                  isMr ? "bg-white text-[#6C151E]" : "text-stone-300 hover:text-white"
                }`}
              >
                मराठी
              </button>
              <button
                type="button"
                onClick={() => setLangPreference("en")}
                className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                  !isMr ? "bg-white text-[#6C151E]" : "text-stone-300 hover:text-white"
                }`}
              >
                English
              </button>
            </div>

            {/* Faculty Edit toggle */}
            {isFaculty && (
              <button
                type="button"
                onClick={() => {
                  if (isEditing) handleSave();
                  else setIsEditing(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-[#0F3D3A] hover:bg-[#165551] text-white transition-all shadow-sm"
              >
                {isEditing ? (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>{isMr ? "जतन करा" : "Save"}</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isMr ? "अभिप्राय संपादित करा" : "Edit Comments"}</span>
                  </>
                )}
              </button>
            )}

            {/* Print / Save PDF Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold rounded-lg bg-[#D4AF37] hover:bg-[#C69214] text-stone-900 transition-all shadow-sm"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isMr ? "प्रिंट / PDF" : "Print / PDF"}</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors ml-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Card Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#FAF7F2] print:p-0 print:bg-white">
          {/* A4 Proportion Card matching the user's reference exactly */}
          <div className="mx-auto bg-[#FFFDF9] border-2 border-[#D9C4B5] rounded-3xl p-6 sm:p-10 shadow-lg relative print:shadow-none print:border-2 print:border-stone-400 print:rounded-2xl print:w-full print:p-8 max-w-2xl">
            {/* Outer Decorative Inset Border */}
            <div className="absolute inset-3 border border-[#E3D3C6] rounded-2xl pointer-events-none" />

            {/* Corner Decorative Accents */}
            <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-[#B3937D]" />
            <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-[#B3937D]" />
            <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-[#B3937D]" />
            <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-[#B3937D]" />

            {/* Top Right Botanical Branch Accent (Matching reference image) */}
            <div className="absolute top-3 right-3 w-28 h-28 pointer-events-none opacity-40 overflow-hidden hidden sm:block">
              <svg viewBox="0 0 120 120" className="w-full h-full text-[#C48B71]">
                <path
                  d="M100,10 Q80,40 50,70 Q70,50 90,30"
                  fill="none"
                  stroke="#9E7667"
                  strokeWidth="1.5"
                />
                <circle cx="95" cy="18" r="4" fill="#D98A78" opacity="0.8" />
                <circle cx="85" cy="28" r="3.5" fill="#D98A78" opacity="0.7" />
                <circle cx="75" cy="42" r="3.5" fill="#D98A78" opacity="0.8" />
                <circle cx="65" cy="55" r="3" fill="#D98A78" opacity="0.7" />
                <path
                  d="M92,20 Q105,15 108,22 Q98,28 92,20 Z"
                  fill="#8F9E8B"
                  opacity="0.6"
                />
                <path
                  d="M82,30 Q92,28 95,35 Q86,38 82,30 Z"
                  fill="#8F9E8B"
                  opacity="0.6"
                />
                <path
                  d="M72,45 Q82,42 85,49 Q76,52 72,45 Z"
                  fill="#8F9E8B"
                  opacity="0.6"
                />
              </svg>
            </div>

            {/* Top Center Emblem & Pin (Matching reference) */}
            <div className="flex flex-col items-center justify-center text-center relative z-10 pt-1">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="w-8 h-px bg-[#D9C4B5]" />
                <div className="w-10 h-12 rounded-t-lg rounded-b-2xl border border-[#C4A999] bg-[#FFF8F2] flex items-center justify-center shadow-xs">
                  <div className="w-7 h-7 relative">
                    <SchoolLogo size="sm" />
                  </div>
                </div>
                <span className="w-8 h-px bg-[#D9C4B5]" />
              </div>

              {/* School Institutional Heading */}
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#6C151E]">
                {isMr
                  ? "जि.प. प्राथमिक शाळा शिलशेत, ता. मोखाडा, जि. पालघर"
                  : "ZP Primary School Shilshet, Tal. Mokhada, Dist. Palghar"}
              </p>
              <p className="text-[9px] font-mono text-stone-500 tracking-wider">
                U-DISE: 27361809501 • शासन मान्यताप्राप्त
              </p>

              {/* Main Title (High-end Serif Typography) */}
              <h1 className="text-3xl sm:text-4xl font-serif tracking-[0.2em] font-normal text-stone-900 mt-2">
                {isMr ? "प्रगती पुस्तक" : "REPORT CARD"}
              </h1>

              {/* Subtitle matching reference */}
              <p className="text-xs sm:text-sm font-serif italic text-stone-600 mt-1 tracking-wide">
                {isMr
                  ? "प्रगती, सातत्यपूर्ण प्रयत्न आणि सर्वांगीण विकास"
                  : "Celebrating progress, effort, and growth"}
              </p>

              <div className="w-16 h-px bg-[#D9C4B5] my-3" />
            </div>

            {/* Student Metadata Grid (Matching reference layout) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mt-4 text-xs font-serif relative z-10">
              {/* Left Column */}
              <div className="space-y-3">
                <div className="flex items-baseline gap-2 border-b border-[#E3D3C6] pb-1">
                  <span className="text-stone-500 font-sans text-[11px] font-semibold min-w-[85px]">
                    {isMr ? "विद्यार्थ्याचे नाव" : "Student Name"}
                  </span>
                  <span className="font-bold text-stone-900 text-sm font-serif truncate">
                    {student.full_name}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 border-b border-[#E3D3C6] pb-1">
                  <span className="text-stone-500 font-sans text-[11px] font-semibold min-w-[85px]">
                    {isMr ? "सत्र / परीक्षा" : "Term"}
                  </span>
                  <span className="text-stone-800 font-medium">
                    {isMr ? reportData.term_mr : reportData.term}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 border-b border-[#E3D3C6] pb-1">
                  <span className="text-stone-500 font-sans text-[11px] font-semibold min-w-[85px]">
                    {isMr ? "नोंदणी क्र. (GR)" : "GR Number"}
                  </span>
                  <span className="font-mono text-stone-800 font-semibold">
                    #{student.register_number}
                  </span>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                <div className="flex items-baseline gap-2 border-b border-[#E3D3C6] pb-1">
                  <span className="text-stone-500 font-sans text-[11px] font-semibold min-w-[65px]">
                    {isMr ? "इयत्ता" : "Class"}
                  </span>
                  <span className="font-bold text-stone-900 text-sm font-serif">
                    {isMr
                      ? `वर्ग ${student.class_standard} ला`
                      : `Standard ${student.class_standard}th`}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 border-b border-[#E3D3C6] pb-1">
                  <span className="text-stone-500 font-sans text-[11px] font-semibold min-w-[65px]">
                    {isMr ? "दिनांक" : "Date"}
                  </span>
                  <span className="text-stone-800 font-mono">
                    {reportData.issue_date}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 border-b border-[#E3D3C6] pb-1">
                  <span className="text-stone-500 font-sans text-[11px] font-semibold min-w-[65px]">
                    {isMr ? "उपस्थिती" : "Attendance"}
                  </span>
                  <span className="text-stone-800 font-semibold">
                    {reportData.attendance_days}
                  </span>
                </div>
              </div>
            </div>

            {/* Subject & Grade Table (Exact replica of reference table layout) */}
            <div className="mt-6 border border-[#E3D3C6] rounded-xl overflow-hidden bg-white shadow-xs relative z-10">
              <table className="w-full text-xs font-serif">
                <thead>
                  <tr className="bg-[#EEDFD5]/70 border-b border-[#D9C4B5] text-stone-800">
                    <th className="py-2.5 px-4 text-left font-serif font-bold tracking-wide w-3/4 border-r border-[#D9C4B5]">
                      {isMr ? "विषय (Subject)" : "Subject"}
                    </th>
                    <th className="py-2.5 px-4 text-center font-serif font-bold tracking-wide w-1/4">
                      {isMr ? "श्रेणी (Grade)" : "Grade"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEDFD5]">
                  {reportData.evaluations.map((item, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? "bg-white" : "bg-[#FAF7F2]/50"}
                    >
                      <td className="py-2.5 px-4 text-stone-800 border-r border-[#EEDFD5]">
                        <span className="font-semibold block text-[13px]">
                          {isMr ? item.subject_mr : item.subject}
                        </span>
                        <span className="text-[10px] text-stone-500 font-sans">
                          {isMr ? item.subject : item.subject_mr}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <span
                          className={`inline-block font-sans font-bold px-3 py-1 rounded-md text-xs ${
                            item.grade === "A+"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : item.grade === "A"
                              ? "bg-teal-50 text-teal-800 border border-teal-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {item.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Teacher Comments Box with Ornate Inset Corners (Matching reference) */}
            <div className="mt-6 relative z-10">
              <div className="border border-[#D4BFB0] rounded-xl p-4 bg-[#FFFDF9] relative">
                {/* Decorative corner notch dots matching image */}
                <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-[#B3937D]" />
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#B3937D]" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-[#B3937D]" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-[#B3937D]" />

                <h4 className="text-xs font-serif font-bold text-stone-800 tracking-wide mb-2 flex items-center justify-between">
                  <span>{isMr ? "शिक्षकांचा अभिप्राय (Teacher Comments)" : "Teacher Comments"}</span>
                  {isFaculty && !isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="print:hidden text-[10px] font-sans text-[#6C151E] hover:underline flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{isMr ? "संपादित करा" : "Edit"}</span>
                    </button>
                  )}
                </h4>

                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      value={editedComments}
                      onChange={(e) => setEditedComments(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#6C151E] font-serif bg-white"
                      placeholder="Enter personalized teacher feedback..."
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-2.5 py-1 text-xs rounded text-stone-600 hover:bg-stone-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
                        className="px-3 py-1 text-xs font-bold rounded bg-[#0F3D3A] text-white hover:bg-[#165551]"
                      >
                        Save Comments
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs sm:text-[13px] font-serif italic text-stone-700 leading-relaxed min-h-[42px]">
                    &ldquo;{isMr ? reportData.teacher_comments_mr : reportData.teacher_comments}&rdquo;
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Section: Floral Sprig Emblem & Signatures (Matching reference) */}
            <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
              {/* Left: School Stamp / Seal */}
              <div className="text-center sm:text-left order-3 sm:order-1">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#C4A999] flex flex-col items-center justify-center p-1 text-[8px] text-stone-400 font-serif leading-tight">
                  <span className="font-bold text-[#6C151E]">जि.प. शाळा शिलशेत</span>
                  <span>मोखाडा, पालघर</span>
                  <span className="font-mono text-[7px] mt-0.5">शालेय शिक्का</span>
                </div>
              </div>

              {/* Center: Delicate Leaf Ornament matching reference image */}
              <div className="flex items-center gap-2 text-[#9E7667] order-1 sm:order-2">
                <span className="w-8 h-px bg-[#D9C4B5]" />
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-[#8F9E8B] fill-current"
                >
                  <path d="M12,2 C10,6 6,8 3,9 C6,11 9,13 10,17 C11,13 14,11 17,9 C14,8 12,6 12,2 Z" />
                  <circle cx="12" cy="18" r="1.5" fill="#C48B71" />
                </svg>
                <span className="w-8 h-px bg-[#D9C4B5]" />
              </div>

              {/* Right: Teacher Signature line matching reference */}
              <div className="text-center sm:text-right order-2 sm:order-3 min-w-[160px]">
                <div className="w-40 border-b border-stone-800 mx-auto sm:ml-auto pb-1 mb-1 text-center">
                  <span className="font-serif italic text-xs text-stone-700 block">
                    {isMr ? reportData.teacher_name_mr : reportData.teacher_name}
                  </span>
                </div>
                <span className="text-[11px] font-serif text-stone-600 block">
                  {isMr ? "वर्गशिक्षक स्वाक्षरी" : "Teacher Signature"}
                </span>
              </div>
            </div>

            {/* Bottom Sub-footer */}
            <div className="text-center mt-6 pt-2 border-t border-[#E3D3C6]/60 text-[9px] text-stone-400 font-sans">
              <span>
                ZP Primary School Shilshet • Digital Academic Record • Celebrating Every Child&apos;s Unique Potential
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

