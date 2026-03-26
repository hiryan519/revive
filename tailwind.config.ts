import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#0F1115",
        cyanGlow: "#00E5FF",
        amberGlow: "#FF8A00",
        cardGray: "#1C1F26",
      },
      boxShadow: {
        "cyan-neon":
          "0 0 0 1px rgba(0, 229, 255, 0.35), 0 0 12px rgba(0, 229, 255, 0.35), 0 0 32px rgba(0, 229, 255, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
