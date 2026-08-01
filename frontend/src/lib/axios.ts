import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api/v1',
  withCredentials: true,
})

let accessToken: string | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
}

// Wired up by the store after creation (see app/store.ts) to avoid a
// circular import between this module and the store. Called when the
// refresh cookie itself is invalid/expired, so the app can drop back to a
// logged-out state.
let onRefreshFailed: () => void = () => {}
export function setOnRefreshFailed(handler: () => void) {
  onRefreshFailed = handler
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

let refreshPromise: Promise<string | null> | null = null

// Coalesces concurrent 401s into a single refresh call instead of firing
// one refresh request per failed request.
async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = api
      .post<{ data: { accessToken: string } }>('/auth/refresh')
      .then((res) => {
        const token = res.data.data.accessToken
        setAccessToken(token)
        return token
      })
      .catch(() => {
        setAccessToken(null)
        onRefreshFailed()
        return null
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined
    const url = original?.url ?? ''
    const isAuthEndpoint = ['/auth/login', '/auth/register', '/auth/refresh'].some((p) => url.includes(p))

    if (error.response?.status === 401 && original && !original._retry && !isAuthEndpoint) {
      original._retry = true
      const token = await refreshAccessToken()
      if (token) {
        original.headers.Authorization = `Bearer ${token}`
        return api(original)
      }
    }

    return Promise.reject(error)
  }
)
