import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Search, LogOut, Sprout } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { logout } from '@/features/auth/authSlice'
import { roleLabels } from '@/features/auth/roleLabels'
import { navItems } from './navConfig'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import NotificationBell from '@/components/common/NotificationBell'
import { cn } from '@/lib/utils'

/**
 * Institutional black top bar used on every page. Renders the public
 * (logged-out) nav or the authenticated app nav depending on session state.
 */
export default function SiteHeader() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const [mobileOpen, setMobileOpen] = useState(false)

  const items = user ? navItems.filter((item) => item.roles.includes(user.role)) : []

  return (
    <header className="bg-ink sticky top-0 z-40 text-white">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-6 px-4 sm:px-6 lg:px-10">
        <Link to={user ? '/dashboard' : '/'} className="flex shrink-0 items-center gap-2.5">
          <span className="bg-primary flex size-8 items-center justify-center">
            <Sprout className="size-4.5 text-white" strokeWidth={1.75} />
          </span>
          <span className="text-sm font-bold tracking-[0.08em]">AGRISMART</span>
        </Link>

        {user && (
          <nav className="hidden flex-1 items-center gap-6 overflow-x-auto lg:flex">
            {items.map((item) => (
              <NavLink
                key={item.to + item.label}
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) =>
                  cn(
                    'shrink-0 py-1 text-[11px] font-semibold whitespace-nowrap tracking-[0.1em] uppercase transition-colors',
                    isActive ? 'text-white' : 'text-white/55 hover:text-white'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}

        {!user && <div className="flex-1" />}

        {user ? (
          <div className="ml-auto flex shrink-0 items-center gap-1">
            {items.some((i) => i.to === '/marketplace') && (
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="hidden text-white/80 hover:bg-white/10 hover:text-white sm:inline-flex"
              >
                <Link to="/marketplace" title="Search marketplace">
                  <Search className="size-4.5" strokeWidth={1.75} />
                </Link>
              </Button>
            )}
            <NotificationBell triggerClassName="text-white/80 hover:bg-white/10 hover:text-white" />
            <div className="mx-2 hidden h-6 w-px bg-white/15 sm:block" />
            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex flex-col items-end leading-tight">
                <span className="text-sm font-medium text-white">{user.name}</span>
                <Badge variant="secondary" className="mt-1 border-white/15 bg-white/10 text-white/80">
                  {roleLabels[user.role]}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/80 hover:bg-white/10 hover:text-white"
              onClick={() => dispatch(logout())}
              title="Log out"
            >
              <LogOut className="size-4.5" strokeWidth={1.75} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/80 hover:bg-white/10 hover:text-white lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        ) : (
          <nav className="ml-auto flex items-center gap-6">
            <Link
              to="/login"
              className="text-[11px] font-semibold tracking-[0.1em] text-white/70 uppercase transition-colors hover:text-white"
            >
              Log in
            </Link>
            <Button asChild size="sm">
              <Link to="/register">Create account</Link>
            </Button>
          </nav>
        )}
      </div>

      {user && mobileOpen && (
        <nav className="border-t border-white/10 px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-1">
            {items.map((item) => (
              <NavLink
                key={item.to + item.label}
                to={item.to}
                end={item.to === '/dashboard'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'px-1 py-2 text-xs font-semibold tracking-[0.08em] uppercase',
                    isActive ? 'text-white' : 'text-white/60'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
