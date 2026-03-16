"use client";

import { useState, useCallback } from "react";
import SplashScreen from "./SplashScreen";
import MenuGrid from "./MenuGrid";
import DishDetail from "./DishDetail";
import { type Dish } from "./data";

type Screen = "splash" | "menu" | "detail";

export default function DemoPage() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const handleSplashComplete = useCallback(() => setScreen("menu"), []);

  const handleSelectDish = useCallback((dish: Dish) => {
    setSelectedDish(dish);
    setScreen("detail");
  }, []);

  const handleBack = useCallback(() => {
    setScreen("menu");
    setSelectedDish(null);
  }, []);

  return (
    <div className="mx-auto max-w-[430px] relative">
      {screen === "splash" && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}
      {screen === "menu" && <MenuGrid onSelectDish={handleSelectDish} />}
      {screen === "detail" && selectedDish && (
        <DishDetail dish={selectedDish} onBack={handleBack} />
      )}

      {/* Floating Help */}
      {screen !== "splash" && (
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="fixed top-4 right-4 z-[100] flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.06] text-[14px] text-white/50 backdrop-blur-xl transition-all hover:border-primary/30 hover:bg-primary/[0.1] hover:text-primary"
          title="Help — Learn how to use this demo"
        >
          ?
        </button>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowHelp(false)} />
          <div
            className="relative w-full max-w-[360px] rounded-2xl border border-white/[0.08] bg-[#111]/95 p-6 backdrop-blur-xl"
            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.5)", animation: "helpPop 0.3s ease forwards" }}
          >
            <button onClick={() => setShowHelp(false)} className="absolute top-4 right-4 text-[18px] text-white/30 hover:text-white/60">✕</button>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-lg" style={{ background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.2)", color: "#C9A96E" }}>?</div>
            <h3 className="mb-2 text-[18px] font-normal text-white" style={{ fontFamily: "Georgia, serif" }}>How to use this demo</h3>
            <p className="mb-5 text-[13px] leading-[1.5] text-white/35">This is a preview of the AR Menu your guests will experience.</p>
            <div className="flex flex-col gap-3">
              {[
                { s: "1", t: "Browse the menu and filter by category" },
                { s: "2", t: "Tap any dish card to see full details" },
                { s: "3", t: "Tap 'View on your table' for AR preview" },
                { s: "4", t: "Use back button to return to menu" },
              ].map((item) => (
                <div key={item.s} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg text-[11px] font-semibold" style={{ background: "rgba(201,169,110,0.12)", color: "#C9A96E" }}>{item.s}</span>
                  <span className="text-[13px] text-white/50 pt-0.5">{item.t}</span>
                </div>
              ))}
            </div>
            <a href="/" className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 text-[13px] text-white/40 transition-all hover:border-white/[0.1] hover:text-white/60">← Back to Axon Aura</a>
          </div>
        </div>
      )}

      {screen !== "splash" && (
        <a href="/" className="fixed bottom-4 left-4 z-[100] flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/30 backdrop-blur-xl transition-all hover:border-white/[0.1] hover:text-white/50">← Axon Aura</a>
      )}

      <style jsx>{`
        @keyframes helpPop { from { opacity:0; transform:scale(0.95) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
      `}</style>
    </div>
  );
}
