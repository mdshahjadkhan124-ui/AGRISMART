export type SchemeCategory = 'subsidy' | 'loan' | 'insurance' | 'training' | 'equipment' | 'other'

export interface GovernmentScheme {
  _id: string
  title: string
  description: string
  category: SchemeCategory
  eligibility: string
  state: string
  applicationLink: string
  startDate?: string
  endDate?: string
  isActive: boolean
  createdAt: string
}

export interface SchemeInput {
  title: string
  description: string
  category?: SchemeCategory
  eligibility?: string
  state?: string
  applicationLink?: string
  startDate?: string
  endDate?: string
  isActive?: boolean
}
