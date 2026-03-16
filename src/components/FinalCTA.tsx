"use client";

import { useScrollReveal } from "./useScrollReveal";

export default function FinalCTA() {
  const ref = useScrollReveal(0);

  return (
    <section
      id="cta"
      className="relative py-[120px] overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(201,169,110,0.06) 0%, transparent 70%)",
      }}
    >
      {/* Decorative lines */}
      <div
        className="absolute left-1/2 top-0 h-20 w-[1px] -translate-x-1/2"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(201,169,110,0.2), transparent)",
        }}
      />

      <div ref={ref} className="mx-auto max-w-[600px] px-6 text-center">
        <h2 className="font-cormorant text-[42px] font-light leading-[1.15] text-white">
          Your competitors will have this within a year.
        </h2>
        <p className="mx-auto mt-6 max-w-[480px] text-[15px] font-light leading-[1.8] text-white/45">
          The question is whether you&apos;ll be the one they&apos;re copying,
          or the one playing catch-up.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="/contact"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-10 py-4 text-[16px] font-semibold text-white transition-all duration-300 hover:shadow-[0_8px_40px_rgba(201,169,110,0.4)]"
            style={{
              background: "linear-gradient(135deg, #C9A96E, #B08D57)",
              boxShadow: "0 6px 32px rgba(201,169,110,0.3)",
            }}
          >
            <span className="relative z-10">Get Started Today</span>
            <svg
              className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </a>

          <a
            href="/demo"
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-8 py-4 text-[15px] font-medium text-white/60 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-white"
          >
            Try Demo First
          </a>
        </div>
      </div>
    </section>
  );
}
