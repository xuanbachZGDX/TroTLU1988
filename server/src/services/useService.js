import db from "../models";

// GET CURRENT USER
export const getOne = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOne({
        where: { id },
        raw: true,
        attributes: {
            exclude: ["password"]
        }
      });
      resolve({
        err: response ? 0 : 1,
        msg: response ? "OK" : "Failed to get user",
        response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateUser = (payload, id) =>
  new Promise(async (resolve, reject) => {
    try {
      if (payload.password) {
        const bcrypt = require("bcryptjs");
        payload.password = bcrypt.hashSync(payload.password, bcrypt.genSaltSync(12));
      }
      const response = await db.User.update(payload, {
        where: { id },
      });
      resolve({
        err: response[0] > 0 ? 0 : 1,
        msg: response[0] > 0 ? "Cập nhật thông tin thành công" : "Cập nhật thông tin thất bại",
      });
    } catch (error) {
      reject(error);
    }
  });
