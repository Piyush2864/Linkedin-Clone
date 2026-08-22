'use strict';

module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    industry: DataTypes.STRING,
    company_size: DataTypes.STRING,
    website: DataTypes.STRING,
    logo: DataTypes.STRING,
    cover_image: DataTypes.STRING,
    location: DataTypes.STRING,
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  });

  Company.associate = (models) => {
    Company.belongsTo(models.User, { foreignKey: 'owner_id', as: 'owner' });
    Company.hasMany(models.Job, { foreignKey: 'company_id', as: 'jobs' });
    Company.belongsToMany(models.User, {
      through: 'CompanyFollowers',
      as: 'followers',
      foreignKey: 'company_id',
    });
  };

  return Company;
};
