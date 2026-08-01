const { Router } = require('express');
const { getHealth } = require('../controllers/health.controller');

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Check API and database status
 *     security: []
 *     responses:
 *       200:
 *         description: Service is up
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     uptimeSeconds: { type: integer }
 *                     database: { type: string, enum: [connected, connecting, disconnected, disconnecting] }
 *                     timestamp: { type: string, format: date-time }
 */
router.get('/', getHealth);

module.exports = router;
