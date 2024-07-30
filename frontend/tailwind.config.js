/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // or 'media' or false
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#FFD700",
      },
    },
  },
  plugins: [],
};
