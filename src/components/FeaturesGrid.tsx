"use client";

import SectionTag from "./SectionTag";
import { useScrollReveal } from "./useScrollReveal";

const features = [
  {
    accent: "#C9A96E",
    title: "Photorealistic AR",
    description:
      "AI-generated 3D models with a multi-pass quality pipeline. Every garnish, sauce drizzle, and grill mark — faithfully recreated.",
    icon: "◈",
  },
  {
    accent: "#8BA88E",
    title: "Zero friction",
    description:
      "No app download. QR to browser in under 2 seconds. Works on every modern smartphone out of the box.",
    icon: "◎",
  },
  {
    accent: "#9B8EC4",
    title: "Smart analytics",
    description:
      "Track which dishes guests view most, table engagement duration, and order correlation data in real time.",
    icon: "◇",
  },
  {
    accent: "#B08D57",
    title: "Multi-language",
    description:
      "AI-translated dish descriptions in Selected languages. Automatically detected from the guest's phone settings.",
    icon: "◆",
  },
  {
    accent: "#B5727E",
    title: "One-click updates",
    description:
      "Upload a photo of a new dish. Get a production-ready 3D model in minutes. No photoshoots, no reprints.",
    icon: "◉",
  },
  {
    accent: "#C9A96E",
    title: "Social amplification",
    description:
      "Guests screenshot and share AR dishes to Instagram and WhatsApp. Free, organic marketing for every table.",
    icon: "◈",
  },
];

function FeatureCard({
  accent,
  title,
  description,
  icon,
  delay,
}: {
  accent: string;
  title: string;
  description: string;
  icon: string;
  delay: number;
}) {
  const ref = useScrollReveal(delay);

  return (
    <div
      ref={ref}
      className="group relative overflow-hidden rounded-[16px] border border-white/[0.06] bg-white/[0.02] px-7 py-7 transition-all duration-500 hover:border-white/[0.1] hover:bg-white/[0.035]"
    >
      {/* Hover glow */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: accent }}
      />

      {/* Icon + accent bar */}
      <div className="mb-5 flex items-center gap-3">
        <span
          className="text-[18px] opacity-60"
          style={{ color: accent }}
        >
          {icon}
        </span>
        <div
          className="h-[2px] w-6 rounded-full transition-all duration-500 group-hover:w-10"
          style={{ background: accent, opacity: 0.6 }}
        />
      </div>

      <h3 className="mb-2.5 text-[16px] font-medium text-white/90 transition-colors duration-300 group-hover:text-white">
        {title}
      </h3>
      <p className="text-[13px] font-light leading-[1.7] text-white/45 transition-colors duration-300 group-hover:text-white/60">
        {description}
      </p>
    </div>
  );
}

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-[100px]">
      <div className="mx-auto max-w-[680px] px-6 text-center">
        <SectionTag text="Features" />
        <h2 className="font-cormorant text-[42px] font-light leading-[1.15] text-white">
          Built for premium hospitality
        </h2>
        <div
          className="mx-auto mt-4 h-[1px] w-12"
          style={{
            background: "linear-gradient(90deg, transparent, #C9A96E, transparent)",
          }}
        />
      </div>

      <div className="mx-auto mt-14 grid max-w-[1100px] grid-cols-1 gap-5 px-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <FeatureCard key={i} {...f} delay={i * 80} />
        ))}
      </div>
    </section>
  );
}
