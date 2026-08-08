const { Sequelize } = require('sequelize');
require('dotenv').config();
const logger = require('../utils/logger');

// Determine connection URL (either from config or default local postgres DB)
// User must ensure the DB 'bro' exists if using default local URL
const DB_URL = process.env.DATABASE_URL || process.env.POSTGRES_URI || "postgres://postgres:postgres@localhost:5432/bro";

const dialectOptions = {};

// Use SSL in production only if explicitly requested OR if the URL is an external Render URL.
// Render internal URLs (dpg-xyz) do NOT support SSL.
const isRenderExternal = DB_URL.includes('render.com');
const forceSsl = process.env.DB_SSL === 'true' || (process.env.NODE_ENV === 'production' && isRenderExternal && process.env.DB_SSL !== 'false');

if (forceSsl) {
  dialectOptions.ssl = {
    require: true,
    rejectUnauthorized: false
  };
}

const sequelize = new Sequelize(DB_URL, {
  dialect: 'postgres',
  logging: process.env.DB_LOGGING === 'true' ? (msg) => logger.debug(msg, { category: 'DATABASE_QUERY' }) : false,
  dialectOptions,
  pool: {
    max: parseInt(process.env.DB_POOL_MAX) || 5, // Strict limit to prevent EMAXCONNSESSION (pool_size: 15)
    min: parseInt(process.env.DB_POOL_MIN) || 0, // 0 minimum connections so idle clients are closed
    acquire: 30000,
    idle: 10000,
    evict: 1000
  }
});

module.exports = sequelize;

