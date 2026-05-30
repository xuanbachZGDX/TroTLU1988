import { Op } from "sequelize";
import db from "../../models";
import moment from "moment";
import { v4 as generateId } from "uuid";

export const approveAdminPostService = (postId) =>
  new Promise(async (resolve, reject) => {
    try {
      const post = await db.Post.findOne({
        where: { id: postId },
        include: [
          { model: db.User, as: "user", attributes: ["id", "email", "name"] },
        ],
      });
      if (!post) return resolve({ err: 1, msg: "Không tìm thấy" });

      await db.sequelize.transaction(async (transaction) => {
        const star = +post.star || 0;
        const expiredDays =
          star === 5
            ? 30
            : star === 4
              ? 15
              : star === 3
                ? 10
                : star === 2
                  ? 7
                  : 3;
        await db.Post.update(
          {
            status: "active",
            published: moment().format("DD/MM/YYYY"),
            expired: moment().add(expiredDays, "days").format("DD/MM/YYYY"),
          },
          { where: { id: postId }, transaction },
        );

        await db.Notification.create(
          {
            id: generateId(),
            senderId: null,
            recipientId: post.userId,
            postId: post.id,
            title: "Tin đăng đã được duyệt",
            content: `Tin đăng #${post.id.slice(0, 8).toUpperCase()} "${post.title?.slice(0, 50)}${post.title?.length > 50 ? "..." : ""}" của bạn đã được Admin phê duyệt thành công.`,
            isRead: false,
          },
          { transaction },
        );
      });

      // Gửi email thông báo tự động cho chủ trọ
      if (post.user?.email) {
        const { sendPostStatusEmail } = require("../../utils/emailService");
        sendPostStatusEmail(
          post.user.email,
          post.user.name,
          post.title,
          post.id,
          "active",
        );
      }

      resolve({ err: 0, msg: "Duyệt thành công" });
    } catch (error) {
      reject(error);
    }
  });

export const rejectAdminPostService = (postId, reason = "") =>
  new Promise(async (resolve, reject) => {
    try {
      const post = await db.Post.findOne({
        where: { id: postId },
        include: [
          { model: db.User, as: "user", attributes: ["id", "email", "name"] },
        ],
      });
      if (!post) throw new Error("POST_NOT_FOUND");

      await db.sequelize.transaction(async (t) => {
        if (post.status === "rejected") return;

        // Tìm giao dịch thanh toán gần nhất của tin này để hoàn tiền
        const shortId = postId.slice(0, 8);
        const lastTransaction = await db.Transaction.findOne({
          where: {
            userId: post.userId,
            type: "payment",
            status: "success",
            content: { [Op.like]: `%${shortId}%` },
          },
          order: [["createdAt", "DESC"]],
          transaction: t,
        });

        if (lastTransaction) {
          // Hoàn tiền cho user
          const user = await db.User.findOne({
            where: { id: post.userId },
            transaction: t,
          });
          if (user) {
            await db.User.update(
              { balance: (user.balance || 0) + lastTransaction.amount },
              { where: { id: post.userId }, transaction: t },
            );
            await db.Transaction.create(
              {
                id: generateId(),
                userId: post.userId,
                amount: lastTransaction.amount,
                type: "refund",
                content: `Hoàn tiền tin đăng bị từ chối: ${shortId}`,
                status: "success",
              },
              { transaction: t },
            );
          }
        }

        await db.Post.update(
          { status: "rejected", note: reason },
          { where: { id: postId }, transaction: t },
        );

        await db.Notification.create(
          {
            id: generateId(),
            senderId: null,
            recipientId: post.userId,
            postId: post.id,
            title: "Tin đăng bị từ chối",
            content: `Tin đăng #${post.id.slice(0, 8).toUpperCase()} "${post.title?.slice(0, 50)}${post.title?.length > 50 ? "..." : ""}" của bạn bị từ chối phê duyệt. Lý do: "${reason}".`,
            isRead: false,
          },
          { transaction: t },
        );
      });

      // Gửi email thông báo tự động cho chủ trọ kèm lý do từ chối
      if (post.user?.email) {
        const { sendPostStatusEmail } = require("../../utils/emailService");
        sendPostStatusEmail(
          post.user.email,
          post.user.name,
          post.title,
          post.id,
          "rejected",
          reason,
        );
      }

      resolve({
        err: 0,
        msg: "Đã từ chối bài đăng và hoàn tiền cho người dùng",
      });
    } catch (error) {
      if (error.message === "POST_NOT_FOUND")
        resolve({ err: 1, msg: "Không tìm thấy bài đăng" });
      else reject(error);
    }
  });
