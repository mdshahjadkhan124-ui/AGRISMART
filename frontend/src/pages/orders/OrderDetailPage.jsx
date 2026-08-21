import { useParams } from 'react-router-dom'
import { useMyOrder } from '@/features/orders/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const statusVariant = {
  pending: 'secondary',
  paid: 'default',
  shipped: 'default',
  delivered: 'default',
  cancelled: 'destructive',
}

export default function OrderDetailPage() {
  const { id } = useParams()
  const { data: order, isLoading } = useMyOrder(id)

  if (isLoading) return <p className="text-muted-foreground p-8 text-sm">Loading order…</p>
  if (!order) return <p className="text-muted-foreground p-8 text-sm">Order not found.</p>

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 p-8">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-semibold">Order #{order._id.slice(-6).toUpperCase()}</h1>
        <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Items</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          {order.items.map((item) => (
            <div key={item.product} className="flex justify-between">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>₹{item.subtotalInr}</span>
            </div>
          ))}
          <div className="flex justify-between border-t pt-2 font-medium">
            <span>Total</span>
            <span>₹{order.totalAmountInr}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Shipping & payment</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground flex flex-col gap-1 text-sm">
          <p>{order.shippingAddress}</p>
          <p>
            Payment: {order.payment.method === 'cod' ? 'Cash on delivery' : 'Online (simulated)'} ·{' '}
            <span className="capitalize">{order.payment.status}</span>
          </p>
          <p className="text-xs">Ref: {order.payment.transactionRef}</p>
        </CardContent>
      </Card>
    </div>
  )
}
