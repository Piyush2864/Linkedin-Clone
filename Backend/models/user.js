'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Profile, { foreignKey: 'user_id', as: 'profile' });
      User.hasMany(models.Post, { foreignKey: 'user_id', as: 'posts' });
      User.hasMany(models.Like, { foreignKey: 'user_id', as: 'likes' });
      User.hasMany(models.Comment, { foreignKey: 'user_id', as: 'comments' });
      User.hasMany(models.SavedPost, { foreignKey: 'user_id', as: 'savedPosts' });
      User.hasMany(models.Notification, { foreignKey: 'user_id', as: 'notifications' });
      User.hasMany(models.Job, { foreignKey: 'posted_by', as: 'jobsPosted' });
      User.hasMany(models.Application, { foreignKey: 'applicant_id', as: 'applications' });
      User.hasMany(models.Company, { foreignKey: 'owner_id', as: 'ownedCompanies' });
      User.belongsToMany(models.Company, {
        through: 'CompanyFollowers',
        as: 'followedCompanies',
        foreignKey: 'user_id',
      });
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profile_picture: DataTypes.STRING,
      headline: DataTypes.STRING,
      location: DataTypes.STRING,
      coverPhoto: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
      },
      subscription_type: {
        type: DataTypes.ENUM('free', 'premium'),
        defaultValue: 'free',
      },
      reset_password_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      reset_password_expires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};
