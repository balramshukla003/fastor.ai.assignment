/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        fastor: { orange: "#ff5a00", dark: "#34221e", muted: "#8b8582", line: "#eee9e6", cream: "#fff8f3" }
      },
      boxShadow: { soft: "0 8px 28px rgba(49, 30, 20, 0.07)" },
      fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"] }
    }
  },
  plugins: []
};