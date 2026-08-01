import { api } from '@/lib/axios'
import type { CropHistoryEntry, Farm, FarmActivityEntry, PaginationMeta, SoilReport } from './types'

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
  meta?: PaginationMeta
}

export async function listFarms() {
  const res = await api.get<ApiEnvelope<{ farms: Farm[] }>>('/farms')
  return res.data.data.farms
}

export async function getFarm(farmId: string) {
  const res = await api.get<ApiEnvelope<{ farm: Farm }>>(`/farms/${farmId}`)
  return res.data.data.farm
}

export type CreateFarmInput = Pick<Farm, 'name' | 'areaAcres' | 'soilType' | 'irrigationType'> & {
  location?: Farm['location']
}

export async function createFarm(input: CreateFarmInput) {
  const res = await api.post<ApiEnvelope<{ farm: Farm }>>('/farms', input)
  return res.data.data.farm
}

export async function updateFarm(farmId: string, input: Partial<CreateFarmInput>) {
  const res = await api.put<ApiEnvelope<{ farm: Farm }>>(`/farms/${farmId}`, input)
  return res.data.data.farm
}

export async function deleteFarm(farmId: string) {
  await api.delete(`/farms/${farmId}`)
}

export async function listCropHistory(farmId: string) {
  const res = await api.get<ApiEnvelope<{ cropHistory: CropHistoryEntry[] }>>(`/farms/${farmId}/crop-history`)
  return res.data.data.cropHistory
}

export type AddCropHistoryInput = Pick<CropHistoryEntry, 'cropName' | 'season'> &
  Partial<Pick<CropHistoryEntry, 'sowingDate' | 'harvestDate' | 'yieldQuantityKg' | 'notes'>>

export async function addCropHistory(farmId: string, input: AddCropHistoryInput) {
  const res = await api.post<ApiEnvelope<{ entry: CropHistoryEntry }>>(`/farms/${farmId}/crop-history`, input)
  return res.data.data.entry
}

export async function listSoilReports(farmId: string) {
  const res = await api.get<ApiEnvelope<{ soilReports: SoilReport[] }>>(`/farms/${farmId}/soil-reports`)
  return res.data.data.soilReports
}

export async function getLatestSoilReport(farmId: string) {
  const res = await api.get<ApiEnvelope<{ report: SoilReport }>>(`/farms/${farmId}/soil-reports/latest`)
  return res.data.data.report
}

export type AddSoilReportInput = Pick<SoilReport, 'nitrogen' | 'phosphorus' | 'potassium' | 'ph'> &
  Partial<Pick<SoilReport, 'organicCarbon' | 'moisturePercent'>>

export async function addSoilReport(farmId: string, input: AddSoilReportInput) {
  const res = await api.post<ApiEnvelope<{ report: SoilReport }>>(`/farms/${farmId}/soil-reports`, input)
  return res.data.data.report
}

export async function listActivities(farmId: string) {
  const res = await api.get<ApiEnvelope<{ activities: FarmActivityEntry[] }>>(`/farms/${farmId}/activities`)
  return res.data.data.activities
}

export type AddActivityInput = Pick<FarmActivityEntry, 'activityType' | 'title'> &
  Partial<Pick<FarmActivityEntry, 'description' | 'date' | 'costInr'>>

export async function addActivity(farmId: string, input: AddActivityInput) {
  const res = await api.post<ApiEnvelope<{ activity: FarmActivityEntry }>>(`/farms/${farmId}/activities`, input)
  return res.data.data.activity
}

export async function deleteActivity(farmId: string, activityId: string) {
  await api.delete(`/farms/${farmId}/activities/${activityId}`)
}
