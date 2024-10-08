/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  prefix: "wallie-",
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "ord-blue": "#111621",
        "ord-orange": "#FF6C3A",
        "ord-gray": "#898A95",
        "ord-purple": "#5E72F8",
        "ord-light-gray": "#D9D5D2",
        "ord-green": "#79E992",
        "ord-red": "#FF5454",
        "ord-light-blue": "#303746",
        "ord-light-blue-400": "#495266",
        "ord-light-blue-250": "#2D323D",
        "ord-blue-600": "#171E2D",
        "ord-alert": "#F8F25E",
        "ord-desc": "#A1A4A9",
      },
      fontFamily: {
        pop: ["Poppins", "sans-serif"],
        outfit: ["Outfit", "sans-serif"],
      },
      backgroundOpacity: {
        90: "0.9",
        80: "0.8",
        // Add any other necessary opacities
      },
      scale: {
        120: "1.2",
        // Add other custom scales if needed
      },
    },
  },
  variants: {
    extend: {
      backgroundOpacity: ["responsive", "hover", "focus"],
    },
  },
  plugins: [],
};
