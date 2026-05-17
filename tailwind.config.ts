import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,ts}',
    './components/**/*.{vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: '#161b22',
        border: 'rgba(88, 166, 255, 0.15)',
        accent: '#58a6ff',
        muted: '#8b949e',
        success: '#3fb950',
        warning: '#f78166',
      },
    },
  },
  plugins: [],
} satisfies Config
