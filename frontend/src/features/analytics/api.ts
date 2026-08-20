import { apiSlice } from '@/app/apiSlice'
import type { AnalyticsResponse } from './types'

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyAnalytics: builder.query<AnalyticsResponse, void>({
      query: () => '/analytics/me',
      transformResponse: (res: ApiEnvelope<AnalyticsResponse>) => res.data,
    }),
  }),
})

export const { useGetMyAnalyticsQuery } = analyticsApi
