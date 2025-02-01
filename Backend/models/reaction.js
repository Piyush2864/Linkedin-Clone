module.exports = (sequelize, DataTypes) => {
    const Reaction = sequelize.define('Reaction', {
      post_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      type: {
        type: DataTypes.ENUM('like', 'celebrate', 'support', 'love', 'insightful', 'curious'),
        allowNull: false,
      },
    });
  
    Reaction.associate = (models) => {
      Reaction.belongsTo(models.Post, { foreignKey: 'post_id' });
      Reaction.belongsTo(models.User, { foreignKey: 'user_id' });
    };
  
    return Reaction;
  };
  