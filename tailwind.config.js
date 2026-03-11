/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#e6fff3',
          100: '#b3ffdf',
          200: '#80ffcb',
          300: '#4dffb7',
          400: '#1affa3',
          500: '#00d26a',
          600: '#00a854',
          700: '#007e3f',
          800: '#00542a',
          900: '#002a15',
        },
        surface: {
          DEFAULT: '#060d08',
          card:    '#0c1a0f',
          border:  '#122918',
          muted:   '#0f2014',
        },
      },
      backgroundImage: {
        'brand-gradient':  'linear-gradient(135deg, #00d26a 0%, #00a854 100%)',
        'card-gradient':   'linear-gradient(145deg, #0c1a0f 0%, #0a1a0d 100%)',
        'glow-gradient':   'radial-gradient(ellipse at center, rgba(0,210,106,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'brand':    '0 0 20px rgba(0, 210, 106, 0.3)',
        'brand-sm': '0 0 10px rgba(0, 210, 106, 0.2)',
        'card':     '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}
