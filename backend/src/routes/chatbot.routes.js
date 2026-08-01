const { Router } = require('express');
const controller = require('../controllers/chatbot.controller');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const { chatbotQuerySchema } = require('../validators/chatbot.validator');

const router = Router();

router.post('/query', authenticate, validate(chatbotQuerySchema), controller.query);

module.exports = router;
