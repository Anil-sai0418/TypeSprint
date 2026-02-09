require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://typevex.vercel.app",
    "https://157.50.99.17",
    "http://157.50.99.17",
    "http://157.50.99.17:*",
    "https://157.50.99.17:*"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/bro")
  .then(() => {
    console.log("✅ Database connected successfully");
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
  });

// Routes
console.log('📍 Loading routes...');
app.use("/auth", require('./routes/auth'));
console.log('✅ /auth routes loaded');
app.use("/profile", require('./routes/profile'));
console.log('✅ /profile routes loaded');
app.use("/typing-test", require('./routes/typingTest'));
console.log('✅ /typing-test routes loaded');
app.use("/contribution", require('./routes/contribution'));
console.log('✅ /contribution routes loaded');
app.use("", require('./routes/utils'));
console.log('✅ /utils routes loaded');

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
