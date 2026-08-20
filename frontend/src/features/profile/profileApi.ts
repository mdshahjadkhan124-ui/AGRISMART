import { apiSlice } from '@/app/apiSlice'
import type { FarmerProfile, ProfileInput } from './types'

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export const profileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query<FarmerProfile | null, void>({
      query: () => '/farmers/me',
      transformResponse: (res: ApiEnvelope<{ profile: FarmerProfile | null }>) => res.data.profile,
      providesTags: ['Profile'],
    }),
    upsertMyProfile: builder.mutation<FarmerProfile, ProfileInput>({
      query: (input) => ({ url: '/farmers/me', method: 'PUT', body: input }),
      transformResponse: (res: ApiEnvelope<{ profile: FarmerProfile }>) => res.data.profile,
      invalidatesTags: ['Profile'],
    }),
  }),
})

export const { useGetMyProfileQuery, useUpsertMyProfileMutation } = profileApi
