"use client";

import { useEffect, useRef, useState } from "react";

export default function ARViewPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "ar-active">("loading");
  const [modelLoaded, setModelLoaded] = useState(false);

  // Use plain pizza for web preview (HTML hotspot handles the card)
  // pizza-ar.glb (with baked card) is used for Scene Viewer/Quick Look AR
  const modelSrc = "/models/pizza.glb";
  const arModelSrc = "/models/pizza-ar.glb";
  const dishName = "Margherita Pizza";

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

  useEffect(() => {
    if (!modelLoaded || !containerRef.current) return;

    containerRef.current.innerHTML = `
      <style>
        .info-card-hotspot {
          position: relative;
          pointer-events: none;
          transform: translate(-80%, 0%);
        }
        .info-card {
          width: 240px;
          background: rgba(12, 12, 20, 0.94);
          border: 1px solid rgba(201, 169, 110, 0.3);
          border-radius: 16px;
          padding: 12px;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          box-shadow: 0 8px 40px rgba(0,0,0,0.5), 0 0 20px rgba(201,169,110,0.08);
          backdrop-filter: blur(20px);
        }
        .info-card .badges { display: flex; gap: 6px; margin-bottom: 10px; }
        .info-card .badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 600;
        }
        .info-card .badge-veg {
          background: rgba(34,139,34,0.25); border: 1px solid rgba(34,197,94,0.5); color: #4ade80;
        }
        .info-card .badge-size {
          background: rgba(201,169,110,0.15); border: 1px solid rgba(201,169,110,0.35); color: #C9A96E;
        }
        .info-card .title-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; }
        .info-card .dish-name { font-size: 15px; font-weight: 700; font-family: Georgia, serif; }
        .info-card .price { font-size: 14px; font-weight: 700; color: #C9A96E; }
        .info-card .subtitle { font-size: 11px; color: rgba(255,255,255,0.35); font-style: italic; margin-bottom: 10px; }
        .info-card .divider {
          height: 1px; margin: 10px 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
        }
        .info-card .section-label {
          font-size: 8px; font-weight: 700; color: rgba(255,255,255,0.3);
          letter-spacing: 1.5px; margin-bottom: 8px;
        }
        .info-card .tags { display: flex; flex-wrap: wrap; gap: 4px; }
        .info-card .tag {
          padding: 4px 10px; border-radius: 12px; font-size: 10px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.65);
        }
        .info-card .nutrition { display: flex; justify-content: space-between; text-align: center; }
        .info-card .nutr-item .val { font-size: 15px; font-weight: 700; color: white; }
        .info-card .nutr-item .lbl { font-size: 7px; font-weight: 700; color: rgba(255,255,255,0.3); letter-spacing: 1px; }
        .info-card .powered { text-align: center; font-size: 8px; color: rgba(201,169,110,0.35); margin-top: 10px; }
        .connector-dot {
          width: 8px; height: 8px; border-radius: 50%; margin: 0 auto;
          background: #C9A96E;
          box-shadow: 0 0 8px rgba(201,169,110,0.6);
        }
        .connector-line {
          width: 1.5px; height: 20px; margin: 0 auto;
          background: linear-gradient(180deg, rgba(201,169,110,0.15), rgba(201,169,110,0.5));
        }
      </style>

      <model-viewer
        id="ar-viewer"
        src="${modelSrc}"
        ios-src="${arModelSrc}"
        alt="3D model of ${dishName}"
        camera-controls
        disable-zoom
        auto-rotate
        auto-rotate-delay="0"
        rotation-per-second="8deg"
        camera-orbit="0deg 75deg 0.28m"
        min-camera-orbit="auto auto 0.28m"
        max-camera-orbit="auto auto 0.28m"
        camera-target="0m 0.03m 0m"
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
        <button slot="ar-button" id="custom-ar-btn" style="display:none;"></button>

        <!-- HTML hotspot: always faces user, never rotates -->
        <div slot="hotspot-card"
             data-position="-0.04 0.04 0"
             data-normal="0 0 1"
             data-visibility-attribute="visible"
        >
          <div class="info-card-hotspot">
            <div class="connector-dot"></div>
            <div class="connector-line"></div>
            <div class="info-card">
              <div class="badges">
                <span class="badge badge-veg"><span style="color:#22c55e;">●</span> VEG</span>
                <span class="badge badge-size">16" Large</span>
              </div>
              <div class="title-row">
                <span class="dish-name">Margherita Pizza</span>
                <span class="price">₹495</span>
              </div>
              <div class="subtitle">Classic Neapolitan Style</div>
              <div class="divider"></div>
              <div class="section-label">INGREDIENTS</div>
              <div class="tags">
                <span class="tag">Pizza Dough</span>
                <span class="tag">San Marzano Tomatoes</span>
                <span class="tag">Fresh Mozzarella</span>
                <span class="tag">Olive Oil</span>
                <span class="tag">Fresh Basil</span>
                <span class="tag">Sea Salt</span>
                <span class="tag">Garlic</span>
                <span class="tag">Oregano</span>
              </div>
              <div class="divider"></div>
              <div class="section-label">NUTRITION (PER SLICE)</div>
              <div class="nutrition">
                <div class="nutr-item"><div class="val">272</div><div class="lbl">CALORIES</div></div>
                <div class="nutr-item"><div class="val">12g</div><div class="lbl">PROTEIN</div></div>
                <div class="nutr-item"><div class="val">10g</div><div class="lbl">FAT</div></div>
                <div class="nutr-item"><div class="val">33g</div><div class="lbl">CARBS</div></div>
              </div>
              <div class="powered">Powered by Axon Aura</div>
            </div>
          </div>
        </div>
      </model-viewer>
    `;

    setStatus("ready");

    const viewer = document.getElementById("ar-viewer");
    if (viewer) {
      viewer.addEventListener("wheel", (e) => e.preventDefault(), { passive: false });
    }

    // Auto-trigger AR on mobile
    const isAndroid = /android/i.test(navigator.userAgent);
    const isIOS = /iphone|ipad/i.test(navigator.userAgent);
    if (isAndroid || isIOS) {
      setTimeout(() => {
        const v = viewer as HTMLElement & { activateAR?: () => Promise<void>; canActivateAR?: boolean };
        if (v?.canActivateAR && v?.activateAR) {
          v.activateAR().then(() => setStatus("ar-active")).catch(() => setStatus("ready"));
        }
      }, 1500);
    }
  }, [modelLoaded]);

  const handleManualAR = () => {
    const viewer = document.getElementById("ar-viewer") as HTMLElement & { activateAR?: () => Promise<void>; canActivateAR?: boolean };
    if (viewer?.canActivateAR && viewer?.activateAR) {
      viewer.activateAR();
      return;
    }
    const isAndroid = /android/i.test(navigator.userAgent);
    if (isAndroid) {
      const fullUrl = `${window.location.origin}${arModelSrc}`;
      window.location.href = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(fullUrl)}&mode=ar_preferred&title=${encodeURIComponent(dishName)}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;end;`;
      return;
    }
    alert("AR is supported on Android (ARCore) and iOS (ARKit). Please try on a compatible device.");
  };

  return (
    <div className="fixed inset-0 bg-[#060608] overflow-hidden">
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-[1]"
        style={{
          height: "40%",
          background: "linear-gradient(180deg, transparent 0%, rgba(101,67,33,0.1) 40%, rgba(101,67,33,0.22) 100%)",
        }}
      />

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
            <p className="text-[12px] font-semibold text-white" style={{ fontFamily: "Georgia, serif" }}>Axon Aura</p>
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

      {/* Bottom AR button */}
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
    </div>
  );
}
