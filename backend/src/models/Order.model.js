const mongoose = require('mongoose');

// An order is scoped to a single seller — checkout validates that every
// item in the cart belongs to the same seller, which keeps fulfillment
// ownership (and RBAC) unambiguous. A buyer with items from two sellers
// simply places two orders.
const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: [
      {
        _id: false,
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'MarketplaceProduct', required: true },
        name: { type: String, required: true },
        priceInr: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        subtotalInr: { type: Number, required: true },
      },
    ],
    totalAmountInr: { type: Number, required: true, min: 0 },
    shippingAddress: { type: String, required: true, trim: true, maxlength: 300 },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
