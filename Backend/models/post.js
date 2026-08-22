'use strict';

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    content: DataTypes.TEXT,
    media_url: DataTypes.STRING,
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    comments: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    shared_post_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  Post.associate = (models) => {
    Post.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Post.belongsTo(models.Post, { foreignKey: 'shared_post_id', as: 'sharedPost' });
    Post.hasMany(models.Like, { foreignKey: 'post_id', as: 'likesList' });
    Post.hasMany(models.Comment, { foreignKey: 'post_id', as: 'commentsList' });
  };

  return Post;
};
