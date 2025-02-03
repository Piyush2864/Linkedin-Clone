'use strict';

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/config.js'); 

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Profile, { foreignKey: 'user_id', as: 'profile' });
      User.hasMany(models.Post, { foreignKey: 'user_id', as: 'posts' });
      User.belongsToMany(models.User, {
        as: 'connections',
        through: 'Connections',
        foreignKey: 'user_id',
        otherKey: 'connection_id',
      });
    }
  }

  User.init(
    {
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: DataTypes.STRING,
      profile_picture: DataTypes.STRING,
      headline: DataTypes.STRING,
      location: DataTypes.STRING,
      coverPhoto: {
        type: DataTypes.STRING, // Store image URL
        allowNull: true,
      },
      subscription_type: {
        type: DataTypes.ENUM('free', 'premium'),
        defaultValue: 'free',
      },
    },
    {
      sequelize, 
      modelName: 'User',
    }
  );

  return User;
};
