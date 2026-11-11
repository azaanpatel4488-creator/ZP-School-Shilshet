"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Student } from "@/types";
import { getStudents, saveStudent, deleteStudent } from "@/lib/dataService";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { StudentCard } from "@/components/StudentCard";
import { StudentDetailModal } from "@/components/StudentDetailModal";
import { AddStudentForm } from "@/components/AddStudentForm";
import {
  Users,
  Search,
  Filter,
  Plus,
  Printer,
  BookOpen,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

function StudentsContent() {
  const searchParams = useSearchParams();
  const initialClass = searchParams.get("class");

  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();

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
    loadStudents();
  }, [selectedClass]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Search matching
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        s.full_name.toLowerCase().includes(query) ||
        s.register_number.includes(query) ||
        s.pen_id.toLowerCase().includes(query) ||
        s.aadhaar_number.includes(query) ||
        s.mother_name.toLowerCase().includes(query);

      // Category matching
      const matchesCategory =
        categoryFilter === "all" || s.caste_category.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [students, searchQuery, categoryFilter]);

  // Save student handler
  const handleSaveStudent = async (
    payload: Omit<Student, "id" | "created_at" | "updated_at">,
    id?: string
  ) => {
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

  // Delete student handler
  const handleDeleteStudent = async (id: string) => {
    await deleteStudent(id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setIsDetailModalOpen(false);
    setActiveStudent(null);
    toast.success(language === "mr" ? "विद्यार्थी नोंद हटवली गेली." : "Student record removed.");
  };

  // Print register
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header & Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#6C151E] uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4 text-[#6C151E]" />
            <span>
              {language === "mr" ? "अधिकृत शालेय नोंदवही" : "Official Class Registers"}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
            {t.classesTitle}
          </h1>
          <p className="text-xs md:text-sm text-stone-600 mt-1">
            {language === "mr"
              ? "इयत्ता १ ली ते ५ वी मधील विद्यार्थ्यांची जनरल रजिस्टर, आधार, पेन व शिष्यवृत्ती नोंदवही."
              : "Digital archives for Classes 1 to 5 with strict validation of GR, Aadhaar, PEN, and Bank DBT."}
          </p>
        </div>

        {/* Action Buttons */}
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
      </div>

      {/* Class Selector Segmented Control */}
      <div className="py-6">
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
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Search */}
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

        {/* Category Filter */}
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

      {/* Summary Stat Strip */}
      <div className="flex items-center justify-between text-xs text-stone-600 mb-4 px-1">
        <span className="font-semibold">
          {language === "mr" ? "एकूण निकाल:" : "Showing:"}{" "}
          <strong className="text-[#6C151E] font-bold">{filteredStudents.length}</strong> {t.studentCountLabel}
          {selectedClass && ` (${language === "mr" ? `इयत्ता ${selectedClass}` : `Class ${selectedClass}`})`}
        </span>
        <span className="hidden sm:inline text-stone-500">
          {language === "mr"
            ? "विद्यार्थी कार्डवर क्लिक करून सविस्तर माहिती व संपादन पर्याय पहा."
            : "Click any student card to review full dossier and edit records."}
        </span>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-stone-200 p-4 h-44 animate-pulse flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="w-16 h-20 bg-stone-200 rounded-md" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-stone-200 rounded w-3/4" />
                  <div className="h-3 bg-stone-200 rounded w-1/2" />
                  <div className="h-3 bg-stone-200 rounded w-2/3" />
                </div>
              </div>
              <div className="h-6 bg-stone-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : filteredStudents.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border-2 border-dashed border-stone-300 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#6C151E] flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-base">
              {language === "mr" ? "कोणतीही विद्यार्थी नोंद आढळली नाही" : "No student records found"}
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              {language === "mr"
                ? "कृपया आपला शोध निकष बदला किंवा नवीन विद्यार्थी नोंद तयार करण्यासाठी 'नवीन विद्यार्थी जोडा' बटणावर क्लिक करा."
                : "Try clearing your search query or add a new student using the button above."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setCategoryFilter("all");
            }}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
          >
            {language === "mr" ? "सर्व फिल्टर पूर्ववत करा" : "Clear all filters"}
          </button>
        </div>
      ) : (
        /* Roster Grid */
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
      />

      {/* Add / Edit Student Form */}
      <AddStudentForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingStudent(null);
        }}
        onSave={handleSaveStudent}
        initialData={editingStudent}
      />
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
