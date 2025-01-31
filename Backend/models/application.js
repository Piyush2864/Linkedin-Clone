module.exports = (sequelize, DataTypes) => {
    const Application = sequelize.define('Application', {
      job_id: DataTypes.INTEGER,  
      applicant_id: DataTypes.INTEGER, 
      resume_url: DataTypes.STRING, 
      cover_letter: DataTypes.TEXT, 
      status: {                     
        type: DataTypes.STRING,
        defaultValue: 'pending', 
      },
    });
  
    Application.associate = (models) => {
      Application.belongsTo(models.User, { foreignKey: 'applicant_id', as: 'applicant' });
      Application.belongsTo(models.Job, { foreignKey: 'job_id', as: 'job' });
    };
  
    return Application;
  };
  