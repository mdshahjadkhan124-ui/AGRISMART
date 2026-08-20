import { useMutationCompat } from '@/app/rtkQueryCompat'
import {
  useGetMyDiseaseReportsQuery,
  useGetMyDiseaseReportQuery,
  useCreateDiseaseReportMutation,
  useGetDiseaseQueueQuery,
  useRespondToDiseaseReportMutation,
} from './api'
import type { RespondInput } from './types'

export function useMyDiseaseReports() {
  return useGetMyDiseaseReportsQuery()
}

export function useMyDiseaseReport(id: string) {
  return useGetMyDiseaseReportQuery(id, { skip: !id })
}

export function useCreateDiseaseReport() {
  return useMutationCompat(useCreateDiseaseReportMutation())
}

export function useDiseaseQueue() {
  return useGetDiseaseQueueQuery()
}

export function useRespondToDiseaseReport() {
  const [trigger, state] = useRespondToDiseaseReportMutation()
  return useMutationCompat([(arg: { id: string; input: RespondInput }) => trigger(arg), state])
}
