'use strict';
import { Model, DataTypes } from 'sequelize';

export default class Post extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Post.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
  }
}

Post.init({
  user_id: DataTypes.INTEGER,
  content: DataTypes.TEXT,
  media_url: DataTypes.STRING,
  likes: DataTypes.INTEGER,
  comments: DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'Post',
});
