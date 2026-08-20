import { apiSlice } from '@/app/apiSlice'
import type { AppNotification } from './types'

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
  meta?: { unreadCount: number }
}

export interface NotificationsResult {
  notifications: AppNotification[]
  unreadCount: number
}

export const notificationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsResult, void>({
      query: () => '/notifications',
      transformResponse: (res: ApiEnvelope<{ notifications: AppNotification[] }>) => ({
        notifications: res.data.notifications,
        unreadCount: res.meta?.unreadCount ?? 0,
      }),
      providesTags: ['Notification'],
    }),
    markNotificationRead: builder.mutation<void, string>({
      query: (id) => ({ url: `/notifications/${id}/read`, method: 'PUT' }),
      invalidatesTags: ['Notification'],
    }),
    markAllNotificationsRead: builder.mutation<void, void>({
      query: () => ({ url: '/notifications/read-all', method: 'PUT' }),
      invalidatesTags: ['Notification'],
    }),
  }),
})

export const { useGetNotificationsQuery, useMarkNotificationReadMutation, useMarkAllNotificationsReadMutation } =
  notificationsApi
