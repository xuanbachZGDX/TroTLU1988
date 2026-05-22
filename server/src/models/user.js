"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Post, { foreignKey: "userId", sourceKey: "id", as: "user" });
      User.hasMany(models.Contact, { foreignKey: "userId", as: "contacts" });
    }
  }
  User.init(
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      name: DataTypes.STRING,
      password: DataTypes.STRING,
      phone: DataTypes.STRING,
      role: DataTypes.STRING,
      zalo: DataTypes.STRING,
      email: DataTypes.STRING,
      avatar: DataTypes.STRING,
      balance: { type: DataTypes.INTEGER, defaultValue: 0 },
      otp: DataTypes.STRING,
      passwordResetExpires: DataTypes.DATE,
      status: { type: DataTypes.STRING, defaultValue: 'active' },
    },
    {
      sequelize,
      modelName: "User",
      indexes: [
        { unique: true, fields: ["phone"] },
        { unique: true, fields: ["email"] }
      ]
    },
  );
  return User;
};
