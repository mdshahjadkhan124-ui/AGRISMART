export interface CropSuggestionInput {
  n: number
  p: number
  k: number
  temperature: number
  humidity: number
  ph: number
  rainfall: number
  farmId?: string
}

export interface CropMatch {
  cropName: string
  season: string
  score: number
  waterRequirement: string
  expectedYieldPerAcre: string
  expectedProfitPerAcreInr: number
  outOfRangeFactors: string[]
}

export interface CropSuggestionRecord {
  _id: string
  inputs: Omit<CropSuggestionInput, 'farmId'>
  results: CropMatch[]
  createdAt: string
}
