const { z } = require('zod');

const addCropHistorySchema = z.object({
  cropName: z.string().trim().min(1, 'Crop name is required').max(100),
  season: z.enum(['kharif', 'rabi', 'zaid', 'perennial']),
  sowingDate: z.coerce.date().optional(),
  harvestDate: z.coerce.date().optional(),
  yieldQuantityKg: z.coerce.number().min(0).optional(),
  notes: z.string().trim().max(500).optional(),
});

module.exports = { addCropHistorySchema };
