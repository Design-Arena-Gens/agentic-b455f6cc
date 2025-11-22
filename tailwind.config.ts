import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eefcf6',
          100: '#d6f7e7',
          200: '#aeeed0',
          300: '#76e1b3',
          400: '#3acd90',
          500: '#1fb57a',
          600: '#149166',
          700: '#137255',
          800: '#145a46',
          900: '#124a3b',
        },
      },
      keyframes: {
        bounceBeat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12%)' }
        },
        pulseBeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.12)' }
        }
      },
      animation: {
        'bounce-beat': 'bounceBeat 0.5s ease',
        'pulse-beat': 'pulseBeat 0.5s ease'
      }
    },
  },
  plugins: [],
};

export default config;
