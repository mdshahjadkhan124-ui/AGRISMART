import { api } from '@/lib/axios'
import type { FarmerProfile, ProfileInput } from './types'

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export async function getMyProfile() {
  const res = await api.get<ApiEnvelope<{ profile: FarmerProfile | null }>>('/farmers/me')
  return res.data.data.profile
}

export async function upsertMyProfile(input: ProfileInput) {
  const res = await api.put<ApiEnvelope<{ profile: FarmerProfile }>>('/farmers/me', input)
  return res.data.data.profile
}
