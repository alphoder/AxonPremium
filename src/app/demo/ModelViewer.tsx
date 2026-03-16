"use client";

import { useEffect, useRef, useState } from "react";

interface ModelViewerProps {
  src: string;
  alt?: string;
  className?: string;
  arEnabled?: boolean;
}

export default function ModelViewer({
  src,
  alt = "3D dish model",
  className = "",
  arEnabled = false,
}: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if model-viewer is already defined
    if (customElements.get("model-viewer")) {
      setLoaded(true);
      return;
    }

    // Load from CDN (most reliable approach)
    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js";
    script.onload = () => {
      // Wait for custom element to be defined
      customElements.whenDefined("model-viewer").then(() => {
        setLoaded(true);
      });
    };
    // Also try the npm import as backup
    script.onerror = () => {
      import("@google/model-viewer")
        .then(() => {
          customElements.whenDefined("model-viewer").then(() => {
            setLoaded(true);
          });
        })
        .catch(console.error);
    };
    document.head.appendChild(script);

    return () => {
      // Don't remove script on cleanup - it should persist
    };
  }, []);

  // Once loaded, inject the model-viewer element via innerHTML
  // This avoids React JSX issues with web components
  useEffect(() => {
    if (!loaded || !containerRef.current) return;

    const arAttrs = arEnabled
      ? `ar ar-modes="webxr scene-viewer quick-look" ar-scale="auto" ar-placement="floor"`
      : "";

    containerRef.current.innerHTML = `
      <model-viewer
        src="${src}"
        alt="${alt}"
        camera-controls
        touch-action="pan-y"
        auto-rotate
        auto-rotate-delay="0"
        rotation-per-second="30deg"
        camera-orbit="0deg 65deg 105%"
        min-camera-orbit="auto auto 80%"
        max-camera-orbit="auto auto 200%"
        field-of-view="30deg"
        shadow-intensity="0.6"
        shadow-softness="0.8"
        exposure="1.1"
        interaction-prompt="auto"
        interaction-prompt-threshold="3000"
        loading="eager"
        ${arAttrs}
        style="width:100%;min-height:400px;height:100%;display:block;background:transparent;--poster-color:transparent;"
      >
      </model-viewer>
    `;
  }, [loaded, src, alt, arEnabled]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Loading state while model-viewer script loads */}
      {!loaded && (
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div
              className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#C9A96E]"
            />
            <p className="text-[11px] text-white/30">Loading 3D viewer...</p>
          </div>
        </div>
      )}
    </div>
  );
}
