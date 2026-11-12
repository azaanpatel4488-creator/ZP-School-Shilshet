"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { SchoolNotice, NoticeCategory } from "@/types";
import {
  getNotices,
  saveNotice,
  deleteNotice,
  togglePinNotice,
} from "@/lib/noticeService";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { NoticeFormModal } from "./NoticeFormModal";
import { NoticeDetailModal } from "./NoticeDetailModal";
import { MarathiSpeakerButton } from "@/components/ui/MarathiSpeakerButton";
import {
  Bell,
  Calendar,
  Pin,
  Plus,
  Play,
  Share2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  FileText,
  Image as ImageIcon,
  Film,
  Award,
} from "lucide-react";
import { toast } from "sonner";

export const NoticeBoard: React.FC = () => {
  const { language } = useLanguage();
  const { isFaculty } = useAuth();
  const isMr = language === "mr";

  const [notices, setNotices] = useState<SchoolNotice[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<NoticeCategory | "all">("all");
  const [activeNotice, setActiveNotice] = useState<SchoolNotice | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<SchoolNotice | null>(null);

  // Load notices
  const loadAllNotices = async () => {
    const list = await getNotices();
    setNotices(list);
  };

  useEffect(() => {
    loadAllNotices();
  }, []);

  // Pinned notices for the Marquee ticker
  const pinnedNotices = useMemo(() => {
    return notices.filter((n) => n.is_pinned);
  }, [notices]);

  // Filtered notices for grid
  const filteredNotices = useMemo(() => {
    if (selectedCategory === "all") return notices;
    return notices.filter((n) => n.category === selectedCategory);
  }, [notices, selectedCategory]);

  // Handle Save
  const handleSaveNotice = async (
    data: Omit<SchoolNotice, "id" | "created_at">,
    id?: string
  ) => {
    await saveNotice(data, id);
    await loadAllNotices();
  };

  // Handle Delete
  const handleDeleteNotice = async (id: string) => {
    await deleteNotice(id);
    await loadAllNotices();
    toast.success(isMr ? "सूचना काढून टाकली." : "Notice deleted.");
  };

  // Format date helper
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(isMr ? "mr-IN" : "en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getCategoryBadge = (cat: NoticeCategory) => {
    switch (cat) {
      case "urgent":
        return {
          label: isMr ? "अत्यंत महत्त्वाचे" : "Urgent",
          bg: "bg-rose-100 text-rose-800 border-rose-300",
        };
      case "holiday":
        return {
          label: isMr ? "शासकीय सुट्टी" : "Holiday",
          bg: "bg-emerald-100 text-emerald-800 border-emerald-300",
        };
      case "exam":
        return {
          label: isMr ? "परीक्षा व निकाल" : "Exam",
          bg: "bg-blue-100 text-blue-800 border-blue-300",
        };
      case "event":
        return {
          label: isMr ? "क्रीडा व उपक्रम" : "Event",
          bg: "bg-amber-100 text-amber-900 border-amber-300",
        };
      default:
        return {
          label: isMr ? "सामान्य सूचना" : "Notice",
          bg: "bg-stone-100 text-stone-700 border-stone-300",
        };
    }
  };

  const getMediaBadge = (type: string) => {
    switch (type) {
      case "flyer":
        return { icon: FileText, label: isMr ? "फ्लायर" : "Flyer" };
      case "image":
        return { icon: ImageIcon, label: isMr ? "पोस्टर" : "Poster" };
      case "gif":
        return { icon: Sparkles, label: "GIF" };
      case "video":
        return { icon: Film, label: "Video" };
      default:
        return { icon: FileText, label: isMr ? "मजकूर" : "Text" };
    }
  };

  return (
    <section className="space-y-6">
      {/* 1. TOP LIVE TICKER / MARQUEE BANNER */}
      <div className="bg-[#4D0E15] text-white rounded-2xl overflow-hidden border border-[#851C27] shadow-sm flex items-center">
        <div className="bg-[#6C151E] px-4 py-2.5 flex items-center gap-2 shrink-0 font-bold text-xs uppercase tracking-wider text-[#F5DABF] border-r border-[#851C27] z-10 shadow-md">
          <Bell className="w-4 h-4 text-amber-300 animate-bounce" />
          <span>{isMr ? "ताज्या सूचना" : "Latest Notices"}</span>
        </div>

        <div className="overflow-hidden whitespace-nowrap py-2 flex-1 relative">
          <div className="inline-block animate-marquee text-xs font-medium text-stone-200">
            {pinnedNotices.length > 0 ? (
              pinnedNotices.map((n, idx) => (
                <span
                  key={n.id}
                  onClick={() => {
                    setActiveNotice(n);
                    setIsDetailOpen(true);
                  }}
                  className="mx-6 hover:text-white cursor-pointer hover:underline inline-flex items-center gap-1.5"
                >
                  <span className="text-[#D4AF37]">★</span>
                  <span>{isMr ? n.title_mr : n.title}</span>
                  <span className="text-[10px] text-stone-400 font-mono">({formatDate(n.created_at)})</span>
                </span>
              ))
            ) : (
              <span className="mx-6 text-stone-300">
                {isMr
                  ? "जि.प. शाळा शिलशेत • नियमित वर्ग व उपस्थिती • अधिक माहितीसाठी सूचना फलक पहा."
                  : "ZP Primary School Shilshet • Check the notice board below for all latest announcements."}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN DIGITAL NOTICE BOARD HEADER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-md space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#6C151E]/10 text-[#6C151E] border border-[#6C151E]/20">
                डिजिटल सूचना फलक • E-Notice Board
              </span>
              <span className="text-xs text-stone-500 font-mono">
                UDISE: 27361809501
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              {isMr ? "शालेय ई-सूचना फलक" : "Live Digital Notice Board"}
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              {isMr
                ? "सुट्ट्या, परीक्षा, क्रीडा स्पर्धा, अधिकृत परिपत्रके आणि दैनंदिन उपक्रमांची अधिकृत माहिती"
                : "Official notices, holiday circulars, exam dates, sports flyers, and multimedia updates"}
            </p>
          </div>

          {/* Faculty Post Notice Button */}
          {isFaculty && (
            <button
              type="button"
              onClick={() => {
                setEditingNotice(null);
                setIsFormOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6C151E] hover:bg-[#851C27] text-white text-xs font-bold shadow-md active:scale-95 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{isMr ? "+ नवीन सूचना प्रकाशित करा" : "+ Post New Notice"}</span>
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: "all", label: isMr ? "सर्व सूचना" : "All Notices" },
            { id: "urgent", label: isMr ? "🚨 अत्यंत महत्त्वाचे" : "🚨 Urgent" },
            { id: "holiday", label: isMr ? "🏖️ सुट्ट्या" : "🏖️ Holidays" },
            { id: "exam", label: isMr ? "📝 परीक्षा" : "📝 Exams" },
            { id: "event", label: isMr ? "🏆 उपक्रम व क्रीडा" : "🏆 Events & Sports" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap border ${
                selectedCategory === tab.id
                  ? "bg-[#0F3D3A] text-white border-[#0F3D3A] shadow-xs"
                  : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 3. NOTICE CARDS GRID */}
        {filteredNotices.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
            {isMr ? "या वर्गवारीत सध्या कोणतीही सूचना उपलब्ध नाही." : "No notices available in this category."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNotices.map((notice) => {
              const cat = getCategoryBadge(notice.category);
              const media = getMediaBadge(notice.media_type);
              const MediaIcon = media.icon;
              const hasMedia = notice.media_type !== "text" && !!notice.media_url;

              return (
                <div
                  key={notice.id}
                  onClick={() => {
                    setActiveNotice(notice);
                    setIsDetailOpen(true);
                  }}
                  className="group bg-white rounded-2xl border border-stone-200/90 hover:border-[#6C151E] shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer flex flex-col focus:outline-none"
                >
                  {/* Media Banner Thumbnail or Text Frame */}
                  {hasMedia ? (
                    <div className="relative aspect-video w-full bg-stone-900 overflow-hidden">
                      <Image
                        src={notice.media_url!}
                        alt={notice.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized={notice.media_type === "gif"}
                      />
                      {notice.media_type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                          <div className="w-12 h-12 rounded-full bg-white/90 text-[#6C151E] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold flex items-center gap-1 backdrop-blur-xs">
                        <MediaIcon className="w-3 h-3" />
                        <span>{media.label}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-[#FAF7F2] border-b border-[#E8CFB5]/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#6C151E]/10 text-[#6C151E] flex items-center justify-center font-bold">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-bold text-stone-600">
                          {isMr ? "अधिकृत शालेय सूचना" : "Official Notice"}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {formatDate(notice.created_at)}
                      </span>
                    </div>
                  )}

                  {/* Card Content Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${cat.bg}`}
                        >
                          {cat.label}
                        </span>
                        {notice.is_pinned && (
                          <span className="text-[10px] font-bold text-amber-700 flex items-center gap-1">
                            <Pin className="w-3 h-3" />
                            <span>{isMr ? "अग्रभागी" : "Pinned"}</span>
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-stone-900 text-sm leading-snug group-hover:text-[#6C151E] transition-colors line-clamp-2">
                        {isMr ? notice.title_mr : notice.title}
                      </h3>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-serif">
                        {isMr ? notice.content_mr || notice.content : notice.content}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono">
                          {formatDate(notice.created_at)}
                        </span>
                        <MarathiSpeakerButton
                          text={`${isMr ? notice.title_mr : notice.title}. ${
                            isMr ? notice.content_mr || notice.content : notice.content
                          }`}
                          size="sm"
                          label={isMr ? "ऐका" : "Listen"}
                        />
                      </div>

                      <span className="text-[11px] font-bold text-[#6C151E] flex items-center group-hover:translate-x-0.5 transition-transform">
                        <span>{isMr ? "सविस्तर वाचा" : "View"}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Notice Detail Lightbox Modal */}
      <NoticeDetailModal
        notice={activeNotice}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setActiveNotice(null);
        }}
        onEdit={(noticeToEdit) => {
          setEditingNotice(noticeToEdit);
          setIsFormOpen(true);
        }}
        onDelete={handleDeleteNotice}
      />

      {/* Faculty Post / Edit Form Modal */}
      {isFaculty && (
        <NoticeFormModal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingNotice(null);
          }}
          onSave={handleSaveNotice}
          initialData={editingNotice}
        />
      )}
    </section>
  );
};

