import { apiSlice } from '@/app/apiSlice'

export const fertilizerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFertilizerHistory: builder.query({
      query: () => '/fertilizer-recommendations',
      transformResponse: (res) => res.data.recommendations,
      providesTags: ['FertilizerRec'],
    }),
    createFertilizerRecommendation: builder.mutation({
      query: (input) => ({ url: '/fertilizer-recommendations', method: 'POST', body: input }),
      transformResponse: (res) => res.data.recommendation,
      invalidatesTags: ['FertilizerRec'],
    }),
  }),
})

export const { useGetFertilizerHistoryQuery, useCreateFertilizerRecommendationMutation } = fertilizerApi
