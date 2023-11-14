/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          850: 'background: #1E2025'
        }
      },
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'],
        mono: ['"Ubuntu Mono"', 'monospace'],
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}