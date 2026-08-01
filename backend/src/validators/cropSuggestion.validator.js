const { z } = require('zod');

const cropSuggestionSchema = z.object({
  n: z.coerce.number().min(0, 'Nitrogen must be 0 or greater'),
  p: z.coerce.number().min(0, 'Phosphorus must be 0 or greater'),
  k: z.coerce.number().min(0, 'Potassium must be 0 or greater'),
  temperature: z.coerce.number().min(-10).max(60, 'Temperature must be a realistic value in °C'),
  humidity: z.coerce.number().min(0).max(100, 'Humidity must be between 0 and 100%'),
  ph: z.coerce.number().min(0).max(14, 'pH must be between 0 and 14'),
  rainfall: z.coerce.number().min(0, 'Rainfall must be 0 or greater'),
  farmId: z.string().trim().optional(),
});

module.exports = { cropSuggestionSchema };
