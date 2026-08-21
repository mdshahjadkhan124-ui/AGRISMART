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
} from './farmsApi'

export function useFarms() {
  return useGetFarmsQuery()
}

export function useFarm(farmId) {
  return useGetFarmQuery(farmId, { skip: !farmId })
}

export function useCreateFarm() {
  return useMutationCompat(useCreateFarmMutation())
}

export function useDeleteFarm() {
  const [trigger, state] = useDeleteFarmMutation()
  return useMutationCompat([(farmId) => trigger(farmId), state])
}

export function useCropHistory(farmId) {
  return useGetCropHistoryQuery(farmId, { skip: !farmId })
}

export function useAddCropHistory(farmId) {
  const [trigger, state] = useAddCropHistoryMutation()
  return useMutationCompat([(input) => trigger({ farmId, input }), state])
}

export function useSoilReports(farmId) {
  return useGetSoilReportsQuery(farmId, { skip: !farmId })
}

export function useLatestSoilReport(farmId) {
  return useGetLatestSoilReportQuery(farmId, { skip: !farmId })
}

export function useAddSoilReport(farmId) {
  const [trigger, state] = useAddSoilReportMutation()
  return useMutationCompat([(input) => trigger({ farmId, input }), state])
}

export function useActivities(farmId) {
  return useGetActivitiesQuery(farmId, { skip: !farmId })
}

export function useAddActivity(farmId) {
  const [trigger, state] = useAddActivityMutation()
  return useMutationCompat([(input) => trigger({ farmId, input }), state])
}

export function useDeleteActivity(farmId) {
  const [trigger, state] = useDeleteActivityMutation()
  return useMutationCompat([(activityId) => trigger({ farmId, activityId }), state])
}
