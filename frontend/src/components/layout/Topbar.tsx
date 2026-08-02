import { Menu, LogOut } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { logout } from '@/features/auth/authSlice'
import { roleLabels } from '@/features/auth/roleLabels'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import NotificationBell from '@/components/common/NotificationBell'

interface TopbarProps {
  onMenuClick: () => void
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  if (!user) return null

  return (
    <header className="border-border bg-background/80 sticky top-0 z-40 flex h-16 items-center gap-3 border-b px-4 backdrop-blur-sm sm:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
        <Menu className="size-4.5" />
      </Button>

      <div className="flex-1" />

      <NotificationBell />

      <div className="bg-border mx-1 hidden h-6 w-px sm:block" />

      <div className="hidden items-center gap-3 sm:flex">
        <div className="flex flex-col items-end leading-tight">
          <span className="text-foreground text-sm font-medium">{user.name}</span>
          <Badge variant="secondary" className="mt-0.5">
            {roleLabels[user.role]}
          </Badge>
        </div>
        <span className="bg-accent text-accent-foreground flex size-9 items-center justify-center rounded-full text-sm font-semibold">
          {initials(user.name)}
        </span>
      </div>

      <Button variant="ghost" size="icon" onClick={() => dispatch(logout())} title="Log out">
        <LogOut className="size-4.5" />
      </Button>
    </header>
  )
}
