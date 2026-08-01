import { api } from '@/lib/axios'
import type { AppNotification } from './types'

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
  meta?: { unreadCount: number }
}

export async function listNotifications() {
  const res = await api.get<ApiEnvelope<{ notifications: AppNotification[] }>>('/notifications')
  return { notifications: res.data.data.notifications, unreadCount: res.data.meta?.unreadCount ?? 0 }
}

export async function markAsRead(id: string) {
  await api.put(`/notifications/${id}/read`)
}

export async function markAllAsRead() {
  await api.put('/notifications/read-all')
}
