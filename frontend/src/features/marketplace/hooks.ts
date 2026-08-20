import { useMutationCompat } from '@/app/rtkQueryCompat'
import {
  useGetPublicProductsQuery,
  useGetProductQuery,
  useGetMyProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from './api'
import type { ProductInput } from './types'

export function usePublicProducts(params: { category?: string; search?: string } = {}) {
  return useGetPublicProductsQuery(params)
}

export function useProduct(id: string) {
  return useGetProductQuery(id, { skip: !id })
}

export function useMyProducts() {
  return useGetMyProductsQuery()
}

export function useCreateProduct() {
  return useMutationCompat(useCreateProductMutation())
}

export function useUpdateProduct(id: string) {
  const [trigger, state] = useUpdateProductMutation()
  return useMutationCompat([(input: Partial<ProductInput>) => trigger({ id, input }), state])
}

export function useDeleteProduct() {
  return useMutationCompat(useDeleteProductMutation())
}
