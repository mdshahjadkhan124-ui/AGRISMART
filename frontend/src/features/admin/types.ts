import type { Role } from '@/features/auth/types'

export interface AdminUser {
  id: string
  name: string
  email: string
  phone?: string
  role: Role
  authProvider: 'local' | 'google'
  isEmailVerified: boolean
  isActive: boolean
  createdAt: string
}

export interface AuditLogEntry {
  _id: string
  actor: { _id: string; name: string; email: string; role: string } | string
  action: string
  targetType: string
  targetId?: string
  metadata: Record<string, unknown>
  createdAt: string
}
