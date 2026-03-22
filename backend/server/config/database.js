const { Sequelize } = require('sequelize');
require('dotenv').config();

// Determine connection URL (either from config or default local postgres DB)
// User must ensure the DB 'bro' exists if using default local URL
const DB_URL = process.env.DATABASE_URL || process.env.POSTGRES_URI || "postgres://postgres:postgres@localhost:5432/bro";

const dialectOptions = {};

// Use SSL in production unless explicitly disabled, which Render often requires for external DB connections.
if (process.env.NODE_ENV === 'production' && process.env.DB_SSL !== 'false') {
  dialectOptions.ssl = {
    require: true,
    rejectUnauthorized: false
  };
}

const sequelize = new Sequelize(DB_URL, {
  dialect: 'postgres',
  logging: false, // Set to console.log to see SQL queries
  dialectOptions
});

module.exports = sequelize;
