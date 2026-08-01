import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getSocket } from '@/lib/socket'
import * as api from './api'
import type { AppNotification } from './types'

const QUERY_KEY = ['notifications']

export function useNotifications() {
  const queryClient = useQueryClient()
  const query = useQuery({ queryKey: QUERY_KEY, queryFn: api.listNotifications })

  // Live updates: prepend new notifications as they arrive over the socket
  // instead of waiting for the next poll/navigation to refetch.
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const onNew = (incoming: Omit<AppNotification, '_id' | 'isRead'> & { id: string }) => {
      queryClient.setQueryData<{ notifications: AppNotification[]; unreadCount: number } | undefined>(
        QUERY_KEY,
        (current) => {
          if (!current) return current
          const notification: AppNotification = {
            _id: incoming.id,
            type: incoming.type,
            title: incoming.title,
            message: incoming.message,
            link: incoming.link,
            isRead: false,
            createdAt: incoming.createdAt,
          }
          return {
            notifications: [notification, ...current.notifications],
            unreadCount: current.unreadCount + 1,
          }
        }
      )
    }

    socket.on('notification:new', onNew)
    return () => {
      socket.off('notification:new', onNew)
    }
  }, [queryClient])

  return query
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.markAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.markAllAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
