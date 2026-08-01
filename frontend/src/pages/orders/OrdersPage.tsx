import { Link } from 'react-router-dom'
import { useMyOrders } from '@/features/orders/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { OrderStatus } from '@/features/orders/types'

const statusVariant: Record<OrderStatus, 'secondary' | 'default' | 'destructive'> = {
  pending: 'secondary',
  paid: 'default',
  shipped: 'default',
  delivered: 'default',
  cancelled: 'destructive',
}

export default function OrdersPage() {
  const { data: orders, isLoading } = useMyOrders()

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold">My Orders</h1>

      {isLoading && <p className="text-muted-foreground text-sm">Loading orders…</p>}
      {orders && orders.length === 0 && <p className="text-muted-foreground text-sm">No orders yet.</p>}

      <div className="flex flex-col gap-3">
        {orders?.map((order) => (
          <Link key={order._id} to={`/orders/${order._id}`}>
            <Card className="hover:border-primary transition-colors">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base">₹{order.totalAmountInr}</CardTitle>
                <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                {order.items.length} item{order.items.length > 1 ? 's' : ''} · {new Date(order.createdAt).toLocaleDateString()}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
