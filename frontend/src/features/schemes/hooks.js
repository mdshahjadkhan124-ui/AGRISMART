import { useMutationCompat } from '@/app/rtkQueryCompat'
import { useGetSchemesQuery, useGetSchemeQuery, useCreateSchemeMutation, useUpdateSchemeMutation, useDeleteSchemeMutation } from './api'

export function useSchemes(params = {}) {
  return useGetSchemesQuery(params)
}

export function useScheme(id) {
  return useGetSchemeQuery(id, { skip: !id })
}

export function useCreateScheme() {
  return useMutationCompat(useCreateSchemeMutation())
}

export function useUpdateScheme(id) {
  const [trigger, state] = useUpdateSchemeMutation()
  return useMutationCompat([(input) => trigger({ id, input }), state])
}

export function useDeleteScheme() {
  return useMutationCompat(useDeleteSchemeMutation())
}
