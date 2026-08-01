import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from './api'
import type { ProductInput } from './types'

export function usePublicProducts(params: { category?: string; search?: string } = {}) {
  return useQuery({ queryKey: ['marketplace-products', params], queryFn: () => api.listPublicProducts(params) })
}

export function useProduct(id: string) {
  return useQuery({ queryKey: ['marketplace-products', id], queryFn: () => api.getProduct(id), enabled: Boolean(id) })
}

export function useMyProducts() {
  return useQuery({ queryKey: ['marketplace-products', 'mine'], queryFn: api.listMyProducts })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.createProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['marketplace-products'] }),
  })
}

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Partial<ProductInput>) => api.updateProduct(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['marketplace-products'] }),
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['marketplace-products'] }),
  })
}
