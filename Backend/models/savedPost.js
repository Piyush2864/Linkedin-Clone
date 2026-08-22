'use strict';

module.exports = (sequelize, DataTypes) => {
  const SavedPost = sequelize.define('SavedPost', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Posts',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  });

  SavedPost.associate = (models) => {
    SavedPost.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    SavedPost.belongsTo(models.Post, { foreignKey: 'post_id', as: 'post' });
  };

  return SavedPost;
};
