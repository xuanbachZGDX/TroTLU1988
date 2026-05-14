import db from "../../models";

export const getDistrictsService = (provinceCode) =>
  new Promise(async (resolve, reject) => {
    try {
      const query = {
        raw: true,
        attributes: ["code", "value", "provinceCode"],
      };
      if (provinceCode) query.where = { provinceCode };

      const response = await db.District.findAll(query);
      resolve({
        err: response ? 0 : 1,
        msg: response ? "OK" : "Failed to get districts",
        response,
      });
    } catch (error) {
      reject(error);
    }
  });
