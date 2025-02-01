module.exports = (sequelize, DataTypes) => {
    const Endorsement = sequelize.define('Endorsement', {
        endorsed_by: DataTypes.INTEGER,
        endorsed_user: DataTypes.INTEGER,
        skill: DataTypes.STRING,
    });

    Endorsement.associate = (models) => {
        Endorsement.belongsTo(models.User, { foreignKey: 'endorsed_by' });
        Endorsement.belongsTo(models.User, { foreignKey: 'endorsed_user' });
    };

    return Endorsement;
};
