'use strict';

module.exports = (sequelize, DataTypes) => {
  const CompanyFollower = sequelize.define('CompanyFollower', {
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Companies',
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

  CompanyFollower.associate = (models) => {
    CompanyFollower.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
    CompanyFollower.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return CompanyFollower;
};
