const { z } = require('zod');

const weatherQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
  farmId: z.string().trim().optional(),
});

module.exports = { weatherQuerySchema };
