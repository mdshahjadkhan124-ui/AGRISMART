import { api } from '@/lib/axios'
import type { CropSuggestionInput, CropSuggestionRecord } from './types'

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export async function createCropSuggestion(input: CropSuggestionInput) {
  const res = await api.post<ApiEnvelope<{ suggestion: CropSuggestionRecord }>>('/crop-suggestions', input)
  return res.data.data.suggestion
}

export async function listCropSuggestionHistory() {
  const res = await api.get<ApiEnvelope<{ suggestions: CropSuggestionRecord[] }>>('/crop-suggestions')
  return res.data.data.suggestions
}
