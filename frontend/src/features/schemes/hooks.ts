import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from './api'
import type { SchemeInput } from './types'

export function useSchemes(params: { category?: string; state?: string; search?: string; includeInactive?: boolean } = {}) {
  return useQuery({ queryKey: ['schemes', params], queryFn: () => api.listSchemes(params) })
}

export function useScheme(id: string) {
  return useQuery({ queryKey: ['schemes', id], queryFn: () => api.getScheme(id), enabled: Boolean(id) })
}

export function useCreateScheme() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.createScheme,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schemes'] }),
  })
}

export function useUpdateScheme(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Partial<SchemeInput>) => api.updateScheme(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schemes'] }),
  })
}

export function useDeleteScheme() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.deleteScheme,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schemes'] }),
  })
}
