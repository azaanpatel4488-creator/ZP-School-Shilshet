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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      }
    };
  }, []);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === "undefined") return;

    // If currently playing, stop both audio & speech synthesis
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      return;
    }

    // Cancel any previous speech
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Clean text of markdown, URLs, symbols for natural speech
    const cleanText = text
      .replace(/https?:\/\/\S+/g, "")
      .replace(/[•★\-\_\*#]/g, " ")
      .trim();

    if (!cleanText) return;

    // 1. Check for native browser Marathi voice (pre-installed on Android & modern devices)
    let marathiVoice: SpeechSynthesisVoice | undefined = undefined;
    if ("speechSynthesis" in window) {
      const voices = window.speechSynthesis.getVoices();
      marathiVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith("mr") ||
          v.name.toLowerCase().includes("marathi")
      );
    }

    if (marathiVoice && "speechSynthesis" in window) {
      // Use native device engine
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utteranceRef.current = utterance;
      utterance.voice = marathiVoice;
      utterance.lang = marathiVoice.lang;
      utterance.rate = 0.85; // Clear, comfortable cadence for primary parents & kids
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    } else {
      // 2. High-Fidelity Cloud Marathi Voice fallback
      // (Guarantees fluent native Marathi pronunciation even on Windows desktops without Marathi voice packs)
      try {
        const snippet = cleanText.slice(0, 180);
        const streamUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=mr&client=tw-ob&q=${encodeURIComponent(
          snippet
        )}`;
        const audio = new Audio(streamUrl);
        audioRef.current = audio;

        audio.onplay = () => setIsPlaying(true);
        audio.onended = () => {
          setIsPlaying(false);
          audioRef.current = null;
        };
        audio.onerror = () => {
          // If network stream blocked, fall back to whatever voice the device has
          if ("speechSynthesis" in window) {
            const fallbackUtterance = new SpeechSynthesisUtterance(cleanText);
            fallbackUtterance.lang = "mr-IN";
            fallbackUtterance.rate = 0.85;
            fallbackUtterance.onstart = () => setIsPlaying(true);
            fallbackUtterance.onend = () => setIsPlaying(false);
            fallbackUtterance.onerror = () => setIsPlaying(false);
            window.speechSynthesis.speak(fallbackUtterance);
          } else {
            setIsPlaying(false);
          }
        };

        audio.play().catch(() => {
          if ("speechSynthesis" in window) {
            const fallbackUtterance = new SpeechSynthesisUtterance(cleanText);
            fallbackUtterance.lang = "mr-IN";
            window.speechSynthesis.speak(fallbackUtterance);
          } else {
            setIsPlaying(false);
          }
        });
      } catch (err) {
        console.error("Audio playback error:", err);
        setIsPlaying(false);
      }
    }
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

