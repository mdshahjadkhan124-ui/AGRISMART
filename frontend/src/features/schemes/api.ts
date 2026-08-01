import { api } from '@/lib/axios'
import type { GovernmentScheme, SchemeInput } from './types'

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export async function listSchemes(params: { category?: string; state?: string; search?: string; includeInactive?: boolean } = {}) {
  const res = await api.get<ApiEnvelope<{ schemes: GovernmentScheme[] }>>('/schemes', { params })
  return res.data.data.schemes
}

export async function getScheme(id: string) {
  const res = await api.get<ApiEnvelope<{ scheme: GovernmentScheme }>>(`/schemes/${id}`)
  return res.data.data.scheme
}

export async function createScheme(input: SchemeInput) {
  const res = await api.post<ApiEnvelope<{ scheme: GovernmentScheme }>>('/schemes', input)
  return res.data.data.scheme
}

export async function updateScheme(id: string, input: Partial<SchemeInput>) {
  const res = await api.put<ApiEnvelope<{ scheme: GovernmentScheme }>>(`/schemes/${id}`, input)
  return res.data.data.scheme
}

export async function deleteScheme(id: string) {
  await api.delete(`/schemes/${id}`)
}
