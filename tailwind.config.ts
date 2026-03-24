import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        fire: {
          50: "#fff1f1",
          100: "#ffdfdf",
          200: "#ffc4c4",
          300: "#ff9c9c",
          400: "#ff6363",
          500: "#ff3131",
          600: "#f31515",
          700: "#cd0c0c",
          800: "#a90e0e",
          900: "#8c1313",
          950: "#4d0404",
        },
      },
      animation: {
        'flame': 'flame 3s ease-in-out infinite',
      },
      keyframes: {
        flame: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
