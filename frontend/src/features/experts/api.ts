import { api } from '@/lib/axios'
import type { ExpertProfile, ExpertProfileInput } from './types'

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export async function listExperts() {
  const res = await api.get<ApiEnvelope<{ experts: ExpertProfile[] }>>('/experts')
  return res.data.data.experts
}

export async function getExpert(id: string) {
  const res = await api.get<ApiEnvelope<{ expert: ExpertProfile }>>(`/experts/${id}`)
  return res.data.data.expert
}

export async function getMyExpertProfile() {
  const res = await api.get<ApiEnvelope<{ profile: ExpertProfile | null }>>('/experts/me')
  return res.data.data.profile
}

export async function upsertMyExpertProfile(input: ExpertProfileInput) {
  const res = await api.put<ApiEnvelope<{ profile: ExpertProfile }>>('/experts/me', input)
  return res.data.data.profile
}
