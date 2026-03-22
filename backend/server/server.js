require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const sequelize = require('./config/database');

// Initialize models
require('./models/User');
require('./models/UserProfile');
require('./models/ContributionActivity');
require('./models/ApplicationLike');

const app = express();

// Trust proxy is required when deploying to platforms like Render or Heroku behind load balancers.
app.set('trust proxy', 1);

// Rate Limiter configuration to prevent DDoS and brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
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
app.use(morgan('combined')); // Production logging

// CORS Configuration - Professional Setup
const allowedOrigins = [
  'https://type-sprint-psi.vercel.app',
  'https://typevex-1.onrender.com', // Render URL
  process.env.FRONTEND_URL, // Dynamic frontend URL from env
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000'
].filter(Boolean); // Remove null/undefined

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed or in development
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.warn(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie'], // Important for cookies
  optionsSuccessStatus: 200,
  maxAge: 86400 // Cache preflight for 24h
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Pre-flight

// Standard Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Connect to PostgreSQL with Sequelize Sync
// In production, altering tables automatically can be dangerous, so we conditionally enable it
const syncOptions = process.env.NODE_ENV === 'production' ? {} : { alter: true };
sequelize.sync(syncOptions)
  .then(() => console.log('✅ PostgreSQL Database connected & synchronized successfully'))
  .catch((err) => {
    console.error('❌ SQL Database sync error:', err.message);
    if (process.env.NODE_ENV === 'production') {
      console.error('Shutting down server due to DB connection failure...');
      process.exit(1);
    }
  });

// Routes
app.use("/auth", require('./routes/auth'));
app.use("/profile", require('./routes/profile'));
app.use("/typing-test", require('./routes/typingTest'));
app.use("/contribution", require('./routes/contribution'));
app.use("/like", require('./routes/like'));
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

// Production-ready Error Handling
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(`[ERROR] ${req.method} ${req.url}:`, err.stack);
  
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'An internal server error occurred' : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 10000;
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server is live in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📍 URL: http://localhost:${PORT}/`);
  console.log(`📦 Node Version: ${process.version}`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing HTTP server.');
  server.close(() => {
    console.log('HTTP server closed.');
    sequelize.close().then(() => {
      console.log('Sequelize connection closed.');
      process.exit(0);
    });
  });
});

module.exports = app;
