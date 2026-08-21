import { useMutationCompat } from '@/app/rtkQueryCompat'
import { useGetFertilizerHistoryQuery, useCreateFertilizerRecommendationMutation } from './api'

export function useFertilizerHistory() {
  return useGetFertilizerHistoryQuery()
}

export function useCreateFertilizerRecommendation() {
  return useMutationCompat(useCreateFertilizerRecommendationMutation())
}
