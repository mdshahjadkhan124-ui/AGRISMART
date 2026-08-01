import { api } from '@/lib/axios'
import type { CreateOrderInput, Order } from './types'

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export async function createOrder(input: CreateOrderInput) {
  const res = await api.post<ApiEnvelope<{ order: Order }>>('/marketplace/orders', input)
  return res.data.data.order
}

export async function listMyOrders() {
  const res = await api.get<ApiEnvelope<{ orders: Order[] }>>('/marketplace/orders')
  return res.data.data.orders
}

export async function getMyOrder(id: string) {
  const res = await api.get<ApiEnvelope<{ order: Order }>>(`/marketplace/orders/${id}`)
  return res.data.data.order
}

export async function listSellerOrders() {
  const res = await api.get<ApiEnvelope<{ orders: Order[] }>>('/marketplace/orders/seller')
  return res.data.data.orders
}

export async function updateOrderStatus(id: string, status: string) {
  const res = await api.put<ApiEnvelope<{ order: Order }>>(`/marketplace/orders/${id}/status`, { status })
  return res.data.data.order
}
