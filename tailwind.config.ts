import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        abyss: "#050608",
        "abyss-soft": "#0d1016",
        steel: "#8993a4",
        mist: "#f4f7fb",
        chrome: "#c0c7d3",
        ember: "#d6dde8",
        panel: "rgba(12, 16, 24, 0.72)"
      },
      fontFamily: {
        sans: ['"Avenir Next"', '"Avenir"', '"Segoe UI"', "sans-serif"],
        display: ['"Avenir Next"', '"Avenir"', '"Segoe UI"', "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 24px 60px rgba(0,0,0,0.45)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.06)"
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
        "metal-sheen":
          "linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04) 18%, rgba(255,255,255,0.1) 34%, rgba(0,0,0,0) 60%)"
      },
      keyframes: {
        "soft-pulse": {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.03)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        },
        "slow-pan": {
          "0%": { transform: "translate3d(-2%, -2%, 0) scale(1)" },
          "100%": { transform: "translate3d(2%, 2%, 0) scale(1.06)" }
        }
      },
      animation: {
        "soft-pulse": "soft-pulse 8s ease-in-out infinite",
        float: "float 9s ease-in-out infinite",
        "slow-pan": "slow-pan 16s ease-in-out infinite alternate"
      }
    }
  },
  plugins: []
};

export default config;
