import { apiSlice } from '@/app/apiSlice'
import type { CropSuggestionInput, CropSuggestionRecord } from './types'

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export const cropSuggestionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCropSuggestions: builder.query<CropSuggestionRecord[], void>({
      query: () => '/crop-suggestions',
      transformResponse: (res: ApiEnvelope<{ suggestions: CropSuggestionRecord[] }>) => res.data.suggestions,
      providesTags: ['CropSuggestion'],
    }),
    createCropSuggestion: builder.mutation<CropSuggestionRecord, CropSuggestionInput>({
      query: (input) => ({ url: '/crop-suggestions', method: 'POST', body: input }),
      transformResponse: (res: ApiEnvelope<{ suggestion: CropSuggestionRecord }>) => res.data.suggestion,
      invalidatesTags: ['CropSuggestion'],
    }),
  }),
})

export const { useGetCropSuggestionsQuery, useCreateCropSuggestionMutation } = cropSuggestionApi
