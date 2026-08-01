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
  // Optional: older audit log entries created before the backend's
  // minimize:false fix may not have this field at all (Mongoose used to
  // strip empty-object fields from storage) — never assume it's present.
  metadata?: Record<string, unknown>
  createdAt: string
}
