"use client";

import { useEffect, useState } from "react";

export default function SplashScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const duration = 2000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);

      if (p >= 1) {
        clearInterval(interval);
        setTimeout(onComplete, 200);
      }
    }, 16);

    // Show skip hint after 0.8s
    const skipTimer = setTimeout(() => setShowSkip(true), 800);

    return () => {
      clearInterval(interval);
      clearTimeout(skipTimer);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080808] cursor-pointer"
      onClick={onComplete}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(201,169,110,0.04) 0%, transparent 60%)",
        }}
      />

      {/* Logo */}
      <div
        className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl text-lg font-semibold text-white"
        style={{
          background: "linear-gradient(135deg, #C9A96E, #B08D57)",
          animation: "logoIn 0.8s ease forwards",
        }}
      >
        <span style={{ fontFamily: "Georgia, serif", fontSize: "24px" }}>
          A
        </span>
      </div>

      {/* Brand */}
      <h1
        className="text-[28px] font-normal tracking-[12px] text-white"
        style={{
          fontFamily: "Georgia, serif",
          animation: "textIn 0.8s ease 0.2s forwards",
          opacity: 0,
        }}
      >
        AXON AURA
      </h1>

      {/* Tagline */}
      <p
        className="mt-3 text-[13px] font-normal tracking-[3px] text-white/40 uppercase"
        style={{
          animation: "textIn 0.8s ease 0.4s forwards",
          opacity: 0,
        }}
      >
        See it before you taste it
      </p>

      {/* Loading bar */}
      <div className="mt-10 h-[2px] w-[120px] overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full transition-transform duration-100"
          style={{
            background: "linear-gradient(90deg, #C9A96E, #C9A96E)",
            transform: `scaleX(${progress})`,
            transformOrigin: "left",
          }}
        />
      </div>

      {/* Skip hint */}
      {showSkip && (
        <p
          className="mt-8 text-[11px] text-white/20"
          style={{ animation: "fadeIn 0.5s ease forwards" }}
        >
          Tap anywhere to skip
        </p>
      )}

      <style jsx>{`
        @keyframes logoIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes textIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
