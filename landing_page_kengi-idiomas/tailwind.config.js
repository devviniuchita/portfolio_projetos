/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./assets/js/**/*.js",
    "./assets/CSS/**/*.css",
    "./assets/CSS/pages/**/*.css",
  ],
  safelist: [
    {
      pattern: /(bg|text|hover:bg)-(primary|secondary|red-hover|blue-dark)/,
    },
    "py-16",
    "bg-gray-50",
    "text-3xl",
    "font-bold",
    "text-center",
    "text-secondary",
    "mb-8",
    "flex",
    "items-center",
    "justify-center",
    "w-full",
    "max-w-[19.375rem]",
    "h-[3.625rem]",
    "bg-primary",
    "bg-secondary",
    "hover:bg-red-hover",
    "hover:bg-blue-dark",
    "rounded-[1.25rem]",
    "cursor-pointer",
    "transition-all",
    "duration-300",
    "hover:bg-red-hover",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#d22630",
        secondary: "#003057",
        "red-hover": "#a91d25",
        "blue-dark": "#002B4E",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      screens: {
        xl: "1328px",
      },
    },
  },
  plugins: [],
};
