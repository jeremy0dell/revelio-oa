import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#FAF8F0",
        charcoal: "#1A1A1A",
        "warm-gray": "#2A2A2A",
        gold: "#C4A265",
        "gold-muted": "#A8905A",
        oxblood: "#722F37",
        plum: "#4A2040",
        "soft-gray": "#E5E2DA",
      },
      fontFamily: {
        serif: ["Georgia", "Palatino", "Times New Roman", "serif"],
        sans: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
