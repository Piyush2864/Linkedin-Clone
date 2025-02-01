module.exports = (sequelize, DataTypes) => {
    const GroupMember = sequelize.define('GroupMember', {
      group_id: DataTypes.INTEGER,  
      user_id: DataTypes.INTEGER,   
      is_admin: {                   
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    });
  
    GroupMember.associate = (models) => {
      GroupMember.belongsTo(models.Group, { foreignKey: 'group_id' });
      GroupMember.belongsTo(models.User, { foreignKey: 'user_id' });
    };
  
    return GroupMember;
  };
  