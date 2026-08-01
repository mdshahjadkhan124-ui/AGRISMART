export type ProductCategory = 'seeds' | 'fertilizers' | 'pesticides' | 'tools' | 'machinery' | 'other'

export interface MarketplaceProduct {
  _id: string
  seller: string | { _id: string; name: string }
  name: string
  description: string
  category: ProductCategory
  priceInr: number
  unit: string
  stockQuantity: number
  imageUrl: string
  isActive: boolean
  createdAt: string
}

export interface ProductInput {
  name: string
  description?: string
  category?: ProductCategory
  priceInr: number
  unit?: string
  stockQuantity: number
  image?: File
}
