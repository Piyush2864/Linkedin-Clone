'use strict';

module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
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
  });

  Like.associate = (models) => {
    Like.belongsTo(models.Post, { foreignKey: 'post_id', as: 'post' });
    Like.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return Like;
};
