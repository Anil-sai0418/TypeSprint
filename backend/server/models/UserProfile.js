const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const UserProfile = sequelize.define('UserProfile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: User,
      key: 'id',
    },
  },
  phone: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
  },
  profileImage: {
    type: DataTypes.TEXT,
  },
  // Typing Statistics
  highestSpeed: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  bestTest: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  totalTests: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  dailyStreak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  averageSpeed: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  highestAccuracy: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  // Activity map
  activityMap: {
    type: DataTypes.JSON, // Maps string to number
    defaultValue: {},
  },
  // Typing tests history
  typingTests: {
    type: DataTypes.JSON, // Array of objects
    defaultValue: [],
  },
  achievements: {
    type: DataTypes.JSON, // Array of strings
    defaultValue: ["First Test"],
  },
  lastTestDate: {
    type: DataTypes.DATE,
  },
  lastStreakReminder: {
    type: DataTypes.DATE,
  },
}, {
  timestamps: true,
  tableName: 'userProfiles',
});

// Associations
User.hasOne(UserProfile, { foreignKey: 'userId', as: 'profile' });
UserProfile.belongsTo(User, { foreignKey: 'userId' });

module.exports = UserProfile;
