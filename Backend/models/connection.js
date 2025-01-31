'use strict';

const { Model, DataTypes } = require('sequelize');

class Connection extends Model {
  static associate(models) {
    // define association here
  }
}

Connection.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    connection_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: 'Connection',
  }
);

module.exports = Connection;
