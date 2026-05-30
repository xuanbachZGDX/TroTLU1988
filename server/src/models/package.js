"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Package extends Model {
    static associate(models) {
      // No special association needed unless we want to associate with posts or transactions
    }
  }
  Package.init(
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      name: DataTypes.STRING,
      star: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      color: DataTypes.STRING,
      benefit: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Package",
    },
  );
  return Package;
};
