"use client";

import React, { useState, useEffect } from "react";
import { Inquiry } from "@/types";
import { getInquiries, submitInquiry, updateInquiryStatus } from "@/lib/dataService";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import {
  HelpCircle,
  Phone,
  User,
  Send,
  CheckCircle2,
  Clock,
  CheckCircle,
  XCircle,
  FileCheck,
  Calendar,
  ShieldCheck,
  Filter,
  Loader2,
} from "lucide-react";

export default function InquiriesPage() {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();

  // Inquiry Intake Form State
  const [studentName, setStudentName] = useState("");
  const [parentName, setParentName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [applyingForClass, setApplyingForClass] = useState<number>(1);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Faculty Review State
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const data = await getInquiries();
      setInquiries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  // Handle Form Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName.trim() || !parentName.trim()) {
      toast.error(language === "mr" ? "कृपया सर्व आवश्यक नावे भरा." : "Please provide student and parent names.");
      return;
    }

    const cleanMobile = contactNumber.replace(/\D/g, "");
    if (cleanMobile.length !== 10) {
      toast.error(language === "mr" ? "मोबाईल क्रमांक १० अंकांचा असावा." : "Mobile must be strictly 10 digits.");
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await submitInquiry({
        student_name: studentName.trim(),
        parent_name: parentName.trim(),
        contact_number: cleanMobile,
        applying_for_class: Number(applyingForClass),
        message: message.trim() || undefined,
      });

      setInquiries((prev) => [created, ...prev]);
      setFormSubmitted(true);
      toast.success(t.inquirySuccess);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Reset
      setStudentName("");
      setParentName("");
      setContactNumber("");
      setMessage("");
    } catch (err) {
      console.error(err);
      toast.error(language === "mr" ? "अर्ज पाठवताना अडचण आली." : "Failed to submit inquiry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update Status handler
  const handleStatusChange = async (id: string, newStatus: Inquiry["status"]) => {
    try {
      await updateInquiryStatus(id, newStatus);
      setInquiries((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));
      toast.success(
        language === "mr" ? `स्थिती बदलून '${newStatus}' केली.` : `Status updated to ${newStatus}.`
      );
    } catch (err) {
      console.error(err);
      toast.error(language === "mr" ? "स्थिती बदलता आली नाही." : "Failed to update status.");
    }
  };

  const filteredInquiries = inquiries.filter(
    (inq) => statusFilter === "all" || inq.status === statusFilter
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-12">
      {/* Title */}
      <div className="border-b border-stone-200 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#6C151E] uppercase tracking-wider mb-1">
          <HelpCircle className="w-4 h-4 text-[#6C151E]" />
          <span>{language === "mr" ? "प्रवेश प्रक्रिया व संपर्क केंद्र" : "Admission Intake & Desk"}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
          {t.inquiryTitle}
        </h1>
        <p className="text-xs md:text-sm text-stone-600 mt-1 max-w-2xl">
          {t.inquirySubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: PUBLIC INQUIRY INTAKE FORM */}
        <div className="lg:col-span-6 bg-white p-6 md:p-8 rounded-2xl border-2 border-[#E8CFB5] shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[#6C151E]">
              {language === "mr" ? "नवीन प्रवेश / चौकशी अर्ज" : "Apply for Admission (Classes 1 to 5)"}
            </h2>
            <p className="text-xs text-stone-600">
              {language === "mr"
                ? "इयत्ता १ ली ते ५ वी मध्ये प्रवेशासाठी पालकांनी खालील माहिती भरावी. शाळा प्रशासन थेट संपर्क साधेल."
                : "Free and compulsory elementary education under RTE. Fill details below for fast processing."}
            </p>
          </div>

          {formSubmitted && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{language === "mr" ? "अर्ज प्राप्त झाला!" : "Inquiry Registered!"}</p>
                <p className="mt-0.5">{t.inquirySuccess}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {t.inquiryStudentName} *
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Mayur Somnath Shinde"
                className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#6C151E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {t.inquiryParentName} *
              </label>
              <input
                type="text"
                required
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="e.g. Somnath Shinde"
                className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#6C151E]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.inquiryMobile} (10 Digits) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value.replace(/\D/g, ""))}
                  placeholder="9823124567"
                  className="w-full px-3.5 py-2.5 text-xs font-mono rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#6C151E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.inquiryClass} *
                </label>
                <select
                  value={applyingForClass}
                  onChange={(e) => setApplyingForClass(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#6C151E]"
                >
                  <option value={1}>{t.class1}</option>
                  <option value={2}>{t.class2}</option>
                  <option value={3}>{t.class3}</option>
                  <option value={4}>{t.class4}</option>
                  <option value={5}>{t.class5}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {t.inquiryMessage}
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Provide residential village / pada, prior school if any, or specific questions..."
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#6C151E]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#6C151E] hover:bg-[#851C27] text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>{t.inquirySubmit}</span>
            </button>
          </form>

          {/* RTE Free Education badge */}
          <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8CFB5] flex items-center gap-3 text-xs text-stone-700">
            <ShieldCheck className="w-5 h-5 text-[#0F3D3A] shrink-0" />
            <span>
              {language === "mr"
                ? "बालकांचा मोफत व सक्तीच्या शिक्षणाचा अधिकार (RTE) अंतर्गत १ ली ते ५ वी चे शिक्षण, मोफत पाठ्यपुस्तके व पोषण आहार उपलब्ध."
                : "Government certified rural school providing free education, nutritious Mid-Day Meal, and free textbook kits."}
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: FACULTY ADMISSION REVIEW CONSOLE */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0F3D3A] text-white p-5 rounded-2xl flex items-center justify-between shadow-md">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5DABF]">
                {language === "mr" ? "मुख्याध्यापक व शिक्षक डॅशबोर्ड" : "Faculty Review Console"}
              </span>
              <h2 className="text-base font-bold">{t.inquiriesReviewTitle}</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#165551] text-xs font-bold text-[#F5DABF]">
              {inquiries.length} {language === "mr" ? "अर्ज" : "Inquiries"}
            </span>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {["all", "pending", "contacted", "enrolled", "rejected"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${
                  statusFilter === st
                    ? "bg-[#6C151E] text-white border-[#6C151E]"
                    : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* List of Inquiries */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white p-5 rounded-xl border border-stone-200 h-28 animate-pulse" />
              ))}
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-stone-200 text-center text-xs text-stone-500">
              {language === "mr" ? "या फिल्टरसाठी कोणतेही अर्ज नाहीत." : "No inquiries match this status filter."}
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {filteredInquiries.map((inq) => {
                const dateStr = new Date(inq.created_at).toLocaleDateString(
                  language === "mr" ? "mr-IN" : "en-US",
                  { month: "short", day: "numeric", year: "numeric" }
                );

                return (
                  <div
                    key={inq.id}
                    className="bg-white p-4 rounded-xl border border-stone-200/90 hover:border-stone-300 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-stone-900 text-sm">{inq.student_name}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF7F2] text-[#6C151E] border border-[#E8CFB5]">
                            {language === "mr" ? `इयत्ता ${inq.applying_for_class}` : `Class ${inq.applying_for_class}`}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500">
                          {language === "mr" ? "पालक:" : "Parent:"}{" "}
                          <strong className="text-stone-700">{inq.parent_name}</strong>
                        </p>
                      </div>

                      {/* Status Tag */}
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold capitalize ${
                          inq.status === "enrolled"
                            ? "bg-emerald-100 text-emerald-800"
                            : inq.status === "contacted"
                            ? "bg-sky-100 text-sky-800"
                            : inq.status === "rejected"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {inq.status}
                      </span>
                    </div>

                    {inq.message && (
                      <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                        {inq.message}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs">
                      {/* Clickable Mobile */}
                      <a
                        href={`tel:${inq.contact_number}`}
                        className="inline-flex items-center gap-1.5 text-stone-700 hover:text-[#6C151E] font-medium"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#0F3D3A]" />
                        <span className="font-mono">+91 {inq.contact_number}</span>
                      </a>

                      {/* Status update buttons */}
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-stone-400 mr-1">Status:</span>
                        <select
                          value={inq.status}
                          onChange={(e) => handleStatusChange(inq.id, e.target.value as Inquiry["status"])}
                          className="text-[11px] font-semibold py-1 px-2 rounded border border-stone-300 bg-white focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="contacted">Contacted</option>
                          <option value="enrolled">Enrolled</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
