import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { credentialsReceived, sessionExpired } from '@/features/auth/authSlice'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api/v1',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken
    if (token) headers.set('Authorization', `Bearer ${token}`)
    return headers
  },
})

// Endpoints whose own 401 must never trigger a refresh-and-retry cycle —
// mirrors the old axios interceptor's exclusion list exactly.
const NO_REAUTH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh']

function requestUrl(args) {
  return typeof args === 'string' ? args : args.url
}

// Coalesces concurrent 401s into a single refresh call instead of firing
// one refresh request per failed request — same purpose as the old axios
// interceptor's shared `refreshPromise`.
let refreshPromise = null

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error?.status === 401 && !NO_REAUTH_PATHS.some((p) => requestUrl(args).includes(p))) {
    if (!refreshPromise) {
      refreshPromise = (async () => {
        const refreshResult = await rawBaseQuery({ url: '/auth/refresh', method: 'POST' }, api, extraOptions)
        if (refreshResult.data) {
          api.dispatch(credentialsReceived(refreshResult.data.data))
          return true
        }
        api.dispatch(sessionExpired())
        return false
      })().finally(() => {
        refreshPromise = null
      })
    }

    const refreshed = await refreshPromise
    if (refreshed) {
      result = await rawBaseQuery(args, api, extraOptions)
    }
  }

  return result
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Farm',
    'CropHistory',
    'SoilReport',
    'Activity',
    'Profile',
    'CropSuggestion',
    'FertilizerRec',
    'DiseaseReport',
    'DiseaseQueue',
    'Expert',
    'ExpertProfile',
    'Appointment',
    'Message',
    'Product',
    'Order',
    'Scheme',
    'Notification',
    'AdminUser',
    'AuditLog',
  ],
  endpoints: () => ({}),
})
