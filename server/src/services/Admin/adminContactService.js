import db from "../../models";

export const getAdminContactsService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Contact.findAll({
        include: [
          { model: db.User, as: "user", attributes: ["name", "phone", "email"] },
        ],
        order: [["createdAt", "DESC"]],
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

export const deleteAdminContactService = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Contact.destroy({
        where: { id },
      });
      resolve({
        err: response > 0 ? 0 : 1,
        msg: response > 0 ? "Deleted" : "Failed to delete contact",
      });
    } catch (error) {
      reject(error);
    }
  });
