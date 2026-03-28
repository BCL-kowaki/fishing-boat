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
        primary: {
          DEFAULT: "#ad926a",
          dark: "#846a3f",
          home: "#77654b",
        },
        muted: {
          DEFAULT: "#999",
          light: "#aaa",
          dark: "#777",
        },
        border: "#ddd",
        "bg-alt": "#f3f3f3",
      },
      fontFamily: {
        sans: ["'Noto Sans JP'", "Arial", "'Hiragino Sans'", "sans-serif"],
        serif: [
          "'Noto Serif JP'",
          "'Times New Roman'",
          "'Yu Mincho'",
          "serif",
        ],
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": {
            opacity: "0",
            transform: "scale(1.15)",
            filter: "blur(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
            filter: "blur(0)",
          },
        },
        "bounce-down": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(8px)" },
        },
      },
      animation: {
        "fade-in-up":
          "fade-in-up 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "scale-in":
          "scale-in 2.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "bounce-down": "bounce-down 1.8s ease infinite",
      },
    },
  },
  plugins: [],
};
export default config;
