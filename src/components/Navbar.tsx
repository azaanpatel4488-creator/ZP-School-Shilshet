"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SchoolLogo } from "./ui/SchoolLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  Menu,
  X,
  Users,
  Send,
  Image as GalleryIcon,
  HelpCircle,
  LogIn,
  LogOut,
  Home,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  UserCheck,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t, language } = useLanguage();
  const { user, isAuthenticated, isFaculty, isParent, logout } = useAuth();

  // Dynamic Navigation Items based on Role
  const navLinks = [
    { href: "/", label: t.navHome, icon: Home, public: true },
    ...(isAuthenticated
      ? [
          {
            href: "/students",
            label: isFaculty
              ? (language === "mr" ? "विद्यार्थी नोंदी (वर्ग १-५)" : "Student Registers")
              : (language === "mr" ? "माझ्या पाल्याची नोंद" : "My Child's Record"),
            icon: Users,
            public: false,
          },
          {
            href: "/assignments",
            label: isFaculty
              ? (language === "mr" ? "अभ्यास प्रसारक" : "Assignment Dispatcher")
              : (language === "mr" ? "शालेय गृहपाठ" : "Class Assignments"),
            icon: Send,
            public: false,
          },
        ]
      : []),
    {
      href: "/gallery",
      label: language === "mr" ? "गॅलरी व शिक्षक" : "Gallery & Faculty",
      icon: GalleryIcon,
      public: true,
    },
    {
      href: "/inquiries",
      label: language === "mr" ? "प्रवेश व चौकशी" : "Admissions & Inquiries",
      icon: HelpCircle,
      public: true,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#6C151E] text-white shadow-md border-b-2 border-[#D4AF37]/50">
      {/* Top micro institutional banner */}
      <div className="bg-[#4D0E15] px-4 py-1 text-[11px] text-[#F5DABF] font-medium flex items-center justify-between border-b border-[#6C151E]">
        <div className="container mx-auto flex items-center justify-between">
          <span className="truncate">
            {language === "mr"
              ? "महाराष्ट्र शासन • जिल्हा परिषद पालघर • प्राथमिक शिक्षण विभाग • यु-डायस: २७३६१८०९५०१"
              : "Govt. of Maharashtra • Rural Education Directorate • U-DISE: 27361809501"}
          </span>
          <div className="hidden sm:flex items-center gap-4 text-[11px]">
            <a href="mailto:headmaster@zpshilshet.edu.in" className="hover:text-white transition-colors">
              ✉️ zpshilshet@gmail.com
            </a>
            <span className="text-stone-400">|</span>
            <span className="text-[#F5DABF] font-mono">Affiliation: MSBSHSE</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Institutional Branding on Left */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#F5DABF] rounded-lg p-1"
          >
            <SchoolLogo size="md" />
            <div className="flex flex-col">
              <span className="font-extrabold text-base md:text-lg tracking-tight leading-tight text-white group-hover:text-[#F5DABF] transition-colors">
                {language === "mr" ? "जि.प. प्राथमिक शाळा शिलशेत" : "ZP Primary School Shilshet"}
              </span>
              <span className="text-[11px] text-[#F5DABF]/90 font-medium tracking-wide">
                {language === "mr" ? "ता. मोखाडा, जि. पालघर" : "Tal. Mokhada, Dist. Palghar"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    active
                      ? "bg-[#FAF7F2] text-[#6C151E] shadow-sm font-bold"
                      : "text-stone-100 hover:text-white hover:bg-[#851C27]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action buttons (Language Switcher + Auth) */}
          <div className="hidden sm:flex items-center gap-3">
            <LanguageSwitcher />

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2.5 py-1 rounded-md bg-[#0F3D3A] text-[#F5DABF] border border-[#0F3D3A] font-medium hidden xl:inline-block max-w-[180px] truncate">
                  {isFaculty ? (
                    <>
                      <GraduationCap className="w-3 h-3 inline mr-1 text-[#D4AF37]" />
                      Faculty
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-3 h-3 inline mr-1 text-[#D4AF37]" />
                      {user?.student_name ? user.student_name.split(" ")[0] : "Parent"}
                    </>
                  )}
                </span>
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-[#0F3D3A] hover:bg-[#165551] text-white border border-[#D4AF37]/40 shadow-xs transition-all active:scale-95"
                  title="Sign out of current session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{language === "mr" ? "बाहेर पडा" : "Sign Out"}</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-md bg-[#F5DABF] text-[#6C151E] hover:bg-white shadow-xs transition-all active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{language === "mr" ? "प्रवेश (Sign In)" : "Sign In / Register"}</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu & Language Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageSwitcher variant="compact" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:bg-[#851C27] rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#4D0E15] border-t border-[#851C27] px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <div className="pb-2 border-b border-stone-700/50 mb-2">
            {isAuthenticated ? (
              <div className="flex items-center justify-between text-xs text-[#F5DABF]">
                <span className="font-semibold">{user?.name}</span>
                <span className="px-2 py-0.5 rounded bg-[#0F3D3A] text-white uppercase text-[10px]">
                  {user?.role}
                </span>
              </div>
            ) : (
              <span className="text-xs text-stone-300">
                {language === "mr" ? "सार्वजनिक अतिथी मोड" : "Public Visitor Mode"}
              </span>
            )}
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                  active
                    ? "bg-[#FAF7F2] text-[#6C151E]"
                    : "text-stone-200 hover:bg-[#6C151E] hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-stone-700/50">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0F3D3A] text-white text-sm font-bold"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.navLogout}</span>
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#F5DABF] text-[#6C151E] text-sm font-bold"
              >
                <LogIn className="w-4 h-4" />
                <span>{language === "mr" ? "प्रवेश (Sign In)" : "Sign In / Register"}</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
