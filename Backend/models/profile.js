'use strict';
import { Model, DataTypes } from 'sequelize';

export default class Profile extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Profile.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

Profile.init({
  bio: DataTypes.TEXT,
  skills: DataTypes.JSON,
  experience: DataTypes.JSON,
  education: DataTypes.JSON,
  user_id: DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'Profile',
});
