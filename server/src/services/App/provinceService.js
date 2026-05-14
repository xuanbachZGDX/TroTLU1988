import db from "../../models";

// GET ALL PROVINCE
export const getProvinceService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Province.findAll({
        raw: true,
        attributes: ["code", "value"],
      });
      resolve({
        err: response ? 0 : 1,
        msg: response ? "OK" : "Failed to get provinces",
        response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getProvinceWithCountService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Province.findAll({
        attributes: [
          "code",
          "value",
          [db.sequelize.fn("COUNT", db.sequelize.col("posts.id")), "postCount"],
        ],
        include: [
          {
            model: db.Post,
            as: "posts",
            attributes: [],
          },
        ],
        group: ["Province.id", "Province.code", "Province.value"],
        order: [[db.sequelize.fn("COUNT", db.sequelize.col("posts.id")), "DESC"]],
        limit: 8,
        subQuery: false,
      });
      resolve({
        err: response ? 0 : 1,
        msg: response ? "OK" : "Failed to get provinces with count",
        response,
      });
    } catch (error) {
      console.error("Error in getProvinceWithCountService:", error);
      reject(error);
    }
  });
