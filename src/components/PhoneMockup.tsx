"use client";

export default function PhoneMockup() {
  return (
    <div className="relative z-10 animate-float">
      {/* Glow behind phone */}
      <div
        className="pointer-events-none absolute -inset-8 rounded-[40px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(201,169,110,0.08) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative flex w-[180px] flex-col overflow-hidden rounded-[24px] border border-white/[0.08] p-3.5"
        style={{
          background:
            "linear-gradient(160deg, rgba(20,20,20,0.9), rgba(10,10,10,0.95))",
          backdropFilter: "blur(24px)",
          height: "320px",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Notch */}
        <div className="mx-auto mb-3 h-[4px] w-10 rounded-full bg-white/10" />

        {/* Restaurant name */}
        <p className="mb-4 text-center text-[9px] font-medium tracking-[2px] text-white/35 uppercase">
          The Grand Pavilion
        </p>

        {/* Menu items */}
        <div className="flex flex-col gap-3">
          <MenuItem
            gradient="linear-gradient(135deg, #C9A96E, #B08D57)"
            name="Butter Chicken"
            price="495"
          />
          <MenuItem
            gradient="linear-gradient(135deg, #8BA88E, #7B9BB5)"
            name="Truffle Risotto"
            price="695"
          />
          <MenuItem
            gradient="linear-gradient(135deg, #9B8EC4, #B5727E)"
            name="Paneer Tikka"
            price="395"
          />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* AR Button */}
        <button
          className="mt-2 w-full rounded-xl py-2.5 text-[10px] font-semibold tracking-wide text-white transition-all"
          style={{
            background: "linear-gradient(135deg, #C9A96E, #B08D57)",
            boxShadow: "0 4px 16px rgba(201,169,110,0.25)",
          }}
        >
          View in AR
        </button>
      </div>
    </div>
  );
}

function MenuItem({
  gradient,
  name,
  price,
}: {
  gradient: string;
  name: string;
  price: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg p-1.5 transition-colors hover:bg-white/[0.03]">
      <div
        className="h-[38px] w-[38px] flex-shrink-0 rounded-lg"
        style={{ background: gradient, opacity: 0.9 }}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] font-medium text-white/75">
          {name}
        </p>
        <p className="text-[9px] text-primary/80">&#8377;{price}</p>
      </div>
    </div>
  );
}
