const MarketplaceProduct = require('../models/MarketplaceProduct.model');
const ApiError = require('../utils/ApiError');
const imageUploadService = require('./imageUpload.service');
const { getPagination, buildMeta } = require('../utils/pagination');

async function getOwnedProduct(productId, sellerId) {
  const product = await MarketplaceProduct.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');
  if (product.seller.toString() !== sellerId) throw new ApiError(403, 'You do not have access to this product');
  return product;
}

async function createProduct(sellerId, data, file) {
  let imageUrl = '';
  if (file) {
    const uploadResult = await imageUploadService.uploadBuffer(file.buffer, 'agrismart/marketplace');
    imageUrl = uploadResult.secure_url;
  }
  return MarketplaceProduct.create({ ...data, seller: sellerId, imageUrl });
}

async function listMyProducts(sellerId, query) {
  const { page, limit, skip } = getPagination(query);
  const [items, total] = await Promise.all([
    MarketplaceProduct.find({ seller: sellerId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    MarketplaceProduct.countDocuments({ seller: sellerId }),
  ]);
  return { items, meta: buildMeta({ page, limit }, total) };
}

async function updateProduct(productId, sellerId, data, file) {
  const product = await getOwnedProduct(productId, sellerId);
  if (file) {
    const uploadResult = await imageUploadService.uploadBuffer(file.buffer, 'agrismart/marketplace');
    data.imageUrl = uploadResult.secure_url;
  }
  Object.assign(product, data);
  await product.save();
  return product;
}

async function deleteProduct(productId, sellerId) {
  await getOwnedProduct(productId, sellerId);
  await MarketplaceProduct.deleteOne({ _id: productId });
}

// Public browse: active listings only, optional category filter and text
// search over name/description.
async function listPublicProducts(query) {
  const { page, limit, skip } = getPagination(query);
  const filter = { isActive: true };
  if (query.category) filter.category = query.category;
  if (query.search) filter.$text = { $search: query.search };

  const [items, total] = await Promise.all([
    MarketplaceProduct.find(filter)
      .populate('seller', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    MarketplaceProduct.countDocuments(filter),
  ]);

  return { items, meta: buildMeta({ page, limit }, total) };
}

async function getPublicProduct(productId) {
  const product = await MarketplaceProduct.findOne({ _id: productId, isActive: true }).populate('seller', 'name');
  if (!product) throw new ApiError(404, 'Product not found');
  return product;
}

module.exports = {
  getOwnedProduct,
  createProduct,
  listMyProducts,
  updateProduct,
  deleteProduct,
  listPublicProducts,
  getPublicProduct,
};
