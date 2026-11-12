"use client";

import React from "react";
import Image from "next/image";
import { SchoolNotice } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  X,
  Share2,
  Calendar,
  User,
  Tag,
  Film,
  ExternalLink,
  Edit3,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

interface NoticeDetailModalProps {
  notice: SchoolNotice | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (notice: SchoolNotice) => void;
  onDelete?: (id: string) => void;
}

export const NoticeDetailModal: React.FC<NoticeDetailModalProps> = ({
  notice,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  const { language } = useLanguage();
  const { isFaculty } = useAuth();
  const isMr = language === "mr";

  if (!isOpen || !notice) return null;

  // Format date
  const formattedDate = new Date(notice.created_at).toLocaleDateString(
    isMr ? "mr-IN" : "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  // Category labels and colors
  const getCategoryInfo = (cat: string) => {
    switch (cat) {
      case "urgent":
        return {
          label: isMr ? "🚨 अत्यंत महत्त्वाचे" : "🚨 Urgent Notice",
          bg: "bg-rose-50 text-rose-800 border-rose-200",
        };
      case "holiday":
        return {
          label: isMr ? "🏖️ शासकीय सुट्टी" : "🏖️ Holiday Circular",
          bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
        };
      case "exam":
        return {
          label: isMr ? "📝 परीक्षा व निकाल" : "📝 Examination",
          bg: "bg-blue-50 text-blue-800 border-blue-200",
        };
      case "event":
        return {
          label: isMr ? "🏆 क्रीडा व उपक्रम" : "🏆 Event & Sports",
          bg: "bg-amber-50 text-amber-900 border-amber-200",
        };
      default:
        return {
          label: isMr ? "📌 सर्वसाधारण सूचना" : "📌 Announcement",
          bg: "bg-stone-100 text-stone-700 border-stone-200",
        };
    }
  };

  const catInfo = getCategoryInfo(notice.category);

  // Helper to extract YouTube embed URL if applicable
  const getEmbedVideoUrl = (url?: string) => {
    if (!url) return null;
    if (url.includes("youtube.com/watch?v=")) {
      const vid = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${vid}`;
    }
    if (url.includes("youtu.be/")) {
      const vid = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${vid}`;
    }
    return url;
  };

  // WhatsApp share
  const handleShareWhatsApp = () => {
    const titleText = isMr ? notice.title_mr : notice.title;
    const bodyText = isMr ? notice.content_mr || notice.content : notice.content;
    const text = `📢 *जि.प. प्राथमिक शाळा शिलशेत (मोखाडा)*\n📌 *सूचना: ${titleText}*\n📅 दिनांक: ${formattedDate}\n\n${bodyText}\n\nअधिक माहितीसाठी भेट द्या: https://zpshilshet.edu.in`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border-2 border-[#E8CFB5] w-full max-w-2xl overflow-hidden text-stone-900 my-8 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="bg-[#6C151E] text-white p-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${catInfo.bg}`}>
              {catInfo.label}
            </span>
            {notice.is_pinned && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4AF37] text-stone-900">
                ⭐ {isMr ? "अग्रभागी" : "Pinned"}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Main Title */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
              {isMr ? notice.title_mr : notice.title}
            </h2>
            {isMr && notice.title && notice.title !== notice.title_mr && (
              <p className="text-xs text-stone-500 font-sans mt-0.5">{notice.title}</p>
            )}

            {/* Micro Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 mt-3 pt-3 border-t border-stone-100">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#6C151E]" />
                <span>{formattedDate}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#0F3D3A]" />
                <span>{notice.author_name}</span>
              </span>
              <span className="text-stone-400">|</span>
              <span className="font-mono text-[11px] text-stone-500">
                UDISE: 27361809501
              </span>
            </div>
          </div>

          {/* Media Presentation: Poster, Flyer, Image, GIF, Video */}
          {notice.media_type !== "text" && notice.media_url && (
            <div className="rounded-2xl overflow-hidden border-2 border-stone-200 bg-stone-50 shadow-inner">
              {notice.media_type === "video" ? (
                <div className="relative aspect-video w-full bg-black">
                  <iframe
                    src={getEmbedVideoUrl(notice.media_url) || ""}
                    title={notice.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              ) : (
                <div className="relative w-full min-h-[260px] max-h-[460px] flex items-center justify-center bg-stone-900">
                  <Image
                    src={notice.media_url}
                    alt={notice.title}
                    width={800}
                    height={500}
                    className="object-contain max-h-[460px] w-auto h-auto mx-auto"
                    unoptimized={notice.media_type === "gif"}
                  />
                </div>
              )}
              <div className="bg-stone-100 px-3 py-1.5 text-[11px] text-stone-500 flex items-center justify-between border-t border-stone-200">
                <span className="capitalize font-semibold">
                  {notice.media_type === "flyer"
                    ? isMr ? "अधिकृत शालेय फ्लायर / परिपत्रक" : "Official School Circular Flyer"
                    : notice.media_type === "gif"
                    ? "Animated Visual GIF"
                    : notice.media_type === "video"
                    ? "Interactive Video Broadcast"
                    : "School Activity Photo"}
                </span>
                <a
                  href={notice.media_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#6C151E] hover:underline flex items-center gap-1 font-bold text-[10px]"
                >
                  <span>{isMr ? "मूळ आकार पहा" : "Open Original"}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* Detailed Message Text */}
          <div className="space-y-3 bg-[#FAF7F2] p-5 rounded-2xl border border-[#E8CFB5]/80">
            <h4 className="text-xs uppercase font-extrabold text-[#6C151E] tracking-wider">
              {isMr ? "सविस्तर माहिती / अधिकृत संदेश" : "Official Announcement Details"}
            </h4>
            <p className="text-sm text-stone-800 leading-relaxed whitespace-pre-wrap font-serif">
              {isMr ? notice.content_mr || notice.content : notice.content}
            </p>

            {isMr && notice.content && notice.content !== notice.content_mr && (
              <div className="pt-3 border-t border-stone-200 text-xs text-stone-600 font-sans leading-relaxed">
                <span className="font-bold text-stone-700 block mb-0.5">English Translation:</span>
                {notice.content}
              </div>
            )}
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Faculty edit/delete controls */}
          <div className="flex items-center gap-2">
            {isFaculty && (
              <>
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(isMr ? "ही सूचना काढून टाकायची आहे का?" : "Delete this notice?")) {
                        onDelete(notice.id);
                        onClose();
                      }
                    }}
                    className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isMr ? "हटवा" : "Delete"}</span>
                  </button>
                )}
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onEdit(notice);
                    }}
                    className="flex items-center gap-1 px-3.5 py-2 text-xs font-bold rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isMr ? "संपादित करा" : "Edit"}</span>
                  </button>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* WhatsApp Share Button */}
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold shadow-md transition-all active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isMr ? "WhatsApp वर पाठवा" : "Share on WhatsApp"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-stone-700 hover:bg-stone-200 transition-colors"
            >
              {isMr ? "बंद करा" : "Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
