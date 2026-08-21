import { apiSlice } from '@/app/apiSlice'

export const profileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query({
      query: () => '/farmers/me',
      transformResponse: (res) => res.data.profile,
      providesTags: ['Profile'],
    }),
    upsertMyProfile: builder.mutation({
      query: (input) => ({ url: '/farmers/me', method: 'PUT', body: input }),
      transformResponse: (res) => res.data.profile,
      invalidatesTags: ['Profile'],
    }),
  }),
})

export const { useGetMyProfileQuery, useUpsertMyProfileMutation } = profileApi
