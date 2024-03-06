const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class', // 'media' or 'class'
  theme: {
    extend: {},
    screens: {
      xs: '481px',
      ...defaultTheme.screens,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
