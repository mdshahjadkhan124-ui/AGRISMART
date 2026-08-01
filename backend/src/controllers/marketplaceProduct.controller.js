const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const service = require('../services/marketplaceProduct.service');

const listPublicProducts = asyncHandler(async (req, res) => {
  const { items, meta } = await service.listPublicProducts(req.query);
  res.status(200).json(new ApiResponse(200, { products: items }, 'Success', meta));
});

const getPublicProduct = asyncHandler(async (req, res) => {
  const product = await service.getPublicProduct(req.params.id);
  res.status(200).json(new ApiResponse(200, { product }));
});

const listMyProducts = asyncHandler(async (req, res) => {
  const { items, meta } = await service.listMyProducts(req.user.id, req.query);
  res.status(200).json(new ApiResponse(200, { products: items }, 'Success', meta));
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await service.createProduct(req.user.id, req.body, req.file);
  res.status(201).json(new ApiResponse(201, { product }, 'Product listed'));
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await service.updateProduct(req.params.id, req.user.id, req.body, req.file);
  res.status(200).json(new ApiResponse(200, { product }, 'Product updated'));
});

const deleteProduct = asyncHandler(async (req, res) => {
  await service.deleteProduct(req.params.id, req.user.id);
  res.status(200).json(new ApiResponse(200, null, 'Product deleted'));
});

module.exports = { listPublicProducts, getPublicProduct, listMyProducts, createProduct, updateProduct, deleteProduct };
