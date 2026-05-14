'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Feature extends Model {
    static associate(models) {
      Feature.belongsToMany(models.Post, {
        through: 'PostFeature',
        foreignKey: 'featureId',
        as: 'posts'
      });
    }
  }
  Feature.init({
    id: { type: DataTypes.STRING, primaryKey: true },
    code: DataTypes.STRING,
    value: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Feature',
  });
  return Feature;
};
