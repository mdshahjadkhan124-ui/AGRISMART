import { apiSlice } from '@/app/apiSlice'
import type { MarketplaceProduct, ProductInput } from './types'

interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

function toFormData(input: ProductInput | Partial<ProductInput>) {
  const formData = new FormData()
  Object.entries(input).forEach(([key, value]) => {
    if (value == null) return
    formData.append(key, value instanceof File ? value : String(value))
  })
  return formData
}

export const marketplaceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPublicProducts: builder.query<MarketplaceProduct[], { category?: string; search?: string } | void>({
      query: (params) => ({ url: '/marketplace/products', params: params ?? {} }),
      transformResponse: (res: ApiEnvelope<{ products: MarketplaceProduct[] }>) => res.data.products,
      providesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    getProduct: builder.query<MarketplaceProduct, string>({
      query: (id) => `/marketplace/products/${id}`,
      transformResponse: (res: ApiEnvelope<{ product: MarketplaceProduct }>) => res.data.product,
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),
    getMyProducts: builder.query<MarketplaceProduct[], void>({
      query: () => '/marketplace/products/mine',
      transformResponse: (res: ApiEnvelope<{ products: MarketplaceProduct[] }>) => res.data.products,
      providesTags: [{ type: 'Product', id: 'MINE' }],
    }),
    createProduct: builder.mutation<MarketplaceProduct, ProductInput>({
      query: (input) => ({ url: '/marketplace/products', method: 'POST', body: toFormData(input) }),
      transformResponse: (res: ApiEnvelope<{ product: MarketplaceProduct }>) => res.data.product,
      invalidatesTags: [{ type: 'Product', id: 'LIST' }, { type: 'Product', id: 'MINE' }],
    }),
    updateProduct: builder.mutation<MarketplaceProduct, { id: string; input: Partial<ProductInput> }>({
      query: ({ id, input }) => ({ url: `/marketplace/products/${id}`, method: 'PUT', body: toFormData(input) }),
      transformResponse: (res: ApiEnvelope<{ product: MarketplaceProduct }>) => res.data.product,
      invalidatesTags: [{ type: 'Product', id: 'LIST' }, { type: 'Product', id: 'MINE' }],
    }),
    deleteProduct: builder.mutation<void, string>({
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
