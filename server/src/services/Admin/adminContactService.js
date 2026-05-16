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

export const replyAdminContactService = (id, responseText) =>
  new Promise(async (resolve, reject) => {
    try {
      const contact = await db.Contact.findByPk(id);
      if (!contact) {
        return resolve({
          err: 1,
          msg: "Không tìm thấy tin nhắn liên hệ",
        });
      }

      contact.response = responseText;
      contact.status = "replied";
      await contact.save();

      resolve({
        err: 0,
        msg: "Replied",
      });
    } catch (error) {
      reject(error);
    }
  });
