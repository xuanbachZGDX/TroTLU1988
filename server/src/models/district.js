'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class District extends Model {
    static associate(models) {
      District.belongsTo(models.Province, { foreignKey: 'provinceCode', targetKey: 'code', as: 'province' });
      District.hasMany(models.Post, { foreignKey: 'districtCode', sourceKey: 'code', as: 'posts' });
    }
  }
  District.init({
    id: { type: DataTypes.STRING, primaryKey: true },
    code: DataTypes.STRING,
    value: DataTypes.STRING,
    provinceCode: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'District',
    indexes: [
      { fields: ['provinceCode'] },
      { fields: ['code'] }
    ]
  });
  return District;
};
