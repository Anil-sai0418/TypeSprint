const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// CORS Configuration for deployed frontend
const corsOptions = {
  origin: [
    'http://localhost:5173',      // Local development
    'http://localhost:5174',      // Local alternative port
    'https://type-sprint-psi.vercel.app'  // Vercel deployment
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/bro")
  .then(() => {
    console.log("✅ Database connected successfully");
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
  });

// Routes
app.use("/auth", require('./routes/auth'));
app.use("/profile", require('./routes/profile'));
app.use("/typing-test", require('./routes/typingTest'));
app.use("", require('./routes/utils'));

// Health check
app.get("/health", (req, res) => {
  res.send({ success: true, message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).send({ success: false, message: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}/`);
});

module.exports = app;
