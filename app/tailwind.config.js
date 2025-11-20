/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        notion: {
          bg: "#ffffff",
          "bg-dark": "#191919",
          "bg-secondary": "#f7f6f3",
          "bg-secondary-dark": "#2f2f2f",
          text: "#37352f",
          "text-dark": "#e3e2e0",
          "text-secondary": "#787774",
          "text-secondary-dark": "#9b9a97",
          border: "#e9e9e7",
          "border-dark": "#3f3f3f",
          hover: "#f1f0ee",
          "hover-dark": "#373737",
          blue: "#2383e2",
          "blue-bg": "#e7f3ff",
          "blue-bg-dark": "#1e3a5f",
          purple: "#9065b0",
          "purple-bg": "#f4effc",
          "purple-bg-dark": "#3a2d4a",
          red: "#eb5757",
          "red-bg": "#ffe2dd",
          "red-bg-dark": "#5c2b2b",
          green: "#448361",
          "green-bg": "#ddedea",
          "green-bg-dark": "#2d4a3e",
          yellow: "#dfab01",
          "yellow-bg": "#fdecc8",
          "yellow-bg-dark": "#4a3d1f",
        },
      },
      animation: {
        confetti: "confetti 3s ease-out forwards",
        "slide-in": "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-out": "slideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fadeIn 0.2s ease-out",
        "bounce-in": "bounceIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        confetti: {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "1" },
          "100%": {
            transform: "translateY(100vh) rotate(720deg)",
            opacity: "0",
          },
        },
        slideIn: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideOut: {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(-100%)", opacity: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica",
          "Apple Color Emoji",
          "Arial",
          "sans-serif",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
        ],
      },
      boxShadow: {
        notion:
          "rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 2px 4px",
        "notion-hover":
          "rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.2) 0px 3px 9px",
        "notion-dark": "rgba(255, 255, 255, 0.05) 0px 0px 0px 1px",
        "notion-dark-hover": "rgba(255, 255, 255, 0.08) 0px 0px 0px 1px",
      },
    },
  },
  plugins: [],
};
