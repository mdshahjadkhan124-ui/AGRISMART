import { useMutationCompat } from '@/app/rtkQueryCompat'
import { useGetCropSuggestionsQuery, useCreateCropSuggestionMutation } from './api'

export function useCropSuggestionHistory() {
  return useGetCropSuggestionsQuery()
}

export function useCreateCropSuggestion() {
  return useMutationCompat(useCreateCropSuggestionMutation())
}
