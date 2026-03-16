"use client";

import { useState, useEffect, useCallback } from "react";
import { useScrollReveal } from "./useScrollReveal";

const testimonials = [
  {
    quote:
      "Our guests started photographing the AR dishes before the real food even arrived. That's free Instagram marketing we couldn't buy.",
    name: "Rajiv Sharma",
    role: "F&B Director",
    company: "The Grand Pavilion, Delhi",
    color: "#C9A96E",
  },
  {
    quote:
      "We saw a 22% increase in premium dish orders within the first month. International guests finally understood our menu without needing a translator.",
    name: "Priya Patel",
    role: "General Manager",
    company: "Spice Route, Mumbai",
    color: "#B08D57",
  },
  {
    quote:
      "The setup was seamless — they handled everything. From 3D modeling to QR card design, our team didn't have to lift a finger. World class service.",
    name: "Arjun Mehta",
    role: "Owner",
    company: "Saffron & Co, Bangalore",
    color: "#8BA88E",
  },
];

export default function Testimonial() {
  const ref = useScrollReveal(0);
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, next]);

  const goTo = (index: number) => {
    setCurrent(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10s
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const t = testimonials[current];

  return (
    <div className="border-y border-white/[0.06] bg-white/[0.015]">
      <div
        ref={ref}
        className="mx-auto max-w-[700px] px-6 py-20 text-center"
      >
        {/* Quote */}
        <div className="relative min-h-[180px]">
          <blockquote
            key={current}
            className="font-cormorant text-[26px] font-light italic leading-[1.5] text-white transition-all duration-500"
            style={{
              animation: "fadeInUp 0.5s ease forwards",
            }}
          >
            &ldquo;{t.quote}&rdquo;
          </blockquote>
        </div>

        {/* Author */}
        <div
          key={`author-${current}`}
          className="mt-8 flex items-center justify-center gap-3"
          style={{
            animation: "fadeInUp 0.5s ease 0.15s forwards",
            opacity: 0,
          }}
        >
          <div
            className="h-10 w-10 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`,
            }}
          />
          <div className="text-left">
            <p className="text-[14px] font-medium text-white">{t.name}</p>
            <p className="text-[12px] text-white/30">
              {t.role}, {t.company}
            </p>
          </div>
        </div>

        {/* Dots */}
        <div className="mt-8 flex items-center justify-center gap-2.5">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 bg-primary"
                  : "w-1.5 bg-white/15 hover:bg-white/30"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
