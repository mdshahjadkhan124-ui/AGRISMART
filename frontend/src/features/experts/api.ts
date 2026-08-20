import { apiSlice } from '@/app/apiSlice'
import type { ExpertProfile, ExpertProfileInput } from './types'

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export const expertsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExperts: builder.query<ExpertProfile[], void>({
      query: () => '/experts',
      transformResponse: (res: ApiEnvelope<{ experts: ExpertProfile[] }>) => res.data.experts,
      providesTags: [{ type: 'Expert', id: 'LIST' }],
    }),
    getExpert: builder.query<ExpertProfile, string>({
      query: (id) => `/experts/${id}`,
      transformResponse: (res: ApiEnvelope<{ expert: ExpertProfile }>) => res.data.expert,
      providesTags: (_result, _error, id) => [{ type: 'Expert', id }],
    }),
    getMyExpertProfile: builder.query<ExpertProfile | null, void>({
      query: () => '/experts/me',
      transformResponse: (res: ApiEnvelope<{ profile: ExpertProfile | null }>) => res.data.profile,
      providesTags: ['ExpertProfile'],
    }),
    upsertMyExpertProfile: builder.mutation<ExpertProfile, ExpertProfileInput>({
      query: (input) => ({ url: '/experts/me', method: 'PUT', body: input }),
      transformResponse: (res: ApiEnvelope<{ profile: ExpertProfile }>) => res.data.profile,
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
