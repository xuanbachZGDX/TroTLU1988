"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.hasMany(models.Image, { foreignKey: "postId", as: "images" });

      Post.belongsTo(models.User, {
        foreignKey: "userId",
        targetKey: "id",
        as: "user",
      });
      Post.belongsTo(models.Category, {
        foreignKey: "categoryCode",
        targetKey: "code",
        as: "category",
      });
      Post.belongsTo(models.Province, {
        foreignKey: "provinceCode",
        targetKey: "code",
        as: "province",
      });
      Post.belongsTo(models.District, {
        foreignKey: "districtCode",
        targetKey: "code",
        as: "district",
      });

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
      star: DataTypes.INTEGER,
      address: DataTypes.STRING,
      description: DataTypes.TEXT,
      categoryCode: DataTypes.STRING,
      provinceCode: DataTypes.STRING,
      districtCode: DataTypes.STRING,
      priceNumber: DataTypes.FLOAT,
      areaNumber: DataTypes.FLOAT,
      status: DataTypes.STRING,
      userId: DataTypes.STRING,
      note: DataTypes.TEXT,

      // Inline columns instead of separate tables
      sourcePostRef: DataTypes.STRING,
      type: DataTypes.STRING,
      target: DataTypes.STRING,
      bonus: DataTypes.STRING,
      published: DataTypes.STRING,
      expired: DataTypes.STRING,

      // Virtual fields for nested client compatibility
      attributes: {
        type: DataTypes.VIRTUAL,
        get() {
          const priceVal = this.priceNumber || 0;
          const priceText =
            priceVal < 1
              ? `${priceVal * 1000000} đồng/tháng`
              : `${priceVal} triệu/tháng`;
          const acreageText = this.areaNumber ? `${this.areaNumber} m2` : "";
          return {
            price: priceText,
            acreage: acreageText,
            published: this.published,
          };
        },
      },
      overview: {
        type: DataTypes.VIRTUAL,
        get() {
          return {
            code: this.sourcePostRef,
            type: this.type,
            target: this.target,
            bonus: this.bonus,
            published: this.published,
            expired: this.expired,
          };
        },
      },
    },
    {
      sequelize,
      modelName: "Post",
      indexes: [
        { fields: ["provinceCode"] },
        { fields: ["districtCode"] },
        { fields: ["status"] },
        { fields: ["userId"] },
      ],
    },
  );
  return Post;
};
