module.exports = (sequelize, DataTypes) => {
    const SavedJob = sequelize.define('SavedJob', {
        user_id: DataTypes.INTEGER,
        job_id: DataTypes.INTEGER,
    });

    SavedJob.associate = (models) => {
        SavedJob.belongsTo(models.User, { foreignKey: 'user_id' });
        SavedJob.belongsTo(models.Job, { foreignKey: 'job_id' });
    };

    return SavedJob;
};
