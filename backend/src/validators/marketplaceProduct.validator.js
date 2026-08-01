const { z } = require('zod');

const CATEGORIES = ['seeds', 'fertilizers', 'pesticides', 'tools', 'machinery', 'other'];

const createProductSchema = z.object({
  name: z.string().trim().min(1, 'Product name is required').max(150),
  description: z.string().trim().max(1000).optional(),
  category: z.enum(CATEGORIES).optional(),
  priceInr: z.coerce.number().positive('Price must be greater than 0'),
  unit: z.string().trim().max(30).optional(),
  stockQuantity: z.coerce.number().min(0, 'Stock cannot be negative'),
});

const updateProductSchema = createProductSchema.partial().extend({
  isActive: z.coerce.boolean().optional(),
});

module.exports = { createProductSchema, updateProductSchema };
