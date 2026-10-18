/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Provided Palette:
        // #F2E3D5 (Cream / Pearl Sand)
        // #6D4C2E (Deep Mocha / Roast Espresso)
        // #D9A94D (Golden Amber / Honey Gold)
        // #A66E2E (Caramel Bronze / Warm Spice)
        palette: {
          cream: '#F2E3D5',
          dark: '#6D4C2E',
          gold: '#D9A94D',
          bronze: '#A66E2E',
        },
        brand: {
          50: '#FAF5EE',
          100: '#F2E3D5', // requested cream
          200: '#E6CFBC',
          300: '#D9A94D', // requested gold
          400: '#C78F3B',
          500: '#A66E2E', // requested bronze
          600: '#8C5A24',
          700: '#6D4C2E', // requested deep dark roast
          800: '#4D331D',
          900: '#2F1E10',
          950: '#1A1008',
        },
        surface: {
          light: '#FAF6F0',
          card: '#FFFFFF',
          cardDark: '#1E1510',
          dark: '#140E0A',
          darkElevated: '#281D15',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'warm-sm': '0 2px 8px -2px rgba(109, 76, 46, 0.08)',
        'warm-md': '0 8px 24px -4px rgba(109, 76, 46, 0.12)',
        'warm-lg': '0 16px 36px -6px rgba(109, 76, 46, 0.16)',
        'gold-glow': '0 0 20px rgba(217, 169, 77, 0.35)',
      }
    },
  },
  plugins: [],
};