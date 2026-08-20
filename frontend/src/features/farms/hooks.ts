import { useMutationCompat } from '@/app/rtkQueryCompat'
import {
  useGetFarmsQuery,
  useGetFarmQuery,
  useCreateFarmMutation,
  useDeleteFarmMutation,
  useGetCropHistoryQuery,
  useAddCropHistoryMutation,
  useGetSoilReportsQuery,
  useGetLatestSoilReportQuery,
  useAddSoilReportMutation,
  useGetActivitiesQuery,
  useAddActivityMutation,
  useDeleteActivityMutation,
  type AddActivityInput,
  type AddCropHistoryInput,
  type AddSoilReportInput,
} from './farmsApi'

export function useFarms() {
  return useGetFarmsQuery()
}

export function useFarm(farmId: string) {
  return useGetFarmQuery(farmId, { skip: !farmId })
}

export function useCreateFarm() {
  return useMutationCompat(useCreateFarmMutation())
}

export function useDeleteFarm() {
  const [trigger, state] = useDeleteFarmMutation()
  return useMutationCompat([(farmId: string) => trigger(farmId), state])
}

export function useCropHistory(farmId: string) {
  return useGetCropHistoryQuery(farmId, { skip: !farmId })
}

export function useAddCropHistory(farmId: string) {
  const [trigger, state] = useAddCropHistoryMutation()
  return useMutationCompat([(input: AddCropHistoryInput) => trigger({ farmId, input }), state])
}

export function useSoilReports(farmId: string) {
  return useGetSoilReportsQuery(farmId, { skip: !farmId })
}

export function useLatestSoilReport(farmId: string) {
  return useGetLatestSoilReportQuery(farmId, { skip: !farmId })
}

export function useAddSoilReport(farmId: string) {
  const [trigger, state] = useAddSoilReportMutation()
  return useMutationCompat([(input: AddSoilReportInput) => trigger({ farmId, input }), state])
}

export function useActivities(farmId: string) {
  return useGetActivitiesQuery(farmId, { skip: !farmId })
}

export function useAddActivity(farmId: string) {
  const [trigger, state] = useAddActivityMutation()
  return useMutationCompat([(input: AddActivityInput) => trigger({ farmId, input }), state])
}

export function useDeleteActivity(farmId: string) {
  const [trigger, state] = useDeleteActivityMutation()
  return useMutationCompat([(activityId: string) => trigger({ farmId, activityId }), state])
}
