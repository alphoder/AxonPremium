"use client";

import { useState } from "react";
import SectionTag from "./SectionTag";
import { useScrollReveal } from "./useScrollReveal";

const tiers = [
  {
    name: "Starter",
    tag: "For boutique cafes",
    setup: 49999,
    setupDisplay: "₹49,999",
    monthly: 14999,
    monthlyDisplay: "₹14,999",
    annualMonthly: 12499,
    annualMonthlyDisplay: "₹12,499",
    features: [
      "15 AI-generated 3D dish models",
      "Basic analytics dashboard",
      "Standard QR menu cards",
      "Email support",
      "Monthly updates (3 dishes)",
    ],
    accent: false,
    slug: "starter",
  },
  {
    name: "Professional",
    tag: "Most popular",
    setup: 99999,
    setupDisplay: "₹99,999",
    setupWas: "₹1,50,000",
    monthly: 24999,
    monthlyDisplay: "₹24,999",
    annualMonthly: 20833,
    annualMonthlyDisplay: "₹20,833",
    features: [
      "40 AI-generated 3D dish models",
      "Advanced analytics dashboard",
      "Premium branded QR cards",
      "Multi-language (8 languages)",
      "Dedicated account manager",
      "Monthly updates (8 dishes)",
      "Priority support",
      "Social sharing features",
    ],
    accent: true,
    slug: "professional",
  },
  {
    name: "Enterprise",
    tag: "For 5-star hotels & chains",
    setup: 199999,
    setupDisplay: "₹1,99,999",
    monthly: 39999,
    monthlyDisplay: "₹39,999",
    annualMonthly: 33333,
    annualMonthlyDisplay: "₹33,333",
    features: [
      "Unlimited 3D dish models",
      "White-label solution",
      "API access & integrations",
      "Custom development",
      "24/7 priority support",
      "Unlimited monthly updates",
      "Staff training program",
      "Multi-location management",
    ],
    accent: false,
    slug: "enterprise",
  },
];

function PricingCard({
  tier,
  annual,
  delay,
}: {
  tier: (typeof tiers)[0];
  annual: boolean;
  delay: number;
}) {
  const ref = useScrollReveal(delay);
  const monthlyPrice = annual
    ? tier.annualMonthlyDisplay
    : tier.monthlyDisplay;

  return (
    <div
      ref={ref}
      className={`relative flex flex-col overflow-hidden rounded-[20px] border p-8 transition-all duration-500 hover:translate-y-[-4px] ${
        tier.accent
          ? "border-primary/25 bg-primary/[0.04] shadow-[0_0_60px_rgba(201,169,110,0.08)]"
          : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]"
      }`}
    >
      {/* Popular badge */}
      {tier.accent && (
        <div className="absolute -right-8 top-6 rotate-45 bg-gradient-to-r from-[#C9A96E] to-[#B08D57] px-10 py-1 text-[10px] font-bold tracking-[1.5px] text-white uppercase">
          Popular
        </div>
      )}

      {/* Corner glow for accent */}
      {tier.accent && (
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full blur-3xl"
          style={{ background: "rgba(201,169,110,0.1)" }}
        />
      )}

      {/* Tag */}
      <span
        className={`mb-4 text-[11px] font-semibold tracking-[2px] uppercase ${
          tier.accent ? "text-primary" : "text-white/30"
        }`}
      >
        {tier.tag}
      </span>

      {/* Plan Name */}
      <h3 className="font-cormorant text-[28px] font-light text-white">
        {tier.name}
      </h3>

      {/* Prices */}
      <div className="mt-5 mb-6">
        <div className="flex items-baseline gap-2">
          <span
            className={`font-cormorant text-[40px] font-light ${
              tier.accent ? "text-primary" : "text-white/90"
            }`}
          >
            {monthlyPrice}
          </span>
          <span className="text-[13px] text-white/30">/month</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          {tier.setupWas && (
            <span className="text-[13px] text-white/25 line-through">
              {tier.setupWas}
            </span>
          )}
          <span className="text-[13px] text-white/40">
            {tier.setupDisplay} one-time setup
          </span>
        </div>
        {annual && (
          <span className="mt-1 inline-block rounded-full bg-[#8BA88E]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#8BA88E]">
            Save 2 months
          </span>
        )}
      </div>

      {/* Divider */}
      <div
        className="mb-6 h-[1px]"
        style={{
          background: tier.accent
            ? "linear-gradient(90deg, transparent, rgba(201,169,110,0.2), transparent)"
            : "rgba(255,255,255,0.06)",
        }}
      />

      {/* Features */}
      <div className="flex flex-1 flex-col gap-3">
        {tier.features.map((f, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <span
              className={`mt-0.5 text-[13px] font-semibold ${
                tier.accent ? "text-primary/70" : "text-[#8BA88E]/60"
              }`}
            >
              +
            </span>
            <span className="text-[13px] font-light text-white/50">
              {f}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <a
        href={`/contact?plan=${tier.slug}`}
        className={`group relative mt-8 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl py-4 text-[14px] font-semibold text-white transition-all duration-300 ${
          tier.accent
            ? "hover:shadow-[0_8px_32px_rgba(201,169,110,0.35)]"
            : "hover:shadow-[0_4px_20px_rgba(201,169,110,0.15)]"
        }`}
        style={{
          background: tier.accent
            ? "linear-gradient(135deg, #C9A96E, #B08D57)"
            : "rgba(255,255,255,0.06)",
          boxShadow: tier.accent
            ? "0 4px 24px rgba(201,169,110,0.25)"
            : "none",
        }}
      >
        <span className="relative z-10">
          {tier.accent ? "Get Started" : "Choose Plan"}
        </span>
        <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      </a>
    </div>
  );
}

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="relative py-[100px]">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(201,169,110,0.03) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-[680px] px-6 text-center">
        <SectionTag text="Pricing" />
        <h2 className="font-cormorant text-[42px] font-light leading-[1.15] text-white">
          Transparent pricing, premium value
        </h2>
        <p className="mx-auto mt-5 max-w-[500px] text-[15px] font-light leading-[1.8] text-white/45">
          Choose the plan that fits your restaurant. All plans include
          white-glove onboarding and dedicated support.
        </p>

        {/* Monthly / Annual Toggle */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <span
            className={`text-[14px] transition-colors ${
              !annual ? "text-white" : "text-white/30"
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative h-7 w-12 rounded-full border transition-all duration-300 ${
              annual
                ? "border-primary/40 bg-primary/20"
                : "border-white/[0.1] bg-white/[0.05]"
            }`}
          >
            <div
              className={`absolute top-[3px] h-[18px] w-[18px] rounded-full transition-all duration-300 ${
                annual
                  ? "left-[26px] bg-primary"
                  : "left-[3px] bg-white/60"
              }`}
            />
          </button>
          <span
            className={`text-[14px] transition-colors ${
              annual ? "text-white" : "text-white/30"
            }`}
          >
            Annual
          </span>
          {annual && (
            <span className="rounded-full bg-[#8BA88E]/10 px-2.5 py-1 text-[11px] font-medium text-[#8BA88E]">
              2 months free
            </span>
          )}
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="mx-auto mt-14 grid max-w-[1100px] grid-cols-1 gap-5 px-6 md:grid-cols-3">
        {tiers.map((tier, i) => (
          <PricingCard key={tier.slug} tier={tier} annual={annual} delay={i * 100} />
        ))}
      </div>

      {/* Bottom note */}
      <p className="mx-auto mt-8 max-w-[500px] px-6 text-center text-[12px] text-white/20">
        All plans include 3-month pilot period. Setup fee covers AI model
        generation, QR card design, and onboarding. GST extra.
      </p>
    </section>
  );
}
