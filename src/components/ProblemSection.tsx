"use client";

import SectionTag from "./SectionTag";
import { useScrollReveal } from "./useScrollReveal";

const problems = [
  {
    icon: "?",
    title: "Decision fatigue",
    description:
      "Guests stare at 80-item menus with no visual reference. They default to safe choices, skipping your best dishes.",
    bg: "rgba(176,141,87,0.08)",
  },
  {
    icon: "$",
    title: "Lost premium upsells",
    description:
      "Your 695-rupee truffle risotto looks the same as the 345-rupee dal on paper. Text can't sell texture, presentation, or craft.",
    bg: "rgba(176,141,87,0.08)",
  },
  {
    icon: "~",
    title: "Language barriers",
    description:
      "International guests can't read Hindi dish names. Staff spends minutes explaining instead of serving.",
    bg: "rgba(176,141,87,0.08)",
  },
  {
    icon: "!",
    title: "Stale photography",
    description:
      "Printed menus with last year's photos. Seasonal specials never get photographed. New dishes launch invisible.",
    bg: "rgba(176,141,87,0.08)",
  },
];

function ProblemCard({
  icon,
  title,
  description,
  bg,
  delay,
}: {
  icon: string;
  title: string;
  description: string;
  bg: string;
  delay: number;
}) {
  const ref = useScrollReveal(delay);

  return (
    <div
      ref={ref}
      className="rounded-[14px] border border-white/[0.06] bg-white/[0.025] p-8"
    >
      <div
        className="mb-4 flex h-10 w-10 items-center justify-center rounded-[10px] text-lg font-semibold text-accent"
        style={{ background: bg }}
      >
        {icon}
      </div>
      <h3 className="mb-2 text-[17px] font-medium text-white">{title}</h3>
      <p className="text-[14px] font-light leading-[1.6] text-white/55">
        {description}
      </p>
    </div>
  );
}

export default function ProblemSection() {
  return (
    <section className="py-[100px]">
      {/* Intro */}
      <div className="mx-auto max-w-[680px] px-6 text-center">
        <SectionTag text="The problem" />
        <h2 className="font-cormorant text-[42px] font-light leading-[1.15] text-white">
          Your guests are ordering blind
        </h2>
        <p className="mx-auto mt-5 max-w-[560px] text-[16px] font-light leading-[1.7] text-white/55">
          72% of diners say they&apos;d order differently if they could see the
          dish first. Language barriers, text-only menus, and outdated
          photography cost premium restaurants lakhs in missed upsells every
          year.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="mx-auto mt-14 grid max-w-[1100px] grid-cols-1 gap-5 px-6 md:grid-cols-2">
        {problems.map((p, i) => (
          <ProblemCard key={i} {...p} delay={i * 120} />
        ))}
      </div>
    </section>
  );
}
