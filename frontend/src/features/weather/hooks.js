import { useGetCurrentWeatherQuery, useGetForecastQuery } from './weatherApi'

function isNotConfigured(err) {
  return Boolean(err && typeof err === 'object' && 'status' in err && err.status === 501)
}

export function useCurrentWeather(lat, lon) {
  const query = useGetCurrentWeatherQuery(
    { lat: lat ?? 0, lon: lon ?? 0 },
    { skip: lat == null || lon == null }
  )
  return { ...query, notConfigured: isNotConfigured(query.error) }
}

export function useForecast(lat, lon) {
  const query = useGetForecastQuery(
    { lat: lat ?? 0, lon: lon ?? 0 },
    { skip: lat == null || lon == null }
  )
  return { ...query, notConfigured: isNotConfigured(query.error) }
}
