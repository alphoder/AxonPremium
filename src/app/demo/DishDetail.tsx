"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { type Dish } from "./data";

const ModelViewer = dynamic(() => import("./ModelViewer"), { ssr: false });

export default function DishDetail({
  dish,
  onBack,
}: {
  dish: Dish;
  onBack: () => void;
}) {
  const [infoVisible, setInfoVisible] = useState(false);
  const [showArHint, setShowArHint] = useState(false);
  const [showAr, setShowAr] = useState(false);

  const hasModel = !!dish.modelSrc;

  useEffect(() => {
    const t1 = setTimeout(() => setInfoVisible(true), 300);
    const t2 = setTimeout(() => setShowArHint(true), 1500);
    const t3 = setTimeout(() => setShowArHint(false), 5500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-5 pt-5 pb-3 text-[14px] text-white/50 transition-colors hover:text-white/80"
        title="Return to full menu"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to menu
      </button>

      {/* 3D Viewer Area */}
      <div className="mx-5 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0c0c0c]">
        {hasModel ? (
          <div className="relative h-[320px]">
            <ModelViewer
              src={dish.modelSrc!}
              alt={`3D model of ${dish.name}`}
              className="h-full w-full"
            />
            {/* 3D badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg bg-black/60 px-2.5 py-1 backdrop-blur-md">
              <span className="h-[6px] w-[6px] animate-pulse rounded-full bg-[#8BA88E]" />
              <span className="text-[10px] font-semibold tracking-[1px] text-white/70">3D MODEL</span>
            </div>
            {/* Interaction hint */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
              <span className="rounded-full bg-black/50 px-3 py-1 text-[10px] text-white/30 backdrop-blur">
                Drag to rotate · Pinch to zoom
              </span>
            </div>
          </div>
        ) : (
          <div
            className="flex h-[320px] items-center justify-center relative"
            style={{ background: dish.gradient, opacity: 0.15 }}
          >
            <div className="text-center" style={{ opacity: 1 / 0.15 }}>
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <p className="text-[12px] text-white/30">3D model preview</p>
              <p className="mt-1 text-[10px] text-white/15">Model coming soon</p>
            </div>
          </div>
        )}
      </div>

      {/* AR CTA Button */}
      <div className="px-5 pt-4 relative">
        <button
          onClick={() => {
            if (hasModel) {
              // Try to trigger native AR on mobile via model-viewer's activateAR()
              const mv = document.querySelector("model-viewer") as HTMLElement & { activateAR?: () => void };
              if (mv && mv.activateAR) {
                try {
                  mv.activateAR();
                  return;
                } catch {
                  // Fall through to simulated AR
                }
              }
              // Fallback: Android Scene Viewer intent
              const isAndroid = /android/i.test(navigator.userAgent);
              const isIOS = /iphone|ipad/i.test(navigator.userAgent);
              if (isAndroid && dish.modelSrc) {
                const fullUrl = `${window.location.origin}${dish.modelSrc}`;
                window.location.href = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(fullUrl)}&mode=ar_preferred&title=${encodeURIComponent(dish.name)}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;end;`;
                return;
              }
              if (isIOS && dish.modelSrc) {
                // iOS Quick Look needs USDZ, GLB won't work natively
                // Fall through to simulated AR
              }
            }
            setShowAr(true);
          }}
          className="flex w-full items-center justify-center gap-2.5 rounded-xl py-4 text-[15px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #C9A96E, #B08D57)",
            boxShadow: "0 4px 24px rgba(201,169,110,0.3)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          View on your table
        </button>

        {/* AR Hint Tooltip */}
        {showArHint && (
          <div
            className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-primary/20 bg-[#1a1a1a] px-3 py-2 text-[12px] text-primary/80 shadow-lg"
            style={{ animation: "hintBounce 0.5s ease forwards" }}
            onClick={() => setShowArHint(false)}
          >
            {hasModel ? "📱 Tap to place this 3D dish on your table" : "📱 Tap here to see this dish on your table"}
            <div
              className="absolute left-1/2 -bottom-1 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-primary/20 bg-[#1a1a1a]"
            />
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div
        className="px-5 pt-6 pb-12 transition-all duration-500"
        style={{
          opacity: infoVisible ? 1 : 0,
          transform: infoVisible ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <div className="flex items-start justify-between">
          <h1 className="text-[24px] font-normal text-white" style={{ fontFamily: "Georgia, serif" }}>
            {dish.name}
          </h1>
          <span className="text-[20px] font-medium text-[#C9A96E]">
            &#8377;{dish.price}
          </span>
        </div>

        <p className="mt-3 text-[14px] font-light leading-[1.6] text-white/35">
          {dish.description}
        </p>

        {/* Metadata Row with tooltips */}
        <div className="mt-5 flex items-center gap-4">
          <MetaItem label={dish.calories} tooltip="Calorie count per serving" />
          <Divider />
          <MetaItem label={dish.allergens} tooltip="Known allergens in this dish" />
          <Divider />
          <MetaItem label={dish.type} tooltip={dish.type === "Veg" ? "Vegetarian dish" : "Contains meat/seafood"} />
        </div>

        {/* Tags */}
        <div className="mt-5 flex flex-wrap gap-2">
          {dish.tags.map((tag) => (
            <span key={tag} className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[12px] text-white/30">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* AR Simulation Overlay */}
      {showAr && (
        <div className="fixed inset-0 z-[200] flex flex-col bg-black">
          {/* Camera grid background */}
          <div className="relative flex-1"
            style={{
              background: "linear-gradient(rgba(20,20,20,0.9), rgba(20,20,20,0.95))",
            }}
          >
            {/* Grid lines */}
            <svg className="absolute inset-0 h-full w-full opacity-10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Scanning animation */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
              style={{ animation: "scanLine 2s ease-in-out infinite" }}
            />

            {/* AR Status */}
            <div className="absolute top-6 left-0 right-0 flex justify-center">
              <div className="flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 backdrop-blur">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#8BA88E]" />
                <span className="text-[12px] font-medium text-white/70">AR Active — Surface detected</span>
              </div>
            </div>

            {/* Dish placed on "table" */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="flex flex-col items-center"
                style={{ animation: "arPlaceIn 0.6s ease forwards" }}
              >
                {hasModel ? (
                  /* Real 3D model in AR view */
                  <div className="relative h-[240px] w-[240px]">
                    <ModelViewer
                      src={dish.modelSrc!}
                      alt={`${dish.name} AR view`}
                      className="h-full w-full"
                      arEnabled
                    />
                    {/* Glow effect under model */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-4 w-40 rounded-full bg-primary/20 blur-xl" />
                  </div>
                ) : (
                  <>
                    {/* Shadow */}
                    <div className="mb-4 h-2 w-32 rounded-full bg-primary/20 blur-lg" />
                    {/* Dish visualization placeholder */}
                    <div
                      className="flex h-40 w-40 items-center justify-center rounded-full border-2 border-primary/30"
                      style={{
                        background: `radial-gradient(circle, ${dish.gradient.includes("#C9A96E") ? "rgba(201,169,110,0.2)" : "rgba(176,141,87,0.2)"} 0%, transparent 70%)`,
                        boxShadow: "0 0 60px rgba(201,169,110,0.15), inset 0 0 30px rgba(201,169,110,0.1)",
                      }}
                    >
                      <div className="text-center">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" opacity="0.8">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                        <p className="mt-2 text-[11px] text-primary/60">3D Model</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Dish info card */}
                <div
                  className="mt-6 rounded-xl border border-white/[0.08] bg-black/60 px-5 py-3 backdrop-blur-xl"
                  style={{ animation: "arInfoIn 0.5s ease 0.3s forwards", opacity: 0 }}
                >
                  <p className="text-[15px] font-medium text-white" style={{ fontFamily: "Georgia, serif" }}>
                    {dish.name}
                  </p>
                  <p className="text-[13px] text-primary font-medium">₹{dish.price}</p>
                  <p className="mt-1 text-[11px] text-white/30">{dish.calories} · {dish.type}</p>
                </div>
              </div>
            </div>

            {/* Corner brackets */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[280px] w-[280px] pointer-events-none">
              {/* Top-left */}
              <div className="absolute top-0 left-0 h-8 w-8 border-t-2 border-l-2 border-primary/40 rounded-tl-lg" />
              {/* Top-right */}
              <div className="absolute top-0 right-0 h-8 w-8 border-t-2 border-r-2 border-primary/40 rounded-tr-lg" />
              {/* Bottom-left */}
              <div className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-primary/40 rounded-bl-lg" />
              {/* Bottom-right */}
              <div className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-primary/40 rounded-br-lg" />
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/[0.06] bg-[#0a0a0a] px-6 py-5 pb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[11px] text-white/30 uppercase tracking-[1px]">Viewing in AR</p>
                <p className="text-[16px] font-medium text-white" style={{ fontFamily: "Georgia, serif" }}>{dish.name}</p>
              </div>
              <span className="text-[18px] font-medium text-primary">₹{dish.price}</span>
            </div>
            <button
              onClick={() => setShowAr(false)}
              className="w-full rounded-xl border border-white/[0.1] bg-white/[0.05] py-3.5 text-[14px] font-medium text-white/70 transition-all hover:bg-white/[0.08] active:scale-[0.98]"
            >
              Close AR View
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes hintBounce {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes scanLine {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes arPlaceIn {
          from { opacity: 0; transform: scale(0.7) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes arInfoIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function MetaItem({ label, tooltip }: { label: string; tooltip: string }) {
  return (
    <span className="text-[12px] text-white/25 cursor-help" title={tooltip}>
      {label}
    </span>
  );
}

function Divider() {
  return <div className="h-3 w-[1px] bg-white/[0.08]" />;
}
