import db from "../../models";

export const getFeaturesService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Feature.findAll({
        attributes: ["code", "value"],
        raw: true,
      });
      resolve({
        err: 0,
        msg: "OK",
        response,
      });
    } catch (error) {
      reject(error);
    }
  });
