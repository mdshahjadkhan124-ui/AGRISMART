const swaggerJsdoc = require('swagger-jsdoc');
const env = require('./env');

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AgriSmart API',
      version: '1.0.0',
      description: 'Smart Crop Advisory System — REST API',
    },
    servers: [{ url: `http://localhost:${env.port}/api/v1` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
  apis: ['./src/routes/*.js'],
});

module.exports = swaggerSpec;
