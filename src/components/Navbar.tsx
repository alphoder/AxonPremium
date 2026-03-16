"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const close = () => setMobileOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it works" },
    { href: "#pricing", label: "Pricing" },
    { href: "/demo", label: "Demo" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? "backdrop-blur-[24px] border-b border-white/[0.04]"
            : ""
        }`}
        style={{
          background: scrolled ? "rgba(5,5,5,0.75)" : "transparent",
        }}
      >
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-5">
          <a href="/" className="group flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold text-white transition-shadow duration-300 group-hover:shadow-[0_0_20px_rgba(201,169,110,0.3)]"
              style={{
                background: "linear-gradient(135deg, #C9A96E, #B08D57)",
              }}
            >
              <span style={{ fontFamily: "Georgia, serif" }}>A</span>
            </div>
            <span className="text-[13px] font-medium tracking-[4px] text-white/90">
              AXON AURA
            </span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-[13px] text-white/45 transition-colors duration-300 hover:text-white/90 after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-0 after:bg-primary/50 after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/contact"
              className="group relative overflow-hidden rounded-full border border-primary/30 bg-primary/[0.08] px-5 py-2 text-[13px] text-primary/90 transition-all duration-300 hover:border-primary/50 hover:bg-primary/[0.15] hover:text-primary hover:shadow-[0_0_24px_rgba(201,169,110,0.15)]"
            >
              <span className="relative z-10">Contact Us</span>
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative z-[60] flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
            aria-label="Toggle menu"
          >
            <span
              className={`h-[1.5px] w-5 rounded-full bg-white/70 transition-all duration-300 ${
                mobileOpen ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-[1.5px] w-5 rounded-full bg-white/70 transition-all duration-300 ${
                mobileOpen ? "-translate-y-[2px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-[55] transition-all duration-500 md:hidden ${
          mobileOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-[280px] border-l border-white/[0.06] bg-[#0a0a0a]/95 backdrop-blur-xl transition-transform duration-500 ease-out ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col gap-2 px-8 pt-24">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-white/[0.04] py-4 text-[16px] font-light text-white/60 transition-all hover:text-white"
                style={{
                  transitionDelay: mobileOpen ? `${i * 50}ms` : "0ms",
                  opacity: mobileOpen ? 1 : 0,
                  transform: mobileOpen ? "translateX(0)" : "translateX(20px)",
                }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl py-3.5 text-[15px] font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #C9A96E, #B08D57)",
                boxShadow: "0 4px 24px rgba(201,169,110,0.25)",
              }}
            >
              Contact Us →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
