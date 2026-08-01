const { z } = require('zod');

const chatbotQuerySchema = z.object({
  message: z.string().trim().min(1, 'Message cannot be empty').max(500),
  lang: z.enum(['en', 'hi']).optional(),
});

module.exports = { chatbotQuerySchema };
