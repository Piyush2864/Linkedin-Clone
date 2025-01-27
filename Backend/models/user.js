'use strict';
import { Model, DataTypes } from 'sequelize';

export default class User extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // Defining associations
    User.hasOne(models.Profile, { foreignKey: 'user_id', as: 'profile' });
    User.hasMany(models.Post, { foreignKey: 'user_id', as: 'posts' });
    User.belongsToMany(models.User, {
      as: 'connections',
      through: 'Connections',
      foreignKey: 'user_id',
      otherKey: 'connection_id',
    });
  }
}

User.init({
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  profile_picture: DataTypes.STRING,
  headline: DataTypes.STRING,
  location: DataTypes.STRING,
}, {
  sequelize,
  modelName: 'User',
});

