"use client";

import React, { useState } from "react";
import Image from "next/image";

interface SchoolLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  size = "md",
  className = "",
  showText = false,
}) => {
  const [hasError, setHasError] = useState(false);

  const dimensionMap = {
    sm: 40,
    md: 52,
    lg: 72,
    xl: 104,
  };

  const px = dimensionMap[size];

  // SVG Fallback Emblem if logo.png fails or is absent
  const renderFallbackSvg = () => (
    <div
      style={{ width: px, height: px }}
      className={`relative rounded-full flex items-center justify-center bg-[#0F3D3A] border-2 border-[#D4AF37] shadow-inner select-none ${className}`}
      aria-label="ZP Shilshet Emblem"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full p-1"
      >
        {/* Outer Ring */}
        <circle cx="50" cy="50" r="46" stroke="#D4AF37" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="41" stroke="#F5DABF" strokeWidth="1" strokeDasharray="2 2" />

        {/* Circular text simulation / arc banner */}
        <path
          id="textArc"
          d="M 22 45 A 32 32 0 0 1 78 45"
          fill="none"
        />
        <text
          fill="#D4AF37"
          fontSize="8.5"
          fontWeight="bold"
          letterSpacing="1.2"
          textAnchor="middle"
        >
          <textPath href="#textArc" startOffset="50%">
            ZP SHILSHET
          </textPath>
        </text>

        {/* Sunburst Rays */}
        <g stroke="#D4AF37" strokeWidth="1.5" opacity="0.8">
          <line x1="50" y1="32" x2="50" y2="24" />
          <line x1="42" y1="34" x2="36" y2="28" />
          <line x1="58" y1="34" x2="64" y2="28" />
          <line x1="36" y1="40" x2="28" y2="38" />
          <line x1="64" y1="40" x2="72" y2="38" />
        </g>

        {/* Lamp Flame */}
        <path
          d="M 50 30 C 47 35 48 39 50 42 C 52 39 53 35 50 30 Z"
          fill="#E6C35C"
        />

        {/* Open Book */}
        <path
          d="M 32 58 Q 50 63 50 70 Q 50 63 68 58 L 68 76 Q 50 80 50 86 Q 50 80 32 76 Z"
          fill="#FAF7F2"
          stroke="#D4AF37"
          strokeWidth="1.5"
        />
        <line x1="50" y1="67" x2="50" y2="86" stroke="#0F3D3A" strokeWidth="1.5" />

        {/* Olive / Laurel Leaves */}
        <path
          d="M 25 80 Q 35 90 50 92 Q 65 90 75 80"
          stroke="#D4AF37"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    </div>
  );

  return (
    <div className="flex items-center gap-3">
      {hasError ? (
        renderFallbackSvg()
      ) : (
        <div
          style={{ width: px, height: px }}
          className={`relative rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-sm bg-white shrink-0 ${className}`}
        >
          <Image
            src="/logo.png"
            alt="ZP Primary School Shilshet Logo"
            width={px}
            height={px}
            className="w-full h-full object-contain"
            onError={() => setHasError(true)}
            priority
          />
        </div>
      )}

      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 leading-tight tracking-tight text-sm md:text-base">
            ZP Primary School Shilshet
          </span>
          <span className="text-xs text-stone-600 font-medium">
            जि. प. प्राथमिक शाळा शिलशेत
          </span>
        </div>
      )}
    </div>
  );
};

