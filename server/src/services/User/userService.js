import db from "../../models";

// GET CURRENT USER
export const getOne = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOne({
        where: { id },
        raw: true,
        attributes: {
          exclude: ["password"],
        },
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
      const sanitizedPayload = { ...payload };

      delete sanitizedPayload.role;
      delete sanitizedPayload.id;
      delete sanitizedPayload.balance;
      delete sanitizedPayload.status;

      if (sanitizedPayload.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(sanitizedPayload.email)) {
          return resolve({ err: 5, msg: "Email không đúng định dạng" });
        }
      }

      if (sanitizedPayload.password) {
        const bcrypt = require("bcryptjs");
        const user = await db.User.findByPk(id);
        if (!user) return resolve({ err: 2, msg: "Người dùng không tồn tại" });

        if (!sanitizedPayload.oldPassword) {
          return resolve({ err: 3, msg: "Vui lòng cung cấp mật khẩu cũ" });
        }

        const isCorrect = bcrypt.compareSync(
          sanitizedPayload.oldPassword,
          user.password,
        );
        if (!isCorrect)
          return resolve({ err: 4, msg: "Mật khẩu cũ không chính xác" });

        sanitizedPayload.password = bcrypt.hashSync(
          sanitizedPayload.password,
          bcrypt.genSaltSync(12),
        );
      }

      delete sanitizedPayload.oldPassword;

      const response = await db.User.update(sanitizedPayload, {
        where: { id },
      });
      resolve({
        err: response[0] > 0 ? 0 : 1,
        msg:
          response[0] > 0
            ? "Cập nhật thông tin thành công"
            : "Cập nhật thông tin thất bại",
      });
    } catch (error) {
      reject(error);
    }
  });

export const getMyInquiriesService = (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Contact.findAll({
        where: { userId },
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

export const getUserNotificationsService = (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Notification.findAll({
        where: { recipientId: userId },
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

export const readUserNotificationService = (notificationId, userId) =>
  new Promise(async (resolve, reject) => {
    try {
      await db.Notification.update(
        { isRead: true },
        { where: { id: notificationId, recipientId: userId } },
      );
      resolve({
        err: 0,
        msg: "Đã đánh dấu đã đọc",
      });
    } catch (error) {
      reject(error);
    }
  });

export const submitKycService = (userId, { cccdNumber, cccdFront, cccdBack }) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findByPk(userId);
      if (!user) return resolve({ err: 1, msg: "Người dùng không tồn tại" });

      await db.User.update(
        {
          cccdNumber,
          cccdFront,
          cccdBack,
          kycStatus: "pending",
          kycNote: null,
        },
        { where: { id: userId } },
      );

      resolve({
        err: 0,
        msg: "Gửi thông tin xác minh thành công. Ban quản trị đang xử lý yêu cầu của bạn.",
      });
    } catch (error) {
      reject(error);
    }
  });
