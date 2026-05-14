'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate(models) {
      Image.belongsTo(models.Post, { foreignKey: 'postId', targetKey: 'id', as: 'post' });
    }
  }
  Image.init({
    id: { type: DataTypes.STRING, primaryKey: true },
    postId: DataTypes.STRING,
    image: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};