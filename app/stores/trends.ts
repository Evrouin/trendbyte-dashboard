import { defineStore } from 'pinia'
import type { Trend, Stats, Prediction } from '~/types'
import { fetchWithHmac } from '~/utils/fetchWithHmac'

interface TrendsState {
  trends: Trend[]
  stats: Stats | null
  predictions: Prediction[]
  news: {
    source: string
    name: string
    url: string
    description: string
    stars: number
    collected_at: string
  }[]
  lastFetched: Record<string, number>
}

const CACHE_TTL = 5 * 60 * 1000

export const useTrendsStore = defineStore('trends', {
  state: (): TrendsState => ({
    trends: [],
    stats: null,
    predictions: [],
    news: [],
    lastFetched: {},
  }),

  actions: {
    async fetchTrends(days = 30, limit = 30) {
      const key = `trends-${days}-${limit}`
      if (this.trends.length && !this.isStale(key)) return

      const config = useRuntimeConfig()
      const data = await fetchWithHmac<{ trends: Trend[] }>(`${config.public.apiUrl}/api/trends`, {
        params: { days, limit },
      })
      this.trends = data.trends
      this.lastFetched[key] = Date.now()
    },

    async fetchStats() {
      if (this.stats && !this.isStale('stats')) return

      const config = useRuntimeConfig()
      this.stats = await fetchWithHmac<Stats>(`${config.public.apiUrl}/api/stats`)
      this.lastFetched.stats = Date.now()
    },

    async fetchPredictions(limit = 10) {
      const key = `predictions-${limit}`
      if (this.predictions.length >= limit && !this.isStale(key)) return

      const config = useRuntimeConfig()
      const data = await fetchWithHmac<{ predictions: Prediction[] }>(
        `${config.public.apiUrl}/api/predictions`,
        {
          params: { limit },
        },
      )
      this.predictions = data.predictions
      this.lastFetched[key] = Date.now()
    },

    async fetchNews(params: Record<string, string | number> = { limit: 50 }) {
      const key = `news-${JSON.stringify(params)}`
      if (this.news.length && !this.isStale(key)) return

      const config = useRuntimeConfig()
      const data = await fetchWithHmac<{ news: TrendsState['news'] }>(
        `${config.public.apiUrl}/api/news`,
        {
          params,
        },
      )
      this.news = data.news
      this.lastFetched[key] = Date.now()
    },

    isStale(key: string) {
      const last = this.lastFetched[key]
      if (!last) return true
      return Date.now() - last > CACHE_TTL
    },

    invalidate() {
      this.lastFetched = {}
    },
  },
})
