'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Area extends Model {
    static associate(models) {
      Area.hasMany(models.Post, { foreignKey: 'areaCode', sourceKey: 'code', as: 'posts' });
    }
  }
  Area.init({
    id: { type: DataTypes.STRING, primaryKey: true },
    order: DataTypes.INTEGER,
    code: DataTypes.STRING,
    value: DataTypes.STRING,
    min: DataTypes.FLOAT,
    max: DataTypes.FLOAT,
  }, {
    sequelize,
    modelName: 'Area',
  });
  return Area;
};