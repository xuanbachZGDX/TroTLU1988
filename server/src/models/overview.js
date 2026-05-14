'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Overview extends Model {
    static associate(models) {
      Overview.belongsTo(models.Post, { foreignKey: 'postId', targetKey: 'id', as: 'post' });
    }
  }
  Overview.init({
    id: { type: DataTypes.STRING, primaryKey: true },
    postId: DataTypes.STRING,
    code: DataTypes.STRING,
    type: DataTypes.STRING,
    target: DataTypes.STRING,
    bonus: DataTypes.STRING,
    published: DataTypes.STRING,
    expired: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Overview',
  });
  return Overview;
};
