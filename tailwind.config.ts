import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['ui-sans-serif', 'system-ui', 'Inter', 'Segoe UI', 'sans-serif']
      },
      colors: {
        metal: {
          900: '#0a0b0c',
          800: '#111316',
          700: '#171a1f',
          600: '#1f232b',
          line: '#2c3340',
          glow: '#7df9ff'
        }
      },
      boxShadow: {
        neon: '0 0 30px rgba(125,249,255,0.25)',
        insetMetal: 'inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.5)'
      },
      backgroundImage: {
        steel:
          'radial-gradient(1200px 800px at 20% -10%, rgba(125,249,255,0.08), transparent 40%), ' +
          'radial-gradient(1000px 600px at 110% 10%, rgba(125,249,255,0.06), transparent 45%), ' +
          'linear-gradient(180deg, #0a0b0c, #111316)',
        grid:
          'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), ' +
          'linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)'
      },
      backgroundSize: {
        gridPattern: '36px 36px'
      },
      keyframes: {
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.5' }
        }
      },
      animation: { flicker: 'flicker 6s linear infinite' }
    }
  },
  plugins: []
} satisfies Config
