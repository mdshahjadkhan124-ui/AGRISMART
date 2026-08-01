const { z } = require('zod');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: passwordSchema,
  phone: z.string().trim().min(7).max(20).optional(),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const googleLoginSchema = z.object({
  idToken: z.string().min(1, 'idToken is required'),
});

const otpRequestSchema = z.object({
  phone: z.string().trim().min(7).max(20),
});

const otpVerifySchema = z.object({
  phone: z.string().trim().min(7).max(20),
  code: z.string().trim().min(4).max(10),
});

module.exports = { registerSchema, loginSchema, googleLoginSchema, otpRequestSchema, otpVerifySchema };
