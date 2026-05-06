/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          50:  '#c5d3df',
          100: '#b0c4d4',
          200: '#9fb5d8',
          300: '#7897c8',
          400: '#5a80bc',
          500: '#3c6ab0',
          600: '#2f5899',
          700: '#214475',
          800: '#1a3259',
          900: '#1e3a5f',
          950: '#0f2040',
        },
      },
    },
  },
  plugins: [],
}
