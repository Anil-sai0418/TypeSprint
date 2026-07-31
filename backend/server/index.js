require("dotenv").config();
const express = require('express');
const cors = require('cors');
const requestIdMiddleware = require('./middleware/requestId.middleware');
const httpLoggerMiddleware = require('./middleware/logger.middleware');
const logger = require('./utils/logger');
const sequelize = require('./config/database');

// Import models to ensure they are registered with Sequelize
require('./models/User');
require('./models/UserProfile');
require('./models/ContributionActivity');
require('./models/ApplicationLike');

const app = express();

app.use(requestIdMiddleware);
app.use(httpLoggerMiddleware);

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://type-sprint-mauve.vercel.app",
    "https://typevex.vercel.app",
    "https://157.50.99.17",
    "http://157.50.99.17",
    "http://157.50.99.17:*",
    "https://157.50.99.17:*"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Set-Cookie", "X-Request-ID"],
  credentials: true
}));
app.use(express.json());

// Sync Sequelize Models with Database
sequelize.sync({ alter: true }) // Using alter to update schema automatically without dropping existing data
  .then(() => {
    logger.db.connected({ mode: 'Index' });
  })
  .catch((err) => {
    logger.db.queryFailed(err, { context: 'Index DB Sync Error' });
  });

// Routes
logger.debug('Loading routes...');
app.use("/auth", require('./routes/auth'));
app.use("/profile", require('./routes/profile'));
app.use("/typing-test", require('./routes/typingTest'));
app.use("/contribution", require('./routes/contribution'));
app.use("", require('./routes/utils'));
logger.info('Routes Registered');

// Health check
app.get("/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.send({ success: true, message: "Server is running", database: "connected" });
  } catch (err) {
    res.status(500).send({ success: false, message: "Database connection failed" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err, { requestId: req.id, route: req.originalUrl, method: req.method });
  res.status(500).send({ success: false, message: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  logger.info('Server Started', { port: PORT, url: `http://localhost:${PORT}/` });
});

module.exports = app;

