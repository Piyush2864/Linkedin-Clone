module.exports = (sequelize, DataTypes) => {
    const Group = sequelize.define('Group', {
      name: DataTypes.STRING, // Group Name
      creator_id: DataTypes.INTEGER, // User who created the group
    });
  
    Group.associate = (models) => {
      Group.belongsToMany(models.User, { through: 'GroupMembers', foreignKey: 'group_id' });
      Group.hasMany(models.GroupMessage, { foreignKey: 'group_id', as: 'messages' });
    };
  
    return Group;
  };
  