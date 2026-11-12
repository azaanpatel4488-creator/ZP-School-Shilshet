"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SchoolLogo } from "@/components/ui/SchoolLogo";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  Loader2,
  KeyRound,
  GraduationCap,
  Users,
  UserCheck,
  Hash,
  Phone,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const {
    isAuthenticated,
    isFaculty,
    isParent,
    facultyLogin,
    facultySignUp,
    parentLogin,
    parentSignUp,
    quickDemoLogin,
  } = useAuth();

  // Tabs
  const [role, setRole] = useState<"faculty" | "parent">("faculty");
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  // Faculty fields
  const [schoolEmail, setSchoolEmail] = useState("zpshilshet@gmail.com");
  const [facultyEmail, setFacultyEmail] = useState("patelakbar1679@gmail.com");
  const [facultyPassword, setFacultyPassword] = useState("");

  // Parent fields
  const [grNumber, setGrNumber] = useState("");
  const [last6Mobile, setLast6Mobile] = useState("");
  const [parentPassword, setParentPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated) {
      router.push(isFaculty ? "/students" : "/students");
    }
  }, [isAuthenticated, isFaculty, router]);

  // Handle Faculty Submit
  const handleFacultySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === "signup") {
        const res = await facultySignUp(
          schoolEmail,
          facultyEmail,
          facultyPassword,
          "Shri. Akbar Patel (Faculty)"
        );
        if (res.success) {
          toast.success(
            language === "mr"
              ? "शिक्षक नोंदणी व पासवर्ड यशस्वीरित्या सेट केला!"
              : "Faculty account activated and permanent password created!"
          );
          router.push("/students");
        } else {
          toast.error(res.error || "Activation failed.");
        }
      } else {
        const res = await facultyLogin(schoolEmail, facultyEmail, facultyPassword);
        if (res.success) {
          toast.success(
            language === "mr"
              ? "शिक्षक प्रवेश यशस्वी! स्वागत आहे."
              : "Faculty authentication successful! Welcome."
          );
          router.push("/students");
        } else {
          toast.error(res.error || "Login failed.");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Parent Submit
  const handleParentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === "signup") {
        const res = await parentSignUp(grNumber, last6Mobile, parentPassword);
        if (res.success) {
          toast.success(
            language === "mr"
              ? "पालक नोंदणी यशस्वी! पासवर्ड सेट केला."
              : "Parent account verified and password created successfully!"
          );
          router.push("/students");
        } else {
          toast.error(res.error || "Verification failed.");
        }
      } else {
        const res = await parentLogin(grNumber, parentPassword);
        if (res.success) {
          toast.success(
            language === "mr"
              ? "पालक प्रवेश यशस्वी! स्वागत आहे."
              : "Parent login successful! Welcome."
          );
          router.push("/students");
        } else {
          toast.error(res.error || "Login failed.");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center px-4 py-12 bg-[#FAF7F2]">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border-2 border-[#E8CFB5] overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#6C151E] text-white p-6 text-center space-y-3 relative">
          <div className="flex justify-center">
            <SchoolLogo size="lg" className="border-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              {language === "mr" ? "शालेय अधिकृत प्रवेश पोर्टल" : "ZP Shilshet Access Portal"}
            </h1>
            <p className="text-xs text-[#F5DABF] mt-1">
              {language === "mr"
                ? "शिक्षक आणि विद्यार्थी/पालकांसाठी सुरक्षित डिजिटल प्रवेश"
                : "Secure Digital Gateway for Faculty & Student-Parents"}
            </p>
          </div>

          {/* Role Segmented Switcher */}
          <div className="pt-2 flex rounded-xl bg-[#4D0E15] p-1 border border-[#851C27]">
            <button
              type="button"
              onClick={() => {
                setRole("faculty");
                setMode("signin");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                role === "faculty"
                  ? "bg-white text-[#6C151E] shadow-sm"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{language === "mr" ? "शिक्षक (Faculty)" : "Faculty Desk"}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRole("parent");
                setMode("signin");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                role === "parent"
                  ? "bg-white text-[#6C151E] shadow-sm"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{language === "mr" ? "पालक / विद्यार्थी" : "Student / Parent"}</span>
            </button>
          </div>
        </div>

        {/* Mode Toggle Bar: Sign In vs First-Time Sign Up */}
        <div className="flex border-b border-stone-200 bg-stone-50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              mode === "signin"
                ? "border-[#6C151E] text-[#6C151E] bg-white font-bold"
                : "border-transparent text-stone-600 hover:text-stone-900"
            }`}
          >
            {language === "mr" ? "प्रवेश (Sign In)" : "Sign In / Log In"}
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              mode === "signup"
                ? "border-[#6C151E] text-[#6C151E] bg-white font-bold"
                : "border-transparent text-stone-600 hover:text-stone-900"
            }`}
          >
            {language === "mr" ? "नवीन नोंदणी (First-Time Activation)" : "First-Time Activation / Sign Up"}
          </button>
        </div>

        {/* Form Container */}
        <div className="p-6 md:p-8 space-y-6">
          {/* FACULTY FORM */}
          {role === "faculty" && (
            <form onSubmit={handleFacultySubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8CFB5] text-[11px] text-stone-700">
                <span className="font-bold text-[#6C151E]">
                  {language === "mr" ? "शिक्षक ओळख पडताळणी:" : "Faculty Verification:"}
                </span>{" "}
                {mode === "signup"
                  ? language === "mr"
                    ? "शाळेचा ई-मेल व आपला अधिकृत ई-मेल टाकून आपला कायमस्वरूपी पासवर्ड सेट करा."
                    : "Enter school email and your official faculty email to set your permanent password."
                  : language === "mr"
                  ? "शाळेचा ई-मेल, आपला ई-मेल आणि पासवर्ड वापरून लॉगिन करा."
                  : "Enter school email, faculty email, and your secure password to log in."}
              </div>

              {/* School Official Email */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {language === "mr" ? "शाळेचा अधिकृत ई-मेल" : "Official School Email"} *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={schoolEmail}
                    onChange={(e) => setSchoolEmail(e.target.value)}
                    placeholder="zpshilshet@gmail.com"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-stone-300 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-[#6C151E]"
                  />
                </div>
              </div>

              {/* Faculty Personal/Official Email */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {language === "mr" ? "शिक्षकांचा अधिकृत ई-मेल" : "Faculty Official Email"} *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={facultyEmail}
                    onChange={(e) => setFacultyEmail(e.target.value)}
                    placeholder="patelakbar1679@gmail.com"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-stone-300 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-[#6C151E]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {mode === "signup"
                    ? language === "mr"
                      ? "नवीन पासवर्ड सेट करा (किमान ६ अक्षरे)"
                      : "Create Secure Permanent Password (6+ chars)"
                    : language === "mr"
                    ? "गोपनीय पासवर्ड"
                    : "Secure Access Password"} *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={facultyPassword}
                    onChange={(e) => setFacultyPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#6C151E]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#6C151E] hover:bg-[#851C27] text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <KeyRound className="w-4 h-4" />
                )}
                <span>
                  {mode === "signup"
                    ? language === "mr"
                      ? "पासवर्ड सेट करा व सुरू करा"
                      : "Set Password & Complete Setup"
                    : language === "mr"
                    ? "शिक्षक पोर्टलमध्ये प्रवेश करा"
                    : "Authenticate as Faculty"}
                </span>
              </button>
            </form>
          )}

          {/* PARENT / STUDENT FORM */}
          {role === "parent" && (
            <form onSubmit={handleParentSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-[#E8F2F1] border border-[#0F3D3A]/20 text-[11px] text-stone-700">
                <span className="font-bold text-[#0F3D3A]">
                  {language === "mr" ? "पालक प्रवेश पडताळणी:" : "Parent Portal Access:"}
                </span>{" "}
                {mode === "signup"
                  ? language === "mr"
                    ? "विद्यार्थ्याचा जनरल रजिस्टर (GR) नंबर आणि नोंदणीकृत मोबाईलचे शेवटचे ६ अंक टाकून पासवर्ड तयार करा."
                    : "Enter your child's GR Number and the last 6 digits of your registered mobile number to create your password."
                  : language === "mr"
                  ? "विद्यार्थ्याचा GR नंबर आणि पासवर्ड टाकून लॉगिन करा."
                  : "Enter your child's GR Number and password to access class homework & progress."}
              </div>

              {/* Student GR Number */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {language === "mr" ? "विद्यार्थी जनरल रजिस्टर (GR) नंबर" : "Student Register / GR Number"} *
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={grNumber}
                    onChange={(e) => setGrNumber(e.target.value.replace(/\D/g, ""))}
                    placeholder="e.g. 1041"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-stone-300 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-[#0F3D3A]"
                  />
                </div>
              </div>

              {/* If Sign Up mode: require last 6 digits of mobile */}
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {language === "mr"
                      ? "पालकांच्या मोबाईलचे शेवटचे ६ अंक"
                      : "Last 6 Digits of Parent Mobile"} *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={last6Mobile}
                      onChange={(e) => setLast6Mobile(e.target.value.replace(/\D/g, ""))}
                      placeholder="e.g. 412091"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-stone-300 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-[#0F3D3A]"
                    />
                  </div>
                </div>
              )}

              {/* Password / PIN */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {mode === "signup"
                    ? language === "mr"
                      ? "आपला गोपनीय पासवर्ड / पिन सेट करा"
                      : "Create Your Secret Password / PIN (4+ chars)"
                    : language === "mr"
                    ? "गोपनीय पासवर्ड / पिन"
                    : "Password / PIN"} *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={parentPassword}
                    onChange={(e) => setParentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F3D3A]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0F3D3A] hover:bg-[#165551] text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UserCheck className="w-4 h-4" />
                )}
                <span>
                  {mode === "signup"
                    ? language === "mr"
                      ? "नोंदणी पूर्ण करा व सुरू करा"
                      : "Verify & Create Account"
                    : language === "mr"
                    ? "पालक डॅशबोर्ड उघडा"
                    : "Sign In to Parent Portal"}
                </span>
              </button>
            </form>
          )}

          {/* Quick-Fill Helpers for Reviewer Testing */}
          <div className="pt-4 border-t border-stone-200 space-y-2">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              ⚡ Quick Testing Shortcuts:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setRole("faculty");
                  setMode("signin");
                  setSchoolEmail("zpshilshet@gmail.com");
                  setFacultyEmail("patelakbar1679@gmail.com");
                  setFacultyPassword("shilshet2026");
                }}
                className="p-2 rounded-lg bg-stone-100 hover:bg-[#6C151E]/10 hover:text-[#6C151E] text-stone-700 font-semibold border border-stone-300 text-left transition-colors"
              >
                <p className="font-bold text-[11px]">Fill Faculty</p>
                <p className="text-[10px] text-stone-500 font-mono truncate">patelakbar1679@...</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole("parent");
                  setMode("signup");
                  setGrNumber("1041");
                  setLast6Mobile("412091");
                  setParentPassword("1234");
                }}
                className="p-2 rounded-lg bg-stone-100 hover:bg-[#0F3D3A]/10 hover:text-[#0F3D3A] text-stone-700 font-semibold border border-stone-300 text-left transition-colors"
              >
                <p className="font-bold text-[11px]">Fill Student #1041</p>
                <p className="text-[10px] text-stone-500 font-mono">Aarav Baraf (Cls 1)</p>
              </button>
            </div>
          </div>

          <div className="text-center pt-2 text-[11px] text-stone-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
            <span>Encrypted Institutional Gateway • U-DISE 27361809501</span>
          </div>
        </div>
      </div>
    </div>
  );
}
