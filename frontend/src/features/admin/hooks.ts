import { useMutationCompat } from '@/app/rtkQueryCompat'
import { useGetAdminUsersQuery, useUpdateUserRoleMutation, useUpdateUserStatusMutation, useGetAuditLogsQuery } from './api'

export function useAdminUsers(params: { role?: string; search?: string } = {}) {
  return useGetAdminUsersQuery(params)
}

export function useUpdateUserRole() {
  const [trigger, state] = useUpdateUserRoleMutation()
  return useMutationCompat([(arg: { id: string; role: string }) => trigger(arg), state])
}

export function useUpdateUserStatus() {
  const [trigger, state] = useUpdateUserStatusMutation()
  return useMutationCompat([(arg: { id: string; isActive: boolean }) => trigger(arg), state])
}

export function useAdminAuditLogs() {
  return useGetAuditLogsQuery()
}
