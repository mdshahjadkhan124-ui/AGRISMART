import { api } from '@/lib/axios'
import type { FertilizerInput, FertilizerRecommendationRecord } from './types'

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export async function createFertilizerRecommendation(input: FertilizerInput) {
  const res = await api.post<ApiEnvelope<{ recommendation: FertilizerRecommendationRecord }>>(
    '/fertilizer-recommendations',
    input
  )
  return res.data.data.recommendation
}

export async function listFertilizerHistory() {
  const res = await api.get<ApiEnvelope<{ recommendations: FertilizerRecommendationRecord[] }>>(
    '/fertilizer-recommendations'
  )
  return res.data.data.recommendations
}
