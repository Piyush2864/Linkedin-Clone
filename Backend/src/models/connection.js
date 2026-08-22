'use strict';

module.exports = (sequelize, DataTypes) => {
  const Connection = sequelize.define('Connection', {
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
    connection_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
      defaultValue: 'pending',
    },
  });

  Connection.associate = (models) => {
    Connection.belongsTo(models.User, { foreignKey: 'user_id', as: 'requester' });
    Connection.belongsTo(models.User, { foreignKey: 'connection_id', as: 'receiver' });
  };

  return Connection;
};
