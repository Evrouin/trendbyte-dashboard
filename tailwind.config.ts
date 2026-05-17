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
        bg: {
          DEFAULT: '#0d1117',
          secondary: '#161b22',
          tertiary: '#1c2a3a',
        },
        surface: {
          DEFAULT: 'rgba(56, 139, 253, 0.06)',
          hover: 'rgba(56, 139, 253, 0.1)',
        },
        border: {
          DEFAULT: 'rgba(88, 166, 255, 0.15)',
          subtle: 'rgba(88, 166, 255, 0.1)',
        },
        accent: {
          DEFAULT: '#58a6ff',
          dim: '#388bfd',
        },
        text: {
          DEFAULT: '#f0f6fc',
          secondary: '#8b949e',
          muted: '#484f58',
        },
        success: '#3fb950',
        warning: '#f78166',
        purple: '#d2a8ff',
        yellow: '#dbab09',
        red: '#f85149',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #1c2a3a 100%)',
      },
      backdropBlur: {
        glass: '20px',
      },
    },
  },
  plugins: [],
} satisfies Config
