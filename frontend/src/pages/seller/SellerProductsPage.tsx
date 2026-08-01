import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateProduct, useDeleteProduct, useMyProducts } from '@/features/marketplace/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ProductCategory } from '@/features/marketplace/types'

const categories: ProductCategory[] = ['seeds', 'fertilizers', 'pesticides', 'tools', 'machinery', 'other']

const schema = z.object({
  name: z.string().trim().min(1, 'Product name is required').max(150),
  description: z.string().trim().max(1000).optional(),
  category: z.enum(categories),
  priceInr: z.coerce.number().positive('Price must be greater than 0'),
  unit: z.string().trim().max(30).optional(),
  stockQuantity: z.coerce.number().min(0, 'Stock cannot be negative'),
  image: z
    .custom<FileList>()
    .optional()
    .transform((files) => (files && files.length > 0 ? files[0] : undefined)),
})

type FormInput = z.input<typeof schema>
type FormValues = z.output<typeof schema>

export default function SellerProductsPage() {
  const [showForm, setShowForm] = useState(false)
  const { data: products, isLoading } = useMyProducts()
  const createProduct = useCreateProduct()
  const deleteProduct = useDeleteProduct()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormInput, unknown, FormValues>({ resolver: zodResolver(schema), defaultValues: { category: 'other' } })

  const onSubmit = (values: FormValues) => {
    createProduct.mutate(values, {
      onSuccess: () => {
        reset()
        setShowForm(false)
      },
    })
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Products</h1>
        <Button onClick={() => setShowForm((v) => !v)}>{showForm ? 'Cancel' : 'List a product'}</Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">New listing</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" rows={2} {...register('description')} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Category</Label>
                  <Select value={watch('category')} onValueChange={(v) => setValue('category', v as FormInput['category'])}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="unit">Unit</Label>
                  <Input id="unit" placeholder="kg, litre, piece…" {...register('unit')} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="priceInr">Price (₹)</Label>
                  <Input id="priceInr" type="number" step="0.01" {...register('priceInr')} />
                  {errors.priceInr && <p className="text-destructive text-sm">{errors.priceInr.message}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="stockQuantity">Stock quantity</Label>
                  <Input id="stockQuantity" type="number" {...register('stockQuantity')} />
                  {errors.stockQuantity && <p className="text-destructive text-sm">{errors.stockQuantity.message}</p>}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="image">Photo (optional)</Label>
                <Input id="image" type="file" accept="image/*" {...register('image')} />
              </div>
              {createProduct.isError && <p className="text-destructive text-sm">Couldn't list the product. Try again.</p>}
              <Button type="submit" disabled={createProduct.isPending}>
                {createProduct.isPending ? 'Listing…' : 'List product'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading && <p className="text-muted-foreground text-sm">Loading your products…</p>}
      {products && products.length === 0 && <p className="text-muted-foreground text-sm">You haven't listed anything yet.</p>}

      <div className="flex flex-col gap-3">
        {products?.map((product) => (
          <Card key={product._id}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">{product.name}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => deleteProduct.mutate(product._id)} disabled={deleteProduct.isPending}>
                Delete
              </Button>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              ₹{product.priceInr}/{product.unit} · {product.stockQuantity} in stock · {product.isActive ? 'Active' : 'Inactive'}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
