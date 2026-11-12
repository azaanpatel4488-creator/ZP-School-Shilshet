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
        bordo: {
          DEFAULT: "#6C151E",
          dark: "#4D0E15",
          light: "#851C27",
          subtle: "#F9ECEE",
        },
        pine: {
          DEFAULT: "#0F3D3A",
          dark: "#092523",
          light: "#165551",
          subtle: "#E8F2F1",
        },
        cream: {
          DEFAULT: "#F5DABF",
          soft: "#FAF0E6",
          border: "#E8CFB5",
        },
        "slate-black": "#1A1A1A",
        "off-white": "#FAF7F2",
        gold: {
          DEFAULT: "#D4AF37",
          dark: "#C69214",
          light: "#FBF4DE",
        },
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

