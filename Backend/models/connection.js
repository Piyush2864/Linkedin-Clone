'use strict';
import { Model, DataTypes } from 'sequelize';

export default class Connection extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}

Connection.init({
  user_id: DataTypes.INTEGER,
  connection_id: DataTypes.INTEGER,
  status: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Connection',
});

