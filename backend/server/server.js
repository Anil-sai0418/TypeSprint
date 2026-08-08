require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const requestIdMiddleware = require('./middleware/requestId.middleware');
const httpLoggerMiddleware = require('./middleware/logger.middleware');
const logger = require('./utils/logger');
const sequelize = require('./config/database');

// Initialize models
require('./models/User');
require('./models/UserProfile');
require('./models/ContributionActivity');
require('./models/ApplicationLike');

const app = express();

// Trust proxy is required when deploying to platforms like Render or Heroku behind load balancers.
app.set('trust proxy', 1);

// Attach Request ID middleware & Pino HTTP Logger Middleware
app.use(requestIdMiddleware);
app.use(httpLoggerMiddleware);

// CORS Configuration - Professional Setup
const allowedOrigins = [
  'https://type-sprint-mauve.vercel.app',
  'https://type-sprint-psi.vercel.app',
  'https://typevex-1.onrender.com',
  'https://typevex.vercel.app',
  process.env.FRONTEND_URL || process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000'
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.indexOf(origin) !== -1 || 
      process.env.NODE_ENV !== 'production' || 
      origin.endsWith('.vercel.app') || 
      origin.endsWith('.onrender.com')
    ) {
      callback(null, true);
    } else {
      logger.warn(`Blocked by CORS: ${origin}`, { origin, category: 'CORS' });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie', 'X-Request-ID'],
  optionsSuccessStatus: 200,
  maxAge: 86400
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Cache-Control Headers Middleware - Prevent stale content on hard refresh
app.use((req, res, next) => {
  // Set cache control headers to ensure fresh content
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate, public, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  next();
});

// Rate Limiter configuration to prevent DDoS and brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Generous limit for development
  handler: (req, res, next, options) => {
    logger.warn('Rate Limit Near / Exceeded', {
      requestId: req.id,
      ip: req.ip,
      route: req.originalUrl
    });
    res.status(options.statusCode).send(options.message);
  },
  message: { success: false, message: "Too many requests from this IP, please try again later." },
});

// Security and Performance Middleware
// Apply rate limiter globally
app.use(limiter);
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, // Disable for easier frontend integration if needed
}));
app.use(compression()); // Compress all responses

// Standard Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Connect to PostgreSQL with Sequelize Sync is handled near bottom
const syncOptions = { force: false };

// Root Route Handler - Home/Status endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 API is running smoothly",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use("/auth", require('./routes/auth'));
app.use("/profile", require('./routes/profile'));
app.use("/typing-test", require('./routes/typingTest'));
app.use("/contribution", require('./routes/contribution'));
app.use("/like", require('./routes/like'));
app.use("/api/v1/notifications", require('./routes/notifications'));
app.use("/notifications", require('./routes/notifications'));
app.use("", require('./routes/utils'));

// Health Check Endpoint
app.get("/health", async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    await sequelize.authenticate();
    dbStatus = 'connected';
  } catch (err) {}

  res.status(200).json({ 
    status: 'up', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus
  });
});

// Production-ready Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  logger.error(err, {
    requestId: req.id,
    route: req.baseUrl ? `${req.baseUrl}${req.path || ''}` : (req.originalUrl || req.url),
    method: req.method,
    userId: req.user?.id || req.user?.email || null,
    statusCode
  });
  
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'An internal server error occurred' : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Start server (Optional Cluster Mode via ENABLE_CLUSTER=true)
const PORT = process.env.PORT || 10000;
const cluster = require('cluster');
const os = require('os');
const enableCluster = process.env.ENABLE_CLUSTER === 'true';

if (enableCluster && cluster.isMaster) {
  const numCPUs = os.cpus().length;
  logger.info(`Master process ${process.pid} is running`, { category: 'SYSTEM', pid: process.pid });
  
  sequelize.sync(syncOptions).then(() => {
    logger.db.connected({ mode: 'Master' });
    logger.info(`Scaling server across ${numCPUs} CPU cores...`, { numCPUs });
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
  }).catch(err => {
    logger.db.queryFailed(err, { context: 'Master DB Sync' });
    process.exit(1);
  });

  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`Worker ${worker.process.pid} died with code ${code}. Restarting...`, { pid: worker.process.pid, code, signal });
    cluster.fork();
  });
} else {
  const startServer = () => {
    const server = app.listen(PORT, () => {
      logger.info('Server Started', {
        port: PORT,
        pid: process.pid,
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
        url: `http://localhost:${PORT}/`
      });
    });

    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received. Shutting down gracefully...');
      server.close(() => {
        sequelize.close().then(() => {
          logger.info('Database connection closed gracefully.');
          process.exit(0);
        });
      });
    });
  };

  const shouldSync = process.env.NODE_ENV !== 'production' || process.env.DB_SYNC === 'true';

  if (shouldSync) {
    sequelize.sync(syncOptions).then(() => {
      logger.db.connected({ mode: process.env.NODE_ENV || 'development' });
      startServer();
    }).catch(err => {
      logger.db.queryFailed(err, { context: 'DB Sync' });
      sequelize.authenticate().then(() => {
        logger.db.connected({ mode: 'Fallback Auth' });
        startServer();
      }).catch(authErr => {
        logger.db.queryFailed(authErr, { context: 'DB Connection Failed' });
        process.exit(1);
      });
    });
  } else {
    // Production mode: Lightweight connection check without firing heavy schema inspection queries
    sequelize.authenticate().then(() => {
      logger.db.connected({ mode: 'Production Auth' });
      startServer();
    }).catch(err => {
      logger.db.queryFailed(err, { context: 'Production DB Connection Failed' });
      process.exit(1);
    });
  }
}

module.exports = app;

