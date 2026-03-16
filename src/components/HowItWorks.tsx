"use client";

import SectionTag from "./SectionTag";
import { useScrollReveal } from "./useScrollReveal";

const steps = [
  {
    num: "01",
    title: "Scan",
    description:
      "Guest scans QR code on table. AR menu loads in under 2 seconds — no app download required.",
  },
  {
    num: "02",
    title: "Explore",
    description:
      "Browse the full menu with 3D previews. Tap any dish to rotate, zoom, and inspect every detail.",
  },
  {
    num: "03",
    title: "Place",
    description:
      "Tap 'View on Table' and the dish appears on their actual table through the camera. Life-size, photorealistic.",
  },
];

function StepCard({
  num,
  title,
  description,
  delay,
}: {
  num: string;
  title: string;
  description: string;
  delay: number;
}) {
  const ref = useScrollReveal(delay);

  return (
    <div ref={ref} className="flex flex-col items-center px-2 text-center">
      <span className="font-cormorant text-[56px] font-light tracking-[-2px] text-primary">
        {num}
      </span>
      <div className="my-4 h-[1px] w-8 bg-primary/20" />
      <h3 className="font-cormorant text-[24px] font-normal text-white">
        {title}
      </h3>
      <p className="mt-3 text-[14px] font-light leading-[1.6] text-white/55">
        {description}
      </p>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-[100px]">
      <div className="mx-auto max-w-[680px] px-6 text-center">
        <SectionTag text="How it works" />
        <h2 className="font-cormorant text-[42px] font-light leading-[1.15] text-white">
          Three steps. That&apos;s it.
        </h2>
      </div>

      <div className="mx-auto mt-16 grid max-w-[900px] grid-cols-1 gap-12 px-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <StepCard key={i} {...step} delay={i * 150} />
        ))}
      </div>
    </section>
  );
}
