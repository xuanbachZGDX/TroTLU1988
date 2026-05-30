"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    static associate(models) {
      Report.belongsTo(models.User, { foreignKey: "userId", as: "reporter" });
      Report.belongsTo(models.Post, { foreignKey: "postId", as: "post" });
    }
  }
  Report.init(
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      postId: DataTypes.STRING,
      userId: DataTypes.STRING,
      reason: DataTypes.STRING,
      content: DataTypes.TEXT,
      status: { type: DataTypes.STRING, defaultValue: "pending" }, // pending, resolved, rejected
    },
    {
      sequelize,
      modelName: "Report",
    },
  );
  return Report;
};
