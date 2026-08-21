import { apiSlice } from '@/app/apiSlice'

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (payload) => ({ url: '/auth/login', method: 'POST', body: payload }),
      transformResponse: (res) => res.data,
    }),
    register: builder.mutation({
      query: (payload) => ({ url: '/auth/register', method: 'POST', body: payload }),
      transformResponse: (res) => res.data,
    }),
    googleLogin: builder.mutation({
      query: (idToken) => ({ url: '/auth/google', method: 'POST', body: { idToken } }),
      transformResponse: (res) => res.data,
    }),
    refresh: builder.mutation({
      query: () => ({ url: '/auth/refresh', method: 'POST' }),
      transformResponse: (res) => res.data,
    }),
    logout: builder.mutation({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
    getMe: builder.query({
      query: () => '/auth/me',
      transformResponse: (res) => res.data.user,
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
