/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(255, 74, 28)',
        primaryTransp: 'rgb(255, 74, 28, 0.816)',
        secondary: 'rgb(255, 214, 112)',
        tertiary: 'rgb(51, 153, 137)',
        text: '#170D2E'
      }
    },
  },
  plugins: [],
}
