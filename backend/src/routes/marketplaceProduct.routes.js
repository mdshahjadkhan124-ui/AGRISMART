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

router.get('/', controller.listPublicProducts);
router.get('/mine', authorize(ROLES.SELLER), controller.listMyProducts);
router.post('/', authorize(ROLES.SELLER), upload.single('image'), validate(createProductSchema), controller.createProduct);
router.get('/:id', controller.getPublicProduct);
router.put('/:id', authorize(ROLES.SELLER), upload.single('image'), validate(updateProductSchema), controller.updateProduct);
router.delete('/:id', authorize(ROLES.SELLER), controller.deleteProduct);

module.exports = router;
