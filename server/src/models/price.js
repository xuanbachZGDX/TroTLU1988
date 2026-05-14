'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Price extends Model {
    static associate(models) {
      Price.hasMany(models.Post, { foreignKey: 'priceCode', sourceKey: 'code', as: 'posts' });
    }
  }
  Price.init({
    id: { type: DataTypes.STRING, primaryKey: true },
    order: DataTypes.INTEGER,
    code: DataTypes.STRING,
    value: DataTypes.STRING,
    min: DataTypes.FLOAT,
    max: DataTypes.FLOAT,
  }, {
    sequelize,
    modelName: 'Price',
  });
  return Price;
};