'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostFeature extends Model {
    static associate(models) {}
  }
  PostFeature.init({
    id: { type: DataTypes.STRING, primaryKey: true },
    postId: DataTypes.STRING,
    featureId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'PostFeature',
  });
  return PostFeature;
};
