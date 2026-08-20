import { useMutationCompat } from '@/app/rtkQueryCompat'
import {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetMyOrderQuery,
  useGetSellerOrdersQuery,
  useUpdateOrderStatusMutation,
} from './api'

export function useMyOrders() {
  return useGetMyOrdersQuery()
}

export function useMyOrder(id: string) {
  return useGetMyOrderQuery(id, { skip: !id })
}

export function useCreateOrder() {
  return useMutationCompat(useCreateOrderMutation())
}

export function useSellerOrders() {
  return useGetSellerOrdersQuery()
}

export function useUpdateOrderStatus() {
  const [trigger, state] = useUpdateOrderStatusMutation()
  return useMutationCompat([(arg: { id: string; status: string }) => trigger(arg), state])
}
