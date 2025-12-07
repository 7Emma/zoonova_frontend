/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "375px",
      },
      fontFamily: {
        alfa: ["Alfa Slab One", "serif"],
        roboto: ["Roboto", "sans-serif"],
        skranji: ["Skranji", "cursive"],
        poetsen: ["Poetsen One", "sans-serif"],
        fredoka: ["Fredoka", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        chewy: ["Chewy", "system-ui"],
        luckiest: ["Luckiest Guy", "cursive"],
        bungee: ["Bungee Shade", "cursive"],
        arial: ["Arial", "sans-serif"],
        bowlby: ["Bowlby One SC", "sans-serif"],
        baloo: ["Baloo 2", "cursive"],
        nunito: ["Nunito", "sans-serif"],
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "slide-up": "slideUp 0.3s ease-in-out",
      },
    },
  },
  plugins: [],
};
