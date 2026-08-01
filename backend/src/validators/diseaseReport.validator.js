const { z } = require('zod');

const createReportSchema = z.object({
  cropName: z.string().trim().min(1, 'Crop name is required').max(100),
  symptoms: z.string().trim().min(1, 'Please describe what you are seeing').max(1000),
  farmId: z.string().trim().optional(),
});

const respondSchema = z.object({
  diagnosis: z.string().trim().min(1, 'Diagnosis is required').max(1000),
  treatment: z.string().trim().min(1, 'Treatment advice is required').max(1000),
});

module.exports = { createReportSchema, respondSchema };
