const { Router } = require('express');
const controller = require('../controllers/analytics.controller');
const authenticate = require('../middleware/authenticate');

const router = Router();

/**
 * @openapi
 * /analytics/me:
 *   get:
 *     tags: [Analytics]
 *     summary: Get analytics for the current user, shaped by their role
 *     description: >
 *       Farmer: farm/order/appointment counts, soil health trend, disease report status breakdown.
 *       Expert: appointment status breakdown, reports resolved.
 *       Seller: product count, order status breakdown, delivered revenue.
 *       Officer: region-wide farmer/farm counts, disease report status breakdown.
 *       Gov admin: scheme counts by category.
 *       Super admin: platform-wide totals, users by role, revenue.
 *     responses:
 *       200:
 *         description: Role-shaped analytics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     role: { type: string }
 *                     data: { type: object }
 */
router.get('/me', authenticate, controller.getMyAnalytics);

module.exports = router;
