"use client";

export default function ScrollHint() {
  return (
    <div className="flex flex-col items-center gap-3 pt-12 pb-8">
      <div
        className="h-[40px] w-[1px] origin-top animate-scroll-line"
        style={{
          background: "linear-gradient(180deg, #C9A96E, transparent)",
        }}
      />
      <span className="text-[10px] font-medium tracking-[3px] text-white/30 uppercase">
        Scroll to explore
      </span>
    </div>
  );
}
