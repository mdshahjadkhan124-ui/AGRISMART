import { useSellerOrders, useUpdateOrderStatus } from '@/features/orders/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const statusVariant = {
  pending: 'secondary',
  paid: 'default',
  shipped: 'default',
  delivered: 'default',
  cancelled: 'destructive',
}

const NEXT_STATUS = {
  pending: 'shipped',
  paid: 'shipped',
  shipped: 'delivered',
}

function OrderActions({ order }) {
  const updateStatus = useUpdateOrderStatus()
  const next = NEXT_STATUS[order.status]

  if (!next) return null

  return (
    <div className="flex gap-2">
      <Button size="sm" onClick={() => updateStatus.mutate({ id: order._id, status: next })} disabled={updateStatus.isPending}>
        Mark {next}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => updateStatus.mutate({ id: order._id, status: 'cancelled' })}
        disabled={updateStatus.isPending}
      >
        Cancel
      </Button>
    </div>
  )
}

export default function SellerOrdersPage() {
  const { data: orders, isLoading } = useSellerOrders()

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold">Orders</h1>

      {isLoading && <p className="text-muted-foreground text-sm">Loading orders…</p>}
      {orders && orders.length === 0 && <p className="text-muted-foreground text-sm">No orders yet.</p>}

      <div className="flex flex-col gap-3">
        {orders?.map((order) => {
          const buyer = typeof order.buyer === 'object' ? order.buyer : null
          return (
            <Card key={order._id}>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base">₹{order.totalAmountInr} {buyer && `· ${buyer.name}`}</CardTitle>
                <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm">
                <div className="text-muted-foreground">
                  {order.items.map((item) => (
                    <p key={item.product}>
                      {item.name} × {item.quantity}
                    </p>
                  ))}
                  <p className="mt-1">Ship to: {order.shippingAddress}</p>
                  <p>
                    Payment: {order.payment.method === 'cod' ? 'COD' : 'Online'} · {order.payment.status}
                  </p>
                </div>
                <OrderActions order={order} />
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
