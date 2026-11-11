"use client";

import React, { useState } from "react";
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
  ArrowRight,
  Sparkles,
  Loader2,
  KeyRound,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { login, loginDemo, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/students");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error(language === "mr" ? "कृपया ई-मेल आणि पासवर्ड भरा." : "Please enter email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(email.trim(), password.trim());
      if (res.success) {
        toast.success(language === "mr" ? "लॉगिन यशस्वी! स्वागत आहे." : "Authentication successful! Welcome.");
        router.push("/students");
      } else {
        toast.error(res.error || (language === "mr" ? "प्रवेश अयशस्वी" : "Login failed"));
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = (role: "headmaster" | "teacher") => {
    loginDemo(role);
    toast.success(
      role === "headmaster"
        ? (language === "mr" ? "मुख्याध्यापक सत्रात प्रवेश केला!" : "Signed in as Headmaster session!")
        : (language === "mr" ? "शिक्षक सत्रात प्रवेश केला!" : "Signed in as Teacher session!")
    );
    router.push("/students");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#FAF7F2]">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border-2 border-[#E8CFB5] overflow-hidden">
        {/* Top Header Card */}
        <div className="bg-[#6C151E] text-white p-6 md:p-8 text-center space-y-3 relative">
          <div className="flex justify-center">
            <SchoolLogo size="lg" className="border-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{t.loginTitle}</h1>
            <p className="text-xs text-[#F5DABF] mt-1">{t.loginSubtitle}</p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 md:p-8 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {t.emailLabel}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="headmaster@zpshilshet.edu.in"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#6C151E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {t.passwordLabel}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#6C151E]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
              <span>{t.loginBtn}</span>
            </button>
          </form>

          {/* Instant Demo Access Options for Testing / Offline Evaluation */}
          <div className="pt-4 border-t border-stone-200 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F3D3A]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{language === "mr" ? "त्वरित चाचणी डेमो लॉगिन" : "Instant Faculty Demo Access"}</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-tight">
              {t.demoLoginNotice}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleQuickDemo("headmaster")}
                className="px-3 py-2 text-xs font-semibold rounded-lg bg-[#0F3D3A] hover:bg-[#165551] text-white shadow-xs transition-colors flex items-center justify-center gap-1"
              >
                <span>मुख्याध्यापक</span>
                <span className="text-[10px] text-[#F5DABF]">(HM)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo("teacher")}
                className="px-3 py-2 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 transition-colors flex items-center justify-center gap-1"
              >
                <span>शिक्षक</span>
                <span className="text-[10px] text-stone-500">(Staff)</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-2 text-[11px] text-stone-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
            <span>Encrypted Session • U-DISE 27211105401</span>
          </div>
        </div>
      </div>
    </div>
  );
}

