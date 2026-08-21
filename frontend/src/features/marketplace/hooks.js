import { useMutationCompat } from '@/app/rtkQueryCompat'
import {
  useGetPublicProductsQuery,
  useGetProductQuery,
  useGetMyProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from './api'

export function usePublicProducts(params = {}) {
  return useGetPublicProductsQuery(params)
}

export function useProduct(id) {
  return useGetProductQuery(id, { skip: !id })
}

export function useMyProducts() {
  return useGetMyProductsQuery()
}

export function useCreateProduct() {
  return useMutationCompat(useCreateProductMutation())
}

export function useUpdateProduct(id) {
  const [trigger, state] = useUpdateProductMutation()
  return useMutationCompat([(input) => trigger({ id, input }), state])
}

export function useDeleteProduct() {
  return useMutationCompat(useDeleteProductMutation())
}
