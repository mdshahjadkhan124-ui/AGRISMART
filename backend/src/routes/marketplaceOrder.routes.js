const { Router } = require('express');
const controller = require('../controllers/marketplaceOrder.controller');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/roles');
const { createOrderSchema, updateOrderStatusSchema } = require('../validators/marketplaceOrder.validator');

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /marketplace/orders:
 *   post:
 *     tags: [Marketplace Orders]
 *     summary: Place an order (farmer only) — simulated payment, no real gateway
 *     description: >
 *       All items must belong to the same seller. Stock is reserved atomically per item with
 *       rollback if a later item is unavailable. "mock_online" payments are marked successful
 *       immediately; "cod" stays pending until the seller marks the order delivered.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items, shippingAddress, paymentMethod]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [productId, quantity]
 *                   properties: { productId: { type: string }, quantity: { type: integer, minimum: 1 } }
 *               shippingAddress: { type: string }
 *               paymentMethod: { type: string, enum: [cod, mock_online] }
 *     responses:
 *       201: { description: Order placed; seller is notified }
 *       400: { description: Items from more than one seller, or insufficient stock }
 *   get:
 *     tags: [Marketplace Orders]
 *     summary: List the current farmer's own orders
 *     parameters:
 *       - { name: page, in: query, schema: { type: integer } }
 *       - { name: limit, in: query, schema: { type: integer } }
 *     responses:
 *       200: { description: Orders }
 */
router.post('/', authorize(ROLES.FARMER), validate(createOrderSchema), controller.createOrder);
router.get('/', authorize(ROLES.FARMER), controller.listMyOrders);

/**
 * @openapi
 * /marketplace/orders/seller:
 *   get:
 *     tags: [Marketplace Orders]
 *     summary: List orders placed against the current seller's products
 *     parameters:
 *       - { name: page, in: query, schema: { type: integer } }
 *       - { name: limit, in: query, schema: { type: integer } }
 *     responses:
 *       200: { description: Orders }
 */
router.get('/seller', authorize(ROLES.SELLER), controller.listSellerOrders);

/**
 * @openapi
 * /marketplace/orders/{id}:
 *   get:
 *     tags: [Marketplace Orders]
 *     summary: Get one of the current farmer's own orders
 *     parameters: [{ name: id, in: path, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: Order }
 *       404: { description: Not found (or not yours) }
 */
router.get('/:id', authorize(ROLES.FARMER), controller.getMyOrder);

/**
 * @openapi
 * /marketplace/orders/{id}/status:
 *   put:
 *     tags: [Marketplace Orders]
 *     summary: Update fulfillment status (must be the order's seller)
 *     description: Cancelling restores reserved stock. Marking a COD order "delivered" also marks its payment successful.
 *     parameters: [{ name: id, in: path, required: true, schema: { type: string } }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties: { status: { type: string, enum: [shipped, delivered, cancelled] } }
 *     responses:
 *       200: { description: Order updated; buyer is notified }
 *       409: { description: Order already delivered or cancelled }
 */
router.put('/:id/status', authorize(ROLES.SELLER), validate(updateOrderStatusSchema), controller.updateOrderStatus);

module.exports = router;
