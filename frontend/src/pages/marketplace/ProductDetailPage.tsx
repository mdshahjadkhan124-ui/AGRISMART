import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { useProduct } from '@/features/marketplace/hooks'
import { useCreateOrder } from '@/features/orders/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const checkoutSchema = z.object({
  quantity: z.coerce.number().int().positive('Quantity must be at least 1'),
  shippingAddress: z.string().trim().min(1, 'Shipping address is required').max(300),
  paymentMethod: z.enum(['cod', 'mock_online']),
})

type CheckoutInput = z.input<typeof checkoutSchema>
type CheckoutValues = z.output<typeof checkoutSchema>

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: product, isLoading } = useProduct(id as string)
  const createOrder = useCreateOrder()
  const [placed, setPlaced] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutInput, unknown, CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { quantity: 1, paymentMethod: 'cod' },
  })

  if (isLoading) return <p className="text-muted-foreground p-8 text-sm">Loading product…</p>
  if (!product) return <p className="text-muted-foreground p-8 text-sm">Product not found.</p>

  const onSubmit = (values: CheckoutValues) => {
    createOrder.mutate(
      {
        items: [{ productId: product._id, quantity: values.quantity }],
        shippingAddress: values.shippingAddress,
        paymentMethod: values.paymentMethod,
      },
      {
        onSuccess: (order) => {
          setPlaced(true)
          setTimeout(() => navigate(`/orders/${order._id}`), 1200)
        },
      }
    )
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 p-8">
      {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="max-h-72 w-full rounded-lg object-cover" />}
      <div>
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <p className="text-muted-foreground text-sm">
          ₹{product.priceInr}/{product.unit} · {product.stockQuantity} in stock
        </p>
      </div>
      {product.description && <p className="text-sm">{product.description}</p>}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Buy now</CardTitle>
        </CardHeader>
        <CardContent>
          {placed ? (
            <p className="text-sm text-green-600 dark:text-green-500">Order placed! Redirecting…</p>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" min={1} max={product.stockQuantity} {...register('quantity')} />
                {errors.quantity && <p className="text-destructive text-sm">{errors.quantity.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="shippingAddress">Shipping address</Label>
                <Input id="shippingAddress" {...register('shippingAddress')} />
                {errors.shippingAddress && <p className="text-destructive text-sm">{errors.shippingAddress.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Payment method</Label>
                <Select
                  value={watch('paymentMethod')}
                  onValueChange={(v) => setValue('paymentMethod', v as CheckoutValues['paymentMethod'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cod">Cash on delivery</SelectItem>
                    <SelectItem value="mock_online">Pay online (simulated)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {createOrder.isError && <p className="text-destructive text-sm">Couldn't place the order. Try again.</p>}
              <Button type="submit" disabled={createOrder.isPending}>
                {createOrder.isPending ? 'Placing order…' : 'Place order'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
