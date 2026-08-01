const { Router } = require('express');
const controller = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const { authLimiter } = require('../middleware/rateLimiters');
const {
  registerSchema,
  loginSchema,
  googleLoginSchema,
  otpRequestSchema,
  otpVerifySchema,
} = require('../validators/auth.validator');

const router = Router();

router.use(authLimiter);

router.post('/register', validate(registerSchema), controller.register);
router.post('/login', validate(loginSchema), controller.login);
router.post('/refresh', controller.refresh);
router.post('/logout', controller.logout);
router.get('/me', authenticate, controller.me);

router.post('/google', validate(googleLoginSchema), controller.googleLogin);
router.post('/otp/request', validate(otpRequestSchema), controller.requestOtp);
router.post('/otp/verify', validate(otpVerifySchema), controller.verifyOtp);

module.exports = router;
