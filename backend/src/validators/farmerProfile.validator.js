const { z } = require('zod');

const upsertProfileSchema = z.object({
  address: z.string().trim().max(200).optional(),
  state: z.string().trim().max(100).optional(),
  district: z.string().trim().max(100).optional(),
  village: z.string().trim().max(100).optional(),
  pincode: z.string().trim().max(10).optional(),
  farmingExperienceYears: z.coerce.number().min(0).max(100).optional(),
  preferredLanguage: z.enum(['en', 'hi']).optional(),
  bio: z.string().trim().max(500).optional(),
});

module.exports = { upsertProfileSchema };
