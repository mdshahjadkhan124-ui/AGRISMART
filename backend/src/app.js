const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');

const env = require('./config/env');
const logger = require('./config/logger');
const swaggerSpec = require('./config/swagger');
const { corsOrigin } = require('./config/cors');
const apiRoutes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

if (env.nodeEnv !== 'test') {
  app.use(
    morgan(env.nodeEnv === 'production' ? 'combined' : 'dev', {
      stream: { write: (msg) => logger.http(msg.trim()) },
    })
  );
}

// General API rate limit; stricter limits are layered on top of this for
// sensitive routes like /auth. Relaxed under the test suite, which
// legitimately makes far more than 300 requests per run.
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: env.nodeEnv === 'test' ? 100000 : 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use('/api/v1', apiRoutes);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
