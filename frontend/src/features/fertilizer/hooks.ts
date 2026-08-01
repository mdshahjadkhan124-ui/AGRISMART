import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from './api'

export function useFertilizerHistory() {
  return useQuery({ queryKey: ['fertilizer-recommendations'], queryFn: api.listFertilizerHistory })
}

export function useCreateFertilizerRecommendation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.createFertilizerRecommendation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fertilizer-recommendations'] }),
  })
}
