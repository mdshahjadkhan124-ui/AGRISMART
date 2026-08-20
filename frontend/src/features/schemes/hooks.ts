import { useMutationCompat } from '@/app/rtkQueryCompat'
import { useGetSchemesQuery, useGetSchemeQuery, useCreateSchemeMutation, useUpdateSchemeMutation, useDeleteSchemeMutation } from './api'
import type { SchemeInput } from './types'

export function useSchemes(params: { category?: string; state?: string; search?: string; includeInactive?: boolean } = {}) {
  return useGetSchemesQuery(params)
}

export function useScheme(id: string) {
  return useGetSchemeQuery(id, { skip: !id })
}

export function useCreateScheme() {
  return useMutationCompat(useCreateSchemeMutation())
}

export function useUpdateScheme(id: string) {
  const [trigger, state] = useUpdateSchemeMutation()
  return useMutationCompat([(input: Partial<SchemeInput>) => trigger({ id, input }), state])
}

export function useDeleteScheme() {
  return useMutationCompat(useDeleteSchemeMutation())
}
