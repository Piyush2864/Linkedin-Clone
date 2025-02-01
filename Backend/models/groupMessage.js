module.exports = (sequelize, DataTypes) => {
    const GroupMessage = sequelize.define('GroupMessage', {
      group_id: DataTypes.INTEGER,  // Group ID
      sender_id: DataTypes.INTEGER, // User sending the message
      content: DataTypes.TEXT,      // Message content
    });
  
    GroupMessage.associate = (models) => {
      GroupMessage.belongsTo(models.Group, { foreignKey: 'group_id', as: 'group' });
      GroupMessage.belongsTo(models.User, { foreignKey: 'sender_id', as: 'sender' });
    };
  
    return GroupMessage;
  };
  