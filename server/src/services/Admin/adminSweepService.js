import db from "../../models";
import moment from "moment";
import { v4 as generateId } from "uuid";

export const sweepPendingPostsService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const pendingPosts = await db.Post.findAll({
        where: { status: "pending" },
      });

      let approvedCount = 0;

      for (const post of pendingPosts) {
        const userId = post.userId;
        const star = +post.star || 0;

        // Tầng 1: Nếu là tin đăng VIP thì được tự động duyệt ngay
        let shouldApprove = star > 0;

        // Tầng 2: Nếu là tin thường, kiểm tra lịch sử chủ trọ uy tín
        if (!shouldApprove) {
          const activeCount = await db.Post.count({
            where: { userId, status: "active" },
          });
          const rejectedCount = await db.Post.count({
            where: { userId, status: "rejected" },
          });

          // Điều kiện uy tín: Có tối thiểu 5 tin đăng hoạt động và chưa từng bị từ chối tin nào
          if (activeCount >= 5 && rejectedCount === 0) {
            shouldApprove = true;
          }
        }

        if (shouldApprove) {
          await db.sequelize.transaction(async (transaction) => {
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
              { where: { id: post.id }, transaction },
            );

            await db.Notification.create(
              {
                id: generateId(),
                senderId: null,
                recipientId: post.userId,
                postId: post.id,
                title: "Tin đăng đã được duyệt",
                content: `Tin đăng #${post.id.slice(0, 8).toUpperCase()} "${post.title?.slice(0, 50)}${post.title?.length > 50 ? "..." : ""}" của bạn đã được duyệt tự động.`,
                isRead: false,
              },
              { transaction },
            );
          });
          approvedCount++;
        }
      }

      resolve({
        err: 0,
        msg: `Quét hệ thống thành công. Đã duyệt tự động ${approvedCount} tin chờ duyệt.`,
        approvedCount,
      });
    } catch (error) {
      reject(error);
    }
  });
