"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Square, Loader2 } from "lucide-react";

interface MarathiSpeakerButtonProps {
  text: string;
  label?: string;
  className?: string;
  size?: "sm" | "md";
}

export const MarathiSpeakerButton: React.FC<MarathiSpeakerButtonProps> = ({
  text,
  label = "ऐका (Listen)",
  className = "",
  size = "sm",
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsSupported(false);
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isSupported || typeof window === "undefined") return;

    // If currently playing, stop
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Cancel any previous speech
    window.speechSynthesis.cancel();

    // Clean text of emojis or URLs for clear speech
    const cleanText = text
      .replace(/https?:\/\/\S+/g, "")
      .replace(/[•★\-\_\*]/g, " ")
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;

    // Detect Marathi or closest Devanagari voice
    const voices = window.speechSynthesis.getVoices();
    const marathiVoice =
      voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith("mr") ||
          v.name.toLowerCase().includes("marathi")
      ) ||
      voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith("hi") ||
          v.name.toLowerCase().includes("hindi")
      ) ||
      voices.find((v) => v.lang.toLowerCase().includes("in"));

    if (marathiVoice) {
      utterance.voice = marathiVoice;
      utterance.lang = marathiVoice.lang;
    } else {
      utterance.lang = "mr-IN";
    }

    // Gentle, clear cadence for young kids & parents
    utterance.rate = 0.85;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = (event) => {
      console.warn("Speech synthesis notice:", event);
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={handleSpeak}
      title={isPlaying ? "वाचन थांबवा (Stop speaking)" : "मराठीत ऐका (Listen in Marathi)"}
      className={`inline-flex items-center gap-1.5 rounded-full font-bold transition-all select-none active:scale-95 ${
        isPlaying
          ? "bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-sm animate-pulse"
          : "bg-[#0F3D3A]/10 hover:bg-[#0F3D3A] text-[#0F3D3A] hover:text-white border border-[#0F3D3A]/20"
      } ${
        size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3.5 py-1.5 text-xs"
      } ${className}`}
    >
      {isPlaying ? (
        <>
          <Square className="w-3 h-3 fill-current" />
          <span>थांबवा (Stop)</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
