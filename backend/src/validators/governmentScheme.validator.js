const { z } = require('zod');

const CATEGORIES = ['subsidy', 'loan', 'insurance', 'training', 'equipment', 'other'];

const createSchemeSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  description: z.string().trim().min(1, 'Description is required').max(2000),
  category: z.enum(CATEGORIES).optional(),
  eligibility: z.string().trim().max(1000).optional(),
  state: z.string().trim().max(100).optional(),
  applicationLink: z.string().trim().max(500).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

const updateSchemeSchema = createSchemeSchema.partial().extend({
  isActive: z.coerce.boolean().optional(),
});

module.exports = { createSchemeSchema, updateSchemeSchema };
