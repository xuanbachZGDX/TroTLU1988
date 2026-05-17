'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostHistory extends Model {
    static associate(models) {
      PostHistory.belongsTo(models.Post, { foreignKey: 'postId', as: 'post' });
      PostHistory.belongsTo(models.User, { foreignKey: 'editorId', as: 'editor' });
    }
  }
  PostHistory.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    postId: DataTypes.STRING,
    editorId: DataTypes.STRING,
    oldTitle: DataTypes.STRING,
    newTitle: DataTypes.STRING,
    oldPrice: DataTypes.DOUBLE,
    newPrice: DataTypes.DOUBLE,
    oldArea: DataTypes.DOUBLE,
    newArea: DataTypes.DOUBLE,
    oldDescription: DataTypes.TEXT,
    newDescription: DataTypes.TEXT,
    oldAddress: DataTypes.TEXT,
    newAddress: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: "PostHistory",
  });
  return PostHistory;
};
