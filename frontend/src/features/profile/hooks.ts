import { useMutationCompat } from '@/app/rtkQueryCompat'
import { useGetMyProfileQuery, useUpsertMyProfileMutation } from './profileApi'

export function useMyProfile() {
  return useGetMyProfileQuery()
}

export function useUpsertMyProfile() {
  return useMutationCompat(useUpsertMyProfileMutation())
}
