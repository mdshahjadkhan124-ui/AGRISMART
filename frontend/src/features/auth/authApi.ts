import { apiSlice } from '@/app/apiSlice'
import type { AuthResponseData, User } from './types'

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponseData, { email: string; password: string }>({
      query: (payload) => ({ url: '/auth/login', method: 'POST', body: payload }),
      transformResponse: (res: ApiEnvelope<AuthResponseData>) => res.data,
    }),
    register: builder.mutation<AuthResponseData, { name: string; email: string; password: string; phone?: string }>({
      query: (payload) => ({ url: '/auth/register', method: 'POST', body: payload }),
      transformResponse: (res: ApiEnvelope<AuthResponseData>) => res.data,
    }),
    googleLogin: builder.mutation<AuthResponseData, string>({
      query: (idToken) => ({ url: '/auth/google', method: 'POST', body: { idToken } }),
      transformResponse: (res: ApiEnvelope<AuthResponseData>) => res.data,
    }),
    refresh: builder.mutation<AuthResponseData, void>({
      query: () => ({ url: '/auth/refresh', method: 'POST' }),
      transformResponse: (res: ApiEnvelope<AuthResponseData>) => res.data,
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
    getMe: builder.query<User, void>({
      query: () => '/auth/me',
      transformResponse: (res: ApiEnvelope<{ user: User }>) => res.data.user,
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useGoogleLoginMutation,
  useRefreshMutation,
  useLogoutMutation,
  useGetMeQuery,
} = authApi
