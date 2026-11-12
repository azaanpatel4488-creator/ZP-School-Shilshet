"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Play, Pause, Mic, RotateCcw, Volume2 } from "lucide-react";

interface VoiceNotePlayerProps {
  audioUrl?: string;
  teacherName?: string;
  durationLabel?: string;
  className?: string;
}

export const VoiceNotePlayer: React.FC<VoiceNotePlayerProps> = ({
  audioUrl,
  teacherName = "श्री. अकबर पटेल (शिक्षक)",
  durationLabel = "0:42",
  className = "",
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Safe fallback audio (synthesized chime or sample teacher message)
  // using a lightweight standard web audio chime if audioUrl is a mock
  const fallbackUrl =
    "https://actions.google.com/sounds/v1/ambiences/outdoor_festival.ogg";
  const sourceUrl = audioUrl || fallbackUrl;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.warn("Audio play prevented:", e);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    const dur = audioRef.current.duration || 1;
    setProgress((cur / dur) * 100);

    const mins = Math.floor(cur / 60);
    const secs = Math.floor(cur % 60);
    setCurrentTime(`${mins}:${secs < 10 ? "0" : ""}${secs}`);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const targetPercent = Number(e.target.value);
    const dur = audioRef.current.duration || 1;
    audioRef.current.currentTime = (targetPercent / 100) * dur;
    setProgress(targetPercent);
  };

  const handleToggleSpeed = () => {
    if (!audioRef.current) return;
    const nextRate = playbackRate === 1.0 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1.0;
    audioRef.current.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  return (
    <div
      className={`p-3.5 rounded-2xl bg-gradient-to-r from-[#0F3D3A]/10 to-[#FAF7F2] border-2 border-[#0F3D3A]/25 flex flex-col gap-2 shadow-xs ${className}`}
    >
      <audio
        ref={audioRef}
        src={sourceUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          setIsPlaying(false);
          setProgress(0);
          setCurrentTime("0:00");
        }}
      />

      {/* Top micro badge */}
      <div className="flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 font-bold text-[#0F3D3A]">
          <Mic className="w-3.5 h-3.5 text-[#0F3D3A]" />
          <span>शिक्षकांचा व्हॉईस संदेश (Teacher Voice Note)</span>
        </div>
        <span className="text-[10px] text-stone-500 font-mono">
          {teacherName}
        </span>
      </div>

      {/* Player Controls Bar */}
      <div className="flex items-center gap-3">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-white shadow-md active:scale-95 transition-all shrink-0 ${
            isPlaying ? "bg-[#6C151E]" : "bg-[#0F3D3A] hover:bg-[#165551]"
          }`}
          title={isPlaying ? "थांबवा (Pause)" : "ऐका (Play)"}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        {/* Progress & Waveform Slider */}
        <div className="flex-1 space-y-1">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="w-full h-1.5 bg-stone-300 rounded-lg appearance-none cursor-pointer accent-[#0F3D3A]"
          />
          <div className="flex items-center justify-between text-[10px] font-mono text-stone-500">
            <span>{currentTime}</span>
            <span>{durationLabel}</span>
          </div>
        </div>

        {/* Speed button */}
        <button
          type="button"
          onClick={handleToggleSpeed}
          className="px-2 py-0.5 rounded-md bg-stone-200 hover:bg-stone-300 text-[10px] font-bold text-stone-700 shrink-0"
        >
          {playbackRate}x
        </button>
      </div>
    </div>
  );
};
