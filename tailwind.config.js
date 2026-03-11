/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#dde8ff',
          200: '#b3caff',
          300: '#80a8ff',
          400: '#4d85ff',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#1e3480',
        },
        surface: {
          DEFAULT: '#0f0f1a',
          card: '#1a1a2e',
          border: '#2a2a40',
          muted: '#252540',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gold-gradient': 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
        'card-gradient': 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
      },
    },
  },
  plugins: [],
}


