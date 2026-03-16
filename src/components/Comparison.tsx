"use client";

import SectionTag from "./SectionTag";
import { useScrollReveal } from "./useScrollReveal";

const withoutItems = [
  "Annual photoshoot costs: ₹1.5-3L",
  "Menu reprinting every season: ₹50K-1L",
  "Lost upsells on premium dishes",
  "Foreign guest missed orders",
  "Zero data on guest preferences",
  "Static, stale menu experience",
];

const withItems = [
  "AI-generated 3D models in minutes",
  "15-25% higher average order value",
  "Auto-translation in 8+ languages",
  "Real-time analytics dashboard",
  "Zero reprinting costs ever again",
  "Free organic social media marketing",
];

export default function Comparison() {
  const leftRef = useScrollReveal(0);
  const rightRef = useScrollReveal(150);

  return (
    <section className="py-[100px]">
      <div className="mx-auto max-w-[680px] px-6 text-center">
        <SectionTag text="The math" />
        <h2 className="font-cormorant text-[42px] font-light leading-[1.15] text-white">
          Your current menu costs more than you think
        </h2>
        <div
          className="mx-auto mt-4 h-[1px] w-12"
          style={{
            background:
              "linear-gradient(90deg, transparent, #C9A96E, transparent)",
          }}
        />
      </div>

      <div className="mx-auto mt-14 grid max-w-[800px] grid-cols-1 gap-5 px-6 md:grid-cols-2">
        {/* Without Card */}
        <div
          ref={leftRef}
          className="group rounded-[16px] border border-white/[0.06] bg-white/[0.02] p-7 transition-all duration-500 hover:border-white/[0.1] hover:bg-white/[0.03]"
        >
          <h3 className="mb-6 text-[15px] font-medium text-white/50">
            Without Axon Aura
          </h3>
          <div className="flex flex-col gap-3.5">
            {withoutItems.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-0.5 text-[14px] font-semibold text-accent/80">
                  ✕
                </span>
                <span className="text-[14px] font-light text-white/45">
                  {item}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-white/[0.06] pt-5">
            <span className="text-[12px] text-white/25 tracking-wide">
              Annual cost
            </span>
            <p className="font-cormorant text-[22px] text-accent/90">
              ₹2-4+ lakhs
            </p>
          </div>
        </div>

        {/* With Card */}
        <div
          ref={rightRef}
          className="group relative overflow-hidden rounded-[16px] border border-primary/15 p-7 transition-all duration-500 hover:border-primary/25"
          style={{ background: "rgba(201,169,110,0.03)" }}
        >
          <div
            className="pointer-events-none absolute -right-12 -top-12 h-24 w-24 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: "rgba(201,169,110,0.15)" }}
          />
          <h3 className="mb-6 text-[15px] font-medium text-primary/90">
            With Axon Aura
          </h3>
          <div className="flex flex-col gap-3.5">
            {withItems.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-0.5 text-[14px] font-semibold text-[#8BA88E]/80">
                  +
                </span>
                <span className="text-[14px] font-light text-white/50">
                  {item}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-primary/15 pt-5">
            <span className="text-[12px] text-white/25 tracking-wide">
              Starts at
            </span>
            <p className="font-cormorant text-[22px] text-primary">
              ₹14,999/month
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
