import db from "../../models";

export const getAllPackagesService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Package.findAll({
        order: [["star", "DESC"]],
      });
      resolve({
        err: response ? 0 : 1,
        msg: response ? "OK" : "Failed to get packages",
        response,
      });
    } catch (error) {
      reject(error);
    }
  });
