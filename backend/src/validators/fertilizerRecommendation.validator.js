const { z } = require('zod');

const fertilizerRecommendationSchema = z
  .object({
    farmId: z.string().trim().optional(),
    nitrogen: z.coerce.number().min(0).optional(),
    phosphorus: z.coerce.number().min(0).optional(),
    potassium: z.coerce.number().min(0).optional(),
    ph: z.coerce.number().min(0).max(14).optional(),
  })
  .refine(
    (data) => Boolean(data.farmId) || [data.nitrogen, data.phosphorus, data.potassium, data.ph].every((v) => v != null),
    { message: 'Provide either a farmId (to use its latest soil report) or nitrogen, phosphorus, potassium, and ph directly.' }
  );

module.exports = { fertilizerRecommendationSchema };
