import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from './api'

export function useMyOrders() {
  return useQuery({ queryKey: ['orders', 'mine'], queryFn: api.listMyOrders })
}

export function useMyOrder(id: string) {
  return useQuery({ queryKey: ['orders', 'mine', id], queryFn: () => api.getMyOrder(id), enabled: Boolean(id) })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.createOrder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders', 'mine'] }),
  })
}

export function useSellerOrders() {
  return useQuery({ queryKey: ['orders', 'seller'], queryFn: api.listSellerOrders })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.updateOrderStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders', 'seller'] }),
  })
}
