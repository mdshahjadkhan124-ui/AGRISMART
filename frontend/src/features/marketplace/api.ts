import { api } from '@/lib/axios'
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

export async function listPublicProducts(params: { category?: string; search?: string } = {}) {
  const res = await api.get<ApiEnvelope<{ products: MarketplaceProduct[] }>>('/marketplace/products', { params })
  return res.data.data.products
}

export async function getProduct(id: string) {
  const res = await api.get<ApiEnvelope<{ product: MarketplaceProduct }>>(`/marketplace/products/${id}`)
  return res.data.data.product
}

export async function listMyProducts() {
  const res = await api.get<ApiEnvelope<{ products: MarketplaceProduct[] }>>('/marketplace/products/mine')
  return res.data.data.products
}

export async function createProduct(input: ProductInput) {
  const res = await api.post<ApiEnvelope<{ product: MarketplaceProduct }>>('/marketplace/products', toFormData(input))
  return res.data.data.product
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  const res = await api.put<ApiEnvelope<{ product: MarketplaceProduct }>>(`/marketplace/products/${id}`, toFormData(input))
  return res.data.data.product
}

export async function deleteProduct(id: string) {
  await api.delete(`/marketplace/products/${id}`)
}
