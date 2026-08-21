import { apiSlice } from '@/app/apiSlice'

export const notificationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => '/notifications',
      transformResponse: (res) => ({
        notifications: res.data.notifications,
        unreadCount: res.meta?.unreadCount ?? 0,
      }),
      providesTags: ['Notification'],
    }),
    markNotificationRead: builder.mutation({
      query: (id) => ({ url: `/notifications/${id}/read`, method: 'PUT' }),
      invalidatesTags: ['Notification'],
    }),
    markAllNotificationsRead: builder.mutation({
      query: () => ({ url: '/notifications/read-all', method: 'PUT' }),
      invalidatesTags: ['Notification'],
    }),
  }),
})

export const { useGetNotificationsQuery, useMarkNotificationReadMutation, useMarkAllNotificationsReadMutation } =
  notificationsApi
