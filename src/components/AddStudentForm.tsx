"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Student } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { uploadStudentPhoto } from "@/lib/supabase";
import { toast } from "sonner";
import {
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  Save,
  User,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

interface AddStudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (studentData: Omit<Student, "id" | "created_at" | "updated_at">, id?: string) => Promise<void>;
  initialData?: Student | null;
}

export const AddStudentForm: React.FC<AddStudentFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const { t, language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [classStandard, setClassStandard] = useState<number>(1);
  const [fullName, setFullName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [penId, setPenId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [bankName, setBankName] = useState("Bank of Maharashtra");
  const [bankAccountNo, setBankAccountNo] = useState("");
  const [bankIfsc, setBankIfsc] = useState("MAHB0000412");
  const [casteCategory, setCasteCategory] = useState("ST");
  const [studyIqScore, setStudyIqScore] = useState<number>(75);
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync initialData when editing
  useEffect(() => {
    if (initialData) {
      setClassStandard(initialData.class_standard || 1);
      setFullName(initialData.full_name || "");
      setMotherName(initialData.mother_name || "");
      setRegisterNumber(initialData.register_number || "");
      setAadhaarNumber(initialData.aadhaar_number || "");
      setPenId(initialData.pen_id || "");
      setMobileNumber(initialData.mobile_number || "");
      setBankName(initialData.bank_name || "Bank of Maharashtra");
      setBankAccountNo(initialData.bank_account_no || "");
      setBankIfsc(initialData.bank_ifsc || "MAHB0000412");
      setCasteCategory(initialData.caste_category || "ST");
      setStudyIqScore(initialData.study_iq_score ?? 75);
      setPhotoUrl(initialData.photo_url || "");
    } else {
      // Reset form
      setClassStandard(1);
      setFullName("");
      setMotherName("");
      setRegisterNumber("");
      setAadhaarNumber("");
      setPenId("273618095");
      setMobileNumber("");
      setBankName("Bank of Maharashtra");
      setBankAccountNo("");
      setBankIfsc("MAHB0000412");
      setCasteCategory("ST");
      setStudyIqScore(75);
      setPhotoUrl("");
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Validation functions
  const validate = () => {
    const errs: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 3) {
      errs.fullName = language === "mr" ? "विद्यार्थ्याचे पूर्ण नाव आवश्यक आहे (किमान ३ अक्षरे)." : "Full name is required (min 3 chars).";
    }

    if (!motherName.trim()) {
      errs.motherName = language === "mr" ? "आईचे नाव आवश्यक आहे." : "Mother's name is required.";
    }

    // Register Number: 3-4 digits strictly validated
    const regClean = registerNumber.trim();
    if (!/^\d{3,4}$/.test(regClean)) {
      errs.registerNumber = language === "mr" ? "जी.आर. नंबर ३ ते ४ अंकी संख्या असावा." : "GR number must be 3 to 4 digits.";
    }

    // Aadhaar Number: strictly 12 digits
    const aadhaarClean = aadhaarNumber.replace(/\D/g, "");
    if (aadhaarClean.length !== 12) {
      errs.aadhaarNumber = language === "mr" ? "आधार क्रमांक बरोबर १२ अंकांचा असावा." : "Aadhaar must be strictly 12 digits.";
    }

    // PEN ID: strictly 11 alphanumeric digits
    const penClean = penId.trim();
    if (!/^[A-Za-z0-9]{11}$/.test(penClean)) {
      errs.penId = language === "mr" ? "पेन (PEN) आयडी अचूक ११ अंकी असावा." : "PEN ID must be strictly 11 alphanumeric characters.";
    }

    // Mobile Number: strictly 10 digits
    const mobClean = mobileNumber.replace(/\D/g, "");
    if (mobClean.length !== 10) {
      errs.mobileNumber = language === "mr" ? "मोबाईल क्रमांक १० अंकांचा असावा." : "Mobile must be strictly 10 digits.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(language === "mr" ? "कृपया वैध फोटो फाईल निवडा" : "Please select an image file");
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const uploadedUrl = await uploadStudentPhoto(file);
      setPhotoUrl(uploadedUrl);
      toast.success(language === "mr" ? "पासपोर्ट फोटो अपलोड झाला!" : "Passport photo uploaded!");
    } catch (err) {
      console.error(err);
      toast.error(language === "mr" ? "फोटो अपलोड अयशस्वी" : "Photo upload failed");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error(language === "mr" ? "कृपया फॉर्ममधील त्रुटी तपासा." : "Please correct form validation errors.");
      return;
    }

    setIsSubmitting(true);
    try {
      const studentPayload: Omit<Student, "id" | "created_at" | "updated_at"> = {
        class_standard: Number(classStandard),
        full_name: fullName.trim(),
        mother_name: motherName.trim(),
        register_number: registerNumber.trim(),
        aadhaar_number: aadhaarNumber.replace(/\D/g, ""),
        pen_id: penId.trim(),
        mobile_number: mobileNumber.replace(/\D/g, ""),
        bank_name: bankName.trim(),
        bank_account_no: bankAccountNo.trim(),
        bank_ifsc: bankIfsc.trim().toUpperCase(),
        caste_category: casteCategory,
        study_iq_score: Number(studyIqScore),
        photo_url: photoUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80",
      };

      await onSave(studentPayload, initialData?.id);
      toast.success(
        initialData
          ? (language === "mr" ? "विद्यार्थी नोंद यशस्वीरित्या अद्ययावत केली!" : "Student record updated successfully!")
          : (language === "mr" ? "नवीन विद्यार्थी नोंद यशस्वीरित्या जोडली!" : "New student record created successfully!")
      );
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(language === "mr" ? "नोंद जतन करताना त्रुटी आली." : "Failed to save student record.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl border-2 border-[#E8CFB5] w-full max-w-3xl max-h-[92vh] overflow-y-auto text-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Form Header */}
        <div className="bg-[#6C151E] text-white p-5 rounded-t-2xl flex items-center justify-between sticky top-0 z-10 border-b-2 border-[#D4AF37]/50">
          <div>
            <h2 className="text-lg font-bold">
              {initialData ? t.editStudent : t.addStudentBtn}
            </h2>
            <p className="text-xs text-[#F5DABF]">
              {language === "mr"
                ? "इयत्ता १ ली ते ५ वी डिजिटल नोंदवही फॉर्म"
                : "Classes 1–5 Digital Register Record Engine"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Photo & Class Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-[#FAF7F2] border border-[#E8CFB5]">
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-24 h-28 rounded-lg overflow-hidden border-2 border-[#6C151E] bg-white shadow-sm flex items-center justify-center">
                {isUploadingPhoto ? (
                  <Loader2 className="w-6 h-6 animate-spin text-[#6C151E]" />
                ) : photoUrl ? (
                  <Image src={photoUrl} alt="Preview" fill className="object-cover" />
                ) : (
                  <User className="w-10 h-10 text-stone-300" />
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
                className="text-[11px] font-semibold px-2.5 py-1 rounded bg-[#0F3D3A] text-white hover:bg-[#165551] flex items-center gap-1 transition-colors"
              >
                <Upload className="w-3 h-3" />
                <span>{language === "mr" ? "फोटो निवडा" : "Upload 1:1 Photo"}</span>
              </button>
            </div>

            <div className="flex-1 w-full space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {language === "mr" ? "इयत्ता / वर्ग निवड" : "Class Standard (1–5)"} *
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setClassStandard(cls)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        classStandard === cls
                          ? "bg-[#6C151E] text-white border-[#6C151E] shadow-sm"
                          : "bg-white text-stone-700 border-stone-300 hover:border-stone-400"
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.casteLabel} *
                </label>
                <select
                  value={casteCategory}
                  onChange={(e) => setCasteCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#6C151E]"
                >
                  <option value="ST">ST (Scheduled Tribe / अनुसूचित जमाती)</option>
                  <option value="SC">SC (Scheduled Caste / अनुसूचित जाती)</option>
                  <option value="OBC">OBC (Other Backward Class / इतर मागासवर्गीय)</option>
                  <option value="VJNT">VJNT (Vimukta Jati & Nomadic Tribes / विमुक्त जाती व भटक्या जमाती)</option>
                  <option value="SBC">SBC (Special Backward Category / विशेष मागास प्रवर्ग)</option>
                  <option value="General">General / Open (सर्वसाधारण)</option>
                  <option value="EWS">EWS (Economically Weaker Section)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Student Names & Basic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {t.studentNameLabel} *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Aarav Suresh Baraf"
                className={`w-full px-3 py-2 text-xs rounded-lg border bg-white focus:outline-none focus:ring-2 ${
                  errors.fullName ? "border-rose-500 focus:ring-rose-500" : "border-stone-300 focus:ring-[#6C151E]"
                }`}
              />
              {errors.fullName && <p className="text-[11px] text-rose-600 mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {t.motherNameLabel} *
              </label>
              <input
                type="text"
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
                placeholder="e.g. Savitri Suresh Baraf"
                className={`w-full px-3 py-2 text-xs rounded-lg border bg-white focus:outline-none focus:ring-2 ${
                  errors.motherName ? "border-rose-500 focus:ring-rose-500" : "border-stone-300 focus:ring-[#6C151E]"
                }`}
              />
              {errors.motherName && <p className="text-[11px] text-rose-600 mt-1">{errors.motherName}</p>}
            </div>
          </div>

          {/* GR Number, Aadhaar, PEN, Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {t.grNoLabel} (3–4 Digits) *
              </label>
              <input
                type="text"
                maxLength={4}
                value={registerNumber}
                onChange={(e) => setRegisterNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="1042"
                className={`w-full px-3 py-2 text-xs rounded-lg border font-mono bg-white focus:outline-none focus:ring-2 ${
                  errors.registerNumber ? "border-rose-500 focus:ring-rose-500" : "border-stone-300 focus:ring-[#6C151E]"
                }`}
              />
              {errors.registerNumber && <p className="text-[11px] text-rose-600 mt-1">{errors.registerNumber}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {t.aadhaarLabel} (12 Digits) *
              </label>
              <input
                type="text"
                maxLength={12}
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="482910482910"
                className={`w-full px-3 py-2 text-xs rounded-lg border font-mono bg-white focus:outline-none focus:ring-2 ${
                  errors.aadhaarNumber ? "border-rose-500 focus:ring-rose-500" : "border-stone-300 focus:ring-[#6C151E]"
                }`}
              />
              {errors.aadhaarNumber && <p className="text-[11px] text-rose-600 mt-1">{errors.aadhaarNumber}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {t.penIdLabel} (11 Chars) *
              </label>
              <input
                type="text"
                maxLength={11}
                value={penId}
                onChange={(e) => setPenId(e.target.value.toUpperCase())}
                placeholder="27361809501"
                className={`w-full px-3 py-2 text-xs rounded-lg border font-mono bg-white focus:outline-none focus:ring-2 ${
                  errors.penId ? "border-rose-500 focus:ring-rose-500" : "border-stone-300 focus:ring-[#6C151E]"
                }`}
              />
              {errors.penId && <p className="text-[11px] text-rose-600 mt-1">{errors.penId}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {t.mobileLabel} (10 Digits) *
              </label>
              <input
                type="text"
                maxLength={10}
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="9823412091"
                className={`w-full px-3 py-2 text-xs rounded-lg border font-mono bg-white focus:outline-none focus:ring-2 ${
                  errors.mobileNumber ? "border-rose-500 focus:ring-rose-500" : "border-stone-300 focus:ring-[#6C151E]"
                }`}
              />
              {errors.mobileNumber && <p className="text-[11px] text-rose-600 mt-1">{errors.mobileNumber}</p>}
            </div>
          </div>

          {/* Bank Details */}
          <div className="space-y-3 pt-2 border-t border-stone-200">
            <h4 className="text-xs uppercase font-extrabold text-[#0F3D3A] tracking-wider">
              {language === "mr" ? "बँक खाते व डीबीटी शिष्यवृत्ती तपशील" : "Bank Account & DBT Scholarship Details"}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">{t.bankNameLabel}</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Bank of Maharashtra"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F3D3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">{t.bankAccLabel}</label>
                <input
                  type="text"
                  value={bankAccountNo}
                  onChange={(e) => setBankAccountNo(e.target.value)}
                  placeholder="60412890312"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 font-mono bg-white focus:outline-none focus:ring-2 focus:ring-[#0F3D3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">{t.ifscLabel}</label>
                <input
                  type="text"
                  value={bankIfsc}
                  onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                  placeholder="MAHB0000412"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 font-mono bg-white focus:outline-none focus:ring-2 focus:ring-[#0F3D3A]"
                />
              </div>
            </div>
          </div>

          {/* Academic Study IQ Slider */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                {t.iqScoreLabel}
              </label>
              <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E8CFB5] text-[#6C151E]">
                {studyIqScore} / 100
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={studyIqScore}
              onChange={(e) => setStudyIqScore(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#6C151E]"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg text-stone-600 hover:bg-stone-100 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg bg-[#6C151E] text-white hover:bg-[#851C27] active:scale-95 transition-all shadow-md disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{initialData ? t.saveChanges : t.addStudentBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

