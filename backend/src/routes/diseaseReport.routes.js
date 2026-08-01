const { Router } = require('express');
const controller = require('../controllers/diseaseReport.controller');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const upload = require('../middleware/upload');
const { ROLES } = require('../config/roles');
const { createReportSchema, respondSchema } = require('../validators/diseaseReport.validator');

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize(ROLES.FARMER),
  upload.single('image'),
  validate(createReportSchema),
  controller.createReport
);
router.get('/', authorize(ROLES.FARMER), controller.listMyReports);

router.get('/queue', authorize(ROLES.EXPERT, ROLES.SUPER_ADMIN), controller.listQueue);
router.put('/:id/respond', authorize(ROLES.EXPERT, ROLES.SUPER_ADMIN), validate(respondSchema), controller.respondToReport);

router.get('/:id', authorize(ROLES.FARMER), controller.getMyReport);

module.exports = router;
