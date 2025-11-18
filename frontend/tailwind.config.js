/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cyan: { 400: "#22D3EE" },
        pink: { 100: "#FBCFE8", 200: "#F9A8D4", 500: "#EC4899", 600: "#DB2777" },
        purple: { 100: "#EDE9FE", 400: "#C084FC", 600: "#9333EA" },
        teal: { 100: "#CCFBF1", 400: "#5EEAD4" },
        indigo: { 100: "#E0E7FF", 200: "#C7D2FE", 600: "#4F46E5" },
      },
    },
  },
  plugins: [],
};