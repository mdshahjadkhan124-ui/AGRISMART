const mongoose = require('mongoose');

// Functional-level payment simulation — no real payment gateway is
// integrated. "mock_online" payments are marked successful immediately;
// "cod" (cash on delivery) stays pending until the seller marks the order
// delivered. See services/marketplaceOrder.service.js.
const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      unique: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amountInr: { type: Number, required: true, min: 0 },
    method: { type: String, enum: ['cod', 'mock_online'], required: true },
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
    transactionRef: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
