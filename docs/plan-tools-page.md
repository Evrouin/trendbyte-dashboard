# Tools Page Design Plan

## Nav Structure

```
Dashboard | News | Trends | Predictions | Categories | Tools ▾
                                                        ├── Tech Lookup
                                                        ├── Compare
                                                        ├── Watchlist
                                                        ├── Correlation Finder
                                                        ├── Category Predictor
                                                        └── Export Trends (modal)
```

## 1. Tech Lookup (`/tools/lookup`)

Single search box → instant rich card.

**Layout:**

- Large centered search input with autocomplete (from trends list)
- On select/enter → shows a card below:

**Card contents:**

- Tech icon + name (large)
- Badges (Rising, Multi-source, etc.)
- Score + mentions + sources list
- Lifecycle phase pill
- Sentiment indicator (Positive/Neutral/Negative)
- Mini sparkline of last 4 weeks
- Link to full trend detail page

**Empty state:** "Search for any technology to see its trend data"

## 2. Compare (`/compare`)

Already built. Move route to `/tools/compare` or keep at `/compare` with nav link under Tools.

Keep existing design — select up to 5 trends, overlay score history chart.

## 3. Watchlist (`/tools/watchlist`)

Personal tech watchlist stored in localStorage.

**Layout:**

- Top: search/add input (autocomplete from trends)
- Below: grid of watched tech cards (2 cols desktop, 1 mobile)

**Each card:**

- Tech icon + name
- Current score + change since last visit
- Lifecycle badge
- Mini sparkline (last 4 data points)
- Remove button (x)

**Empty state:** "Add technologies to your watchlist to track them here"

**Storage:** `localStorage.setItem('watchlist', JSON.stringify(['Python', 'Rust', ...]))`

## 4. Correlation Finder (`/tools/correlations`)

Input a tech → see what trends with it.

**Layout:**

- Search input (select a tech)
- Below: list of correlated techs as cards

**Each result card:**

- Tech icon + name
- Correlation strength bar (0-100%)
- Co-occurrence count
- Link to compare both

**Empty state:** "Select a technology to find what trends alongside it"

## 5. Category Predictor (`/tools/predict`)

Paste text → ML predicts category.

**Layout:**

- Textarea input ("Paste a post title or description...")
- Predict button
- Below: result card showing:
  - Predicted category (large, colored pill)
  - Confidence bar per category (horizontal bars)
  - Top 3 categories with percentages

**Empty state:** "Enter text to see which tech category it belongs to"

## 6. Export Trends (modal, triggered from Tools dropdown)

**Modal contents:**

- Title: "Export Trends"
- Date range picker (reuse DateRangePicker component)
- Data type: Trends | Mentions | Predictions (radio/pills)
- Format: CSV | JSON (pills)
- Download button
- Close button (x)

**Behavior:**

- Fetches from API with selected params
- Converts to chosen format client-side
- Triggers browser download

## Shared Design Patterns

- All pages: `<h1>` + description paragraph at top
- All search inputs: same style as trends page search
- All cards: `glass-card` class
- All results: fade-in transition
- All empty states: centered muted text
- Mobile: single column, full-width inputs

## Implementation Order

1. Nav dropdown (layout change)
2. Tech Lookup (most impactful, simple)
3. Watchlist (localStorage, no backend)
4. Correlation Finder (existing endpoint)
5. Category Predictor (existing endpoint)
6. Export modal (utility)
7. Move Compare under Tools nav
