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
        // Hyperliquid-inspired neon palette
        neon: {
          green: "#00ff88",
          cyan: "#00e5ff",
          lime: "#c6ff00",
          yellow: "#ffff00",
        },
        dark: {
          DEFAULT: "#000000",
          50: "#0a0a0a",
          100: "#111111",
          200: "#161616",
          300: "#1a1a1a",
          400: "#222222",
          500: "#333333",
        },
        zinc: {
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b",
        },
      },
      fontFamily: {
        mono: ["'IBM Plex Mono'", "monospace"],
        sans: ["'Plus Jakarta Sans'", "Inter", "sans-serif"],
      },
      animation: {
        "ticker": "ticker 30s linear infinite",
        "pulse-neon": "pulseNeon 2s ease-in-out infinite",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "glow": "glow 2s ease-in-out infinite alternate",
        "slide-in-right": "slideInRight 0.25s ease",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseNeon: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px #00ff88, 0 0 10px #00ff88" },
          "100%": { boxShadow: "0 0 20px #00ff88, 0 0 40px #00ff88, 0 0 60px #00ff88" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)",
        "radial-neon": "radial-gradient(ellipse at top, rgba(0,255,136,0.12) 0%, transparent 60%)",
        "vault-card": "linear-gradient(135deg, #111111 0%, #1a1a1a 100%)",
      },
      backgroundSize: {
        "grid": "40px 40px",
      },
    },
  },
  plugins: [],
};
export default config;
