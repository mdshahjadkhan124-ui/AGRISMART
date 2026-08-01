const { Router } = require('express');
const controller = require('../controllers/farm.controller');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/roles');
const { createFarmSchema, updateFarmSchema } = require('../validators/farm.validator');
const { addCropHistorySchema } = require('../validators/cropHistory.validator');
const { addSoilReportSchema } = require('../validators/soilReport.validator');
const { addActivitySchema, updateActivitySchema } = require('../validators/farmActivity.validator');

const router = Router();

router.use(authenticate, authorize(ROLES.FARMER));

router.get('/', controller.listFarms);
router.post('/', validate(createFarmSchema), controller.createFarm);
router.get('/:farmId', controller.getFarm);
router.put('/:farmId', validate(updateFarmSchema), controller.updateFarm);
router.delete('/:farmId', controller.deleteFarm);

router.get('/:farmId/crop-history', controller.listCropHistory);
router.post('/:farmId/crop-history', validate(addCropHistorySchema), controller.addCropHistory);

router.get('/:farmId/soil-reports', controller.listSoilReports);
router.get('/:farmId/soil-reports/latest', controller.getLatestSoilReport);
router.post('/:farmId/soil-reports', validate(addSoilReportSchema), controller.addSoilReport);

router.get('/:farmId/activities', controller.listActivities);
router.post('/:farmId/activities', validate(addActivitySchema), controller.addActivity);
router.put('/:farmId/activities/:activityId', validate(updateActivitySchema), controller.updateActivity);
router.delete('/:farmId/activities/:activityId', controller.deleteActivity);

module.exports = router;
