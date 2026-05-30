import { Op } from "sequelize";
import db from "../../models";
import { sendBlockEmail } from "../../utils/emailService";

export const getAdminUsersService = (page, query) =>
  new Promise(async (resolve, reject) => {
    try {
      const { limitUser, search, role, status } = query;
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const limit = +limitUser || +process.env.LIMIT || 10;
      const where = {};

      if (role) where.role = role;
      if (status) where.status = status;
      if (search)
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } },
        ];

      const response = await db.User.findAndCountAll({
        where,
        limit,
        offset: offset * limit,
        order: [["createdAt", "DESC"]],
        raw: true,
        attributes: { exclude: ["password", "otp", "passwordResetExpires"] },
      });

      const rows = await Promise.all(
        response.rows.map(async (user) => ({
          ...user,
          postCount: await db.Post.count({ where: { userId: user.id } }),
        })),
      );

      resolve({ err: 0, msg: "OK", response: { count: response.count, rows } });
    } catch (error) {
      reject(error);
    }
  });

export const updateUserStatusService = (userId, status, reason = "") =>
  new Promise(async (resolve, reject) => {
    try {
      if (!["active", "blocked"].includes(status))
        return resolve({ err: 1, msg: "Trạng thái không hợp lệ" });
      const user = await db.User.findOne({ where: { id: userId } });
      if (!user) return resolve({ err: 1, msg: "Không tìm thấy" });
      if (user.role === "admin")
        return resolve({ err: 1, msg: "Không thể khóa Admin" });

      await db.User.update({ status }, { where: { id: userId } });

      if (status === "blocked" && user.email) {
        sendBlockEmail(
          user.email,
          user.name,
          reason || "Vi phạm điều khoản dịch vụ hệ thống TLU.com.",
        );
      }

      resolve({ err: 0, msg: "Cập nhật thành công" });
    } catch (error) {
      reject(error);
    }
  });

export const getKycPendingUsersService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findAll({
        where: { kycStatus: "pending" },
        attributes: { exclude: ["password", "otp", "passwordResetExpires"] },
        order: [["updatedAt", "DESC"]],
        raw: true,
      });
      resolve({ err: 0, msg: "OK", response });
    } catch (error) {
      reject(error);
    }
  });

export const handleKycService = (userId, action, note = "") =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findByPk(userId);
      if (!user) return resolve({ err: 1, msg: "Người dùng không tồn tại" });

      if (action === "approve") {
        await db.User.update(
          { kycStatus: "verified", kycNote: note || "Đã xác minh danh tính" },
          { where: { id: userId } },
        );

        // Notify user
        const { v4 } = require("uuid");
        await db.Notification.create({
          id: v4(),
          senderId: null,
          recipientId: userId,
          postId: null,
          title: "Xác minh danh tính thành công",
          content:
            "Chúc mừng! Tài khoản của bạn đã được xác minh danh tính thành công.",
          isRead: false,
        });

        resolve({ err: 0, msg: "Đã phê duyệt xác minh danh tính thành công" });
      } else if (action === "reject") {
        await db.User.update(
          {
            kycStatus: "rejected",
            kycNote:
              note ||
              "Từ chối do hình ảnh không hợp lệ hoặc thông tin sai lệch",
          },
          { where: { id: userId } },
        );

        // Notify user
        const { v4 } = require("uuid");
        await db.Notification.create({
          id: v4(),
          senderId: null,
          recipientId: userId,
          postId: null,
          title: "Yêu cầu xác minh danh tính bị từ chối",
          content: `Yêu cầu xác minh danh tính của bạn bị từ chối. Lý do: "${note || "Hình ảnh không rõ nét hoặc sai lệch thông tin"}". Vui lòng gửi lại.`,
          isRead: false,
        });

        resolve({ err: 0, msg: "Đã từ chối yêu cầu xác minh danh tính" });
      } else {
        resolve({ err: 1, msg: "Hành động không hợp lệ" });
      }
    } catch (error) {
      reject(error);
    }
  });
