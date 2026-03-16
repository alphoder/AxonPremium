"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export default function ARViewPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "ar-active" | "no-ar">("loading");
  const [modelLoaded, setModelLoaded] = useState(false);
  const [cardMinimized, setCardMinimized] = useState(false);

  const modelSrc = "/models/pizza.glb";
  const dishName = "Margherita Pizza";
  const dishPrice = "₹495";
  const dishSubtitle = "Classic Neapolitan Style";

  // Load model-viewer CDN
  useEffect(() => {
    if (customElements.get("model-viewer")) {
      setModelLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js";
    script.onload = () => {
      customElements.whenDefined("model-viewer").then(() => setModelLoaded(true));
    };
    document.head.appendChild(script);
  }, []);

  // Inject model-viewer
  useEffect(() => {
    if (!modelLoaded || !containerRef.current) return;

    containerRef.current.innerHTML = `
      <model-viewer
        id="ar-viewer"
        src="${modelSrc}"
        alt="3D model of ${dishName}"
        camera-controls
        disable-zoom
        auto-rotate
        auto-rotate-delay="0"
        rotation-per-second="8deg"
        camera-orbit="0deg 65deg 1.2m"
        min-camera-orbit="auto auto auto"
        max-camera-orbit="auto auto auto"
        field-of-view="45deg"
        min-field-of-view="45deg"
        max-field-of-view="45deg"
        interaction-prompt="none"
        shadow-intensity="1.5"
        shadow-softness="0.8"
        exposure="1.1"
        environment-image="neutral"
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="auto"
        ar-placement="floor"
        loading="eager"
        style="width:100%;height:100%;display:block;background:transparent;--poster-color:transparent;"
      >
        <button slot="ar-button" id="custom-ar-btn" style="
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #C9A96E, #B08D57);
          color: white;
          border: none;
          border-radius: 14px;
          padding: 16px 32px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 24px rgba(201,169,110,0.4);
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          z-index: 10;
        ">
          📸 Place on your table
        </button>
      </model-viewer>
    `;

    setStatus("ready");

    // Prevent zoom on model (pizza stays fixed size)
    const viewer = document.getElementById("ar-viewer");
    if (viewer) {
      viewer.addEventListener("wheel", (e) => e.preventDefault(), { passive: false });
    }

    // Auto-trigger AR on mobile
    const isAndroid = /android/i.test(navigator.userAgent);
    const isIOS = /iphone|ipad/i.test(navigator.userAgent);
    if (isAndroid || isIOS) {
      setTimeout(() => {
        const v = document.getElementById("ar-viewer") as HTMLElement & {
          activateAR?: () => Promise<void>;
          canActivateAR?: boolean;
        };
        if (v?.canActivateAR && v?.activateAR) {
          v.activateAR().then(() => setStatus("ar-active")).catch(() => setStatus("ready"));
        }
      }, 1500);
    }
  }, [modelLoaded]);

  // Draggable card logic
  const dragState = useRef({ isDragging: false, startX: 0, startY: 0, startLeft: 0, startTop: 0 });

  const onPointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    // Don't drag if resizing (bottom-right corner)
    if (clientX > rect.right - 25 && clientY > rect.bottom - 25) return;

    dragState.current = {
      isDragging: true,
      startX: clientX,
      startY: clientY,
      startLeft: card.offsetLeft,
      startTop: card.offsetTop,
    };
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragState.current.isDragging || !cardRef.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const dx = clientX - dragState.current.startX;
      const dy = clientY - dragState.current.startY;
      cardRef.current.style.left = `${dragState.current.startLeft + dx}px`;
      cardRef.current.style.top = `${dragState.current.startTop + dy}px`;
      cardRef.current.style.right = "auto";
    };
    const onUp = () => { dragState.current.isDragging = false; };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchmove", onMove, { passive: true });
    document.addEventListener("touchend", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onUp);
    };
  }, []);

  // Manual AR launch
  const handleManualAR = () => {
    const viewer = document.getElementById("ar-viewer") as HTMLElement & {
      activateAR?: () => Promise<void>;
      canActivateAR?: boolean;
    };
    if (viewer?.canActivateAR && viewer?.activateAR) {
      viewer.activateAR();
      return;
    }
    const isAndroid = /android/i.test(navigator.userAgent);
    if (isAndroid) {
      const fullUrl = `${window.location.origin}${modelSrc}`;
      window.location.href = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(fullUrl)}&mode=ar_preferred&title=${encodeURIComponent(dishName)}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;end;`;
      return;
    }
    alert("AR is supported on Android (ARCore) and iOS (ARKit). Please try on a compatible device.");
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a12] overflow-hidden">
      {/* Table surface gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-[1]"
        style={{
          height: "35%",
          background: "linear-gradient(180deg, transparent 0%, rgba(101,67,33,0.12) 40%, rgba(101,67,33,0.25) 100%)",
        }}
      />

      {/* Full-screen 3D Model */}
      <div ref={containerRef} className="absolute inset-0 z-0">
        {!modelLoaded && (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-[#C9A96E]" />
              <p className="text-[13px] text-white/30">Loading 3D model...</p>
            </div>
          </div>
        )}
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-[60] flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2.5 rounded-full bg-black/40 backdrop-blur-md px-3 py-2 border border-white/[0.06]">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #C9A96E, #B08D57)" }}
          >
            <span style={{ fontFamily: "Georgia, serif" }}>A</span>
          </div>
          <div>
            <p className="text-[12px] font-semibold text-white" style={{ fontFamily: "Georgia, serif" }}>
              Axon Aura
            </p>
            <p className="text-[8px] tracking-[1.5px] text-white/30 uppercase">AR Menu</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-3 py-1.5 border border-white/[0.06]">
            <span className={`h-[5px] w-[5px] rounded-full ${status === "ar-active" ? "bg-[#8BA88E] animate-pulse" : status === "ready" ? "bg-[#C9A96E]" : "bg-white/30 animate-pulse"}`} />
            <span className="text-[10px] font-medium text-white/50">
              {status === "loading" ? "Loading..." : status === "ar-active" ? "AR Active" : "3D Ready"}
            </span>
          </div>
        </div>
      </div>

      {/* Floating Info Card — always faces user, draggable, resizable */}
      {modelLoaded && !cardMinimized && (
        <div
          ref={cardRef}
          onMouseDown={onPointerDown}
          onTouchStart={onPointerDown}
          className="absolute z-[100] select-none"
          style={{
            top: "8%",
            right: "4%",
            width: "min(320px, 85vw)",
            minWidth: 240,
            maxWidth: 500,
            minHeight: 180,
            maxHeight: "80vh",
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: 20,
            padding: "20px 22px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.4), 0 0 80px rgba(201,169,110,0.05)",
            cursor: "grab",
            resize: "both",
            overflow: "auto",
            transition: "box-shadow 0.3s ease",
          }}
        >
          {/* Close / Minimize button */}
          <button
            onClick={() => setCardMinimized(true)}
            className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white/40 hover:bg-white/20 hover:text-white/70 transition-all text-xs"
          >
            ✕
          </button>

          {/* Badges */}
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider"
              style={{ background: "rgba(34,139,34,0.2)", border: "1.5px solid #22c55e", color: "#4ade80" }}>
              <span className="h-2 w-2 rounded-full bg-[#22c55e] inline-block" />
              VEG
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold"
              style={{ background: "rgba(201,169,110,0.15)", border: "1.5px solid rgba(201,169,110,0.4)", color: "#C9A96E" }}>
              16&quot; Large
            </span>
          </div>

          {/* Name & Price */}
          <div className="flex items-baseline justify-between mb-0.5">
            <h2 className="text-[22px] font-bold text-white tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
              {dishName}
            </h2>
            <span className="text-[18px] font-semibold text-[#C9A96E]">{dishPrice}</span>
          </div>
          <p className="text-[12px] text-white/35 italic mb-3">{dishSubtitle}</p>

          {/* Divider */}
          <div className="h-px my-3" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />

          {/* Ingredients */}
          <p className="text-[10px] uppercase tracking-[1.5px] text-white/30 font-semibold mb-2">Ingredients</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {["Pizza Dough", "San Marzano Tomatoes", "Fresh Mozzarella", "Olive Oil", "Fresh Basil", "Sea Salt", "Garlic", "Oregano"].map((ing) => (
              <span
                key={ing}
                className="rounded-full px-2.5 py-1 text-[11px] text-white/75 transition-all hover:bg-white/10 hover:-translate-y-0.5"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {ing}
              </span>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px my-3" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />

          {/* Nutrition */}
          <p className="text-[10px] uppercase tracking-[1.5px] text-white/30 font-semibold mb-2">Nutrition (per slice)</p>
          <div className="flex justify-between">
            {[
              { value: "272", label: "Calories" },
              { value: "12g", label: "Protein" },
              { value: "10g", label: "Fat" },
              { value: "33g", label: "Carbs" },
            ].map((item) => (
              <div key={item.label} className="text-center flex-1">
                <div className="text-[18px] font-bold text-white">{item.value}</div>
                <div className="text-[9px] uppercase tracking-wider text-white/30">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Resize hint */}
          <span className="absolute bottom-1.5 right-2.5 text-[14px] text-white/15 pointer-events-none">⤢</span>
        </div>
      )}

      {/* Minimized card toggle */}
      {modelLoaded && cardMinimized && (
        <button
          onClick={() => setCardMinimized(false)}
          className="absolute top-[8%] right-[4%] z-[100] flex items-center gap-2 rounded-full bg-black/50 backdrop-blur-md px-4 py-2.5 border border-white/[0.08] hover:bg-black/60 transition-all"
        >
          <span className="text-[12px] font-medium text-white/60">Show Info</span>
          <span className="text-white/40">ℹ️</span>
        </button>
      )}

      {/* Bottom AR Button */}
      <div className="absolute bottom-6 left-4 right-4 z-[60]">
        <button
          onClick={handleManualAR}
          className="flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-[15px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #C9A96E, #B08D57)",
            boxShadow: "0 4px 32px rgba(201,169,110,0.35)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          View on your table
        </button>
      </div>

      {/* Bottom hint */}
      {modelLoaded && (
        <div className="absolute bottom-[72px] left-0 right-0 flex justify-center z-[50] pointer-events-none">
          <span className="rounded-full bg-black/40 backdrop-blur px-3 py-1 text-[10px] text-white/25">
            Drag to rotate · Pizza is fixed size
          </span>
        </div>
      )}

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-[40] flex justify-center pb-1.5">
        <p className="text-[9px] text-white/15">
          Powered by <span className="font-medium text-white/20">Axon Aura</span>
        </p>
      </div>
    </div>
  );
}
