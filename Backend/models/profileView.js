module.exports = (sequelize, DataTypes) => {
    const ProfileView = sequelize.define('ProfileView', {
        viewer_id: DataTypes.INTEGER,  // User who viewed the profile
        viewed_user_id: DataTypes.INTEGER,  // Profile owner
    });

    ProfileView.associate = (models) => {
        ProfileView.belongsTo(models.User, { foreignKey: 'viewer_id', as: 'viewer' });
        ProfileView.belongsTo(models.User, { foreignKey: 'viewed_user_id', as: 'profileOwner' });
    };

    return ProfileView;
};
