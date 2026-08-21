import { apiSlice } from '@/app/apiSlice'

export const expertsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExperts: builder.query({
      query: () => '/experts',
      transformResponse: (res) => res.data.experts,
      providesTags: [{ type: 'Expert', id: 'LIST' }],
    }),
    getExpert: builder.query({
      query: (id) => `/experts/${id}`,
      transformResponse: (res) => res.data.expert,
      providesTags: (_result, _error, id) => [{ type: 'Expert', id }],
    }),
    getMyExpertProfile: builder.query({
      query: () => '/experts/me',
      transformResponse: (res) => res.data.profile,
      providesTags: ['ExpertProfile'],
    }),
    upsertMyExpertProfile: builder.mutation({
      query: (input) => ({ url: '/experts/me', method: 'PUT', body: input }),
      transformResponse: (res) => res.data.profile,
      invalidatesTags: ['ExpertProfile', { type: 'Expert', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetExpertsQuery,
  useGetExpertQuery,
  useGetMyExpertProfileQuery,
  useUpsertMyExpertProfileMutation,
} = expertsApi
