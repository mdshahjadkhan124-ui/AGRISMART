import { apiSlice } from '@/app/apiSlice'
import type { CreateOrderInput, Order } from './types'

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<Order, CreateOrderInput>({
      query: (input) => ({ url: '/marketplace/orders', method: 'POST', body: input }),
      transformResponse: (res: ApiEnvelope<{ order: Order }>) => res.data.order,
      invalidatesTags: [{ type: 'Order', id: 'MINE' }],
    }),
    getMyOrders: builder.query<Order[], void>({
      query: () => '/marketplace/orders',
      transformResponse: (res: ApiEnvelope<{ orders: Order[] }>) => res.data.orders,
      providesTags: [{ type: 'Order', id: 'MINE' }],
    }),
    getMyOrder: builder.query<Order, string>({
      query: (id) => `/marketplace/orders/${id}`,
      transformResponse: (res: ApiEnvelope<{ order: Order }>) => res.data.order,
      providesTags: (_result, _error, id) => [{ type: 'Order', id }],
    }),
    getSellerOrders: builder.query<Order[], void>({
      query: () => '/marketplace/orders/seller',
      transformResponse: (res: ApiEnvelope<{ orders: Order[] }>) => res.data.orders,
      providesTags: [{ type: 'Order', id: 'SELLER' }],
    }),
    updateOrderStatus: builder.mutation<Order, { id: string; status: string }>({
      query: ({ id, status }) => ({ url: `/marketplace/orders/${id}/status`, method: 'PUT', body: { status } }),
      transformResponse: (res: ApiEnvelope<{ order: Order }>) => res.data.order,
      invalidatesTags: [{ type: 'Order', id: 'SELLER' }],
    }),
  }),
})

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetMyOrderQuery,
  useGetSellerOrdersQuery,
  useUpdateOrderStatusMutation,
} = ordersApi
