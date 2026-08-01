const { z } = require('zod');

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().trim().min(1),
        quantity: z.coerce.number().int().positive('Quantity must be at least 1'),
      })
    )
    .min(1, 'Add at least one item to order'),
  shippingAddress: z.string().trim().min(1, 'Shipping address is required').max(300),
  paymentMethod: z.enum(['cod', 'mock_online']),
});

const updateOrderStatusSchema = z.object({
  status: z.enum(['shipped', 'delivered', 'cancelled']),
});

module.exports = { createOrderSchema, updateOrderStatusSchema };
