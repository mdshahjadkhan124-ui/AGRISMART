import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as farmsApi from './farmsApi'

export function useFarms() {
  return useQuery({ queryKey: ['farms'], queryFn: farmsApi.listFarms })
}

export function useFarm(farmId: string) {
  return useQuery({ queryKey: ['farms', farmId], queryFn: () => farmsApi.getFarm(farmId), enabled: Boolean(farmId) })
}

export function useCreateFarm() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: farmsApi.createFarm,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['farms'] }),
  })
}

export function useDeleteFarm() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: farmsApi.deleteFarm,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['farms'] }),
  })
}

export function useCropHistory(farmId: string) {
  return useQuery({
    queryKey: ['farms', farmId, 'crop-history'],
    queryFn: () => farmsApi.listCropHistory(farmId),
    enabled: Boolean(farmId),
  })
}

export function useAddCropHistory(farmId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: farmsApi.AddCropHistoryInput) => farmsApi.addCropHistory(farmId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['farms', farmId, 'crop-history'] }),
  })
}

export function useSoilReports(farmId: string) {
  return useQuery({
    queryKey: ['farms', farmId, 'soil-reports'],
    queryFn: () => farmsApi.listSoilReports(farmId),
    enabled: Boolean(farmId),
  })
}

export function useLatestSoilReport(farmId: string) {
  return useQuery({
    queryKey: ['farms', farmId, 'soil-reports', 'latest'],
    queryFn: () => farmsApi.getLatestSoilReport(farmId),
    enabled: Boolean(farmId),
    retry: false,
  })
}

export function useAddSoilReport(farmId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: farmsApi.AddSoilReportInput) => farmsApi.addSoilReport(farmId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms', farmId, 'soil-reports'] })
    },
  })
}

export function useActivities(farmId: string) {
  return useQuery({
    queryKey: ['farms', farmId, 'activities'],
    queryFn: () => farmsApi.listActivities(farmId),
    enabled: Boolean(farmId),
  })
}

export function useAddActivity(farmId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: farmsApi.AddActivityInput) => farmsApi.addActivity(farmId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['farms', farmId, 'activities'] }),
  })
}

export function useDeleteActivity(farmId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (activityId: string) => farmsApi.deleteActivity(farmId, activityId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['farms', farmId, 'activities'] }),
  })
}
