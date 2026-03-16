"use client";

import dynamic from "next/dynamic";
import PhoneMockup from "./PhoneMockup";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export default function Hero() {
  return (
    <div className="mx-auto max-w-[1100px] px-6">
      {/* ── Top: Full-width 3D Particle Scene ── */}
      <div className="relative flex items-center justify-center">
        {/* Radial glow behind particles */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,169,110,0.06) 0%, transparent 70%)",
          }}
        />
        <HeroScene />
      </div>

      {/* ── Bottom: Content Grid ── */}
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left Column */}
        <div className="flex flex-col items-start">
          {/* Beta Badge */}
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-primary/20 bg-primary/[0.08] px-4 py-2 backdrop-blur-sm">
            <span className="h-[6px] w-[6px] rounded-full bg-primary animate-pulse-dot" />
            <span className="text-[13px] font-medium text-primary/90 tracking-wide">
              Now in private beta
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-cormorant text-[48px] font-light leading-[1.08] tracking-[-1.5px] text-white lg:text-[60px]">
            See it before
            <br />
            you <em className="text-primary italic">taste</em> it
          </h1>

          {/* Divider line */}
          <div
            className="mt-6 h-[1px] w-16"
            style={{
              background:
                "linear-gradient(90deg, #C9A96E, transparent)",
            }}
          />

          {/* Subheadline */}
          <p className="mt-6 max-w-[460px] text-[15px] font-light leading-[1.8] text-white/50">
            Photorealistic 3D dish previews that appear right on your
            guest&apos;s table. No app download, no friction — just point, see,
            and order with confidence.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="/demo"
              className="group relative overflow-hidden rounded-full px-7 py-3.5 text-[14px] font-medium text-white transition-all duration-300 hover:shadow-[0_8px_32px_rgba(201,169,110,0.35)]"
              style={{
                background: "linear-gradient(135deg, #C9A96E, #B08D57)",
                boxShadow: "0 4px 24px rgba(201,169,110,0.25)",
              }}
            >
              <span className="relative z-10">Try demo</span>
              {/* Shimmer effect */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </a>
            <a
              href="#how-it-works"
              className="rounded-full border border-white/[0.08] bg-white/[0.02] px-7 py-3.5 text-[14px] font-medium text-white/60 backdrop-blur-sm transition-all duration-300 hover:border-white/15 hover:bg-white/[0.04] hover:text-white/90"
            >
              See how it works
            </a>
          </div>

          {/* Social Proof */}
          <div className="mt-10 flex items-center gap-3">
            <div className="flex -space-x-2">
              {["#C9A96E", "#B08D57", "#8BA88E", "#9B8EC4"].map(
                (color, i) => (
                  <div
                    key={i}
                    className="h-7 w-7 rounded-full border-2 border-dark"
                    style={{ background: color, opacity: 0.85 }}
                  />
                )
              )}
            </div>
            <span className="text-[13px] text-white/25 tracking-wide">
              12+ premium restaurants in pilot
            </span>
          </div>
        </div>

        {/* Right Column: Phone Mockup */}
        <div className="relative flex items-center justify-center">
          <PhoneMockup />
        </div>
      </div>
    </div>
  );
}
