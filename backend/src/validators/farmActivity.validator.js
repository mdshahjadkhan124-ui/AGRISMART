const { z } = require('zod');

const ACTIVITY_TYPES = [
  'sowing',
  'irrigation',
  'fertilizing',
  'pesticide_spray',
  'weeding',
  'harvesting',
  'soil_testing',
  'other',
];

const addActivitySchema = z.object({
  activityType: z.enum(ACTIVITY_TYPES),
  title: z.string().trim().min(1, 'Title is required').max(150),
  description: z.string().trim().max(1000).optional(),
  date: z.coerce.date().optional(),
  costInr: z.coerce.number().min(0).optional(),
});

const updateActivitySchema = addActivitySchema.partial();

module.exports = { addActivitySchema, updateActivitySchema };
