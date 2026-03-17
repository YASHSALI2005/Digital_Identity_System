/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#14b8a6", // teal-500
        secondary: "#1e293b", // slate-800
        dark: "#0f172a", // slate-900
        premiumBorder: "rgba(255, 255, 255, 0.1)",
      }
    },
  },
  plugins: [],
}
