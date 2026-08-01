import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from './api'

export function useCropSuggestionHistory() {
  return useQuery({ queryKey: ['crop-suggestions'], queryFn: api.listCropSuggestionHistory })
}

export function useCreateCropSuggestion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.createCropSuggestion,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['crop-suggestions'] }),
  })
}
