"use client";

import { useState, useEffect, useRef } from "react";
import { dishes, categories, type Dish } from "./data";

export default function MenuGrid({
  onSelectDish,
}: {
  onSelectDish: (dish: Dish) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [visible, setVisible] = useState<boolean[]>([]);
  const [showHint, setShowHint] = useState(false);

  const filtered =
    activeCategory === "All"
      ? dishes
      : dishes.filter((d) => d.category === activeCategory);

  const prevCategory = useRef(activeCategory);

  useEffect(() => {
    if (prevCategory.current !== activeCategory) {
      setVisible([]);
      const timeouts: NodeJS.Timeout[] = [];
      filtered.forEach((_, i) => {
        timeouts.push(
          setTimeout(() => {
            setVisible((v) => {
              const next = [...v];
              next[i] = true;
              return next;
            });
          }, i * 80)
        );
      });
      prevCategory.current = activeCategory;
      return () => timeouts.forEach(clearTimeout);
    } else {
      setVisible(filtered.map(() => true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, filtered.length]);

  // Show hint after 2 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowHint(true), 2000);
    const t2 = setTimeout(() => setShowHint(false), 6000);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #C9A96E, #B08D57)" }}
          >
            <span style={{ fontFamily: "Georgia, serif" }}>A</span>
          </div>
          <div>
            <p className="text-[15px] font-semibold text-white" style={{ fontFamily: "Georgia, serif" }}>
              The Grand Pavilion
            </p>
            <p className="text-[11px] tracking-[1.5px] text-white/35 uppercase">
              Premium Dining
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5">
          <span className="h-[6px] w-[6px] animate-pulse rounded-full bg-[#8BA88E]" />
          <span className="text-[11px] font-medium text-white/50">AR Menu</span>
        </div>
      </div>

      {/* Hero Text */}
      <div className="px-5 py-4">
        <h1 className="text-[28px] font-normal text-white" style={{ fontFamily: "Georgia, serif" }}>
          Explore our menu
        </h1>
        <p className="mt-1.5 text-[13px] leading-[1.5] text-white/35">
          Tap any dish to preview in 3D. Place it on your table with AR.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto px-5 pb-4 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            title={`Filter: ${cat === "All" ? "Show all dishes" : `Show ${cat} only`}`}
            className={`flex-shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium transition-all ${
              activeCategory === cat
                ? "border-[#C9A96E]/40 bg-[#C9A96E]/[0.12] text-[#C9A96E]"
                : "border-white/[0.06] bg-transparent text-white/40 hover:text-white/60"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Floating Hint */}
      {showHint && (
        <div
          className="mx-5 mb-3 flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/[0.06] px-4 py-3 transition-all"
          style={{ animation: "hintFade 0.5s ease forwards" }}
          onClick={() => setShowHint(false)}
        >
          <span className="text-[16px]">👆</span>
          <span className="text-[13px] text-primary/80">
            Tap any dish below to preview it in 3D
          </span>
        </div>
      )}

      {/* Dish Cards */}
      <div className="flex flex-col gap-3 px-5 pb-24">
        {filtered.map((dish, i) => (
          <DishCard
            key={dish.id}
            dish={dish}
            visible={visible[i] ?? false}
            onClick={() => onSelectDish(dish)}
            showPulse={i === 0 && showHint}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.04] px-5 py-5 text-center">
        <p className="text-[11px] text-white/20">
          Powered by <span className="font-medium text-white/30">Axon Aura</span>
        </p>
        <p className="mt-1 text-[10px] text-white/15">
          AR dining experience by Axon
        </p>
      </div>

      <style jsx>{`
        @keyframes hintFade {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseRing {
          0% { box-shadow: 0 0 0 0 rgba(201,169,110,0.3); }
          70% { box-shadow: 0 0 0 8px rgba(201,169,110,0); }
          100% { box-shadow: 0 0 0 0 rgba(201,169,110,0); }
        }
      `}</style>
    </div>
  );
}

function DishCard({
  dish,
  visible,
  onClick,
  showPulse,
}: {
  dish: Dish;
  visible: boolean;
  onClick: () => void;
  showPulse?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-stretch overflow-hidden rounded-[14px] border border-white/[0.06] bg-white/[0.03] text-left transition-all duration-500 hover:border-white/[0.1] hover:bg-white/[0.05] active:scale-[0.98]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        animation: showPulse ? "pulseRing 2s ease infinite" : undefined,
      }}
    >
      {/* Image placeholder */}
      <div className="relative w-[120px] flex-shrink-0">
        <div className="h-full w-full" style={{ background: dish.gradient }} />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(90deg, transparent 60%, #080808 100%)" }}
        />
        <span className={`absolute top-2.5 left-2.5 rounded-md px-1.5 py-0.5 text-[9px] font-semibold backdrop-blur ${dish.modelSrc ? "bg-[#C9A96E]/30 text-[#C9A96E]" : "bg-black/50 text-white/80"}`}>
          {dish.modelSrc ? "3D Ready" : "3D"}
        </span>
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 py-4 pr-4 pl-3">
        <div className="flex items-center justify-between">
          <h3 className="truncate text-[15px] font-normal text-white" style={{ fontFamily: "Georgia, serif" }}>
            {dish.name}
          </h3>
          <span className="flex-shrink-0 text-[14px] font-medium text-[#C9A96E]">
            &#8377;{dish.price}
          </span>
        </div>
        <p className="line-clamp-2 text-[12px] leading-[1.4] text-white/35">
          {dish.description}
        </p>
        <div className="flex gap-1.5">
          {dish.tags.map((tag) => (
            <span key={tag} className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/25">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
