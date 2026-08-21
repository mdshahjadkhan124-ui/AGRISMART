import { apiSlice } from '@/app/apiSlice'

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (input) => ({ url: '/marketplace/orders', method: 'POST', body: input }),
      transformResponse: (res) => res.data.order,
      invalidatesTags: [{ type: 'Order', id: 'MINE' }],
    }),
    getMyOrders: builder.query({
      query: () => '/marketplace/orders',
      transformResponse: (res) => res.data.orders,
      providesTags: [{ type: 'Order', id: 'MINE' }],
    }),
    getMyOrder: builder.query({
      query: (id) => `/marketplace/orders/${id}`,
      transformResponse: (res) => res.data.order,
      providesTags: (_result, _error, id) => [{ type: 'Order', id }],
    }),
    getSellerOrders: builder.query({
      query: () => '/marketplace/orders/seller',
      transformResponse: (res) => res.data.orders,
      providesTags: [{ type: 'Order', id: 'SELLER' }],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({ url: `/marketplace/orders/${id}/status`, method: 'PUT', body: { status } }),
      transformResponse: (res) => res.data.order,
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
