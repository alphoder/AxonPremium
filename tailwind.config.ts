import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#C9A96E",
        accent: "#B08D57",
        dark: "#060608",
        surface: "rgba(255,255,255,0.02)",
        "surface-border": "rgba(255,255,255,0.06)",
        "text-secondary": "rgba(255,255,255,0.55)",
        "text-tertiary": "rgba(255,255,255,0.3)",
        sage: "#8BA88E",
        lavender: "#9B8EC4",
        rose: "#B5727E",
        steel: "#7B9BB5",
        ivory: "#E8D5B7",
      },
      fontFamily: {
        cormorant: ["Cormorant Garamond", "Georgia", "serif"],
        dm: ["DM Sans", "system-ui", "sans-serif"],
      },
      keyframes: {
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(0.85)" },
        },
        "grain": {
          "0%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-5%, -10%)" },
          "20%": { transform: "translate(-15%, 5%)" },
          "30%": { transform: "translate(7%, -25%)" },
          "40%": { transform: "translate(-5%, 25%)" },
          "50%": { transform: "translate(-15%, 10%)" },
          "60%": { transform: "translate(15%, 0%)" },
          "70%": { transform: "translate(0%, 15%)" },
          "80%": { transform: "translate(3%, 35%)" },
          "90%": { transform: "translate(-10%, 10%)" },
          "100%": { transform: "translate(0, 0)" },
        },
        "scroll-line": {
          "0%": { scaleY: "0", opacity: "0" },
          "50%": { scaleY: "1", opacity: "1" },
          "100%": { scaleY: "0", opacity: "0" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 40px rgba(201,169,110,0.15)" },
          "50%": { boxShadow: "0 0 60px rgba(201,169,110,0.3)" },
        },
      },
      animation: {
        "float": "float 4s ease-in-out infinite",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        "grain": "grain 8s steps(10) infinite",
        "scroll-line": "scroll-line 2.5s ease-in-out infinite",
        "glow-pulse": "glow-pulse 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
