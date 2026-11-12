"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Student } from "@/types";
import { getStudents, saveStudent, deleteStudent } from "@/lib/dataService";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { StudentCard } from "@/components/StudentCard";
import { StudentDetailModal } from "@/components/StudentDetailModal";
import { AddStudentForm } from "@/components/AddStudentForm";
import { ReportCardModal } from "@/components/ReportCardModal";
import {
  Users,
  Search,
  Filter,
  Plus,
  Printer,
  BookOpen,
  Loader2,
  Lock,
  LogIn,
  GraduationCap,
  UserCheck,
  Award,
} from "lucide-react";
import { toast } from "sonner";

function StudentsContent() {
  const searchParams = useSearchParams();
  const initialClass = searchParams.get("class");

  const { t, language } = useLanguage();
  const { user, isAuthenticated, isFaculty, isParent } = useAuth();

  const [selectedClass, setSelectedClass] = useState<number | null>(
    initialClass ? Number(initialClass) : null
  );
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modals state
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [reportCardStudent, setReportCardStudent] = useState<Student | null>(null);
  const [isReportCardOpen, setIsReportCardOpen] = useState(false);

  // Sync initialClass param if user navigated with ?class=N
  useEffect(() => {
    if (initialClass) {
      setSelectedClass(Number(initialClass));
    }
  }, [initialClass]);

  // Fetch students
  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await getStudents(selectedClass || undefined);
      setStudents(data);
    } catch (err) {
      console.error(err);
      toast.error(language === "mr" ? "नोंदी लोड करताना अडचण आली." : "Failed to load student registers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadStudents();
    }
  }, [selectedClass, isAuthenticated]);

  // If Parent: find their child
  const parentChild = useMemo(() => {
    if (!isParent || !user?.register_number) return null;
    return students.find((s) => s.register_number === user.register_number);
  }, [students, isParent, user]);

  // Filtered students for faculty
  const filteredStudents = useMemo(() => {
    if (isParent) {
      return parentChild ? [parentChild] : [];
    }
    return students.filter((s) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        s.full_name.toLowerCase().includes(query) ||
        s.register_number.includes(query) ||
        s.pen_id.toLowerCase().includes(query) ||
        s.aadhaar_number.includes(query) ||
        s.mother_name.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "all" || s.caste_category.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [students, searchQuery, categoryFilter, isParent, parentChild]);

  // Save student handler (Faculty only)
  const handleSaveStudent = async (
    payload: Omit<Student, "id" | "created_at" | "updated_at">,
    id?: string
  ) => {
    if (!isFaculty) {
      toast.error("Permission denied. Faculty credentials required.");
      return;
    }
    const saved = await saveStudent(payload, id);
    if (id) {
      setStudents((prev) => prev.map((s) => (s.id === id ? saved : s)));
      if (activeStudent && activeStudent.id === id) {
        setActiveStudent(saved);
      }
    } else {
      setStudents((prev) => [saved, ...prev]);
    }
  };

  // Delete student handler (Faculty only)
  const handleDeleteStudent = async (id: string) => {
    if (!isFaculty) {
      toast.error("Permission denied.");
      return;
    }
    await deleteStudent(id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setIsDetailModalOpen(false);
    setActiveStudent(null);
    toast.success(language === "mr" ? "विद्यार्थी नोंद हटवली गेली." : "Student record removed.");
  };

  const handlePrint = () => {
    window.print();
  };

  // 1. GATE: IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#6C151E]/10 text-[#6C151E] flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-[#6C151E]/10 text-[#6C151E] font-bold text-xs uppercase tracking-wider">
            Protected Institutional Area
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900">
            {language === "mr" ? "विद्यार्थी नोंदवही प्रवेश आवश्यक" : "Authentication Required"}
          </h1>
          <p className="text-xs md:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
            {language === "mr"
              ? "विद्यार्थी जनरल रजिस्टर, आधार आणि वैयक्तिक शैक्षणिक प्रगती पाहण्यासाठी कृपया अधिकृत शिक्षक अथवा पालक म्हणून प्रवेश करा."
              : "Official student archives and academic records are restricted to verified school faculty and enrolled student-parents."}
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6C151E] hover:bg-[#851C27] text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <LogIn className="w-4 h-4" />
            <span>{language === "mr" ? "प्रवेश करा (Sign In)" : "Sign In to Access"}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
      {/* Header & Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#6C151E] uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4 text-[#6C151E]" />
            <span>
              {isFaculty
                ? language === "mr" ? "अधिकृत शालेय नोंदवही (वर्ग १-५)" : "Official Institutional Class Registers"
                : language === "mr" ? "पालक डॅशबोर्ड • वैयक्तिक विद्यार्थी नोंद" : "Parent Portal • Student Dossier"}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
            {isFaculty ? t.classesTitle : `${user?.name || "Student Dossier"}`}
          </h1>
          <p className="text-xs md:text-sm text-stone-600 mt-1">
            {isFaculty
              ? language === "mr"
                ? "इयत्ता १ ली ते ५ वी मधील विद्यार्थ्यांची जनरल रजिस्टर, आधार, पेन व शिष्यवृत्ती नोंदवही."
                : "Digital archives for Classes 1 to 5 with strict validation of GR, Aadhaar, PEN, and Bank DBT."
              : language === "mr"
              ? "आपल्या पाल्याची शैक्षणिक प्रगती, जनरल रजिस्टर (GR) व शालेय नोंदवही तपशील."
              : "Review your child's academic metric, general register data, and class details."}
          </p>
        </div>

        {/* Action Buttons: Faculty only */}
        {isFaculty && (
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 transition-colors shadow-xs"
              title="Print Class Register"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === "mr" ? "नोंदवही प्रिंट" : "Print Register"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingStudent(null);
                setIsFormOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-[#6C151E] hover:bg-[#851C27] text-white shadow-md active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addStudentBtn}</span>
            </button>
          </div>
        )}
      </div>

      {/* PARENT PERSONALIZED VIEW */}
      {isParent && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#E8F2F1] border border-[#0F3D3A]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0F3D3A] text-white flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F3D3A]">
                  Enrolled Student Account
                </span>
                <h3 className="font-bold text-stone-900 text-sm md:text-base">
                  {user?.student_name} • GR #{user?.register_number} (Class {user?.class_standard})
                </h3>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {parentChild && (
                <button
                  type="button"
                  onClick={() => {
                    setReportCardStudent(parentChild);
                    setIsReportCardOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-lg bg-[#D4AF37] text-stone-900 text-xs font-bold hover:bg-[#C69214] transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{language === "mr" ? "प्रगती पुस्तक (Report Card)" : "View Report Card"}</span>
                </button>
              )}
              <Link
                href="/assignments"
                className="px-3.5 py-2 rounded-lg bg-[#0F3D3A] text-white text-xs font-bold hover:bg-[#165551] transition-colors"
              >
                {language === "mr" ? "आजचा गृहपाठ पहा ›" : "View Today's Homework ›"}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* FACULTY CONTROLS: CLASS SELECTOR & SEARCH */}
      {isFaculty && (
        <>
          {/* Class Selector Segmented Control */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedClass(null)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                selectedClass === null
                  ? "bg-[#6C151E] text-white border-[#6C151E] shadow-sm"
                  : "bg-white text-stone-700 border-stone-300 hover:border-[#6C151E] hover:text-[#6C151E]"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{t.classSelectorAll}</span>
            </button>

            {[1, 2, 3, 4, 5].map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => setSelectedClass(cls)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                  selectedClass === cls
                    ? "bg-[#6C151E] text-white border-[#6C151E] shadow-sm"
                    : "bg-white text-stone-700 border-stone-300 hover:border-[#6C151E] hover:text-[#6C151E]"
                }`}
              >
                <span>
                  {language === "mr" ? `इयत्ता ${cls} ली` : `Class ${cls}`}
                </span>
              </button>
            ))}
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-stone-300 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C151E]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-stone-400 shrink-0" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C151E]"
              >
                <option value="all">{t.filterAllCategories}</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="OBC">OBC</option>
                <option value="VJNT">VJNT</option>
                <option value="General">General / Open</option>
              </select>
            </div>
          </div>
        </>
      )}

      {/* Roster / Student Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-stone-200 p-4 h-44 animate-pulse flex flex-col justify-between"
            />
          ))}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-stone-300 p-12 text-center space-y-4">
          <Users className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="font-bold text-stone-900 text-base">
            {language === "mr" ? "कोणतीही विद्यार्थी नोंद आढळली नाही" : "No student record found"}
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onClick={() => {
                setActiveStudent(student);
                setIsDetailModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Student Profile Modal */}
      <StudentDetailModal
        student={activeStudent}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setActiveStudent(null);
        }}
        onEdit={(studentToEdit) => {
          setIsDetailModalOpen(false);
          setEditingStudent(studentToEdit);
          setIsFormOpen(true);
        }}
        onDelete={handleDeleteStudent}
        onOpenReportCard={(stu) => {
          setReportCardStudent(stu);
          setIsReportCardOpen(true);
        }}
      />

      {/* Virtual Report Card Modal (प्रगती पुस्तक) */}
      <ReportCardModal
        student={reportCardStudent}
        isOpen={isReportCardOpen}
        onClose={() => {
          setIsReportCardOpen(false);
          setReportCardStudent(null);
        }}
      />

      {/* Add / Edit Student Form: Faculty only */}
      {isFaculty && (
        <AddStudentForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingStudent(null);
          }}
          onSave={handleSaveStudent}
          initialData={editingStudent}
        />
      )}
    </div>
  );
}

export default function StudentsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#6C151E]" />
        </div>
      }
    >
      <StudentsContent />
    </Suspense>
  );
}
