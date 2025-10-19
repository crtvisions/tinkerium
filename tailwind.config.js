/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./tools/**/*.{html,jsx,tsx}",
    "./tools/**/src/**/*.{js,ts,jsx,tsx}",
    "!./**/node_modules/**/*",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
