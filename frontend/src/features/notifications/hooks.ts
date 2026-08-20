import { useEffect } from 'react'
import { useAppDispatch } from '@/app/hooks'
import { useMutationCompat } from '@/app/rtkQueryCompat'
import { getSocket } from '@/lib/socket'
import { notificationsApi, useGetNotificationsQuery, useMarkNotificationReadMutation, useMarkAllNotificationsReadMutation } from './api'
import type { AppNotification } from './types'

export function useNotifications() {
  const dispatch = useAppDispatch()
  const query = useGetNotificationsQuery()

  // Live updates: prepend new notifications as they arrive over the socket
  // instead of waiting for the next poll/navigation to refetch.
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const onNew = (incoming: Omit<AppNotification, '_id' | 'isRead'> & { id: string }) => {
      dispatch(
        notificationsApi.util.updateQueryData('getNotifications', undefined, (current) => {
          current.notifications.unshift({
            _id: incoming.id,
            type: incoming.type,
            title: incoming.title,
            message: incoming.message,
            link: incoming.link,
            isRead: false,
            createdAt: incoming.createdAt,
          })
          current.unreadCount += 1
        })
      )
    }

    socket.on('notification:new', onNew)
    return () => {
      socket.off('notification:new', onNew)
    }
  }, [dispatch])

  return query
}

export function useMarkNotificationRead() {
  return useMutationCompat(useMarkNotificationReadMutation())
}

export function useMarkAllNotificationsRead() {
  return useMutationCompat(useMarkAllNotificationsReadMutation())
}
