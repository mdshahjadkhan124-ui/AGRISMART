export type NotificationType = 'appointment' | 'disease_report' | 'order' | 'chat' | 'system'

export interface AppNotification {
  _id: string
  type: NotificationType
  title: string
  message: string
  link: string
  isRead: boolean
  createdAt: string
}
