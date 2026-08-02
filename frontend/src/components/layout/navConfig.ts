import type { LucideIcon } from 'lucide-react'
import {
  Home,
  Sprout,
  Leaf,
  FlaskConical,
  Bug,
  Stethoscope,
  CalendarClock,
  Store,
  Package,
  Landmark,
  BarChart3,
  User,
  ClipboardList,
  Users,
  ScrollText,
} from 'lucide-react'
import type { Role } from '@/features/auth/types'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  roles: Role[]
}

const allRoles: Role[] = ['farmer', 'expert', 'officer', 'seller', 'gov_admin', 'super_admin']

export const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: Home, roles: allRoles },
  { to: '/farms', label: 'My Farms', icon: Sprout, roles: ['farmer'] },
  { to: '/crop-suggestion', label: 'Crop Suggestion', icon: Leaf, roles: ['farmer'] },
  { to: '/fertilizer-recommendation', label: 'Fertilizer Recommendation', icon: FlaskConical, roles: ['farmer'] },
  { to: '/disease-reports', label: 'Disease Reports', icon: Bug, roles: ['farmer'] },
  { to: '/experts', label: 'Find an Expert', icon: Stethoscope, roles: ['farmer'] },
  { to: '/appointments', label: 'My Appointments', icon: CalendarClock, roles: ['farmer'] },
  { to: '/marketplace', label: 'Marketplace', icon: Store, roles: ['farmer'] },
  { to: '/orders', label: 'My Orders', icon: Package, roles: ['farmer'] },
  { to: '/schemes', label: 'Government Schemes', icon: Landmark, roles: ['farmer'] },
  { to: '/profile', label: 'My Profile', icon: User, roles: ['farmer'] },

  { to: '/appointments', label: 'Consultation Requests', icon: CalendarClock, roles: ['expert'] },
  { to: '/expert/disease-queue', label: 'Disease Report Queue', icon: ClipboardList, roles: ['expert'] },
  { to: '/expert/profile', label: 'My Expert Profile', icon: User, roles: ['expert'] },

  { to: '/seller/products', label: 'My Products', icon: Store, roles: ['seller'] },
  { to: '/seller/orders', label: 'Orders', icon: Package, roles: ['seller'] },

  { to: '/admin/schemes', label: 'Manage Schemes', icon: Landmark, roles: ['gov_admin', 'super_admin'] },
  { to: '/schemes', label: 'View Schemes', icon: ScrollText, roles: ['gov_admin', 'super_admin'] },
  { to: '/admin/users', label: 'Manage Users', icon: Users, roles: ['super_admin'] },
  { to: '/admin/audit-logs', label: 'Audit Logs', icon: ScrollText, roles: ['super_admin'] },

  { to: '/analytics', label: 'Analytics', icon: BarChart3, roles: allRoles },
]
