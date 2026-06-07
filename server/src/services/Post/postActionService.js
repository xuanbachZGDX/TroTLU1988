import db from "../../models";
import { createNewPostService } from "./Action/postCreateService";
import { updatePost } from "./Action/postUpdateService";
import { v4 as generateId } from "uuid";
import { Op } from "sequelize";

export { createNewPostService, updatePost };

export const deletePost = (postId, actor) =>
  new Promise(async (resolve, reject) => {
    try {
      const where =
        actor?.role === "admin"
          ? { id: postId }
          : { id: postId, userId: actor?.id };
      const post = await db.Post.findOne({ where });
      if (!post) return resolve({ err: 1, msg: "Không tìm thấy bài đăng" });

      await db.sequelize.transaction(async (transaction) => {
        // Nếu ở trạng thái chờ duyệt thì hoàn tiền đăng tin
        if (post.status === "pending") {
          const shortId = postId.slice(0, 8);
          const paymentTx = await db.Transaction.findOne({
            where: {
              userId: post.userId,
              type: "payment",
              status: "success",
              content: { [Op.like]: `%${shortId}%` },
            },
            order: [["createdAt", "DESC"]],
            transaction,
          });

          if (paymentTx) {
            // Kiểm tra xem đã có giao dịch hoàn tiền cho tin này sau giao dịch thanh toán hay chưa
            const refundTx = await db.Transaction.findOne({
              where: {
                userId: post.userId,
                type: "refund",
                status: "success",
                content: { [Op.like]: `%${shortId}%` },
                createdAt: { [Op.gt]: paymentTx.createdAt },
              },
              transaction,
            });

            if (!refundTx) {
              const user = await db.User.findOne({
                where: { id: post.userId },
                transaction,
                lock: transaction.LOCK.UPDATE,
              });
              if (user) {
                await db.User.update(
                  { balance: (user.balance || 0) + paymentTx.amount },
                  { where: { id: post.userId }, transaction },
                );
                await db.Transaction.create(
                  {
                    id: generateId(),
                    userId: post.userId,
                    amount: paymentTx.amount,
                    type: "refund",
                    content: `Hoàn phí hủy tin đăng chờ duyệt - Mã tin: ${shortId}`,
                    status: "success",
                  },
                  { transaction },
                );
              }
            }
          }
        }

        // Thay vì destroy, chuyển trạng thái thành 'archived' để lưu trữ vào kho ẩn
        await db.Post.update(
          { status: "archived" },
          { where: { id: postId }, transaction },
        );

        // Tạo thông báo cho Admin nếu chủ trọ tự ẩn tin
        if (actor?.role !== "admin") {
          const userRecord = await db.User.findOne({
            where: { id: post.userId },
            transaction,
          });
          const landlordName = userRecord?.name || "Chủ trọ";
          const { v4 } = require("uuid");
          await db.Notification.create(
            {
              id: v4(),
              postId,
              senderId: actor?.id || post.userId,
              title: "Tin đăng đã bị ẩn",
              content: `Chủ trọ ${landlordName} đã ẩn tin đăng #${postId.slice(0, 8).toUpperCase()} và đưa vào Kho lưu trữ.`,
              isRead: false,
            },
            { transaction },
          );
        }
      });
      resolve({ err: 0, msg: "Lưu trữ tin đăng vào kho thành công" });
    } catch (error) {
      reject(error);
    }
  });

export const restorePost = (postId, actor) =>
  new Promise(async (resolve, reject) => {
    try {
      const where =
        actor?.role === "admin"
          ? { id: postId }
          : { id: postId, userId: actor?.id };
      const post = await db.Post.findOne({ where });
      if (!post) return resolve({ err: 1, msg: "Không tìm thấy bài đăng" });
      if (post.status !== "archived")
        return resolve({ err: 2, msg: "Bài đăng không nằm trong kho lưu trữ" });

      await db.sequelize.transaction(async (transaction) => {
        await db.Post.update(
          { status: "pending" },
          { where: { id: postId }, transaction },
        );

        // Nếu người khôi phục là chủ trọ thì gửi thông báo cho Admin duyệt lại
        if (actor?.role !== "admin") {
          const userRecord = await db.User.findByPk(actor?.id || post.userId);
          const landlordName = userRecord?.name || "Chủ trọ";
          const { v4 } = require("uuid");
          await db.Notification.create(
            {
              id: v4(),
              postId,
              senderId: actor?.id || post.userId,
              title: "Yêu cầu khôi phục tin đăng",
              content: `Chủ trọ ${landlordName} đã khôi phục bài đăng #${postId.slice(0, 8).toUpperCase()} từ Kho lưu trữ. Vui lòng duyệt lại.`,
              isRead: false,
            },
            { transaction },
          );
        }
      });

      resolve({
        err: 0,
        msg: "Khôi phục bài đăng thành công, đang chờ duyệt lại!",
      });
    } catch (error) {
      reject(error);
    }
  });

export const getPostHistoryService = (postId, actor) =>
  new Promise(async (resolve, reject) => {
    try {
      const where =
        actor?.role === "admin"
          ? { id: postId }
          : { id: postId, userId: actor?.id };
      const post = await db.Post.findOne({ where });
      if (!post)
        return resolve({
          err: 1,
          msg: "Không tìm thấy bài đăng hoặc bạn không có quyền xem lịch sử",
        });

      const history = await db.PostHistory.findAll({
        where: { postId },
        include: [
          {
            model: db.User,
            as: "editor",
            attributes: ["id", "name", "phone", "avatar"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      resolve({
        err: 0,
        msg: "Lấy lịch sử thay đổi thành công",
        data: history,
      });
    } catch (error) {
      reject(error);
    }
  });
