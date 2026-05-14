'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attribute extends Model {
    static associate(models) {
      Attribute.belongsTo(models.Post, { foreignKey: 'postId', targetKey: 'id', as: 'post' });
    }
  }
  Attribute.init({
    id: { type: DataTypes.STRING, primaryKey: true },
    postId: DataTypes.STRING,
    price: DataTypes.STRING,
    acreage: DataTypes.STRING,
    published: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Attribute',
  });
  return Attribute;
};