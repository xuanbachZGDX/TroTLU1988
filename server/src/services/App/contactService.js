import db from "../../models";

export const createContactService = (body) =>
  new Promise(async (resolve, reject) => {
    try {
      await db.sequelize.transaction(async (t) => {
        await db.Contact.create({
          userId: body.userId,
          name: body.name,
          phone: body.phone,
          content: body.description,
          status: "pending",
        }, { transaction: t });

        const { v4 } = require("uuid");
        await db.Notification.create({
          id: v4(),
          senderId: body.userId || null,
          postId: null,
          title: "Góp ý / Liên hệ mới",
          content: `Khách hàng ${body.name || "Ẩn danh"} (${body.phone || "Chưa cung cấp SĐT"}) đã gửi góp ý mới: "${body.description?.slice(0, 100) || ""}"`,
          isRead: false
        }, { transaction: t });
      });

      resolve({
        err: 0,
        msg: "Gửi thông tin liên hệ thành công!",
      });
    } catch (error) {
      reject(error);
    }
  });
