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
        campus: {
          bg: "#0B1120",        // Deep slate-navy canvas
          card: "#111827",      // Dark surface
          cardHover: "#1E293B",
          border: "#1F2937",
          parchment: "#F8FAFC", // Warm parchment text & accents
          emerald: "#10B981",   // Community growth & verified status
          emeraldDark: "#065F46",
          gold: "#F59E0B",      // Service hours & honors
          goldDark: "#B45309",  // Metallic border
          crimson: "#DC2626",   // Wax seal & health accents
          cyan: "#06B6D4",      // Tech & social innovation
          indigo: "#6366F1",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "serif"],
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      backgroundImage: {
        "parchment-gradient": "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FDE68A 100%)",
        "gold-shimmer": "linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.25), transparent)",
        "emerald-glow": "radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)",
      },
      animation: {
        "pulse-double": "pulseDouble 1.4s ease-in-out infinite",
        "float-leaf": "floatLeaf 3s ease-in-out infinite",
        "radar-ping": "radarPing 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        "shimmer": "shimmer 2.5s infinite linear",
      },
      keyframes: {
        pulseDouble: {
          "0%, 100%": { transform: "scale(1)" },
          "20%": { transform: "scale(1.15)" },
          "40%": { transform: "scale(1)" },
          "60%": { transform: "scale(1.08)" },
          "80%": { transform: "scale(1)" },
        },
        floatLeaf: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-6px) rotate(8deg)" },
        },
        radarPing: {
          "75%, 100%": { transform: "scale(2.2)", opacity: "0" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
