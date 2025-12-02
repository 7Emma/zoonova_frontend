/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        chewy: ["Chewy", "system-ui"],
        luckiest: ["Luckiest Guy", "cursive"],
        bungee: ["Bungee Shade", "cursive"],
        arial: ["Arial", "sans-serif"],
        bowlby: ["Bowlby One SC", "sans-serif"],
        baloo: ["Baloo 2", "cursive"],
      },
    },
  },
  plugins: [],
};
