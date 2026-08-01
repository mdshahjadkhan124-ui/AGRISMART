import { useQuery } from '@tanstack/react-query'
import { getMyAnalytics } from './api'

export function useMyAnalytics() {
  return useQuery({ queryKey: ['analytics', 'me'], queryFn: getMyAnalytics })
}
