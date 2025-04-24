/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#C83C3C", //red for cards, headers etc.
        secondary: "#331C1C", //brown mostly for texts on white background
        lightgray: "#F5F2F2", // light grey for card backgrounds
        darkgrey: "#CFCCCC", // dark grey for card borders and stuff
      },
    },
  },
  plugins: [],
};
