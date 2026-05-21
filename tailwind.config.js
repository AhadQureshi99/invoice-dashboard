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
          50:  '#e6f4ef',
          100: '#cde9df',
          200: '#a3d4c1',
          300: '#79bea2',
          400: '#4eaa88',
          500: '#2d9171',
          600: '#1f7559',
          700: '#175e48',
          800: '#114a39',
          900: '#0E5F4F',
          950: '#083F33',
        },
      },
    },
  },
  plugins: [],
}
