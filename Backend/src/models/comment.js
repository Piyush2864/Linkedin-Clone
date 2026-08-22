'use strict';

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Posts',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.Post, { foreignKey: 'post_id', as: 'post' });
    Comment.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return Comment;
};
