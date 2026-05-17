export interface Trend {
  name: string
  mentions: number
  score: number
  growth_pct: number
  sources: string[]
}

export interface TrendDetail {
  trend: Trend & { top_url: string; calculated_at: string }
  history: { mentions: number; score: number; growth_pct: number; calculated_at: string }[]
  posts: { source: string; url: string; description: string; stars: number; collected_at: string }[]
}

export interface Prediction {
  name: string
  confidence: number
  signals: string[]
  url: string
  predicted_at: string
}

export interface Category {
  name: string
  keyword_count: number
  top_trends: { name: string; score: number }[]
}

export interface Stats {
  total_mentions: number
  total_trends: number
  total_predictions: number
  active_sources: string[]
  last_run: string
}
