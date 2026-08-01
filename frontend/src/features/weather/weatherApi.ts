import { api } from '@/lib/axios'
import type { CurrentWeather, Forecast } from './types'

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export async function getCurrentWeather(lat: number, lon: number) {
  const res = await api.get<ApiEnvelope<{ weather: CurrentWeather }>>('/weather/current', { params: { lat, lon } })
  return res.data.data.weather
}

export async function getForecast(lat: number, lon: number) {
  const res = await api.get<ApiEnvelope<{ forecast: Forecast }>>('/weather/forecast', { params: { lat, lon } })
  return res.data.data.forecast
}
