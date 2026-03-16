"use client";

import { useState, useEffect } from "react";

export default function FloatingContact() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <a
      href="/contact"
      className={`fixed bottom-6 right-6 z-[9998] flex items-center gap-2.5 rounded-full border border-white/[0.08] px-5 py-3 text-[13px] font-medium tracking-wide text-white/90 backdrop-blur-xl transition-all duration-700 hover:scale-[1.04] hover:border-white/[0.15] hover:text-white hover:shadow-[0_8px_40px_rgba(201,169,110,0.2)] ${
        show
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
      style={{
        background:
          "linear-gradient(135deg, rgba(201,169,110,0.15), rgba(176,141,87,0.12))",
        boxShadow:
          "0 4px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C9A96E] opacity-60" />
        <span
          className="relative inline-flex h-2 w-2 rounded-full"
          style={{
            background: "linear-gradient(135deg, #C9A96E, #B08D57)",
          }}
        />
      </span>
      Contact Us
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-50"
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </a>
  );
}
