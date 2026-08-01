export type DiseaseReportStatus = 'pending' | 'in_review' | 'resolved'

export interface ReportFarmer {
  _id: string
  name: string
  email: string
}

export interface DiseaseReport {
  _id: string
  farmer: string | ReportFarmer
  farm?: string
  cropName: string
  symptoms: string
  imageUrl: string
  status: DiseaseReportStatus
  expert?: string
  diagnosis?: string
  treatment?: string
  reviewedAt?: string
  createdAt: string
}

export interface CreateDiseaseReportInput {
  cropName: string
  symptoms: string
  farmId?: string
  image: File
}

export interface RespondInput {
  diagnosis: string
  treatment: string
}
