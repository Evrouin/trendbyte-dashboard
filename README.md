# TrendByte Dashboard

Frontend for [TrendByte](https://github.com/Evrouin/trendbyte) — a tech trend intelligence system tracking emerging technologies across developer communities.

- Live: https://trendbytedashboard.evrouin.com
- API: https://trendbyte.evrouin.com
- Backend repo: https://github.com/Evrouin/trendbyte

## Pages

| Route | Description |
|-------|-------------|
| `/` | Overview with stats, trend chart, top trends, rising stars |
| `/news` | Latest posts with source filter, search, and date range picker |
| `/trends` | Full trend list with search, date filter, and CSV export |
| `/trends/:name` | Trend detail with score history, source breakdown, related trends |
| `/predictions` | Rising star predictions with confidence scores |
| `/categories` | Category breakdown with per-category trends |
| `/compare` | Compare up to 5 trends with overlaid score history |

## Features

- Pinia store with 5-minute cache TTL for instant navigation
- Custom date range picker component (calendar popup)
- Dark/light mode toggle with localStorage persistence
- Animated counters on stat cards
- Loading skeletons during data fetch
- Responsive layout (card view on mobile, table on desktop)
- CSV export on trends page
- Share button with clipboard copy
- Keyboard shortcut: `/` focuses search
- Tooltips on interactive elements

## Tech Stack

- Nuxt 4 (Vue 3) + TypeScript (strict)
- Tailwind CSS v4
- Pinia (state management)
- Chart.js (vue-chartjs)
- Vitest (unit tests)
- Vercel (deployment)

## Setup

```bash
nvm use 22
npm install
npm run dev
```

The API URL defaults to `https://trendbyte.evrouin.com`. Override with:

```
NUXT_PUBLIC_API_URL=http://localhost:8000
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run format` | Prettier |
| `npm run lint` | ESLint |
| `npm run test` | Vitest unit tests |
| `npm run typecheck` | Vue-tsc type checking |

## Design

Dark blue glassmorphism theme:

- Background: `#0d1117` to `#1c2a3a` gradient
- Glass panels: `rgba(56, 139, 253, 0.06)` with backdrop blur
- Accent: `#58a6ff`
- Text: `#f0f6fc` / `#8b949e`
- Font: Inter

Light mode available via toggle in the navigation bar.

## License

MIT
