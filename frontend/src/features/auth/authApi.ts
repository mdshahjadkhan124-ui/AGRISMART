import { api } from '@/lib/axios'
import type { AuthResponseData, User } from './types'

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export async function loginRequest(payload: { email: string; password: string }) {
  const res = await api.post<ApiEnvelope<AuthResponseData>>('/auth/login', payload)
  return res.data.data
}

export async function registerRequest(payload: {
  name: string
  email: string
  password: string
  phone?: string
}) {
  const res = await api.post<ApiEnvelope<AuthResponseData>>('/auth/register', payload)
  return res.data.data
}

export async function googleLoginRequest(idToken: string) {
  const res = await api.post<ApiEnvelope<AuthResponseData>>('/auth/google', { idToken })
  return res.data.data
}

export async function logoutRequest() {
  await api.post('/auth/logout')
}

export async function fetchMeRequest() {
  const res = await api.get<ApiEnvelope<{ user: User }>>('/auth/me')
  return res.data.data.user
}

export async function refreshRequest() {
  const res = await api.post<ApiEnvelope<AuthResponseData>>('/auth/refresh')
  return res.data.data
}
