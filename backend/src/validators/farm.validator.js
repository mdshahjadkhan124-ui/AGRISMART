const { z } = require('zod');

const SOIL_TYPES = ['alluvial', 'black', 'red', 'laterite', 'arid', 'saline', 'peaty', 'forest', 'other'];
const IRRIGATION_TYPES = ['canal', 'borewell', 'drip', 'sprinkler', 'rainfed', 'other'];

const locationSchema = z
  .object({
    lat: z.coerce.number().min(-90).max(90).optional(),
    lng: z.coerce.number().min(-180).max(180).optional(),
    address: z.string().trim().max(200).optional(),
  })
  .optional();

const createFarmSchema = z.object({
  name: z.string().trim().min(1, 'Farm name is required').max(100),
  areaAcres: z.coerce.number().positive('Area must be greater than 0'),
  soilType: z.enum(SOIL_TYPES).optional(),
  irrigationType: z.enum(IRRIGATION_TYPES).optional(),
  location: locationSchema,
});

const updateFarmSchema = createFarmSchema.partial();

module.exports = { createFarmSchema, updateFarmSchema };
