'use strict';

module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define('Job', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    company_name: DataTypes.STRING,
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Companies',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    location: DataTypes.STRING,
    employment_type: {
      type: DataTypes.STRING,
      defaultValue: 'Full-time',
    },
    salary_range: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    experience_level: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    posted_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  });

  Job.associate = (models) => {
    Job.belongsTo(models.User, { foreignKey: 'posted_by', as: 'recruiter' });
    Job.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
    Job.hasMany(models.Application, { foreignKey: 'job_id', as: 'applications' });
    Job.hasMany(models.SavedJob, { foreignKey: 'job_id', as: 'savedJobEntries' });
  };

  return Job;
};