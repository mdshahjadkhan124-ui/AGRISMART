const { Router } = require('express');
const controller = require('../controllers/marketplaceProduct.controller');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const upload = require('../middleware/upload');
const { ROLES } = require('../config/roles');
const { createProductSchema, updateProductSchema } = require('../validators/marketplaceProduct.validator');

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /marketplace/products:
 *   get:
 *     tags: [Marketplace Products]
 *     summary: Browse active product listings
 *     parameters:
 *       - { name: category, in: query, schema: { type: string, enum: [seeds, fertilizers, pesticides, tools, machinery, other] } }
 *       - { name: search, in: query, schema: { type: string } }
 *       - { name: page, in: query, schema: { type: integer } }
 *       - { name: limit, in: query, schema: { type: integer } }
 *     responses:
 *       200: { description: Products }
 *   post:
 *     tags: [Marketplace Products]
 *     summary: List a new product (seller only)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, priceInr, stockQuantity]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               category: { type: string, enum: [seeds, fertilizers, pesticides, tools, machinery, other] }
 *               priceInr: { type: number }
 *               unit: { type: string }
 *               stockQuantity: { type: number }
 *               image: { type: string, format: binary, description: Optional }
 *     responses:
 *       201: { description: Product listed }
 */
router.get('/', controller.listPublicProducts);

/**
 * @openapi
 * /marketplace/products/mine:
 *   get:
 *     tags: [Marketplace Products]
 *     summary: List the current seller's own products (active and inactive)
 *     responses:
 *       200: { description: Products }
 */
router.get('/mine', authorize(ROLES.SELLER), controller.listMyProducts);
router.post('/', authorize(ROLES.SELLER), upload.single('image'), validate(createProductSchema), controller.createProduct);

/**
 * @openapi
 * /marketplace/products/{id}:
 *   get:
 *     tags: [Marketplace Products]
 *     summary: Get one active product
 *     parameters: [{ name: id, in: path, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: Product }
 *       404: { description: Not found or inactive }
 *   put:
 *     tags: [Marketplace Products]
 *     summary: Update a product (must be owned by the caller)
 *     parameters: [{ name: id, in: path, required: true, schema: { type: string } }]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema: { type: object }
 *     responses:
 *       200: { description: Product updated }
 *       403: { description: Not your product }
 *   delete:
 *     tags: [Marketplace Products]
 *     summary: Delete a product (must be owned by the caller)
 *     parameters: [{ name: id, in: path, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: Product deleted }
 *       403: { description: Not your product }
 */
router.get('/:id', controller.getPublicProduct);
router.put('/:id', authorize(ROLES.SELLER), upload.single('image'), validate(updateProductSchema), controller.updateProduct);
router.delete('/:id', authorize(ROLES.SELLER), controller.deleteProduct);

module.exports = router;
