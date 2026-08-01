const swaggerJsdoc = require('swagger-jsdoc');
const env = require('./env');

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AgriSmart API',
      version: '1.0.0',
      description:
        'Smart Crop Advisory System — REST API. Every advisory feature (crop suggestion, fertilizer ' +
        'recommendation, disease review, the FAQ chatbot) is rule-based/manual-review — there is no AI/ML ' +
        'anywhere in this API.',
    },
    servers: [{ url: `http://localhost:${env.port}/api/v1` }],
    tags: [
      { name: 'Health', description: 'Service and database status' },
      { name: 'Auth', description: 'Registration, login, session refresh, Google OAuth and OTP (config-gated)' },
      { name: 'Farmer Profile', description: "A farmer's own profile" },
      { name: 'Farms', description: 'Farm CRUD and nested crop history / soil reports / activity diary' },
      { name: 'Weather', description: 'OpenWeather current conditions and forecast (config-gated)' },
      { name: 'Crop Suggestion', description: 'Rule-based crop suitability matching' },
      { name: 'Fertilizer Recommendation', description: 'Rule-based nutrient/pH to fertilizer mapping' },
      { name: 'Disease Reports', description: 'Farmer submission + expert manual review queue (no image classifier)' },
      { name: 'Experts', description: 'Expert directory and self-service profile' },
      { name: 'Appointments', description: 'Consultation booking, chat, and the video/audio call placeholder' },
      { name: 'Marketplace Products', description: 'Seller listings and public browse' },
      { name: 'Marketplace Orders', description: 'Checkout (simulated payment) and fulfillment' },
      { name: 'Government Schemes', description: 'Public browse + gov admin / super admin management' },
      { name: 'Notifications', description: "A user's notification inbox" },
      { name: 'Chatbot', description: 'Rule-based Hindi/English FAQ matching — no LLM generation' },
      { name: 'Analytics', description: 'Role-specific dashboard data' },
      { name: 'Admin', description: 'Super Admin only: user management and audit logs' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        ApiErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            statusCode: { type: 'integer', example: 400 },
            message: { type: 'string', example: 'Validation failed' },
            details: { type: 'array', items: { type: 'string' } },
          },
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 20 },
            total: { type: 'integer', example: 42 },
            totalPages: { type: 'integer', example: 3 },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
});

module.exports = swaggerSpec;
