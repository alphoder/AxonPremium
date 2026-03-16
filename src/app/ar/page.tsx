"use client";

import { useEffect, useRef, useState } from "react";

export default function ARViewPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "ar-active" | "no-ar">("loading");
  const [modelLoaded, setModelLoaded] = useState(false);
  const modelSrc = "/models/pizza.glb";
  const dishName = "Butter Chicken";
  const dishPrice = "₹495";

  useEffect(() => {
    // Load model-viewer from CDN
    if (customElements.get("model-viewer")) {
      setModelLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js";
    script.onload = () => {
      customElements.whenDefined("model-viewer").then(() => {
        setModelLoaded(true);
      });
    };
    document.head.appendChild(script);
  }, []);

  // Inject model-viewer once loaded
  useEffect(() => {
    if (!modelLoaded || !containerRef.current) return;

    const isAndroid = /android/i.test(navigator.userAgent);
    const isIOS = /iphone|ipad/i.test(navigator.userAgent);
    const isMobile = isAndroid || isIOS;

    containerRef.current.innerHTML = `
      <model-viewer
        id="ar-viewer"
        src="${modelSrc}"
        alt="3D model of ${dishName}"
        camera-controls
        touch-action="pan-y"
        auto-rotate
        auto-rotate-delay="0"
        rotation-per-second="30deg"
        camera-orbit="0deg 65deg 105%"
        field-of-view="30deg"
        shadow-intensity="0.8"
        shadow-softness="1"
        exposure="1.1"
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="fixed"
        scale="0.01 0.01 0.01"
        loading="eager"
        style="width:100%;height:100%;background:transparent;--poster-color:transparent;"
      >
        <button slot="ar-button" id="custom-ar-btn" style="
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #C9A96E, #B08D57);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 14px 28px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 24px rgba(201,169,110,0.4);
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
          Place on your table
        </button>
      </model-viewer>
    `;

    setStatus("ready");

    // Auto-trigger AR on mobile after a short delay
    if (isMobile) {
      setTimeout(() => {
        const viewer = document.getElementById("ar-viewer") as HTMLElement & {
          activateAR?: () => Promise<void>;
          canActivateAR?: boolean;
        };
        if (viewer && viewer.canActivateAR && viewer.activateAR) {
          viewer.activateAR().then(() => {
            setStatus("ar-active");
          }).catch(() => {
            setStatus("ready");
          });
        }
      }, 1500);
    }
  }, [modelLoaded]);

  // Also handle Android Scene Viewer as direct fallback
  const handleManualAR = () => {
    const isAndroid = /android/i.test(navigator.userAgent);

    // Try model-viewer's built-in AR first
    const viewer = document.getElementById("ar-viewer") as HTMLElement & {
      activateAR?: () => Promise<void>;
      canActivateAR?: boolean;
    };
    if (viewer && viewer.canActivateAR && viewer.activateAR) {
      viewer.activateAR();
      return;
    }

    // Android Scene Viewer fallback
    if (isAndroid) {
      const fullUrl = `${window.location.origin}${modelSrc}`;
      window.location.href = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(fullUrl)}&mode=ar_preferred&title=${encodeURIComponent(dishName)}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;end;`;
      return;
    }

    alert("AR is supported on Android (with ARCore) and iOS (with ARKit). Please try on a compatible device.");
  };

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #C9A96E, #B08D57)" }}
          >
            <span style={{ fontFamily: "Georgia, serif" }}>A</span>
          </div>
          <div>
            <p className="text-[14px] font-semibold text-white" style={{ fontFamily: "Georgia, serif" }}>
              Axon Aura
            </p>
            <p className="text-[10px] tracking-[1.5px] text-white/35 uppercase">
              AR Menu Experience
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5">
          <span className={`h-[6px] w-[6px] rounded-full ${status === "ar-active" ? "bg-[#8BA88E] animate-pulse" : status === "ready" ? "bg-[#C9A96E]" : "bg-white/30 animate-pulse"}`} />
          <span className="text-[11px] font-medium text-white/50">
            {status === "loading" ? "Loading..." : status === "ar-active" ? "AR Active" : "3D Ready"}
          </span>
        </div>
      </div>

      {/* 3D Model Viewer */}
      <div className="flex-1 mx-4 mb-3 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0c0c0c] relative">
        <div ref={containerRef} className="h-full w-full min-h-[400px]">
          {/* Loading spinner */}
          {!modelLoaded && (
            <div className="flex h-full w-full items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#C9A96E]" />
                <p className="text-[12px] text-white/30">Loading 3D model...</p>
              </div>
            </div>
          )}
        </div>

        {/* 3D Badge */}
        {modelLoaded && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg bg-black/60 px-2.5 py-1 backdrop-blur-md pointer-events-none">
            <span className="h-[6px] w-[6px] animate-pulse rounded-full bg-[#8BA88E]" />
            <span className="text-[10px] font-semibold tracking-[1px] text-white/70">3D MODEL</span>
          </div>
        )}

        {/* Interaction hint */}
        {modelLoaded && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
            <span className="rounded-full bg-black/50 px-3 py-1 text-[10px] text-white/30 backdrop-blur">
              Drag to rotate · Pinch to zoom
            </span>
          </div>
        )}
      </div>

      {/* Dish Info */}
      <div className="px-5 pb-3">
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-normal text-white" style={{ fontFamily: "Georgia, serif" }}>
            {dishName}
          </h1>
          <span className="text-[18px] font-medium text-[#C9A96E]">{dishPrice}</span>
        </div>
        <p className="mt-1 text-[13px] text-white/30">
          Tap the button below to place this dish on your table using AR
        </p>
      </div>

      {/* AR Launch Button */}
      <div className="px-5 pb-5">
        <button
          onClick={handleManualAR}
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
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.04] px-5 py-4 text-center">
        <p className="text-[11px] text-white/20">
          Powered by <span className="font-medium text-white/30">Axon Aura</span>
        </p>
        <a href="/demo" className="mt-1 block text-[11px] text-[#C9A96E]/50 hover:text-[#C9A96E]/80 transition-colors">
          Explore full menu →
        </a>
      </div>
    </div>
  );
}
