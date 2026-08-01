const { z } = require('zod');

const addSoilReportSchema = z.object({
  nitrogen: z.coerce.number().min(0, 'Nitrogen must be 0 or greater'),
  phosphorus: z.coerce.number().min(0, 'Phosphorus must be 0 or greater'),
  potassium: z.coerce.number().min(0, 'Potassium must be 0 or greater'),
  ph: z.coerce.number().min(0).max(14, 'pH must be between 0 and 14'),
  organicCarbon: z.coerce.number().min(0).max(100).optional(),
  moisturePercent: z.coerce.number().min(0).max(100).optional(),
  testedAt: z.coerce.date().optional(),
});

module.exports = { addSoilReportSchema };
