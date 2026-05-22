import db from "../../models";

export const getAdminContactsService = () =>
  new Promise(async (resolve, reject) => {
    try {
      // Mark contact notifications as read when admin views the contact page
      await db.Notification.update(
        { isRead: true },
        { where: { title: "Góp ý / Liên hệ mới", isRead: false } }
      );

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

      await db.sequelize.transaction(async (t) => {
        contact.response = responseText;
        contact.status = "replied";
        await contact.save({ transaction: t });

        if (contact.userId) {
          const { v4 } = require("uuid");
          await db.Notification.create({
            id: v4(),
            senderId: null,
            recipientId: contact.userId,
            postId: null,
            title: "Phản hồi góp ý / liên hệ",
            content: `Quản trị viên đã phản hồi góp ý của bạn: "${responseText.slice(0, 100)}${responseText.length > 100 ? '...' : ''}"`,
            isRead: false
          }, { transaction: t });
        }
      });

      resolve({
        err: 0,
        msg: "Replied",
      });
    } catch (error) {
      reject(error);
    }
  });
