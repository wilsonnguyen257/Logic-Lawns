/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors.js';

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        brand: colors.green,
      }
    },
  },
  plugins: [],
};
