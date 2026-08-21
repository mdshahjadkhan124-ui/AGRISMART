import { apiSlice } from '@/app/apiSlice'

function toFormData(input) {
  const formData = new FormData()
  Object.entries(input).forEach(([key, value]) => {
    if (value == null) return
    formData.append(key, value instanceof File ? value : String(value))
  })
  return formData
}

export const marketplaceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPublicProducts: builder.query({
      query: (params) => ({ url: '/marketplace/products', params: params ?? {} }),
      transformResponse: (res) => res.data.products,
      providesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    getProduct: builder.query({
      query: (id) => `/marketplace/products/${id}`,
      transformResponse: (res) => res.data.product,
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),
    getMyProducts: builder.query({
      query: () => '/marketplace/products/mine',
      transformResponse: (res) => res.data.products,
      providesTags: [{ type: 'Product', id: 'MINE' }],
    }),
    createProduct: builder.mutation({
      query: (input) => ({ url: '/marketplace/products', method: 'POST', body: toFormData(input) }),
      transformResponse: (res) => res.data.product,
      invalidatesTags: [{ type: 'Product', id: 'LIST' }, { type: 'Product', id: 'MINE' }],
    }),
    updateProduct: builder.mutation({
      query: ({ id, input }) => ({ url: `/marketplace/products/${id}`, method: 'PUT', body: toFormData(input) }),
      transformResponse: (res) => res.data.product,
      invalidatesTags: [{ type: 'Product', id: 'LIST' }, { type: 'Product', id: 'MINE' }],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({ url: `/marketplace/products/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }, { type: 'Product', id: 'MINE' }],
    }),
  }),
})

export const {
  useGetPublicProductsQuery,
  useGetProductQuery,
  useGetMyProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = marketplaceApi
