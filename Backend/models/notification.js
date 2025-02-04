'use strict';

module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    sender_id: { 
      type: DataTypes.INTEGER,
      allowNull: true, 
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    type: { 
      type: DataTypes.ENUM('endorsement', 'profile_view', 'message'), 
      allowNull: false,
    },
    message: { 
      type: DataTypes.STRING, 
      allowNull: false,
      validate: {
        notEmpty: true, 
      },
    },
    is_read: { 
      type: DataTypes.BOOLEAN,
      defaultValue: false, 
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  // Associations
  Notification.associate = (models) => {
    Notification.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Notification.belongsTo(models.User, { foreignKey: 'sender_id', as: 'sender' });
  };

  return Notification;
};
