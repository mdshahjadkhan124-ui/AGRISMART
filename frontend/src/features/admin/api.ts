import { api } from '@/lib/axios'
import type { AdminUser, AuditLogEntry } from './types'

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export async function listUsers(params: { role?: string; search?: string } = {}) {
  const res = await api.get<ApiEnvelope<{ users: AdminUser[] }>>('/admin/users', { params })
  return res.data.data.users
}

export async function updateUserRole(id: string, role: string) {
  const res = await api.put<ApiEnvelope<{ user: AdminUser }>>(`/admin/users/${id}/role`, { role })
  return res.data.data.user
}

export async function updateUserStatus(id: string, isActive: boolean) {
  const res = await api.put<ApiEnvelope<{ user: AdminUser }>>(`/admin/users/${id}/status`, { isActive })
  return res.data.data.user
}

export async function listAuditLogs() {
  const res = await api.get<ApiEnvelope<{ auditLogs: AuditLogEntry[] }>>('/admin/audit-logs')
  return res.data.data.auditLogs
}
