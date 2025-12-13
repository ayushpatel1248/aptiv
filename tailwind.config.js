/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9ebff',
          200: '#b3d7ff',
          300: '#85beff',
          400: '#569dff',
          500: '#2e78ff',
          600: '#1f5be6',
          700: '#1a49bb',
          800: '#183f94',
          900: '#173775',
        },
      },
    },
  },
  plugins: [],
}

