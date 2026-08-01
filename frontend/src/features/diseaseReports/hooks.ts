import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from './api'
import type { RespondInput } from './types'

export function useMyDiseaseReports() {
  return useQuery({ queryKey: ['disease-reports', 'mine'], queryFn: api.listMyDiseaseReports })
}

export function useMyDiseaseReport(id: string) {
  return useQuery({
    queryKey: ['disease-reports', 'mine', id],
    queryFn: () => api.getMyDiseaseReport(id),
    enabled: Boolean(id),
  })
}

export function useCreateDiseaseReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.createDiseaseReport,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['disease-reports', 'mine'] }),
  })
}

export function useDiseaseQueue() {
  return useQuery({ queryKey: ['disease-reports', 'queue'], queryFn: api.listDiseaseQueue })
}

export function useRespondToDiseaseReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: RespondInput }) => api.respondToDiseaseReport(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['disease-reports', 'queue'] }),
  })
}
