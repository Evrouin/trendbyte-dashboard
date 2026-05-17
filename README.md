# TrendByte Dashboard

Frontend dashboard for TrendByte — a tech trend intelligence system that tracks emerging technologies across developer communities.

Live API: https://trendbyte.evrouin.com

## Tech Stack

- Nuxt 4 (Vue 3)
- TypeScript (strict)
- Tailwind CSS v4
- Chart.js (vue-chartjs)
- Prettier + ESLint

## Pages

- `/` — Overview with stats, trend chart, top trends table, rising stars
- `/news` — Latest posts from all sources with source filter
- `/trends` — Full trend list with search and date range filter
- `/trends/:name` — Trend detail with score history chart and related posts
- `/predictions` — Rising star predictions with confidence scores
- `/categories` — Category breakdown with per-category charts

## Setup

```bash
nvm use 22
npm install
npm run dev
```

## Environment

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| NUXT_PUBLIC_API_URL | TrendByte API base URL |

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build
npm run format    # Run Prettier
npm run lint      # Run ESLint
```

## Design System

Matches the TrendByte brand (dark blue glassmorphism theme):

- Background: #0d1117 to #1c2a3a gradient
- Glass panels: rgba(56, 139, 253, 0.06) with backdrop blur
- Accent: #58a6ff
- Text: #f0f6fc (primary), #8b949e (secondary)
- Font: Inter

## License

MIT
