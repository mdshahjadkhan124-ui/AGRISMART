const { Router } = require('express');
const controller = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const { authLimiter } = require('../middleware/rateLimiters');
const { registerSchema, loginSchema, googleLoginSchema } = require('../validators/auth.validator');

const router = Router();

router.use(authLimiter);

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new account (always created as a farmer)
 *     description: A client can never self-assign a privileged role — the `role` field, if sent, is ignored server-side.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, minLength: 2 }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 8, description: 'Must contain at least one letter and one number' }
 *               phone: { type: string }
 *     responses:
 *       201: { description: Account created, refresh cookie set }
 *       400: { description: Validation failed, content: { application/json: { schema: { $ref: '#/components/schemas/ApiErrorResponse' } } } }
 *       409: { description: Email already registered }
 */
router.post('/register', validate(registerSchema), controller.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in with email and password
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200: { description: Logged in, refresh cookie set }
 *       401: { description: Invalid email or password }
 */
router.post('/login', validate(loginSchema), controller.login);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Rotate the refresh cookie and issue a new access token
 *     security: []
 *     responses:
 *       200: { description: Session refreshed }
 *       401: { description: Missing, invalid, expired, or reused refresh token }
 */
router.post('/refresh', controller.refresh);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Revoke the current refresh token and clear the cookie
 *     security: []
 *     responses:
 *       200: { description: Logged out }
 */
router.post('/logout', controller.logout);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get the current authenticated user
 *     responses:
 *       200: { description: Current user }
 *       401: { description: Missing or invalid access token }
 */
router.get('/me', authenticate, controller.me);

/**
 * @openapi
 * /auth/google:
 *   post:
 *     tags: [Auth]
 *     summary: Log in or register via a Google ID token
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idToken]
 *             properties: { idToken: { type: string } }
 *     responses:
 *       200: { description: Logged in with Google }
 *       401: { description: Invalid Google token }
 *       501: { description: Google OAuth not configured (GOOGLE_CLIENT_ID missing) }
 */
router.post('/google', validate(googleLoginSchema), controller.googleLogin);

module.exports = router;
