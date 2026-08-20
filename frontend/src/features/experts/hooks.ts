import { useMutationCompat } from '@/app/rtkQueryCompat'
import { useGetExpertsQuery, useGetExpertQuery, useGetMyExpertProfileQuery, useUpsertMyExpertProfileMutation } from './api'

export function useExperts() {
  return useGetExpertsQuery()
}

export function useExpert(id: string) {
  return useGetExpertQuery(id, { skip: !id })
}

export function useMyExpertProfile() {
  return useGetMyExpertProfileQuery()
}

export function useUpsertMyExpertProfile() {
  return useMutationCompat(useUpsertMyExpertProfileMutation())
}
