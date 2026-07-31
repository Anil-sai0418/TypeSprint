const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.auth.invalidToken({ requestId: req.id, route: req.originalUrl, reason: 'Missing or malformed Authorization header' });
    return res.status(401).send({ message: "No token provided" });
  }
  
  const token = authHeader.slice(7); // Remove "Bearer " prefix
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production_at_least_32_characters_long');
    req.user = decoded;
    logger.auth.jwtVerification({ requestId: req.id, userId: decoded.id || decoded.userId || decoded.email });
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      logger.auth.expiredToken({ requestId: req.id, route: req.originalUrl, expiredAt: error.expiredAt });
    } else {
      logger.auth.invalidToken({ requestId: req.id, route: req.originalUrl, errorName: error.name });
    }
    res.status(401).send({ message: "Invalid token" });
  }
};

module.exports = verifyToken;

