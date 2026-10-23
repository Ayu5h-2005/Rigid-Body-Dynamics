/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        felt: {
          900: '#06281e',
          800: '#0b3b2c',
          700: '#084f3a',
          600: '#0e7053',
          500: '#158060',
        },
        slatebg: {
          950: '#070b11',
          900: '#0c131c',
          850: '#101a26',
          800: '#162334',
          700: '#21334b',
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        accent: {
          teal: '#2dd4bf',
          cyan: '#38bdf8',
          emerald: '#34d399',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
