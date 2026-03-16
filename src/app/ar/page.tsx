"use client";

import { useEffect, useRef, useState } from "react";

export default function ARViewPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "ar-active">("loading");
  const [modelLoaded, setModelLoaded] = useState(false);

  const modelSrc = "/models/pizza.glb";
  const dishName = "Margherita Pizza";
  const dishPrice = "₹495";

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

  // Inject model-viewer with hotspot annotations
  useEffect(() => {
    if (!modelLoaded || !containerRef.current) return;

    // 16 inches = 0.4064 meters. ar-scale="fixed" preserves viewer scale in AR.
    // We scale the model so it appears as 16" diameter on a real surface.
    containerRef.current.innerHTML = `
      <style>
        /* ---- Info Card Hotspot ---- */
        .hotspot-card {
          --mv-hotspot-color: transparent;
          display: block;
          width: min(260px, 55vw);
          pointer-events: auto;
          transition: opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1);
        }
        .hotspot-card.hidden-card {
          opacity: 0 !important;
          transform: translateY(8px) scale(0.95) !important;
          pointer-events: none !important;
        }

        /* ---- Connector Arrow ---- */
        .connector-hotspot {
          --mv-hotspot-color: transparent;
          display: block;
          pointer-events: none;
          transition: opacity 0.5s cubic-bezier(0.4,0,0.2,1);
        }
        .connector-hotspot.hidden-card {
          opacity: 0 !important;
        }

        /* ---- Card Internals ---- */
        .ar-card {
          background: rgba(10, 10, 18, 0.75);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(201,169,110,0.2);
          border-radius: 16px;
          padding: 16px 18px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.6), 0 0 60px rgba(201,169,110,0.06);
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        }
        .ar-card .badge-row { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; }
        .ar-card .veg-badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(34,139,34,0.2); border: 1.5px solid #22c55e;
          border-radius: 6px; padding: 3px 10px; font-size: 10px;
          font-weight: 700; color: #4ade80; text-transform: uppercase; letter-spacing: 0.5px;
        }
        .ar-card .veg-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; display: inline-block; }
        .ar-card .size-badge {
          display: inline-flex; align-items: center;
          background: rgba(201,169,110,0.12); border: 1.5px solid rgba(201,169,110,0.35);
          border-radius: 6px; padding: 3px 10px; font-size: 10px;
          font-weight: 700; color: #C9A96E;
        }
        .ar-card .dish-name {
          font-size: 20px; font-weight: 700; color: #fff; margin: 0;
          font-family: Georgia, 'Times New Roman', serif; letter-spacing: -0.3px;
        }
        .ar-card .dish-price { font-size: 16px; font-weight: 600; color: #C9A96E; }
        .ar-card .dish-subtitle { font-size: 11px; color: rgba(255,255,255,0.35); font-style: italic; margin-top: 2px; }
        .ar-card .divider {
          height: 1px; margin: 10px 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        }
        .ar-card .section-title {
          font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px;
          color: rgba(255,255,255,0.3); margin-bottom: 6px; font-weight: 700;
        }
        .ar-card .ingredients { display: flex; flex-wrap: wrap; gap: 5px; }
        .ar-card .ing-tag {
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px; padding: 4px 10px; font-size: 10px; color: rgba(255,255,255,0.7);
        }
        .ar-card .nutrition-row { display: flex; justify-content: space-between; margin-top: 4px; }
        .ar-card .nut-item { text-align: center; flex: 1; }
        .ar-card .nut-val { font-size: 16px; font-weight: 700; color: #fff; }
        .ar-card .nut-label { font-size: 8px; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.5px; }

        /* ---- Connector SVG ---- */
        .connector-line {
          width: 2px; height: 60px;
          background: linear-gradient(180deg, rgba(201,169,110,0.5), rgba(201,169,110,0));
          margin: 0 auto;
        }
        .connector-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #C9A96E; margin: 0 auto;
          box-shadow: 0 0 12px rgba(201,169,110,0.6);
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }

        /* ---- AR Button ---- */
        #custom-ar-btn {
          position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
          background: linear-gradient(135deg, #C9A96E, #B08D57);
          color: white; border: none; border-radius: 14px;
          padding: 14px 28px; font-size: 14px; font-weight: 600;
          cursor: pointer; box-shadow: 0 4px 24px rgba(201,169,110,0.4);
          display: flex; align-items: center; gap: 8px; white-space: nowrap; z-index: 10;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        }

        /* ---- Powered badge ---- */
        .powered-badge {
          position: absolute; bottom: 70px; left: 50%; transform: translateX(-50%);
          font-size: 9px; color: rgba(255,255,255,0.2); white-space: nowrap;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        }
      </style>

      <model-viewer
        id="ar-viewer"
        src="${modelSrc}"
        alt="3D model of ${dishName}"
        camera-controls
        disable-zoom
        auto-rotate
        auto-rotate-delay="0"
        rotation-per-second="8deg"
        camera-orbit="20deg 60deg 0.8m"
        min-camera-orbit="auto auto 0.8m"
        max-camera-orbit="auto auto 0.8m"
        field-of-view="45deg"
        min-field-of-view="45deg"
        max-field-of-view="45deg"
        interaction-prompt="none"
        shadow-intensity="1.5"
        shadow-softness="0.8"
        exposure="1.2"
        environment-image="neutral"
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="fixed"
        ar-placement="floor"
        loading="eager"
        style="width:100%;height:100%;display:block;background:transparent;--poster-color:transparent;"
      >
        <!-- Connector dot hotspot (at pizza edge) -->
        <div class="connector-hotspot" slot="hotspot-connector" data-position="0.08 0.015 -0.08" data-normal="0 1 0">
          <div class="connector-dot"></div>
          <div class="connector-line"></div>
        </div>

        <!-- Info card hotspot (floating above-right of pizza) -->
        <div class="hotspot-card" slot="hotspot-card" data-position="0.22 0.12 -0.05" data-normal="0 1 0">
          <div class="ar-card">
            <div class="badge-row">
              <span class="veg-badge"><span class="veg-dot"></span> VEG</span>
              <span class="size-badge">16" Large</span>
            </div>
            <div style="display:flex;align-items:baseline;justify-content:space-between;">
              <h2 class="dish-name">${dishName}</h2>
              <span class="dish-price">${dishPrice}</span>
            </div>
            <div class="dish-subtitle">Classic Neapolitan Style</div>
            <div class="divider"></div>
            <div class="section-title">Ingredients</div>
            <div class="ingredients">
              <span class="ing-tag">Pizza Dough</span>
              <span class="ing-tag">San Marzano Tomatoes</span>
              <span class="ing-tag">Fresh Mozzarella</span>
              <span class="ing-tag">Olive Oil</span>
              <span class="ing-tag">Fresh Basil</span>
              <span class="ing-tag">Sea Salt</span>
              <span class="ing-tag">Garlic</span>
              <span class="ing-tag">Oregano</span>
            </div>
            <div class="divider"></div>
            <div class="section-title">Nutrition (per slice)</div>
            <div class="nutrition-row">
              <div class="nut-item"><div class="nut-val">272</div><div class="nut-label">Calories</div></div>
              <div class="nut-item"><div class="nut-val">12g</div><div class="nut-label">Protein</div></div>
              <div class="nut-item"><div class="nut-val">10g</div><div class="nut-label">Fat</div></div>
              <div class="nut-item"><div class="nut-val">33g</div><div class="nut-label">Carbs</div></div>
            </div>
          </div>
        </div>

        <!-- AR placement button -->
        <button slot="ar-button" id="custom-ar-btn">
          📸 Place on your table
        </button>

        <div class="powered-badge">Powered by Axon Aura</div>
      </model-viewer>
    `;

    setStatus("ready");

    // ---- Interaction hide/show logic ----
    const viewer = document.getElementById("ar-viewer") as HTMLElement;
    if (!viewer) return;

    // Prevent zoom (pizza stays fixed size)
    viewer.addEventListener("wheel", (e) => e.preventDefault(), { passive: false });

    let interactionTimer: ReturnType<typeof setTimeout> | null = null;

    const cardHotspot = viewer.querySelector('[slot="hotspot-card"]');
    const connectorHotspot = viewer.querySelector('[slot="hotspot-connector"]');

    const hideCard = () => {
      cardHotspot?.classList.add("hidden-card");
      connectorHotspot?.classList.add("hidden-card");
      if (interactionTimer) clearTimeout(interactionTimer);
    };

    const showCardDelayed = () => {
      if (interactionTimer) clearTimeout(interactionTimer);
      interactionTimer = setTimeout(() => {
        cardHotspot?.classList.remove("hidden-card");
        connectorHotspot?.classList.remove("hidden-card");
      }, 2000);
    };

    // Mouse interactions
    viewer.addEventListener("pointerdown", (e) => {
      // Only hide if interacting with the model (not buttons)
      if ((e.target as HTMLElement).tagName === "BUTTON") return;
      hideCard();
    });
    viewer.addEventListener("pointerup", showCardDelayed);

    // Touch interactions
    viewer.addEventListener("touchstart", (e) => {
      if ((e.target as HTMLElement).tagName === "BUTTON") return;
      hideCard();
    }, { passive: true });
    viewer.addEventListener("touchend", showCardDelayed);

    // Auto-trigger AR on mobile
    const isAndroid = /android/i.test(navigator.userAgent);
    const isIOS = /iphone|ipad/i.test(navigator.userAgent);
    if (isAndroid || isIOS) {
      setTimeout(() => {
        const v = viewer as HTMLElement & {
          activateAR?: () => Promise<void>;
          canActivateAR?: boolean;
        };
        if (v?.canActivateAR && v?.activateAR) {
          v.activateAR().then(() => setStatus("ar-active")).catch(() => setStatus("ready"));
        }
      }, 1500);
    }
  }, [modelLoaded]);

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
    <div className="fixed inset-0 bg-[#060608] overflow-hidden">
      {/* Table surface gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-[1]"
        style={{
          height: "40%",
          background: "linear-gradient(180deg, transparent 0%, rgba(101,67,33,0.1) 40%, rgba(101,67,33,0.22) 100%)",
        }}
      />

      {/* Full-screen model-viewer */}
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
        <div className="flex items-center gap-2.5 rounded-full bg-black/50 backdrop-blur-md px-3 py-2 border border-white/[0.06]">
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

        <div className="flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-md px-3 py-1.5 border border-white/[0.06]">
          <span className={`h-[5px] w-[5px] rounded-full ${status === "ar-active" ? "bg-[#8BA88E] animate-pulse" : status === "ready" ? "bg-[#C9A96E]" : "bg-white/30 animate-pulse"}`} />
          <span className="text-[10px] font-medium text-white/50">
            {status === "loading" ? "Loading..." : status === "ar-active" ? "AR Active" : "3D Ready"}
          </span>
        </div>
      </div>

      {/* Bottom AR launch (only shown as fallback if the slot button isn't visible) */}
      <div className="absolute bottom-5 left-4 right-4 z-[60]">
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

      {/* Interaction hint */}
      {modelLoaded && (
        <div className="absolute bottom-[68px] left-0 right-0 flex justify-center z-[50] pointer-events-none">
          <span className="rounded-full bg-black/50 backdrop-blur px-3 py-1 text-[10px] text-white/25">
            Drag to rotate · Card follows the dish
          </span>
        </div>
      )}
    </div>
  );
}
