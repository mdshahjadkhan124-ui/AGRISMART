export interface ExpertUser {
  _id: string
  name: string
  email: string
  avatarUrl?: string
  isActive: boolean
}

export interface ExpertProfile {
  _id: string
  user: ExpertUser
  specialization: string
  qualifications: string
  experienceYears: number
  bio: string
  consultationFeeInr: number
  isAvailable: boolean
}

export type ExpertProfileInput = Partial<
  Pick<ExpertProfile, 'specialization' | 'qualifications' | 'experienceYears' | 'bio' | 'consultationFeeInr' | 'isAvailable'>
>
