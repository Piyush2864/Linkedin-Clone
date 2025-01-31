module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
      sender_id: DataTypes.INTEGER,  
      receiver_id: DataTypes.INTEGER, 
      content: DataTypes.TEXT,
      is_delivered: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false },        
      is_read: {                      
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    });
  
    Message.associate = (models) => {
      Message.belongsTo(models.User, { foreignKey: 'sender_id', as: 'sender' });
      Message.belongsTo(models.User, { foreignKey: 'receiver_id', as: 'receiver' });
    };
  
    return Message;
  };
  