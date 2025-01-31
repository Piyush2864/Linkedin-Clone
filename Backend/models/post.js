'use strict';

const { Model, DataTypes } = require('sequelize');
const {sequelize} = require('../db/config.js')

class Post extends Model {
  static associate(models) {
    Post.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

Post.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    content: DataTypes.TEXT,
    media_url: DataTypes.STRING,
    likes: DataTypes.INTEGER,
    comments: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: 'Post',
  }
);

module.exports = Post;
