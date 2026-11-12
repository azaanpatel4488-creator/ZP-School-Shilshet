"use client";

import React, { useState, useEffect } from "react";
import { SchoolNotice, NoticeCategory, NoticeMediaType } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  X,
  FileText,
  Image as ImageIcon,
  Film,
  Sparkles,
  Pin,
  Save,
  Loader2,
  Tag,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";

interface NoticeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (noticeData: Omit<SchoolNotice, "id" | "created_at">, id?: string) => Promise<void>;
  initialData?: SchoolNotice | null;
}

export const NoticeFormModal: React.FC<NoticeFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const isMr = language === "mr";

  const [title, setTitle] = useState("");
  const [titleMr, setTitleMr] = useState("");
  const [content, setContent] = useState("");
  const [contentMr, setContentMr] = useState("");
  const [category, setCategory] = useState<NoticeCategory>("urgent");
  const [mediaType, setMediaType] = useState<NoticeMediaType>("text");
  const [mediaUrl, setMediaUrl] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setTitleMr(initialData.title_mr);
      setContent(initialData.content);
      setContentMr(initialData.content_mr || "");
      setCategory(initialData.category);
      setMediaType(initialData.media_type);
      setMediaUrl(initialData.media_url || "");
      setIsPinned(!!initialData.is_pinned);
    } else {
      setTitle("");
      setTitleMr("");
      setContent("");
      setContentMr("");
      setCategory("urgent");
      setMediaType("text");
      setMediaUrl("");
      setIsPinned(false);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleMr.trim() && !title.trim()) {
      toast.error(isMr ? "कृपया सूचनेचे शीर्षक लिहा." : "Please enter a notice title.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(
        {
          title: title.trim() || titleMr.trim(),
          title_mr: titleMr.trim() || title.trim(),
          content: content.trim() || contentMr.trim(),
          content_mr: contentMr.trim() || content.trim(),
          category,
          media_type: mediaType,
          media_url: mediaType === "text" ? undefined : mediaUrl.trim(),
          is_pinned: isPinned,
          author_name: user?.name || "श्री. अकबर पटेल (शिक्षक)",
        },
        initialData?.id
      );
      toast.success(
        isMr
          ? initialData
            ? "सूचना अद्ययावत केली!"
            : "नवीन सूचना यशस्वीरित्या प्रकाशित केली!"
          : "Notice published successfully!"
      );
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save notice.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preset media quick helpers
  const handleQuickMediaPreset = (url: string, type: NoticeMediaType) => {
    setMediaUrl(url);
    setMediaType(type);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border-2 border-[#E8CFB5] w-full max-w-xl overflow-hidden text-stone-900 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#6C151E] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#F5DABF]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {initialData
                  ? isMr
                    ? "सूचना संपादित करा"
                    : "Edit School Notice"
                  : isMr
                  ? "नवीन सूचना प्रकाशित करा"
                  : "Post New Notice on Board"}
              </h3>
              <p className="text-[11px] text-[#F5DABF]">
                {isMr
                  ? "शालेय ई-सूचना फलक • पोस्टर, फ्लायर, GIF किंवा मजकूर"
                  : "Digital Notice Board • Poster, Flyer, GIF, Video or Text"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Marathi Title (Primary for ZP schools) */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              {isMr ? "सूचनेचे शीर्षक (मराठीत)" : "Notice Title (Marathi)"} *
            </label>
            <input
              type="text"
              required
              value={titleMr}
              onChange={(e) => setTitleMr(e.target.value)}
              placeholder="उदा. दिवाळी सुट्टी व परीक्षा वेळापत्रक जाहीर..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#6C151E] font-medium"
            />
          </div>

          {/* English Title */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              {isMr ? "इंग्रजी शीर्षक (पर्यायी)" : "Notice Title (English)"}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Diwali Vacation & Examination Timetable..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#6C151E]"
            />
          </div>

          {/* Category & Media Type Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {isMr ? "वर्गवारी (Category)" : "Category"} *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as NoticeCategory)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#6C151E]"
              >
                <option value="urgent">{isMr ? "🚨 अत्यंत महत्त्वाचे (Urgent)" : "🚨 Urgent Notice"}</option>
                <option value="holiday">{isMr ? "🏖️ शासकीय सुट्टी (Holiday)" : "🏖️ Holiday Circular"}</option>
                <option value="exam">{isMr ? "📝 परीक्षा व निकाल (Exam/Result)" : "📝 Exam & Results"}</option>
                <option value="event">{isMr ? "🏆 क्रीडा व सांस्कृतिक उपक्रम (Event)" : "🏆 Event & Sports"}</option>
                <option value="general">{isMr ? "📌 सर्वसाधारण सूचना (General)" : "📌 General Announcement"}</option>
              </select>
            </div>

            {/* Media Type */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {isMr ? "माध्यम प्रकार (Media Type)" : "Media Format"} *
              </label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value as NoticeMediaType)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#6C151E]"
              >
                <option value="text">{isMr ? "📄 केवळ मजकूर (Text Only)" : "📄 Text Only"}</option>
                <option value="flyer">{isMr ? "🖼️ अधिकृत फ्लायर / परिपत्रक (Flyer)" : "🖼️ Official Flyer"}</option>
                <option value="image">{isMr ? "📸 फोटो / पोस्टर (Poster / Image)" : "📸 Poster / Photo"}</option>
                <option value="gif">{isMr ? "✨ अॅनिमेटेड GIF (Animated GIF)" : "✨ Animated GIF"}</option>
                <option value="video">{isMr ? "🎥 व्हिडिओ / YouTube (Video)" : "🎥 Video / YouTube"}</option>
              </select>
            </div>
          </div>

          {/* Media URL Input if not text */}
          {mediaType !== "text" && (
            <div className="space-y-2 p-3 rounded-xl bg-stone-50 border border-stone-200">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                {mediaType === "video"
                  ? isMr
                    ? "व्हिडिओ लिंक (YouTube / MP4 URL)"
                    : "Video / YouTube URL"
                  : isMr
                  ? "इमेज, पोस्टर किंवा GIF URL"
                  : "Image, Poster, or GIF URL"} *
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  required
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder={
                    mediaType === "video"
                      ? "https://www.youtube.com/watch?v=..."
                      : "https://example.com/poster.jpg"
                  }
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#6C151E]"
                />
              </div>

              {/* Sample Presets for Teachers */}
              <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[10px]">
                <span className="text-stone-500 font-bold">
                  {isMr ? "नमुना निवडा:" : "Quick Samples:"}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleQuickMediaPreset(
                      "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80",
                      "flyer"
                    )
                  }
                  className="px-2 py-0.5 rounded bg-white border border-stone-200 hover:border-[#6C151E] text-stone-700"
                >
                  📄 सुट्टी फ्लायर
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleQuickMediaPreset(
                      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80",
                      "image"
                    )
                  }
                  className="px-2 py-0.5 rounded bg-white border border-stone-200 hover:border-[#6C151E] text-stone-700"
                >
                  🏆 क्रीडा पोस्टर
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleQuickMediaPreset(
                      "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
                      "gif"
                    )
                  }
                  className="px-2 py-0.5 rounded bg-white border border-stone-200 hover:border-[#6C151E] text-stone-700"
                >
                  ✨ पोषण आहार GIF
                </button>
              </div>
            </div>
          )}

          {/* Description / Content in Marathi */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              {isMr ? "सूचनेचा सविस्तर तपशील (मराठीत)" : "Notice Details (Marathi)"} *
            </label>
            <textarea
              rows={4}
              required
              value={contentMr}
              onChange={(e) => setContentMr(e.target.value)}
              placeholder="सर्व पालक व विद्यार्थ्यांना कळविण्यात येते की..."
              className="w-full p-3 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#6C151E] leading-relaxed"
            />
          </div>

          {/* English Content (Optional) */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              {isMr ? "इंग्रजी तपशील (पर्यायी)" : "Notice Details (English)"}
            </label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="All parents and students are hereby informed that..."
              className="w-full p-3 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#6C151E] leading-relaxed"
            />
          </div>

          {/* Pinned switch */}
          <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8CFB5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pin className={`w-4 h-4 ${isPinned ? "text-[#6C151E]" : "text-stone-400"}`} />
              <div>
                <span className="text-xs font-bold text-stone-800 block">
                  {isMr ? "फलकावर अग्रभागी ठेवा (Pin to Top Ticker)" : "Pin to Top Ticker"}
                </span>
                <span className="text-[10px] text-stone-500">
                  {isMr
                    ? "ही सूचना मुख्य पृष्ठावरील स्क्रोलिंग टिकरमध्ये ठळकपणे दिसेल."
                    : "Displays prominently in the live scrolling header ticker."}
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="w-4 h-4 rounded text-[#6C151E] focus:ring-[#6C151E] cursor-pointer"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-stone-600 hover:bg-stone-100 transition-colors"
            >
              {isMr ? "रद्द करा" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#6C151E] hover:bg-[#851C27] text-white text-xs font-bold shadow-md active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>
                {initialData
                  ? isMr
                    ? "बदल जतन करा"
                    : "Save Changes"
                  : isMr
                  ? "सूचना प्रकाशित करा"
                  : "Publish Notice"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

