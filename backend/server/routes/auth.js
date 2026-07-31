const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const { sendLoginNotification } = require('../utils/emailService');
const logger = require('../utils/logger');

const router = express.Router();

// POST /auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send({ success: false, message: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send({ success: false, message: "Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const savedUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Create user profile
    await UserProfile.create({
      userId: savedUser.id,
      achievements: ["First Test"]
    });

    logger.info('User Registration Success', {
      requestId: req.id,
      userId: savedUser.id,
      email: savedUser.email
    });

    res.send({
      success: true,
      message: "Registration successful",
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email
      }
    });
  } catch (err) {
    logger.error(err, { requestId: req.id, context: 'Registration Failure' });
    res.status(500).send({ success: false, message: "Registration failed", error: err.message });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    logger.auth.loginAttempt({ requestId: req.id, email, ip: req.ip });

    if (!email || !password) {
      logger.auth.loginFailure({ requestId: req.id, email, reason: 'Missing credentials' });
      return res.status(400).send({ success: false, message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      logger.auth.loginFailure({ requestId: req.id, email, reason: 'User not found' });
      return res.status(404).send({ success: false, message: "User not found" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.auth.loginFailure({ requestId: req.id, email, userId: user.id, reason: 'Incorrect password' });
      return res.status(401).send({ success: false, message: "Incorrect password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production_at_least_32_characters_long',
      { expiresIn: '7d' }
    );

    logger.auth.loginSuccess({
      requestId: req.id,
      userId: user.id,
      email: user.email,
      ip: req.ip
    });

    res.send({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

    // Send login notification email asynchronously in background without blocking response
    setImmediate(() => {
      sendLoginNotification(user.email, user.name).catch(err => {
        logger.error(err, { requestId: req.id, userId: user.id, context: 'sendLoginNotification' });
      });
    });
  } catch (err) {
    logger.error(err, { requestId: req.id, context: 'Login Error' });
    res.status(500).send({ success: false, message: "Login failed", error: err.message });
  }
});

module.exports = router;

