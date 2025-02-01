'use strict';

const { Model, DataTypes } = require('sequelize');
const {sequelize} = require('../db/config.js')

class Post extends Model {
  static associate(models) {
    Post.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Post.belongsTo(models.Post, { foreignKey: 'shared_post_id', as: 'sharedPost' });
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
    shared_post_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: 'Post',
  }
);

module.exports = Post;
