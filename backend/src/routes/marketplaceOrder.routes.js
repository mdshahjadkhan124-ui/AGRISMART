const { Router } = require('express');
const controller = require('../controllers/marketplaceOrder.controller');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/roles');
const { createOrderSchema, updateOrderStatusSchema } = require('../validators/marketplaceOrder.validator');

const router = Router();

router.use(authenticate);

router.post('/', authorize(ROLES.FARMER), validate(createOrderSchema), controller.createOrder);
router.get('/', authorize(ROLES.FARMER), controller.listMyOrders);
router.get('/seller', authorize(ROLES.SELLER), controller.listSellerOrders);
router.get('/:id', authorize(ROLES.FARMER), controller.getMyOrder);
router.put('/:id/status', authorize(ROLES.SELLER), validate(updateOrderStatusSchema), controller.updateOrderStatus);

module.exports = router;
