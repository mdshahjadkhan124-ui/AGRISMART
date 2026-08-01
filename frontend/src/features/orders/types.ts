export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentMethod = 'cod' | 'mock_online'

export interface OrderItem {
  product: string
  name: string
  priceInr: number
  quantity: number
  subtotalInr: number
}

export interface Payment {
  _id: string
  amountInr: number
  method: PaymentMethod
  status: 'pending' | 'success' | 'failed'
  transactionRef: string
}

export interface Order {
  _id: string
  buyer: string | { _id: string; name: string; email: string }
  seller: string
  items: OrderItem[]
  totalAmountInr: number
  shippingAddress: string
  status: OrderStatus
  payment: Payment
  createdAt: string
}

export interface CreateOrderInput {
  items: { productId: string; quantity: number }[]
  shippingAddress: string
  paymentMethod: PaymentMethod
}
