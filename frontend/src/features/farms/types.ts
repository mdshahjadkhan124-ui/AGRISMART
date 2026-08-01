export type SoilType = 'alluvial' | 'black' | 'red' | 'laterite' | 'arid' | 'saline' | 'peaty' | 'forest' | 'other'
export type IrrigationType = 'canal' | 'borewell' | 'drip' | 'sprinkler' | 'rainfed' | 'other'
export type Season = 'kharif' | 'rabi' | 'zaid' | 'perennial'
export type ActivityType =
  | 'sowing'
  | 'irrigation'
  | 'fertilizing'
  | 'pesticide_spray'
  | 'weeding'
  | 'harvesting'
  | 'soil_testing'
  | 'other'
export type SoilHealthLabel = 'Poor' | 'Fair' | 'Good' | 'Excellent'

export interface Farm {
  _id: string
  farmer: string
  name: string
  areaAcres: number
  soilType: SoilType
  irrigationType: IrrigationType
  location?: { lat?: number; lng?: number; address?: string }
  createdAt: string
  updatedAt: string
}

export interface CropHistoryEntry {
  _id: string
  farm: string
  cropName: string
  season: Season
  sowingDate?: string
  harvestDate?: string
  yieldQuantityKg?: number
  notes?: string
  createdAt: string
}

export interface SoilReport {
  _id: string
  farm: string
  nitrogen: number
  phosphorus: number
  potassium: number
  ph: number
  organicCarbon?: number
  moisturePercent?: number
  testedAt: string
  healthScore: number
  healthLabel: SoilHealthLabel
  recommendations: string[]
  createdAt: string
}

export interface FarmActivityEntry {
  _id: string
  farm: string
  activityType: ActivityType
  title: string
  description?: string
  date: string
  costInr?: number
  createdAt: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}
