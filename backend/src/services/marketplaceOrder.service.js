const crypto = require('crypto');
const MarketplaceProduct = require('../models/MarketplaceProduct.model');
const Order = require('../models/Order.model');
const Payment = require('../models/Payment.model');
const ApiError = require('../utils/ApiError');
const notificationService = require('./notification.service');
const { getPagination, buildMeta } = require('../utils/pagination');

function generateTransactionRef() {
  return `MOCK-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
}

// Simulated checkout — no real payment gateway. "mock_online" is marked
// paid/successful immediately; "cod" stays pending until the seller marks
// the order delivered. Stock is reserved atomically per item, with a
// best-effort rollback if a later item in the cart turns out unavailable.
async function createOrder(buyerId, { items, shippingAddress, paymentMethod }) {
  const productIds = items.map((i) => i.productId);
  const products = await MarketplaceProduct.find({ _id: { $in: productIds }, isActive: true });

  if (products.length !== new Set(productIds).size) {
    throw new ApiError(400, 'One or more products are unavailable');
  }

  const sellerIds = new Set(products.map((p) => p.seller.toString()));
  if (sellerIds.size > 1) {
    throw new ApiError(400, 'All items in one order must be from the same seller — place separate orders for different sellers.');
  }

  const productMap = new Map(products.map((p) => [p._id.toString(), p]));
  const reserved = [];

  try {
    for (const { productId, quantity } of items) {
      const updated = await MarketplaceProduct.findOneAndUpdate(
        { _id: productId, stockQuantity: { $gte: quantity } },
        { $inc: { stockQuantity: -quantity } },
        { new: true }
      );
      if (!updated) {
        throw new ApiError(400, `Not enough stock for "${productMap.get(productId)?.name ?? 'a product'}"`);
      }
      reserved.push({ productId, quantity });
    }
  } catch (err) {
    await Promise.all(
      reserved.map((r) => MarketplaceProduct.updateOne({ _id: r.productId }, { $inc: { stockQuantity: r.quantity } }))
    );
    throw err;
  }

  const orderItems = items.map(({ productId, quantity }) => {
    const product = productMap.get(productId);
    return {
      product: product._id,
      name: product.name,
      priceInr: product.priceInr,
      quantity,
      subtotalInr: product.priceInr * quantity,
    };
  });
  const totalAmountInr = orderItems.reduce((sum, i) => sum + i.subtotalInr, 0);

  const order = await Order.create({
    buyer: buyerId,
    seller: products[0].seller,
    items: orderItems,
    totalAmountInr,
    shippingAddress,
    status: paymentMethod === 'mock_online' ? 'paid' : 'pending',
  });

  const payment = await Payment.create({
    order: order._id,
    buyer: buyerId,
    amountInr: totalAmountInr,
    method: paymentMethod,
    status: paymentMethod === 'mock_online' ? 'success' : 'pending',
    transactionRef: generateTransactionRef(),
  });

  order.payment = payment._id;
  await order.save();

  await notificationService.notify({
    userId: order.seller.toString(),
    type: 'order',
    title: 'New order received',
    message: `A new order for ₹${totalAmountInr} was placed.`,
    link: `/seller/orders`,
  });

  return order;
}

async function listMyOrders(buyerId, query) {
  const { page, limit, skip } = getPagination(query);
  const [items, total] = await Promise.all([
    Order.find({ buyer: buyerId }).populate('payment').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments({ buyer: buyerId }),
  ]);
  return { items, meta: buildMeta({ page, limit }, total) };
}

async function getMyOrder(buyerId, orderId) {
  const order = await Order.findOne({ _id: orderId, buyer: buyerId }).populate('payment');
  if (!order) throw new ApiError(404, 'Order not found');
  return order;
}

async function listSellerOrders(sellerId, query) {
  const { page, limit, skip } = getPagination(query);
  const [items, total] = await Promise.all([
    Order.find({ seller: sellerId }).populate('payment').populate('buyer', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments({ seller: sellerId }),
  ]);
  return { items, meta: buildMeta({ page, limit }, total) };
}

async function updateOrderStatus(sellerId, orderId, status) {
  const order = await Order.findOne({ _id: orderId, seller: sellerId }).populate('payment');
  if (!order) throw new ApiError(404, 'Order not found');
  if (['delivered', 'cancelled'].includes(order.status)) {
    throw new ApiError(409, `This order is already "${order.status}" and cannot be updated further`);
  }

  order.status = status;
  await order.save();

  // Cash-on-delivery is only "collected" once the order is actually delivered.
  if (status === 'delivered' && order.payment?.method === 'cod' && order.payment.status === 'pending') {
    order.payment.status = 'success';
    await order.payment.save();
  }

  if (status === 'cancelled') {
    await MarketplaceProduct.bulkWrite(
      order.items.map((item) => ({
        updateOne: { filter: { _id: item.product }, update: { $inc: { stockQuantity: item.quantity } } },
      }))
    );
  }

  await notificationService.notify({
    userId: order.buyer.toString(),
    type: 'order',
    title: 'Order updated',
    message: `Your order is now "${status}".`,
    link: `/orders/${order._id}`,
  });

  return order;
}

module.exports = { createOrder, listMyOrders, getMyOrder, listSellerOrders, updateOrderStatus };
