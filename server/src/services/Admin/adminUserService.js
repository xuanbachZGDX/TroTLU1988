import { Op } from "sequelize";
import db from "../../models";

export const getAdminUsersService = (page, query) =>
  new Promise(async (resolve, reject) => {
    try {
      const { limitUser, search, role, status } = query;
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const limit = +limitUser || +process.env.LIMIT || 10;
      const where = {};

      if (role) where.role = role;
      if (status) where.status = status;
      if (search) where[Op.or] = [{ name: { [Op.like]: `%${search}%` } }, { phone: { [Op.like]: `%${search}%` } }];

      const response = await db.User.findAndCountAll({
        where, limit, offset: offset * limit, order: [["createdAt", "DESC"]], raw: true,
        attributes: { exclude: ["password", "otp", "passwordResetExpires"] },
      });

      const rows = await Promise.all(response.rows.map(async (user) => ({
        ...user, postCount: await db.Post.count({ where: { userId: user.id } }),
      })));

      resolve({ err: 0, msg: "OK", response: { count: response.count, rows } });
    } catch (error) {
      reject(error);
    }
  });

export const updateUserStatusService = (userId, status, reason = "") =>
  new Promise(async (resolve, reject) => {
    try {
      if (!["active", "blocked"].includes(status)) return resolve({ err: 1, msg: "Trạng thái không hợp lệ" });
      const user = await db.User.findOne({ where: { id: userId } });
      if (!user) return resolve({ err: 1, msg: "Không tìm thấy" });
      if (user.role === "admin") return resolve({ err: 1, msg: "Không thể khóa Admin" });

      await db.User.update({ status }, { where: { id: userId } });

      if (status === "blocked" && user.email) {
        const { sendBlockEmail } = require("../../utils/emailService");
        sendBlockEmail(user.email, user.name, reason || "Vi phạm điều khoản dịch vụ hệ thống PhongTro123.");
      }

      resolve({ err: 0, msg: "Cập nhật thành công" });
    } catch (error) {
      reject(error);
    }
  });
