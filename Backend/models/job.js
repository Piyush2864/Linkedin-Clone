module.exports = (sequelize, DataTypes) => {
    const Job = sequelize.define('Job', {
      title: DataTypes.STRING,        
      description: DataTypes.TEXT,    
      company_name: DataTypes.STRING, 
      location: DataTypes.STRING,     
      employment_type: DataTypes.STRING, 
      posted_by: DataTypes.INTEGER,   
    });
  
    Job.associate = (models) => {
      Job.belongsTo(models.User, { foreignKey: 'posted_by', as: 'recruiter' });
      Job.hasMany(models.Application, { foreignKey: 'job_id', as: 'applications' });
    };
  
    return Job;
  };
  