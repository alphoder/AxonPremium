"use client";

import SectionTag from "./SectionTag";

export default function SolutionSection() {
  return (
    <section
      className="py-[100px]"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(201,169,110,0.04) 0%, transparent 70%)",
      }}
    >
      <div className="mx-auto max-w-[680px] px-6 text-center">
        <SectionTag text="The solution" />
        <h2 className="font-cormorant text-[42px] font-light leading-[1.15] text-white">
          Every dish, alive on the table
        </h2>
        <p className="mx-auto mt-5 max-w-[560px] text-[16px] font-light leading-[1.7] text-white/55">
          Axon Aura generates photorealistic 3D models of every dish on your
          menu. Guests scan a QR code, browse in stunning detail, and place
          life-size AR previews directly on their table — all in the browser,
          no app download required.
        </p>
      </div>
    </section>
  );
}
