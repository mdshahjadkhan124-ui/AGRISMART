import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from './api'

export function useExperts() {
  return useQuery({ queryKey: ['experts'], queryFn: api.listExperts })
}

export function useExpert(id: string) {
  return useQuery({ queryKey: ['experts', id], queryFn: () => api.getExpert(id), enabled: Boolean(id) })
}

export function useMyExpertProfile() {
  return useQuery({ queryKey: ['experts', 'me'], queryFn: api.getMyExpertProfile })
}

export function useUpsertMyExpertProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.upsertMyExpertProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['experts', 'me'] }),
  })
}
