/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

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
        text: '#170D2E',
        greengood: '#3d9900',
        bgOrange: '#FF3600'
      }, 
      boxShadow: {    
      },
      backgroundImage: {
        'halloween': "url('./src/assets/halloween-castle.png')",
        'moon': "url('./src/assets/cloudmoon.gif')",
        'occult': "url('./src/assets/occult.png')",
        'ghost': "url(/assets/ghost.png)",
        'user': "url(/assets/user.svg)",
        'user-plus': "url(/assets/user-plus.svg)"
        },
    },
    textShadow: {
      sm: '0 1px 2px var(--tw-shadow-color)',
      DEFAULT: '0 2px 4px var(--tw-shadow-color)',
      lg: '0 8px 16px var(--tw-shadow-color)',
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    }),
  ],
}
