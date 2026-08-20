import { apiSlice } from '@/app/apiSlice'
import type { AdminUser, AuditLogEntry } from './types'

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUsers: builder.query<AdminUser[], { role?: string; search?: string } | void>({
      query: (params) => ({ url: '/admin/users', params: params ?? {} }),
      transformResponse: (res: ApiEnvelope<{ users: AdminUser[] }>) => res.data.users,
      providesTags: [{ type: 'AdminUser', id: 'LIST' }],
    }),
    updateUserRole: builder.mutation<AdminUser, { id: string; role: string }>({
      query: ({ id, role }) => ({ url: `/admin/users/${id}/role`, method: 'PUT', body: { role } }),
      transformResponse: (res: ApiEnvelope<{ user: AdminUser }>) => res.data.user,
      invalidatesTags: [{ type: 'AdminUser', id: 'LIST' }],
    }),
    updateUserStatus: builder.mutation<AdminUser, { id: string; isActive: boolean }>({
      query: ({ id, isActive }) => ({ url: `/admin/users/${id}/status`, method: 'PUT', body: { isActive } }),
      transformResponse: (res: ApiEnvelope<{ user: AdminUser }>) => res.data.user,
      invalidatesTags: [{ type: 'AdminUser', id: 'LIST' }],
    }),
    getAuditLogs: builder.query<AuditLogEntry[], void>({
      query: () => '/admin/audit-logs',
      transformResponse: (res: ApiEnvelope<{ auditLogs: AuditLogEntry[] }>) => res.data.auditLogs,
      providesTags: ['AuditLog'],
    }),
  }),
})

export const {
  useGetAdminUsersQuery,
  useUpdateUserRoleMutation,
  useUpdateUserStatusMutation,
  useGetAuditLogsQuery,
} = adminApi
