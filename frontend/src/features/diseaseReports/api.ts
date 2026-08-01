import { api } from '@/lib/axios'
import type { CreateDiseaseReportInput, DiseaseReport, RespondInput } from './types'

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export async function createDiseaseReport(input: CreateDiseaseReportInput) {
  const formData = new FormData()
  formData.append('cropName', input.cropName)
  formData.append('symptoms', input.symptoms)
  if (input.farmId) formData.append('farmId', input.farmId)
  formData.append('image', input.image)

  // Let axios/the browser set the multipart Content-Type (with boundary) —
  // do not set it manually here.
  const res = await api.post<ApiEnvelope<{ report: DiseaseReport }>>('/disease-reports', formData)
  return res.data.data.report
}

export async function listMyDiseaseReports() {
  const res = await api.get<ApiEnvelope<{ reports: DiseaseReport[] }>>('/disease-reports')
  return res.data.data.reports
}

export async function getMyDiseaseReport(id: string) {
  const res = await api.get<ApiEnvelope<{ report: DiseaseReport }>>(`/disease-reports/${id}`)
  return res.data.data.report
}

export async function listDiseaseQueue() {
  const res = await api.get<ApiEnvelope<{ reports: DiseaseReport[] }>>('/disease-reports/queue')
  return res.data.data.reports
}

export async function respondToDiseaseReport(id: string, input: RespondInput) {
  const res = await api.put<ApiEnvelope<{ report: DiseaseReport }>>(`/disease-reports/${id}/respond`, input)
  return res.data.data.report
}
