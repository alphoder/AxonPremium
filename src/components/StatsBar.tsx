"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 25, suffix: "%", label: "Higher average order value" },
  { value: 40, suffix: "%", label: "Faster table decisions" },
  { value: 3, suffix: "x", label: "More social media shares" },
  { value: 92, suffix: "%", label: "Guest engagement rate" },
];

function AnimatedCounter({
  target,
  suffix,
}: {
  target: number;
  suffix: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(interval);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="font-cormorant text-[44px] font-light text-primary">
      {count}
      {suffix}
    </span>
  );
}

export default function StatsBar() {
  return (
    <div className="border-y border-white/[0.06] bg-white/[0.015]">
      <div className="mx-auto grid max-w-[1100px] grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <AnimatedCounter target={stat.value} suffix={stat.suffix} />
            <span className="mt-1 text-[13px] text-white/30">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
