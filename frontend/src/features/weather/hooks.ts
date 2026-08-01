import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import * as weatherApi from './weatherApi'

function isNotConfigured(err: unknown) {
  return isAxiosError(err) && err.response?.status === 501
}

export function useCurrentWeather(lat?: number, lon?: number) {
  const query = useQuery({
    queryKey: ['weather', 'current', lat, lon],
    queryFn: () => weatherApi.getCurrentWeather(lat as number, lon as number),
    enabled: lat != null && lon != null,
    retry: false,
  })
  return { ...query, notConfigured: isNotConfigured(query.error) }
}

export function useForecast(lat?: number, lon?: number) {
  const query = useQuery({
    queryKey: ['weather', 'forecast', lat, lon],
    queryFn: () => weatherApi.getForecast(lat as number, lon as number),
    enabled: lat != null && lon != null,
    retry: false,
  })
  return { ...query, notConfigured: isNotConfigured(query.error) }
}
