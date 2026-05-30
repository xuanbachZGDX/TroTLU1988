import db from "../models";
import { v4 as generateId } from "uuid";

export const createReportService = (userId, { postId, reason, content }) =>
  new Promise(async (resolve, reject) => {
    try {
      const post = await db.Post.findByPk(postId);
      if (!post) return resolve({ err: 1, msg: "Không tìm thấy bài đăng" });

      const report = await db.Report.create({
        id: generateId(),
        postId,
        userId,
        reason,
        content,
        status: "pending",
      });

      resolve({
        err: 0,
        msg: "Gửi báo cáo vi phạm thành công. Ban quản trị sẽ sớm xem xét.",
        data: report,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getReportsService = (page = 1, limit = 10, status = "") =>
  new Promise(async (resolve, reject) => {
    try {
      const offset = +page <= 1 ? 0 : +page - 1;
      const parsedLimit = +limit || 10;
      const where = {};
      if (status) where.status = status;

      const response = await db.Report.findAndCountAll({
        where,
        limit: parsedLimit,
        offset: offset * parsedLimit,
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: db.Post,
            as: "post",
            attributes: ["id", "title", "status"],
            include: [
              {
                model: db.User,
                as: "user",
                attributes: ["id", "name", "phone", "email"],
              },
            ],
          },
          {
            model: db.User,
            as: "reporter",
            attributes: ["id", "name", "phone"],
          },
        ],
      });

      resolve({
        err: 0,
        msg: "OK",
        response: {
          count: response.count,
          rows: response.rows,
        },
      });
    } catch (error) {
      reject(error);
    }
  });

export const handleReportService = (reportId, action, note = "") =>
  new Promise(async (resolve, reject) => {
    try {
      const report = await db.Report.findByPk(reportId);
      if (!report) return resolve({ err: 1, msg: "Không tìm thấy báo cáo" });

      if (action === "resolve") {
        await db.sequelize.transaction(async (t) => {
          // Update report status
          await db.Report.update(
            { status: "resolved" },
            { where: { id: reportId }, transaction: t },
          );

          // Update post status to blocked
          await db.Post.update(
            { status: "blocked", note: note || "Bị khóa do báo cáo vi phạm" },
            { where: { id: report.postId }, transaction: t },
          );

          // Get post & author
          const post = await db.Post.findOne({
            where: { id: report.postId },
            include: [
              {
                model: db.User,
                as: "user",
                attributes: ["id", "email", "name"],
              },
            ],
            transaction: t,
          });

          if (post) {
            // Create notification
            const { v4 } = require("uuid");
            await db.Notification.create(
              {
                id: v4(),
                senderId: null,
                recipientId: post.userId,
                postId: post.id,
                title: "Tin đăng của bạn bị khóa",
                content: `Tin đăng #${post.id.slice(0, 8).toUpperCase()} bị khóa do vi phạm: "${note || "Báo cáo của người dùng được duyệt"}".`,
                isRead: false,
              },
              { transaction: t },
            );

            // Send block mail to post owner if mail exists
            if (post.user?.email) {
              const { sendPostStatusEmail } = require("../utils/emailService");
              sendPostStatusEmail(
                post.user.email,
                post.user.name,
                post.title,
                post.id,
                "rejected",
                `Tin đăng của bạn bị khóa do vi phạm quy chế đăng tin: "${note}"`,
              );
            }
          }
        });
        resolve({
          err: 0,
          msg: "Đã xử lý báo cáo: Đã khóa bài đăng và gửi thông báo",
        });
      } else if (action === "reject") {
        await db.Report.update(
          { status: "rejected" },
          { where: { id: reportId } },
        );
        resolve({ err: 0, msg: "Đã từ chối báo cáo" });
      } else {
        resolve({ err: 1, msg: "Hành động không hợp lệ" });
      }
    } catch (error) {
      reject(error);
    }
  });
