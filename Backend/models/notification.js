'use strict';

module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    user_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      references: {
        model: 'Users', 
        key: 'id',
      },
      onDelete: 'CASCADE', 
    },
    type: { 
      type: DataTypes.STRING, 
      allowNull: false,
      validate: {
        notEmpty: true, 
      },
    },
    message: { 
      type: DataTypes.STRING, 
      allowNull: false,
      validate: {
        notEmpty: true, // Ensuring that the message is not empty
      },
    },
    is_read: { 
      type: DataTypes.BOOLEAN,
      defaultValue: false, 
    },
  });

  
  Notification.associate = (models) => {
    Notification.belongsTo(models.User, { 
      foreignKey: 'user_id',
      as: 'user', 
    });
  };

  return Notification;
};
