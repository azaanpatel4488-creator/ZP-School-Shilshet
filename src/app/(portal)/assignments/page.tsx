"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Assignment, MediaType } from "@/types";
import { getAssignments, createAssignment } from "@/lib/dataService";
import { uploadAssignmentFile } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  Send,
  Plus,
  Share2,
  FileText,
  Video,
  Link as LinkIcon,
  Image as ImageIcon,
  MessageSquare,
  ExternalLink,
  Download,
  Calendar,
  X,
  Upload,
  Loader2,
  Filter,
  CheckCircle,
} from "lucide-react";

export default function AssignmentsPage() {
  const { t, language } = useLanguage();
  const { isAuthenticated, user } = useAuth();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassFilter, setSelectedClassFilter] = useState<number | null>(null);

  // New Dispatch Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetClass, setTargetClass] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [contentText, setContentText] = useState("");
  const [mediaType, setMediaType] = useState<MediaType>("text");
  const [mediaUrl, setMediaUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load assignments
  const loadAssignments = async () => {
    setLoading(true);
    try {
      const data = await getAssignments(selectedClassFilter);
      setAssignments(data);
    } catch (err) {
      console.error(err);
      toast.error(language === "mr" ? "अभ्यास लोड करताना अडचण आली." : "Failed to load assignments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, [selectedClassFilter]);

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadAssignmentFile(file);
      setMediaUrl(url);
      toast.success(language === "mr" ? "फाईल अपलोड झाली!" : "Material file uploaded!");
    } catch (err) {
      console.error(err);
      toast.error(language === "mr" ? "अपलोड अयशस्वी" : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  // Safe YouTube embed helper
  const getYouTubeEmbedUrl = (url: string) => {
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
      }
      return null;
    } catch {
      return null;
    }
  };

  // Format WhatsApp Share Link
  const getWhatsAppShareUrl = (assignment: Assignment) => {
    const schoolHeader = language === "mr" ? "जि.प. प्राथमिक शाळा शिलशेत" : "ZP Primary School Shilshet";
    const classText = assignment.target_class
      ? (language === "mr" ? `इयत्ता ${assignment.target_class}` : `Class ${assignment.target_class}`)
      : (language === "mr" ? "सर्व वर्ग (All Classes)" : "All Classes");

    const messageLines = [
      `📢 *${schoolHeader}*`,
      `🎯 *${language === "mr" ? "वर्ग" : "Target"}:* ${classText}`,
      `📌 *${assignment.title}*`,
      ``,
      assignment.content_text || "",
    ];

    if (assignment.media_url) {
      messageLines.push(``);
      messageLines.push(`🔗 *Link/Media:* ${assignment.media_url}`);
    }

    messageLines.push(``);
    messageLines.push(`✍️ *${language === "mr" ? "मार्गदर्शक" : "Faculty"}:* ${assignment.author_name || "School Administration"}`);

    return `https://wa.me/?text=${encodeURIComponent(messageLines.join("\n"))}`;
  };

  // Submit New Assignment
  const handleSubmitDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error(language === "mr" ? "कृपया शीर्षके लिहा." : "Please enter a title.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Omit<Assignment, "id" | "created_at"> = {
        target_class: targetClass,
        title: title.trim(),
        content_text: contentText.trim(),
        media_type: mediaType,
        media_url: mediaUrl.trim() || undefined,
        faculty_id: user?.id,
        author_name: user?.name || "Shri. R. M. Patil (Headmaster)",
      };

      const created = await createAssignment(payload);
      setAssignments((prev) => [created, ...prev]);
      toast.success(
        language === "mr"
          ? "अभ्यास व सूचना यशस्वीरित्या प्रसारित केली!"
          : "Assignment broadcast published successfully!"
      );

      // Reset
      setTitle("");
      setContentText("");
      setMediaUrl("");
      setMediaType("text");
      setTargetClass(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(language === "mr" ? "प्रसारण करताना त्रुटी आली." : "Failed to publish broadcast.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#6C151E] uppercase tracking-wider mb-1">
            <Send className="w-4 h-4 text-[#6C151E]" />
            <span>
              {language === "mr" ? "माध्यम व गृहपाठ प्रसारक" : "Media & Assignment Broadcast"}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
            {t.assignmentsTitle}
          </h1>
          <p className="text-xs md:text-sm text-stone-600 mt-1 max-w-2xl">
            {t.assignmentsSubtitle}
          </p>
        </div>

        {/* Action Button */}
        <div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-lg bg-[#6C151E] hover:bg-[#851C27] text-white shadow-md active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t.newAssignmentBtn}</span>
          </button>
        </div>
      </div>

      {/* Class Filter Bar */}
      <div className="py-6 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedClassFilter(null)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              selectedClassFilter === null
                ? "bg-[#6C151E] text-white border-[#6C151E] shadow-xs"
                : "bg-white text-stone-700 border-stone-300 hover:border-[#6C151E]"
            }`}
          >
            {t.classSelectorAll}
          </button>

          {[1, 2, 3, 4, 5].map((cls) => (
            <button
              key={cls}
              type="button"
              onClick={() => setSelectedClassFilter(cls)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                selectedClassFilter === cls
                  ? "bg-[#6C151E] text-white border-[#6C151E] shadow-xs"
                  : "bg-white text-stone-700 border-stone-300 hover:border-[#6C151E]"
              }`}
            >
              {language === "mr" ? `इयत्ता ${cls}` : `Class ${cls}`}
            </button>
          ))}
        </div>

        <span className="text-xs text-stone-500 font-medium">
          {assignments.length} {language === "mr" ? "सक्रिय संदेश" : "active broadcasts"}
        </span>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-stone-200 p-6 h-40 animate-pulse" />
          ))}
        </div>
      ) : assignments.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border-2 border-dashed border-stone-300 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#6C151E] flex items-center justify-center mx-auto">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-base">
              {language === "mr" ? "या वर्गासाठी कोणताही अभ्यास प्रसारित केलेला नाही" : "No assignments found for this filter"}
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              {language === "mr" ? "नवीन अभ्यास पाठवण्यासाठी वरील बटणाचा वापर करा." : "Use the button above to publish homework or notices."}
            </p>
          </div>
        </div>
      ) : (
        /* Assignments Feed */
        <div className="space-y-6">
          {assignments.map((item) => {
            const youtubeEmbed = item.media_type === "youtube" && item.media_url ? getYouTubeEmbedUrl(item.media_url) : null;
            const formattedDate = new Date(item.created_at).toLocaleDateString(
              language === "mr" ? "mr-IN" : "en-US",
              { year: "numeric", month: "short", day: "numeric" }
            );

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-stone-200/90 hover:border-[#6C151E]/60 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* Header */}
                <div className="bg-[#FAF7F2] px-5 py-3 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#6C151E] text-white">
                      {item.target_class
                        ? (language === "mr" ? `इयत्ता ${item.target_class}` : `Class ${item.target_class}`)
                        : (language === "mr" ? "सर्व वर्ग (Classes 1–5)" : "All Classes (1–5)")}
                    </span>
                    <span className="text-xs text-stone-500 flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {formattedDate}
                    </span>
                  </div>

                  <span className="text-xs text-stone-600 font-medium">
                    {language === "mr" ? "प्रसारक:" : "Dispatched by:"}{" "}
                    <strong className="text-stone-900">{item.author_name || "Headmaster"}</strong>
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 md:p-6 space-y-4">
                  <h3 className="text-lg font-bold text-stone-900 leading-snug">
                    {item.title}
                  </h3>

                  {item.content_text && (
                    <div className="text-xs md:text-sm text-stone-700 leading-relaxed whitespace-pre-line bg-stone-50/50 p-4 rounded-lg border border-stone-100">
                      {item.content_text}
                    </div>
                  )}

                  {/* Multi-Format Payload Renderers */}
                  {/* YouTube Video Safe Preview */}
                  {item.media_type === "youtube" && youtubeEmbed && (
                    <div className="rounded-xl overflow-hidden aspect-video max-w-2xl border-2 border-stone-200 shadow-xs">
                      <iframe
                        src={youtubeEmbed}
                        title={item.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {/* Image Attachment */}
                  {item.media_type === "image" && item.media_url && (
                    <div className="relative rounded-xl overflow-hidden max-w-xl max-h-96 border border-stone-200">
                      <Image
                        src={item.media_url}
                        alt={item.title}
                        width={700}
                        height={400}
                        className="w-full object-contain"
                      />
                    </div>
                  )}

                  {/* Document / PDF Attachment */}
                  {item.media_type === "document" && item.media_url && (
                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8CFB5] max-w-lg">
                      <div className="w-10 h-10 rounded-lg bg-[#6C151E] text-white flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-stone-900 truncate">
                          {language === "mr" ? "संलग्न परिपत्रक / कार्यपत्रिका" : "Circular / Study Worksheet"}
                        </p>
                        <p className="text-[11px] text-stone-500 font-mono truncate">
                          {item.media_url.split("/").pop()}
                        </p>
                      </div>
                      <a
                        href={item.media_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#0F3D3A] text-white text-xs font-semibold hover:bg-[#165551] flex items-center gap-1.5 transition-colors shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{t.downloadDocument}</span>
                      </a>
                    </div>
                  )}

                  {/* External URL Hyperlink */}
                  {item.media_type === "url" && item.media_url && (
                    <div className="pt-1">
                      <a
                        href={item.media_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-100 hover:bg-[#F5DABF]/50 text-stone-800 hover:text-[#6C151E] text-xs font-semibold border border-stone-300 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#6C151E]" />
                        <span>{item.media_url}</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* Footer with Direct WhatsApp Broadcast Trigger */}
                <div className="px-5 py-3 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span className="capitalize font-medium">Format: {item.media_type}</span>
                  </div>

                  {/* Click-to-Share to WhatsApp */}
                  <a
                    href={getWhatsAppShareUrl(item)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                    title="Dispatch message directly to parents on WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-current" />
                    <span>{t.shareWhatsApp}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Dispatch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white rounded-2xl shadow-2xl border-2 border-[#E8CFB5] w-full max-w-2xl max-h-[92vh] overflow-y-auto text-stone-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#6C151E] text-white p-5 rounded-t-2xl flex items-center justify-between sticky top-0 z-10 border-b-2 border-[#D4AF37]/50">
              <div>
                <h2 className="text-lg font-bold">{t.newAssignmentBtn}</h2>
                <p className="text-xs text-[#F5DABF]">
                  {language === "mr" ? "पालक व विद्यार्थ्यांसाठी नवीन संदेश किंवा अभ्यास तयार करा" : "Publish materials directly to noticeboard and parent desk"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitDispatch} className="p-6 space-y-4">
              {/* Target Class */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {language === "mr" ? "लक्ष्य वर्ग / इयत्ता" : "Target Class"} *
                </label>
                <div className="grid grid-cols-6 gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetClass(null)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      targetClass === null
                        ? "bg-[#6C151E] text-white border-[#6C151E]"
                        : "bg-white text-stone-700 border-stone-300"
                    }`}
                  >
                    All
                  </button>
                  {[1, 2, 3, 4, 5].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setTargetClass(c)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        targetClass === c
                          ? "bg-[#6C151E] text-white border-[#6C151E]"
                          : "bg-white text-stone-700 border-stone-300"
                      }`}
                    >
                      Cls {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {language === "mr" ? "अभ्यास / परिपत्रक शीर्षक" : "Broadcast Title"} *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Class 3 Science Observation Worksheet"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#6C151E]"
                />
              </div>

              {/* Media Format Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {language === "mr" ? "माध्यम स्वरूप निवडा" : "Payload Format"}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "text", label: "Note / Text", icon: FileText },
                    { id: "youtube", label: "YouTube", icon: Video },
                    { id: "document", label: "PDF / Doc", icon: Download },
                    { id: "url", label: "Web Link", icon: LinkIcon },
                  ].map((fmt) => {
                    const Icon = fmt.icon;
                    return (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setMediaType(fmt.id as MediaType)}
                        className={`p-2.5 rounded-lg border flex flex-col items-center gap-1 text-xs font-semibold transition-all ${
                          mediaType === fmt.id
                            ? "bg-[#0F3D3A] text-white border-[#0F3D3A]"
                            : "bg-stone-50 text-stone-700 border-stone-300 hover:border-stone-400"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{fmt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* URL or File input based on format */}
              {mediaType === "youtube" && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 font-mono bg-white focus:outline-none focus:ring-2 focus:ring-[#6C151E]"
                  />
                </div>
              )}

              {mediaType === "url" && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Web Link URL
                  </label>
                  <input
                    type="url"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://education.maharashtra.gov.in"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 font-mono bg-white focus:outline-none focus:ring-2 focus:ring-[#6C151E]"
                  />
                </div>
              )}

              {mediaType === "document" && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {language === "mr" ? "दस्तऐवज / PDF अपलोड करा" : "Upload Document / PDF"}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*"
                      onChange={handleFileUpload}
                      className="text-xs text-stone-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#0F3D3A] file:text-white hover:file:bg-[#165551]"
                    />
                    {isUploading && <Loader2 className="w-4 h-4 animate-spin text-[#6C151E]" />}
                  </div>
                  {mediaUrl && (
                    <p className="text-[11px] text-emerald-700 font-mono truncate">
                      ✓ File attached: {mediaUrl}
                    </p>
                  )}
                </div>
              )}

              {/* Rich Text / WhatsApp Message Body */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {language === "mr" ? "मजकूर व व्हॉट्सॲप संदेश" : "Message Body (WhatsApp Ready)"}
                </label>
                <textarea
                  rows={4}
                  value={contentText}
                  onChange={(e) => setContentText(e.target.value)}
                  placeholder="Enter detailed instructions, homework tasks, or circular notes..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#6C151E]"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-stone-600 hover:bg-stone-100"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg bg-[#6C151E] text-white hover:bg-[#851C27] active:scale-95 transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>{language === "mr" ? "प्रसारित करा" : "Dispatch Now"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
