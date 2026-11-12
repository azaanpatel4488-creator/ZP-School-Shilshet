"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Student, AttendanceRecord, DailyAttendanceSummary } from "@/types";
import { getStudents } from "@/lib/dataService";
import {
  getAttendanceForDate,
  saveAttendanceForDate,
  fetchAttendanceFromCloud,
  calculateSummary,
  formatWhatsAppKendraReport,
} from "@/lib/attendanceService";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  CheckCircle2,
  XCircle,
  Utensils,
  Share2,
  Copy,
  Calendar,
  Users,
  Search,
  Check,
  TrendingUp,
  Lock,
  LogIn,
  GraduationCap,
  Sparkles,
  HelpCircle,
  FileText,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

export default function AttendancePage() {
  const { language } = useLanguage();
  const { user, isAuthenticated, isFaculty, isParent } = useAuth();

  const isMr = language === "mr";

  // Today formatted as YYYY-MM-DD
  const getTodayISO = () => new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string>(getTodayISO());

  const [students, setStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  // Load students & attendance records
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const studentList = await getStudents();
        setStudents(studentList);
        
        // Try cloud fetch first
        const cloudRecords = await fetchAttendanceFromCloud(selectedDate);
        if (cloudRecords && cloudRecords.length > 0) {
          setRecords(cloudRecords);
        } else {
          const attendanceList = getAttendanceForDate(selectedDate, studentList);
          setRecords(attendanceList);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load attendance records.");
      } finally {
        setLoading(false);
      }
    }
    if (isAuthenticated) {
      loadData();
    }
  }, [selectedDate, isAuthenticated]);

  // Handle toggling student presence
  const handleToggleStatus = (studentId: string) => {
    if (!isFaculty) return;

    setRecords((prev) => {
      const updated: AttendanceRecord[] = prev.map((r) => {
        if (r.student_id === studentId) {
          const nextStatus: "present" | "absent" = r.status === "present" ? "absent" : "present";
          return {
            ...r,
            status: nextStatus,
            meal_opt_out: nextStatus === "absent" ? true : false,
          };
        }
        return r;
      });
      saveAttendanceForDate(selectedDate, updated);
      return updated;
    });
  };

  // Handle meal opt-out toggle
  const handleToggleMeal = (studentId: string) => {
    if (!isFaculty) return;

    setRecords((prev) => {
      const updated: AttendanceRecord[] = prev.map((r) => {
        if (r.student_id === studentId && r.status === "present") {
          return {
            ...r,
            meal_opt_out: !r.meal_opt_out,
          };
        }
        return r;
      });
      saveAttendanceForDate(selectedDate, updated);
      return updated;
    });
  };

  // Mark all present
  const handleMarkAllPresent = () => {
    if (!isFaculty) return;

    setRecords((prev) => {
      const updated: AttendanceRecord[] = prev.map((r) => {
        if (selectedClass === null || r.class_standard === selectedClass) {
          return {
            ...r,
            status: "present" as const,
            meal_opt_out: false,
          };
        }
        return r;
      });
      saveAttendanceForDate(selectedDate, updated);
      toast.success(
        isMr ? "सर्व विद्यार्थी हजर नोंदवले!" : "Marked all students as present!"
      );
      return updated;
    });
  };

  // Calculate live summary
  const summary: DailyAttendanceSummary = useMemo(() => {
    return calculateSummary(selectedDate, records);
  }, [selectedDate, records]);

  // Format date display
  const formattedDateString = useMemo(() => {
    try {
      const d = new Date(selectedDate);
      return d.toLocaleDateString(isMr ? "mr-IN" : "en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return selectedDate;
    }
  }, [selectedDate, isMr]);

  // WhatsApp Report text
  const whatsAppText = useMemo(() => {
    return formatWhatsAppKendraReport(
      summary,
      formattedDateString,
      isMr ? "श्री. अकबर पटेल (शिक्षक)" : "Shri. Akbar Patel (Faculty)"
    );
  }, [summary, formattedDateString, isMr]);

  const handleCopyReport = () => {
    navigator.clipboard.writeText(whatsAppText);
    toast.success(
      isMr
        ? "केंद्रप्रमुख अहवाल क्लिपबोर्डवर कॉपी केला!"
        : "Kendra report copied to clipboard!"
    );
  };

  const handleDispatchWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(whatsAppText)}`;
    window.open(url, "_blank");
  };

  // Filter records for display
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesClass = selectedClass === null || r.class_standard === selectedClass;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.student_name.toLowerCase().includes(q) ||
        r.register_number.includes(q);
      return matchesClass && matchesSearch;
    });
  }, [records, selectedClass, searchQuery]);

  // If Parent: Find child record
  const parentChildRecord = useMemo(() => {
    if (!isParent || !user?.register_number) return null;
    return records.find((r) => r.register_number === user.register_number);
  }, [records, isParent, user]);

  // 1. UN-AUTHENTICATED / SPECTATOR GATE
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border-2 border-[#E8CFB5] shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-[#6C151E]/10 text-[#6C151E] flex items-center justify-center mx-auto border border-[#6C151E]/20 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#6C151E] bg-[#6C151E]/10 px-2.5 py-1 rounded-full">
              Protected Institutional Portal
            </span>
            <h2 className="text-xl font-bold text-stone-900 mt-2">
              {isMr ? "हजेरी व पोषण आहार नोंद" : "Daily Attendance & MDM Tracker"}
            </h2>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              {isMr
                ? "शाळेतील दैनंदिन उपस्थिती आणि माध्यान्ह भोजन अहवाल पाहण्यासाठी कृपया शिक्षक किंवा पालक म्हणून लॉगिन करा."
                : "Official daily student attendance and PM-POSHAN meal tracker requires authorized Faculty or Parent login."}
            </p>
          </div>

          <div className="pt-2 space-y-2.5">
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#6C151E] hover:bg-[#851C27] text-white text-xs font-bold shadow-md transition-all active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>{isMr ? "शिक्षक लॉगिन" : "Faculty Sign In"}</span>
            </Link>
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0F3D3A] hover:bg-[#165551] text-white text-xs font-bold shadow-md transition-all active:scale-95"
            >
              <Users className="w-4 h-4" />
              <span>{isMr ? "पालक प्रवेश / सक्रिय करा" : "Parent Sign In / Activation"}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl space-y-6">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0F3D3A]/10 text-[#0F3D3A] border border-[#0F3D3A]/20">
                  PM-POSHAN • शासन निर्णय
                </span>
                <span className="text-xs text-stone-500 font-mono">
                  UDISE: 27361809501
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                {isMr
                  ? "दैनंदिन उपस्थिती व माध्यान्ह भोजन (MDM)"
                  : "Daily Attendance & PM-POSHAN Tracker"}
              </h1>
              <p className="text-xs text-stone-600 mt-1">
                {isMr
                  ? "विद्यार्थी हजेरी नोंद, पोषण आहार लाभार्थी मोजणी आणि १-क्लिक केंद्रप्रमुख व्हॉट्सअॅप अहवाल"
                  : "Real-time attendance tracking, meal beneficiary count, and 1-click Kendra Pramukh WhatsApp dispatcher"}
              </p>
            </div>

            {/* Date Picker & Quick Actions for Faculty */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 bg-stone-100 border border-stone-300 rounded-xl px-3 py-2 text-xs">
                <Calendar className="w-4 h-4 text-stone-500" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent font-semibold text-stone-800 focus:outline-none text-xs cursor-pointer"
                />
              </div>

              {isFaculty && (
                <>
                  <button
                    type="button"
                    onClick={handleMarkAllPresent}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isMr ? "सर्व हजर करा" : "Mark All Present"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowWhatsAppModal(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{isMr ? "केंद्र अहवाल (WhatsApp)" : "Kendra Report"}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* PARENT SPECIFIC TODAY CARD */}
          {isParent && parentChildRecord && (
            <div className="mt-6 p-4 rounded-2xl bg-[#E8F2F1] border-2 border-[#0F3D3A]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#0F3D3A] text-white flex items-center justify-center font-bold shadow-sm">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F3D3A]">
                    {isMr ? "आपल्या पाल्याची उपस्थिती" : "Child Attendance Status"}
                  </span>
                  <h3 className="font-bold text-stone-900 text-base">
                    {parentChildRecord.student_name} (Class {parentChildRecord.class_standard})
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5 font-mono">
                    GR #{parentChildRecord.register_number} • {formattedDateString}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {parentChildRecord.status === "present" ? (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{isMr ? "आज हजर (Present)" : "Present Today"}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-100 text-rose-800 font-bold text-xs border border-rose-300">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>{isMr ? "आज गैरहजर (Absent)" : "Absent Today"}</span>
                  </span>
                )}

                {parentChildRecord.status === "present" && !parentChildRecord.meal_opt_out && (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300">
                    <Utensils className="w-4 h-4 text-amber-700" />
                    <span>{isMr ? "माध्यान्ह भोजन लाभार्थी" : "Meal Availed"}</span>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Metric Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
            {/* Total Enrolled */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                {isMr ? "एकूण पटसंख्या" : "Total Strength"}
              </span>
              <p className="text-2xl font-bold text-stone-900 mt-1 font-mono">
                {summary.total_enrolled}
              </p>
              <span className="text-[10px] text-stone-500">
                {isMr ? "वर्ग १ ते ५" : "Classes 1 to 5"}
              </span>
            </div>

            {/* Present Today */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                {isMr ? "आज हजर" : "Present Today"}
              </span>
              <p className="text-2xl font-bold text-emerald-800 mt-1 font-mono">
                {summary.total_present}
              </p>
              <span className="text-[10px] text-emerald-700 font-medium">
                {summary.attendance_percentage}% {isMr ? "उपस्थिती" : "rate"}
              </span>
            </div>

            {/* Absent Today */}
            <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200">
              <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">
                {isMr ? "आज गैरहजर" : "Absent Today"}
              </span>
              <p className="text-2xl font-bold text-rose-800 mt-1 font-mono">
                {summary.total_absent}
              </p>
              <span className="text-[10px] text-rose-600">
                {isMr ? "विद्यार्थी रजेवर" : "on leave"}
              </span>
            </div>

            {/* MDM Meals */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block flex items-center gap-1">
                <Utensils className="w-3 h-3 text-amber-700" />
                <span>{isMr ? "माध्यान्ह भोजन" : "MDM Meals"}</span>
              </span>
              <p className="text-2xl font-bold text-amber-900 mt-1 font-mono">
                {summary.total_meals}
              </p>
              <span className="text-[10px] text-amber-700 font-medium">
                {isMr ? "पोषण आहार वाटप" : "meals served"}
              </span>
            </div>

            {/* Attendance % */}
            <div className="p-3.5 rounded-2xl bg-[#0F3D3A]/10 border border-[#0F3D3A]/20 col-span-2 sm:col-span-1">
              <span className="text-[11px] font-bold text-[#0F3D3A] uppercase tracking-wider block flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-[#0F3D3A]" />
                <span>{isMr ? "टक्केवारी" : "Rate %"}</span>
              </span>
              <p className="text-2xl font-bold text-[#0F3D3A] mt-1 font-mono">
                {summary.attendance_percentage}%
              </p>
              <span className="text-[10px] text-[#0F3D3A]/80">
                {isMr ? "नियमित उपस्थिती" : "Average rate"}
              </span>
            </div>
          </div>
        </div>

        {/* FACULTY INTERACTIVE ROSTER */}
        {isFaculty && (
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-md space-y-5">
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Class Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setSelectedClass(null)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    selectedClass === null
                      ? "bg-[#6C151E] text-white border-[#6C151E]"
                      : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  {isMr ? "सर्व वर्ग (१-५)" : "All Classes"}
                </button>
                {[1, 2, 3, 4, 5].map((cls) => {
                  const stat = summary.by_class[cls];
                  return (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setSelectedClass(cls)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap flex items-center gap-1.5 ${
                        selectedClass === cls
                          ? "bg-[#6C151E] text-white border-[#6C151E]"
                          : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                      }`}
                    >
                      <span>{isMr ? `वर्ग ${cls}` : `Class ${cls}`}</span>
                      {stat && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/30">
                          {stat.present}/{stat.enrolled}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Search input */}
              <div className="relative min-w-[200px]">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isMr ? "नाव किंवा GR नंबर शोधा..." : "Search student..."}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#6C151E]"
                />
              </div>
            </div>

            {/* Roster Table / List */}
            <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden bg-white">
              {filteredRecords.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-500">
                  {isMr ? "कोणतेही विद्यार्थी आढळले नाहीत." : "No student records found."}
                </div>
              ) : (
                filteredRecords.map((item, idx) => {
                  const isPresent = item.status === "present";
                  return (
                    <div
                      key={item.student_id}
                      className={`p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                        isPresent ? "hover:bg-stone-50/80" : "bg-rose-50/30"
                      }`}
                    >
                      {/* Student info */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-stone-400 w-5">
                          {idx + 1}.
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-stone-900 text-sm">
                              {item.student_name}
                            </h4>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                              {isMr ? `वर्ग ${item.class_standard}` : `Cls ${item.class_standard}`}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 font-mono">
                            GR #{item.register_number}
                          </p>
                        </div>
                      </div>

                      {/* Interactive Action Controls */}
                      <div className="flex items-center gap-3 pl-8 sm:pl-0">
                        {/* Meal Checkbox (Only if present) */}
                        <label
                          className={`flex items-center gap-1.5 text-xs font-medium cursor-pointer select-none px-2.5 py-1.5 rounded-lg border transition-colors ${
                            !isPresent
                              ? "opacity-30 pointer-events-none border-stone-200 bg-stone-100 text-stone-400"
                              : !item.meal_opt_out
                              ? "bg-amber-50 text-amber-900 border-amber-300 font-semibold"
                              : "bg-stone-50 text-stone-500 border-stone-200"
                          }`}
                        >
                          <input
                            type="checkbox"
                            disabled={!isPresent}
                            checked={isPresent && !item.meal_opt_out}
                            onChange={() => handleToggleMeal(item.student_id)}
                            className="rounded text-amber-600 focus:ring-amber-500"
                          />
                          <Utensils className="w-3.5 h-3.5 text-amber-700" />
                          <span>{isMr ? "भोजन (Meal)" : "MDM"}</span>
                        </label>

                        {/* Present / Absent Toggle Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item.student_id)}
                          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 ${
                            isPresent
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                              : "bg-rose-600 hover:bg-rose-700 text-white"
                          }`}
                        >
                          {isPresent ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{isMr ? "हजर (Present)" : "Present"}</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>{isMr ? "गैरहजर (Absent)" : "Absent"}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* WhatsApp Kendra Dispatch Modal */}
        {showWhatsAppModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setShowWhatsAppModal(false)}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl border-2 border-[#E8CFB5] w-full max-w-lg overflow-hidden text-stone-900"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-[#0F3D3A] text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-[#F5DABF]" />
                  <div>
                    <h3 className="font-bold text-sm">
                      {isMr ? "केंद्रप्रमुख व्हॉट्सअॅप अहवाल" : "Kendra Pramukh Daily Report"}
                    </h3>
                    <p className="text-[10px] text-[#F5DABF]">
                      PM-POSHAN • {formattedDateString}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowWhatsAppModal(false)}
                  className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
                >
                  ✕
                </button>
              </div>

              {/* Message Preview */}
              <div className="p-6 space-y-4">
                <div className="p-4 rounded-2xl bg-[#E8F2F1]/50 border border-[#0F3D3A]/20 font-mono text-xs whitespace-pre-wrap text-stone-800 leading-relaxed max-h-72 overflow-y-auto">
                  {whatsAppText}
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCopyReport}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-800 text-xs font-bold transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isMr ? "अहवाल कॉपी करा" : "Copy Text"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDispatchWhatsApp}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold shadow-md transition-all active:scale-95"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{isMr ? "WhatsApp वर पाठवा" : "Send via WhatsApp"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
