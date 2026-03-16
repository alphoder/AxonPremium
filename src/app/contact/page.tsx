"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ContactPageWrapper() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#060608]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    }>
      <ContactPage />
    </Suspense>
  );
}

const plans = [
  { value: "starter", label: "Starter — ₹49,999 setup + ₹14,999/mo" },
  { value: "professional", label: "Professional — ₹99,999 setup + ₹24,999/mo" },
  { value: "enterprise", label: "Enterprise — ₹1,99,999 setup + ₹39,999/mo" },
  { value: "custom", label: "Custom Solution" },
];

const benefits = [
  { icon: "◈", text: "AI-generated photorealistic 3D dish models" },
  { icon: "◎", text: "No app download — works in any browser" },
  { icon: "◇", text: "Smart analytics & engagement tracking" },
  { icon: "◆", text: "Multi-language auto-translation" },
  { icon: "◉", text: "Dedicated onboarding & white-glove setup" },
  { icon: "◈", text: "Premium QR cards designed for your brand" },
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  restaurantName: string;
  city: string;
  plan: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  restaurantName?: string;
  city?: string;
  plan?: string;
}

function ContactPage() {
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    restaurantName: "",
    city: "",
    plan: searchParams.get("plan") || "professional",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const plan = searchParams.get("plan");
    if (plan && plans.some((p) => p.value === plan)) {
      setForm((prev) => ({ ...prev, plan }));
    }
  }, [searchParams]);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!/^[+]?[\d\s\-()]{8,15}$/.test(form.phone.trim()))
      e.phone = "Enter a valid phone number";
    if (!form.restaurantName.trim())
      e.restaurantName = "Restaurant name is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.plan) e.plan = "Please select a plan";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  };

  const handleChange = (
    field: keyof FormData,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.1 + i * 0.06, duration: 0.5, ease: "easeOut" as const },
    }),
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#060608] pt-[100px] pb-20">
        {/* Background glow */}
        <div
          className="pointer-events-none fixed inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 30% 40%, rgba(201,169,110,0.04) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-[1100px] px-6">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex min-h-[60vh] flex-col items-center justify-center text-center"
              >
                {/* Animated checkmark */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                  className="mb-8 flex h-20 w-20 items-center justify-center rounded-full"
                  style={{
                    background: "linear-gradient(135deg, rgba(139,168,142,0.15), rgba(139,168,142,0.05))",
                    border: "1px solid rgba(139,168,142,0.3)",
                  }}
                >
                  <motion.svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#8BA88E"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </motion.svg>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="font-cormorant text-[42px] font-light text-white"
                >
                  We&apos;ll be in touch
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="mt-4 max-w-[400px] text-[15px] font-light leading-[1.7] text-white/50"
                >
                  Thank you for your interest in Axon Aura. Our team will reach out within 24 hours to schedule your personalized demo.
                </motion.p>

                <motion.a
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  href="/"
                  className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-6 py-3 text-[14px] text-white/60 transition-all duration-300 hover:border-white/[0.15] hover:text-white"
                >
                  ← Back to home
                </motion.a>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 gap-16 lg:grid-cols-2"
              >
                {/* ── Left: Compelling Copy ── */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="flex flex-col justify-center"
                >
                  <div className="mb-6 inline-flex w-fit items-center gap-2.5 rounded-full border border-primary/20 bg-primary/[0.08] px-4 py-2">
                    <span className="h-[6px] w-[6px] rounded-full bg-primary animate-pulse-dot" />
                    <span className="text-[12px] font-semibold tracking-[2px] text-primary/90 uppercase">
                      Limited spots available
                    </span>
                  </div>

                  <h1 className="font-cormorant text-[48px] font-light leading-[1.1] text-white lg:text-[56px]">
                    Transform your
                    <br />
                    dining <em className="text-primary italic">experience</em>
                  </h1>

                  <div
                    className="mt-6 h-[1px] w-16"
                    style={{
                      background: "linear-gradient(90deg, #C9A96E, transparent)",
                    }}
                  />

                  <p className="mt-6 max-w-[440px] text-[15px] font-light leading-[1.8] text-white/50">
                    Join India&apos;s most forward-thinking restaurants already using
                    AR to delight guests and boost revenue. Fill in your details
                    and we&apos;ll set up a personalized demo within 24 hours.
                  </p>

                  {/* Benefits */}
                  <div className="mt-10 flex flex-col gap-4">
                    {benefits.map((b, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                        className="flex items-center gap-3"
                      >
                        <span className="text-[14px] text-primary/70">
                          {b.icon}
                        </span>
                        <span className="text-[14px] font-light text-white/55">
                          {b.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Social proof */}
                  <div className="mt-10 flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {["#C9A96E", "#B08D57", "#8BA88E", "#9B8EC4"].map(
                        (color, i) => (
                          <div
                            key={i}
                            className="h-7 w-7 rounded-full border-2 border-[#060608]"
                            style={{ background: color, opacity: 0.85 }}
                          />
                        )
                      )}
                    </div>
                    <span className="text-[13px] text-white/25">
                      12+ premium restaurants in pilot
                    </span>
                  </div>
                </motion.div>

                {/* ── Right: Form ── */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="rounded-[20px] border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-sm lg:p-10"
                    style={{
                      boxShadow: "0 8px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
                    }}
                  >
                    <h3 className="mb-1 text-[20px] font-medium text-white">
                      Get started
                    </h3>
                    <p className="mb-8 text-[13px] text-white/35">
                      Tell us about your restaurant and we&apos;ll tailor a solution for you.
                    </p>

                    <div className="flex flex-col gap-5">
                      {/* Name */}
                      <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
                        <label className="mb-1.5 block text-[12px] font-medium tracking-wide text-white/40 uppercase">
                          Full Name <span className="text-accent">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          placeholder="Vikram Mehta"
                          className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3.5 text-[15px] text-white placeholder-white/20 outline-none transition-all duration-300 focus:bg-white/[0.05] ${
                            errors.name
                              ? "border-accent/50 focus:border-accent"
                              : "border-white/[0.06] focus:border-primary/40 focus:shadow-[0_0_20px_rgba(201,169,110,0.08)]"
                          }`}
                        />
                        {errors.name && (
                          <p className="mt-1.5 text-[12px] text-accent/80">{errors.name}</p>
                        )}
                      </motion.div>

                      {/* Email + Phone row */}
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
                          <label className="mb-1.5 block text-[12px] font-medium tracking-wide text-white/40 uppercase">
                            Email <span className="text-accent">*</span>
                          </label>
                          <input
                            type="email"
                            value={form.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            placeholder="vikram@restaurant.com"
                            className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3.5 text-[15px] text-white placeholder-white/20 outline-none transition-all duration-300 focus:bg-white/[0.05] ${
                              errors.email
                                ? "border-accent/50 focus:border-accent"
                                : "border-white/[0.06] focus:border-primary/40 focus:shadow-[0_0_20px_rgba(201,169,110,0.08)]"
                            }`}
                          />
                          {errors.email && (
                            <p className="mt-1.5 text-[12px] text-accent/80">{errors.email}</p>
                          )}
                        </motion.div>

                        <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
                          <label className="mb-1.5 block text-[12px] font-medium tracking-wide text-white/40 uppercase">
                            Phone <span className="text-accent">*</span>
                          </label>
                          <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            placeholder="+91 98765 43210"
                            className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3.5 text-[15px] text-white placeholder-white/20 outline-none transition-all duration-300 focus:bg-white/[0.05] ${
                              errors.phone
                                ? "border-accent/50 focus:border-accent"
                                : "border-white/[0.06] focus:border-primary/40 focus:shadow-[0_0_20px_rgba(201,169,110,0.08)]"
                            }`}
                          />
                          {errors.phone && (
                            <p className="mt-1.5 text-[12px] text-accent/80">{errors.phone}</p>
                          )}
                        </motion.div>
                      </div>

                      {/* Restaurant + City row */}
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
                          <label className="mb-1.5 block text-[12px] font-medium tracking-wide text-white/40 uppercase">
                            Restaurant / Cafe <span className="text-accent">*</span>
                          </label>
                          <input
                            type="text"
                            value={form.restaurantName}
                            onChange={(e) => handleChange("restaurantName", e.target.value)}
                            placeholder="The Grand Pavilion"
                            className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3.5 text-[15px] text-white placeholder-white/20 outline-none transition-all duration-300 focus:bg-white/[0.05] ${
                              errors.restaurantName
                                ? "border-accent/50 focus:border-accent"
                                : "border-white/[0.06] focus:border-primary/40 focus:shadow-[0_0_20px_rgba(201,169,110,0.08)]"
                            }`}
                          />
                          {errors.restaurantName && (
                            <p className="mt-1.5 text-[12px] text-accent/80">{errors.restaurantName}</p>
                          )}
                        </motion.div>

                        <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible">
                          <label className="mb-1.5 block text-[12px] font-medium tracking-wide text-white/40 uppercase">
                            City <span className="text-accent">*</span>
                          </label>
                          <input
                            type="text"
                            value={form.city}
                            onChange={(e) => handleChange("city", e.target.value)}
                            placeholder="Mumbai"
                            className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3.5 text-[15px] text-white placeholder-white/20 outline-none transition-all duration-300 focus:bg-white/[0.05] ${
                              errors.city
                                ? "border-accent/50 focus:border-accent"
                                : "border-white/[0.06] focus:border-primary/40 focus:shadow-[0_0_20px_rgba(201,169,110,0.08)]"
                            }`}
                          />
                          {errors.city && (
                            <p className="mt-1.5 text-[12px] text-accent/80">{errors.city}</p>
                          )}
                        </motion.div>
                      </div>

                      {/* Plan Selector */}
                      <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="visible">
                        <label className="mb-1.5 block text-[12px] font-medium tracking-wide text-white/40 uppercase">
                          Preferred Plan <span className="text-accent">*</span>
                        </label>
                        <select
                          value={form.plan}
                          onChange={(e) => handleChange("plan", e.target.value)}
                          className={`w-full appearance-none rounded-xl border bg-white/[0.03] px-4 py-3.5 text-[15px] text-white outline-none transition-all duration-300 focus:bg-white/[0.05] ${
                            errors.plan
                              ? "border-accent/50"
                              : "border-white/[0.06] focus:border-primary/40 focus:shadow-[0_0_20px_rgba(201,169,110,0.08)]"
                          }`}
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='rgba(255,255,255,0.3)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 16px center",
                          }}
                        >
                          {plans.map((p) => (
                            <option
                              key={p.value}
                              value={p.value}
                              className="bg-[#111] text-white"
                            >
                              {p.label}
                            </option>
                          ))}
                        </select>
                      </motion.div>

                      {/* Message */}
                      <motion.div custom={6} variants={fieldVariants} initial="hidden" animate="visible">
                        <label className="mb-1.5 block text-[12px] font-medium tracking-wide text-white/40 uppercase">
                          Message <span className="text-white/20">(optional)</span>
                        </label>
                        <textarea
                          value={form.message}
                          onChange={(e) => handleChange("message", e.target.value)}
                          placeholder="Tell us about your restaurant, number of dishes, specific requirements..."
                          rows={3}
                          className="w-full resize-none rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5 text-[15px] text-white placeholder-white/20 outline-none transition-all duration-300 focus:border-primary/40 focus:bg-white/[0.05] focus:shadow-[0_0_20px_rgba(201,169,110,0.08)]"
                        />
                      </motion.div>

                      {/* Error message */}
                      {status === "error" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-xl border border-accent/20 bg-accent/[0.08] px-4 py-3 text-[13px] text-accent/90"
                        >
                          {errorMsg}
                        </motion.div>
                      )}

                      {/* Submit */}
                      <motion.div custom={7} variants={fieldVariants} initial="hidden" animate="visible">
                        <button
                          type="submit"
                          disabled={status === "loading"}
                          className="group relative w-full overflow-hidden rounded-xl py-4 text-[15px] font-semibold text-white transition-all duration-300 hover:shadow-[0_8px_32px_rgba(201,169,110,0.35)] disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{
                            background: "linear-gradient(135deg, #C9A96E, #B08D57)",
                            boxShadow: "0 4px 24px rgba(201,169,110,0.25)",
                          }}
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            {status === "loading" ? (
                              <>
                                <svg
                                  className="h-4 w-4 animate-spin"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    className="opacity-25"
                                  />
                                  <path
                                    d="M4 12a8 8 0 018-8"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                  />
                                </svg>
                                Submitting...
                              </>
                            ) : (
                              <>
                                Get Your Personalized Demo
                                <span className="transition-transform duration-300 group-hover:translate-x-1">
                                  →
                                </span>
                              </>
                            )}
                          </span>
                          {/* Shimmer */}
                          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                        </button>
                      </motion.div>

                      <p className="text-center text-[12px] text-white/20">
                        We respond within 24 hours. No spam, ever.
                      </p>
                    </div>
                  </form>

                  {/* Back link */}
                  <div className="mt-6 text-center">
                    <a
                      href="/"
                      className="text-[13px] text-white/30 transition-colors duration-300 hover:text-white/60"
                    >
                      ← Back to home
                    </a>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
