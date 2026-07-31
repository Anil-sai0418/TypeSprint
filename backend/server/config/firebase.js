const admin = require('firebase-admin');
const logger = require('../utils/logger');

// Initialize Firebase Admin SDK
// You will need to add your service account key JSON as environment variables
// or place it securely in your project and reference it here.
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT.replace(/\r?\n/g, '\\n'))
  : null;

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  logger.info('Firebase Admin initialized', { category: 'FIREBASE' });
} else {
  logger.warn('Firebase Admin not initialized. Please set FIREBASE_SERVICE_ACCOUNT env var.', { category: 'FIREBASE' });
}

module.exports = admin;