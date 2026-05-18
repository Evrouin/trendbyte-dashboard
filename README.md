# TrendByte Dashboard

Frontend for [TrendByte](https://github.com/Evrouin/trendbyte) — a tech trend intelligence system tracking emerging technologies across developer communities.

🔗 **Live:** https://trendbytedashboard.evrouin.com  
🔗 **API:** https://trendbyte.evrouin.com  
🔗 **Backend repo:** https://github.com/Evrouin/trendbyte

## Pages

| Route           | Description                                             |
| --------------- | ------------------------------------------------------- |
| `/`             | Overview — stats, trend chart, top trends, rising stars |
| `/news`         | Latest posts from all sources with source filter        |
| `/trends`       | Full trend list with search and date range filter       |
| `/trends/:name` | Trend detail with score history chart and related posts |
| `/predictions`  | Rising star predictions with confidence scores          |
| `/categories`   | Category breakdown with per-category bar charts         |

## Tech Stack

- Nuxt 4 (Vue 3) + TypeScript (strict)
- Tailwind CSS v4
- Chart.js (vue-chartjs)
- Vercel (deployment)

## Setup

```bash
nvm use 22
npm install
cp .env.example .env
npm run dev
```

## Environment

| Variable            | Description            |
| ------------------- | ---------------------- |
| NUXT_PUBLIC_API_URL | TrendByte API base URL |

## Scripts

```bash
npm run dev       # Dev server
npm run build     # Production build
npm run preview   # Preview build
npm run format    # Prettier
npm run lint      # ESLint
```

## Design

Dark blue glassmorphism theme matching the TrendByte brand:

- Background: `#0d1117` → `#1c2a3a` gradient
- Glass panels: `rgba(56, 139, 253, 0.06)` + backdrop blur
- Accent: `#58a6ff`
- Text: `#f0f6fc` / `#8b949e`
- Font: Inter

## License

MIT
