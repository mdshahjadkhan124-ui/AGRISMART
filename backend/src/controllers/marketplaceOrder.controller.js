const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const service = require('../services/marketplaceOrder.service');

const createOrder = asyncHandler(async (req, res) => {
  const order = await service.createOrder(req.user.id, req.body);
  res.status(201).json(new ApiResponse(201, { order }, 'Order placed'));
});

const listMyOrders = asyncHandler(async (req, res) => {
  const { items, meta } = await service.listMyOrders(req.user.id, req.query);
  res.status(200).json(new ApiResponse(200, { orders: items }, 'Success', meta));
});

const getMyOrder = asyncHandler(async (req, res) => {
  const order = await service.getMyOrder(req.user.id, req.params.id);
  res.status(200).json(new ApiResponse(200, { order }));
});

const listSellerOrders = asyncHandler(async (req, res) => {
  const { items, meta } = await service.listSellerOrders(req.user.id, req.query);
  res.status(200).json(new ApiResponse(200, { orders: items }, 'Success', meta));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await service.updateOrderStatus(req.user.id, req.params.id, req.body.status);
  res.status(200).json(new ApiResponse(200, { order }, 'Order updated'));
});

module.exports = { createOrder, listMyOrders, getMyOrder, listSellerOrders, updateOrderStatus };
