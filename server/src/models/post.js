"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.hasOne(models.Image, { foreignKey: "postId", as: "images" });
      Post.hasOne(models.Attribute, { foreignKey: "postId", as: "attributes" });
      Post.hasOne(models.Overview, { foreignKey: "postId", as: "overview" });
      
      Post.belongsTo(models.User, { foreignKey: "userId", targetKey: "id", as: "user" });
      Post.belongsTo(models.Category, { foreignKey: "categoryCode", targetKey: "code", as: "category" });
      Post.belongsTo(models.Province, { foreignKey: "provinceCode", targetKey: "code", as: "province" });
      Post.belongsTo(models.District, { foreignKey: "districtCode", targetKey: "code", as: "district" });
      Post.belongsTo(models.Price, { foreignKey: "priceCode", targetKey: "code", as: "price" });
      Post.belongsTo(models.Area, { foreignKey: "areaCode", targetKey: "code", as: "area" });
      
      Post.belongsToMany(models.Feature, {
        through: "PostFeature",
        foreignKey: "postId",
        as: "features",
      });
    }
  }
  Post.init(
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      title: DataTypes.STRING,
      star: DataTypes.STRING,
      address: DataTypes.STRING,
      description: DataTypes.TEXT,
      categoryCode: DataTypes.STRING,
      provinceCode: DataTypes.STRING,
      districtCode: DataTypes.STRING,
      priceCode: DataTypes.STRING,
      areaCode: DataTypes.STRING,
      priceNumber: DataTypes.FLOAT,
      areaNumber: DataTypes.FLOAT,
      status: DataTypes.STRING,
      userId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Post",
    },
  );
  return Post;
};
