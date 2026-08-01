export interface FarmerProfile {
  _id: string
  user: string
  address: string
  state: string
  district: string
  village: string
  pincode: string
  farmingExperienceYears: number
  preferredLanguage: 'en' | 'hi'
  bio: string
}

export type ProfileInput = Partial<
  Pick<FarmerProfile, 'address' | 'state' | 'district' | 'village' | 'pincode' | 'farmingExperienceYears' | 'preferredLanguage' | 'bio'>
>
