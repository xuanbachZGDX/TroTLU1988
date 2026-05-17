import db from "../../models";

export const getAdminNotificationsService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Notification.findAll({
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: db.User,
            as: "sender",
            attributes: ["name", "avatar"],
          },
        ],
      });
      resolve({
        err: 0,
        msg: "OK",
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const readAdminNotificationService = (notificationId) =>
  new Promise(async (resolve, reject) => {
    try {
      await db.Notification.update(
        { isRead: true },
        { where: { id: notificationId } }
      );
      resolve({
        err: 0,
        msg: "Đã đánh dấu đã đọc",
      });
    } catch (error) {
      reject(error);
    }
  });
