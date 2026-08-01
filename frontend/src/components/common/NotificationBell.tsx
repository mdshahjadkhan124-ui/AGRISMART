import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from '@/features/notifications/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AppNotification } from '@/features/notifications/types'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { data } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  const unreadCount = data?.unreadCount ?? 0

  const onOpenNotification = (notification: AppNotification) => {
    if (!notification.isRead) markRead.mutate(notification._id)
    setOpen(false)
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button variant="outline" size="icon" onClick={() => setOpen((v) => !v)} className="relative">
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="bg-destructive text-destructive-foreground absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-[10px]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <Card className="mt-2 w-80 max-h-96 overflow-y-auto">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Notifications</CardTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={() => markAllRead.mutate()}>
                Mark all read
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {(!data || data.notifications.length === 0) && (
              <p className="text-muted-foreground text-sm">No notifications yet.</p>
            )}
            {data?.notifications.map((notification) => (
              <Link
                key={notification._id}
                to={notification.link || '#'}
                onClick={() => onOpenNotification(notification)}
                className={`rounded-md p-2 text-sm ${notification.isRead ? '' : 'bg-accent'}`}
              >
                <p className="font-medium">{notification.title}</p>
                <p className="text-muted-foreground">{notification.message}</p>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
