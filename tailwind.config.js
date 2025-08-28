/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pricetto: "#086870",
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp'), require('@tailwindcss/aspect-ratio')],
};