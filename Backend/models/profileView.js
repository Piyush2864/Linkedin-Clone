module.exports = (sequelize, DataTypes) => {
    const ProfileView = sequelize.define('ProfileView', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        viewer_id: {
            type: DataTypes.INTEGER,
            allowNull: true, 
            references: {
                model: 'Users', 
                key: 'id',
            },
            onDelete: 'SET NULL',
        },
        viewed_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        viewed_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    });

    ProfileView.associate = (models) => {
        ProfileView.belongsTo(models.User, { foreignKey: 'viewer_id', as: 'viewer' });
        ProfileView.belongsTo(models.User, { foreignKey: 'viewed_user_id', as: 'profileOwner' });
    };

    return ProfileView;
};
