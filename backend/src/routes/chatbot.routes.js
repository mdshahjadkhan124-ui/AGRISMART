const { Router } = require('express');
const controller = require('../controllers/chatbot.controller');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const { chatbotQuerySchema } = require('../validators/chatbot.validator');

const router = Router();

/**
 * @openapi
 * /chatbot/query:
 *   post:
 *     tags: [Chatbot]
 *     summary: Ask the FAQ chatbot a question
 *     description: Pure keyword-overlap matching against a curated Hindi/English Q&A set — no LLM/AI generation.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message: { type: string }
 *               lang: { type: string, enum: [en, hi], default: en }
 *     responses:
 *       200:
 *         description: Best-matching answer, or a fallback if nothing matched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     matched: { type: boolean }
 *                     id: { type: string, nullable: true }
 *                     answer: { type: string }
 */
router.post('/query', authenticate, validate(chatbotQuerySchema), controller.query);

module.exports = router;
