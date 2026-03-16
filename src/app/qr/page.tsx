"use client";

import { useEffect, useRef, useState } from "react";

// QR Code generator - uses a canvas-based approach (no external deps)
function generateQR(text: string, size: number): string {
  // Use QR code API for reliable generation
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&bgcolor=080808&color=C9A96E&format=svg`;
}

export default function QRCodePage() {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const arUrl = `${origin}/ar`;
  const qrSize = 300;

  const handleCopy = () => {
    navigator.clipboard.writeText(arUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <a href="/" className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #C9A96E, #B08D57)" }}
          >
            <span style={{ fontFamily: "Georgia, serif" }}>A</span>
          </div>
          <span className="text-[13px] font-medium tracking-[2px] text-white/60">AXON AURA</span>
        </a>
        <a href="/demo" className="text-[13px] text-white/40 hover:text-white/60 transition-colors">
          Demo →
        </a>
      </div>

      <div className="mx-auto max-w-[500px] px-6 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-normal text-white" style={{ fontFamily: "Georgia, serif" }}>
            AR Menu QR Code
          </h1>
          <p className="mt-2 text-[14px] text-white/35">
            Place this QR code on your restaurant table. Guests scan it to instantly view dishes in AR.
          </p>
        </div>

        {/* QR Card - Printable */}
        <div ref={printRef} className="print-card mx-auto">
          <div
            className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0e0e0e] p-8"
            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}
          >
            {/* Restaurant branding */}
            <div className="text-center mb-6">
              <div
                className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-lg font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #C9A96E, #B08D57)" }}
              >
                <span style={{ fontFamily: "Georgia, serif" }}>A</span>
              </div>
              <p className="text-[11px] font-semibold tracking-[3px] text-white/50 uppercase">
                The Grand Pavilion
              </p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-6">
              <div className="rounded-xl bg-white p-4">
                {origin ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={generateQR(arUrl, qrSize)}
                    alt="QR Code for AR Menu"
                    width={qrSize}
                    height={qrSize}
                    className="block"
                    style={{ imageRendering: "crisp-edges" }}
                  />
                ) : (
                  <div className="flex items-center justify-center" style={{ width: qrSize, height: qrSize }}>
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-[#C9A96E]" />
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="text-center">
              <p className="text-[16px] font-normal text-white" style={{ fontFamily: "Georgia, serif" }}>
                Scan to view our menu in AR
              </p>
              <p className="mt-1.5 text-[12px] text-white/30">
                Point your camera at this code to see dishes on your table
              </p>
            </div>

            {/* Divider */}
            <div className="my-5 h-[1px] bg-white/[0.06]" />

            {/* Bottom branding */}
            <div className="flex items-center justify-center gap-2">
              <span className="h-[6px] w-[6px] rounded-full bg-[#C9A96E]/50" />
              <span className="text-[10px] tracking-[2px] text-white/25 uppercase">
                Powered by Axon Aura
              </span>
            </div>
          </div>
        </div>

        {/* URL Display */}
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
          <span className="flex-1 truncate text-[13px] text-white/50 font-mono">{arUrl}</span>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 rounded-lg border border-white/[0.1] bg-white/[0.05] px-3 py-1.5 text-[12px] text-white/60 transition-all hover:bg-white/[0.1]"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handlePrint}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.05] py-3.5 text-[14px] font-medium text-white/70 transition-all hover:bg-white/[0.08]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print QR
          </button>
          <a
            href={arUrl}
            target="_blank"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-[14px] font-semibold text-white transition-all hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #C9A96E, #B08D57)",
              boxShadow: "0 4px 24px rgba(201,169,110,0.3)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Test AR Link
          </a>
        </div>

        {/* How it works */}
        <div className="mt-10 mb-6">
          <h3 className="text-[13px] font-semibold tracking-[2px] text-white/30 uppercase mb-4">
            How it works
          </h3>
          <div className="flex flex-col gap-3">
            {[
              { n: "1", title: "Guest scans QR code", desc: "Using their phone camera or any QR scanner app" },
              { n: "2", title: "3D model loads instantly", desc: "No app download needed — works in the browser" },
              { n: "3", title: "Tap 'View on your table'", desc: "Opens camera and places the dish in AR on the real table" },
            ].map((step) => (
              <div key={step.n} className="flex items-start gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3">
                <span
                  className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg text-[11px] font-semibold"
                  style={{ background: "rgba(201,169,110,0.12)", color: "#C9A96E" }}
                >
                  {step.n}
                </span>
                <div>
                  <p className="text-[13px] font-medium text-white/70">{step.title}</p>
                  <p className="text-[12px] text-white/30">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body { background: white !important; }
          * { color: black !important; }
          .print-card { break-inside: avoid; }
          .print-card > div { border-color: #ddd !important; background: white !important; box-shadow: none !important; }
          nav, button, a, footer, h3, .flex.flex-col.gap-3 { display: none !important; }
          .print-card ~ * { display: none !important; }
        }
      `}</style>
    </div>
  );
}
