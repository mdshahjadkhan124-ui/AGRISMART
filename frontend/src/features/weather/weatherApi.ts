import { apiSlice } from '@/app/apiSlice'
import type { CurrentWeather, Forecast } from './types'

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

interface Coords {
  lat: number
  lon: number
}

export const weatherApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentWeather: builder.query<CurrentWeather, Coords>({
      query: ({ lat, lon }) => ({ url: '/weather/current', params: { lat, lon } }),
      transformResponse: (res: ApiEnvelope<{ weather: CurrentWeather }>) => res.data.weather,
    }),
    getForecast: builder.query<Forecast, Coords>({
      query: ({ lat, lon }) => ({ url: '/weather/forecast', params: { lat, lon } }),
      transformResponse: (res: ApiEnvelope<{ forecast: Forecast }>) => res.data.forecast,
    }),
  }),
})

export const { useGetCurrentWeatherQuery, useGetForecastQuery } = weatherApi
