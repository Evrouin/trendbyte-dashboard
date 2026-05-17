export const useApi = () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiUrl

  const fetchStats = () => {
    return useFetch<import('~/types').Stats>(`${baseUrl}/api/stats`)
  }

  const fetchTrends = (params?: { category?: string; days?: number; limit?: number }) => {
    return useFetch<{ trends: import('~/types').Trend[]; count: number }>(`${baseUrl}/api/trends`, {
      params,
    })
  }

  const fetchTrendDetail = (name: string) => {
    return useFetch<import('~/types').TrendDetail>(`${baseUrl}/api/trends/${name}`)
  }

  const fetchTrendsByCategory = (params?: { days?: number; limit?: number }) => {
    return useFetch<{
      categories: { category: string; trends: { name: string; mentions: number; score: number }[] }[]
    }>(`${baseUrl}/api/trends/by-category`, { params })
  }

  const fetchPredictions = (params?: { min_confidence?: number; limit?: number }) => {
    return useFetch<{ predictions: import('~/types').Prediction[]; count: number }>(
      `${baseUrl}/api/predictions`,
      { params },
    )
  }

  const fetchCategories = () => {
    return useFetch<{ categories: import('~/types').Category[] }>(`${baseUrl}/api/categories`)
  }

  const fetchNews = (params?: { source?: string; limit?: number }) => {
    return useFetch<{
      news: { source: string; name: string; url: string; description: string; stars: number; collected_at: string }[]
      count: number
    }>(`${baseUrl}/api/news`, { params })
  }

  return {
    fetchStats,
    fetchTrends,
    fetchTrendDetail,
    fetchTrendsByCategory,
    fetchPredictions,
    fetchCategories,
    fetchNews,
  }
}
