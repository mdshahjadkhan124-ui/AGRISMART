import { apiSlice } from '@/app/apiSlice'
import type { FertilizerInput, FertilizerRecommendationRecord } from './types'

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export const fertilizerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFertilizerHistory: builder.query<FertilizerRecommendationRecord[], void>({
      query: () => '/fertilizer-recommendations',
      transformResponse: (res: ApiEnvelope<{ recommendations: FertilizerRecommendationRecord[] }>) => res.data.recommendations,
      providesTags: ['FertilizerRec'],
    }),
    createFertilizerRecommendation: builder.mutation<FertilizerRecommendationRecord, FertilizerInput>({
      query: (input) => ({ url: '/fertilizer-recommendations', method: 'POST', body: input }),
      transformResponse: (res: ApiEnvelope<{ recommendation: FertilizerRecommendationRecord }>) => res.data.recommendation,
      invalidatesTags: ['FertilizerRec'],
    }),
  }),
})

export const { useGetFertilizerHistoryQuery, useCreateFertilizerRecommendationMutation } = fertilizerApi
