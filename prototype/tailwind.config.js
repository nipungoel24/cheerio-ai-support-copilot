/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 50: '#ecfdf6', 100: '#d1fae9', 500: '#10a37f', 600: '#0b8a6b', 700: '#0b5d4b', 900: '#063a2f' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      keyframes: {
        glow: { '0%,100%': { boxShadow: '0 0 0 0 rgba(16,163,127,.55)' }, '50%': { boxShadow: '0 0 0 8px rgba(16,163,127,0)' } },
        slidein: { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        fadein: { from: { opacity: '0', transform: 'translateY(4px)' }, to: { opacity: '1', transform: 'none' } },
      },
      animation: { glow: 'glow 1.8s infinite', slidein: 'slidein .25s ease-out', fadein: 'fadein .3s ease-out both' },
    },
  },
  plugins: [],
}
