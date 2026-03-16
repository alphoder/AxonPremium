export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto max-w-[1100px] px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, #C9A96E, #B08D57)",
                }}
              >
                <span style={{ fontFamily: "Georgia, serif" }}>A</span>
              </div>
              <span className="text-[12px] font-medium tracking-[3px] text-white/70">
                AXON AURA
              </span>
            </div>
            <p className="mt-4 text-[12px] leading-[1.6] text-white/25">
              Premium AR menu platform for India&apos;s finest restaurants and hotels.
            </p>
            {/* Social */}
            <div className="mt-5 flex items-center gap-3">
              {[
                { label: "LinkedIn", path: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" },
                { label: "Twitter", path: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
                { label: "Instagram", path: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01M7.5 2h9a5.5 5.5 0 015.5 5.5v9a5.5 5.5 0 01-5.5 5.5h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2z" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] transition-all duration-300 hover:border-white/[0.1] hover:bg-white/[0.04]"
                  title={s.label}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white/30"
                  >
                    <path d={s.path} />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-4 text-[11px] font-semibold tracking-[2px] text-white/40 uppercase">
              Product
            </h4>
            <div className="flex flex-col gap-2.5">
              {[
                { href: "#features", label: "Features" },
                { href: "#how-it-works", label: "How it works" },
                { href: "#pricing", label: "Pricing" },
                { href: "/demo", label: "Live Demo" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[13px] text-white/30 transition-colors hover:text-white/60"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-[11px] font-semibold tracking-[2px] text-white/40 uppercase">
              Company
            </h4>
            <div className="flex flex-col gap-2.5">
              {[
                { href: "/contact", label: "Contact Us" },
                { href: "https://axon-developer-site.vercel.app", label: "Axon Main Site" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="text-[13px] text-white/30 transition-colors hover:text-white/60"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4 text-[11px] font-semibold tracking-[2px] text-white/40 uppercase">
              Get in touch
            </h4>
            <a
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/[0.06] px-5 py-3 text-[13px] font-medium text-primary/80 transition-all duration-300 hover:border-primary/40 hover:bg-primary/[0.1] hover:text-primary"
            >
              <span className="h-[6px] w-[6px] rounded-full bg-primary animate-pulse-dot" />
              Schedule a Demo
            </a>
            <p className="mt-4 text-[12px] text-white/20">
              Response within 24 hours
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/[0.04] py-5 text-center text-[11px] text-white/20">
        &copy; {new Date().getFullYear()} Axon Aura by Axon. All rights
        reserved.
      </div>
    </footer>
  );
}
