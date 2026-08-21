import { apiSlice } from '@/app/apiSlice'

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUsers: builder.query({
      query: (params) => ({ url: '/admin/users', params: params ?? {} }),
      transformResponse: (res) => res.data.users,
      providesTags: [{ type: 'AdminUser', id: 'LIST' }],
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({ url: `/admin/users/${id}/role`, method: 'PUT', body: { role } }),
      transformResponse: (res) => res.data.user,
      invalidatesTags: [{ type: 'AdminUser', id: 'LIST' }],
    }),
    updateUserStatus: builder.mutation({
      query: ({ id, isActive }) => ({ url: `/admin/users/${id}/status`, method: 'PUT', body: { isActive } }),
      transformResponse: (res) => res.data.user,
      invalidatesTags: [{ type: 'AdminUser', id: 'LIST' }],
    }),
    getAuditLogs: builder.query({
      query: () => '/admin/audit-logs',
      transformResponse: (res) => res.data.auditLogs,
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
