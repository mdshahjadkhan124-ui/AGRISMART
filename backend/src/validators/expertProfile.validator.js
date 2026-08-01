const { z } = require('zod');

const upsertExpertProfileSchema = z.object({
  specialization: z.string().trim().max(100).optional(),
  qualifications: z.string().trim().max(300).optional(),
  experienceYears: z.coerce.number().min(0).max(80).optional(),
  bio: z.string().trim().max(500).optional(),
  consultationFeeInr: z.coerce.number().min(0).optional(),
  isAvailable: z.coerce.boolean().optional(),
});

module.exports = { upsertExpertProfileSchema };
