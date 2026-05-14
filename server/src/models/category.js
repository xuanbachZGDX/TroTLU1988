'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Post, { foreignKey: 'categoryCode', sourceKey: 'code', as: 'posts' });
    }
  }
  Category.init({
    id: { type: DataTypes.STRING, primaryKey: true },
    code: DataTypes.STRING,
    value: DataTypes.STRING,
    header: DataTypes.STRING,
    description: DataTypes.STRING,
    order: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};