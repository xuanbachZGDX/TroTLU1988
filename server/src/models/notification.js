"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, { foreignKey: "senderId", as: "sender" });
      Notification.belongsTo(models.Post, { foreignKey: "postId", as: "post" });
    }
  }
  Notification.init(
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      postId: DataTypes.STRING,
      senderId: DataTypes.STRING,
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "Notification",
    }
  );
  return Notification;
};
