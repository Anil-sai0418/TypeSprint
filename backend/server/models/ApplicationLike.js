const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); // Assuming reference to User

const ApplicationLike = sequelize.define('ApplicationLike', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  totalLikes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  // We can store likes array as JSON or a separate table.
  // Given it's a simple array inside document, JSON is fine for SQLite
  likes: {
    type: DataTypes.JSON, 
    defaultValue: [], // Array of objects { userId, likedAt }
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
  tableName: 'applicationLikes',
});

module.exports = ApplicationLike;
