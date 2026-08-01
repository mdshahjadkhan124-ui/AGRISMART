const { z } = require('zod');
const { ROLE_VALUES } = require('../config/roles');

const updateRoleSchema = z.object({
  role: z.enum(ROLE_VALUES),
});

const updateStatusSchema = z.object({
  isActive: z.coerce.boolean(),
});

module.exports = { updateRoleSchema, updateStatusSchema };
