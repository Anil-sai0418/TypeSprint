const express = require('express');
const router = express.Router();

// OAuth feature has been removed from this application
router.all('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'OAuth feature has been removed from this application. Please use email/password authentication instead.' 
  });
});

module.exports = router;

