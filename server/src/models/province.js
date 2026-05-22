'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Province extends Model {
    static associate(models) {
      Province.hasMany(models.Post, { foreignKey: 'provinceCode', sourceKey: 'code', as: 'posts' });
      Province.hasMany(models.District, { foreignKey: 'provinceCode', sourceKey: 'code', as: 'districts' });
    }
  }
  Province.init({
    id: { type: DataTypes.STRING, primaryKey: true },
    code: DataTypes.STRING,
    value: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Province',
    indexes: [
      { unique: true, fields: ['code'] }
    ]
  });
  return Province;
};