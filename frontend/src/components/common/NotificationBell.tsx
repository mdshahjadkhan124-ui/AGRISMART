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
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((v) => !v)}
        className="relative text-white/80 hover:bg-white/10 hover:text-white"
      >
        <Bell className="size-4.5" strokeWidth={1.75} />
        {unreadCount > 0 && (
          <span className="bg-primary absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center text-[10px] font-semibold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <Card className="absolute top-full right-0 z-50 mt-3 max-h-96 w-80 overflow-y-auto">
          <CardHeader className="flex-row items-center justify-between border-b border-border pb-4">
            <CardTitle className="eyebrow">Notifications</CardTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="normal-case" onClick={() => markAllRead.mutate()}>
                Mark all read
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border px-0">
            {(!data || data.notifications.length === 0) && (
              <p className="text-muted-foreground px-5 py-4 text-sm">No notifications yet.</p>
            )}
            {data?.notifications.map((notification) => (
              <Link
                key={notification._id}
                to={notification.link || '#'}
                onClick={() => onOpenNotification(notification)}
                className={`px-5 py-3 text-sm transition-colors hover:bg-muted ${notification.isRead ? '' : 'bg-accent'}`}
              >
                <p className="font-semibold text-foreground">{notification.title}</p>
                <p className="text-muted-foreground mt-0.5">{notification.message}</p>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
