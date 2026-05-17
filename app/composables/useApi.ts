import type { Stats, Trend, TrendDetail, Prediction, Category } from '~/types'

export const useApi = () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiUrl

  const fetchStats = () => {
    return useFetch<Stats>(`${baseUrl}/api/stats`)
  }

  const fetchTrends = (params?: { category?: string; days?: number; limit?: number }) => {
    return useFetch<{ trends: Trend[]; count: number }>(`${baseUrl}/api/trends`, { params })
  }

  const fetchTrendDetail = (name: string) => {
    return useFetch<TrendDetail>(`${baseUrl}/api/trends/${name}`)
  }

  const fetchPredictions = (params?: { min_confidence?: number; limit?: number }) => {
    return useFetch<{ predictions: Prediction[]; count: number }>(`${baseUrl}/api/predictions`, {
      params,
    })
  }

  const fetchCategories = () => {
    return useFetch<{ categories: Category[] }>(`${baseUrl}/api/categories`)
  }

  return { fetchStats, fetchTrends, fetchTrendDetail, fetchPredictions, fetchCategories }
}
