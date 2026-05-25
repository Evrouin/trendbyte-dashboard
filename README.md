# TrendByte Dashboard

Frontend for [TrendByte](https://github.com/Evrouin/trendbyte) — a tech trend intelligence system tracking emerging technologies across developer communities.

- Live: https://trendbytedashboard.evrouin.com
- API: https://trendbyte.evrouin.com
- Backend repo: https://github.com/Evrouin/trendbyte

## Pages

| Route           | Description                                                                  |
| --------------- | ---------------------------------------------------------------------------- |
| `/`             | Dashboard with content cards, stats, trend chart, top trends, rising stars   |
| `/news`         | Latest posts with source filter, search, and date range picker               |
| `/trends`       | Full trend list with search, date filter, and CSV export                     |
| `/trends/:name` | Trend detail with score history, lifecycle, source breakdown, related trends |
| `/predictions`  | Rising star predictions with confidence scores                               |
| `/categories`   | Category breakdown with per-category trends                                  |
| `/tools`        | Tech Lookup, Compare, Watchlist, Export Trends                               |

## Features

- Content cards (daily signal, weekly recap with gradient vibe bar)
- Tech icons via Devicon integration
- Rank badges (gold, silver, bronze) on top trends
- Trend badges (Rising, Multi-source, and more)
- Custom date range picker component (calendar popup)
- Dark/light mode toggle with localStorage persistence
- Sticky navigation bar (hides on scroll down)
- Loading skeletons during data fetch
- Responsive layout (card view on mobile, table on desktop)
- HMAC request signing for API authentication
- Error page with recovery options
- Pinia store with 5-minute cache TTL for instant navigation
- Animated counters on stat cards
- Share button with clipboard copy
- Keyboard shortcut: `/` focuses search
- Tooltips on interactive elements

## Tools

| Tool          | Description                                                    |
| ------------- | -------------------------------------------------------------- |
| Tech Lookup   | Search and view details for any tracked technology             |
| Compare       | Compare up to 5 trends with overlaid score history             |
| Watchlist     | Save trends to a personal watchlist (localStorage persistence) |
| Export Trends | Export trends data as CSV or JSON via modal                    |

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

| Command             | Description              |
| ------------------- | ------------------------ |
| `npm run dev`       | Development server       |
| `npm run build`     | Production build         |
| `npm run preview`   | Preview production build |
| `npm run format`    | Prettier                 |
| `npm run lint`      | ESLint                   |
| `npm run test`      | Vitest unit tests        |
| `npm run typecheck` | Vue-tsc type checking    |

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
