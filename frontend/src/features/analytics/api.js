import { apiSlice } from '@/app/apiSlice'

export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyAnalytics: builder.query({
      query: () => '/analytics/me',
      transformResponse: (res) => res.data,
    }),
  }),
})

export const { useGetMyAnalyticsQuery } = analyticsApi
