export interface FertilizerInput {
  farmId?: string
  nitrogen?: number
  phosphorus?: number
  potassium?: number
  ph?: number
}

export type NutrientLevel = 'Low' | 'Medium' | 'High'

export interface NutrientRecommendation {
  level: NutrientLevel
  fertilizer: string
  dosageKgPerAcre: number
  note: string
}

export interface PhAmendment {
  amendment: string
  dosageKgPerAcre: number
  note: string
}

export interface FertilizerRecommendationRecord {
  _id: string
  inputs: { nitrogen: number; phosphorus: number; potassium: number; ph: number }
  levels: { nitrogen: NutrientLevel; phosphorus: NutrientLevel; potassium: NutrientLevel }
  nutrients: {
    nitrogen: NutrientRecommendation
    phosphorus: NutrientRecommendation
    potassium: NutrientRecommendation
  }
  phAmendment: PhAmendment
  createdAt: string
}
