import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { useGetCurrentWeatherQuery, useGetForecastQuery } from './weatherApi'

function isNotConfigured(err: unknown) {
  return Boolean(err && typeof err === 'object' && 'status' in err && (err as FetchBaseQueryError).status === 501)
}

export function useCurrentWeather(lat?: number, lon?: number) {
  const query = useGetCurrentWeatherQuery(
    { lat: lat ?? 0, lon: lon ?? 0 },
    { skip: lat == null || lon == null }
  )
  return { ...query, notConfigured: isNotConfigured(query.error) }
}

export function useForecast(lat?: number, lon?: number) {
  const query = useGetForecastQuery(
    { lat: lat ?? 0, lon: lon ?? 0 },
    { skip: lat == null || lon == null }
  )
  return { ...query, notConfigured: isNotConfigured(query.error) }
}
