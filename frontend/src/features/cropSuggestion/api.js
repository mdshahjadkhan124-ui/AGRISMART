import { apiSlice } from '@/app/apiSlice'

export const cropSuggestionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCropSuggestions: builder.query({
      query: () => '/crop-suggestions',
      transformResponse: (res) => res.data.suggestions,
      providesTags: ['CropSuggestion'],
    }),
    createCropSuggestion: builder.mutation({
      query: (input) => ({ url: '/crop-suggestions', method: 'POST', body: input }),
      transformResponse: (res) => res.data.suggestion,
      invalidatesTags: ['CropSuggestion'],
    }),
  }),
})

export const { useGetCropSuggestionsQuery, useCreateCropSuggestionMutation } = cropSuggestionApi
