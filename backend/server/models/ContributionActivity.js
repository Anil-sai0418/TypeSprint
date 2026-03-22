const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const ContributionActivity = sequelize.define('ContributionActivity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  activityCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  activityType: {
    type: DataTypes.STRING,
    defaultValue: 'typing_test',
  },
  timezone: {
    type: DataTypes.STRING,
    defaultValue: 'UTC',
  },
  metadata: {
    type: DataTypes.JSON, // { wpm, accuracy, duration }
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  timestamps: false,
  tableName: 'contribution_activities',
  indexes: [
    { fields: ['userId', 'date'] },
    { fields: ['email', 'date'] },
    { fields: ['date'] },
  ]
});

// Associations
User.hasMany(ContributionActivity, { foreignKey: 'userId', as: 'activities' });
ContributionActivity.belongsTo(User, { foreignKey: 'userId' });

module.exports = ContributionActivity;
