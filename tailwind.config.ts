import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "peel-base": "#08090a",
        "peel-surface": "#12141a",
        "peel-surface-raised": "#181b22",
        "peel-border": "#232730",
        "peel-lime": "#84ff00",
        "peel-coral": "#ff553e",
      },
    },
  },
  plugins: [],
};

export default config;
