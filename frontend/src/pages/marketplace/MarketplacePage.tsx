import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePublicProducts } from '@/features/marketplace/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ProductCategory } from '@/features/marketplace/types'

const categories: ProductCategory[] = ['seeds', 'fertilizers', 'pesticides', 'tools', 'machinery', 'other']

export default function MarketplacePage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('')
  const { data: products, isLoading } = usePublicProducts({ search: search || undefined, category: category || undefined })

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold">Marketplace</h1>
        <p className="text-muted-foreground text-sm">Seeds, fertilizers, tools, and more from local sellers.</p>
      </div>

      <div className="flex gap-3">
        <Input placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select value={category || 'all'} onValueChange={(v) => setCategory(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && <p className="text-muted-foreground text-sm">Loading products…</p>}
      {products && products.length === 0 && <p className="text-muted-foreground text-sm">No products found.</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        {products?.map((product) => (
          <Link key={product._id} to={`/marketplace/${product._id}`}>
            <Card className="hover:border-primary h-full transition-colors">
              {product.imageUrl && (
                <img src={product.imageUrl} alt={product.name} className="h-40 w-full rounded-t-lg object-cover" />
              )}
              <CardHeader>
                <CardTitle className="text-base">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                ₹{product.priceInr}/{product.unit} · {product.stockQuantity} in stock
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
