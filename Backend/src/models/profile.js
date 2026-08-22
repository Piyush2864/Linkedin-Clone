'use strict';

module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    bio: DataTypes.TEXT,
    skills: DataTypes.JSON,
    experience: DataTypes.JSON,
    education: DataTypes.JSON,
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
  });

  Profile.associate = (models) => {
    Profile.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return Profile;
};
