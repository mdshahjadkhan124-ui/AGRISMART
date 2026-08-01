const { z } = require('zod');

const bookAppointmentSchema = z.object({
  expertId: z.string().trim().min(1, 'expertId is required'),
  requestedDate: z.coerce.date(),
  meetingType: z.enum(['chat', 'audio', 'video']).optional(),
  reason: z.string().trim().min(1, 'Please describe what you need help with').max(1000),
});

const updateStatusSchema = z.object({
  status: z.enum(['confirmed', 'rejected', 'completed', 'cancelled']),
  expertNotes: z.string().trim().max(1000).optional(),
});

module.exports = { bookAppointmentSchema, updateStatusSchema };
