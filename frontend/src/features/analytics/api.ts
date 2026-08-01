import { api } from '@/lib/axios'
import type { AnalyticsResponse } from './types'

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export async function getMyAnalytics() {
  const res = await api.get<ApiEnvelope<AnalyticsResponse>>('/analytics/me')
  return res.data.data
}
