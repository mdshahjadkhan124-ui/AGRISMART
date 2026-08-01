import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as profileApi from './profileApi'

export function useMyProfile() {
  return useQuery({ queryKey: ['profile', 'me'], queryFn: profileApi.getMyProfile })
}

export function useUpsertMyProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: profileApi.upsertMyProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', 'me'] }),
  })
}
