/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4ff',
          100: '#e0e8ff',
          500: '#3b5bdb',
          600: '#2f4ac0',
          700: '#1e3a8a',
          800: '#1e3066',
          900: '#0f1f42',
        }
      }
    },
  },
  plugins: [],
}
