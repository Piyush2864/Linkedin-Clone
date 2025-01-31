'use strict';

const { Model, DataTypes } = require('sequelize');

class Profile extends Model {
  static associate(models) {
    Profile.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

Profile.init(
  {
    bio: DataTypes.TEXT,
    skills: DataTypes.JSON,
    experience: DataTypes.JSON,
    education: DataTypes.JSON,
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'Profile',
  }
);

module.exports = Profile;
