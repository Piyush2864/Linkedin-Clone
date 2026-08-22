'use strict';

module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define('Application', {
    job_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Jobs',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    applicant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    resume_url: DataTypes.STRING,
    cover_letter: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('pending', 'reviewed', 'shortlisted', 'interviewing', 'accepted', 'rejected'),
      defaultValue: 'pending',
    },
  });

  Application.associate = (models) => {
    Application.belongsTo(models.User, { foreignKey: 'applicant_id', as: 'applicant' });
    Application.belongsTo(models.Job, { foreignKey: 'job_id', as: 'job' });
  };

  return Application;
};