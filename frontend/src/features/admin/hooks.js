import { useMutationCompat } from '@/app/rtkQueryCompat'
import { useGetAdminUsersQuery, useUpdateUserRoleMutation, useUpdateUserStatusMutation, useGetAuditLogsQuery } from './api'

export function useAdminUsers(params = {}) {
  return useGetAdminUsersQuery(params)
}

export function useUpdateUserRole() {
  const [trigger, state] = useUpdateUserRoleMutation()
  return useMutationCompat([(arg) => trigger(arg), state])
}

export function useUpdateUserStatus() {
  const [trigger, state] = useUpdateUserStatusMutation()
  return useMutationCompat([(arg) => trigger(arg), state])
}

export function useAdminAuditLogs() {
  return useGetAuditLogsQuery()
}
