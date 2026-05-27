import { Op } from "sequelize";
import db from "../../models";
import moment from "moment";
import { deletePost as deleteManagedPost } from "../Post/postService";
import { v4 as generateId } from "uuid";

const getPostInclude = () => [
  { model: db.Image, as: "images", attributes: ["image"] },
  { model: db.Attribute, as: "attributes", attributes: ["price", "acreage", "published"] },
  { model: db.User, as: "user", attributes: ["id", "name", "phone", "role"] },
  { model: db.Overview, as: "overview" },
];

export const getAdminPostsService = (page, query) =>
  new Promise(async (resolve, reject) => {
    try {
      const { limitPost, search, status, categoryCode, provinceCode } = query;
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const limit = +limitPost || +process.env.LIMIT || 10;
      const where = {};

      if (categoryCode) where.categoryCode = categoryCode;
      if (provinceCode) where.provinceCode = provinceCode;
      if (query.star !== undefined && query.star !== "") where.star = query.star;
      if (search) where[Op.or] = [{ title: { [Op.like]: `%${search}%` } }, { address: { [Op.like]: `%${search}%` } }, { id: { [Op.like]: `%${search}%` } }];

      const response = await db.Post.findAndCountAll({
        where, order: [["createdAt", "DESC"]], include: getPostInclude(),
        attributes: ["id", "title", "star", "address", "description", "createdAt", "updatedAt", "categoryCode", "provinceCode", "status"],
      });

      let rows = response.rows.map(r => r.get({ plain: true }));
      const today = moment().startOf('day');

      const getExpDate = (dateStr) => {
        if (!dateStr) return moment.invalid();
        const parts = dateStr.split(" ");
        const lastPart = parts[parts.length - 1];
        return moment(lastPart, "DD/MM/YYYY");
      };

      if (status === "active") {
        rows = rows.filter(item => {
          if (item.status !== 'active') return false;
          const expDate = getExpDate(item.overview?.expired);
          return !expDate.isValid() || expDate.isSameOrAfter(today);
        });
      } else if (status === "expired") {
        rows = rows.filter(item => {
          if (item.status !== 'active' && item.status !== 'expired') return false;
          const expDate = getExpDate(item.overview?.expired);
          return expDate.isValid() && expDate.isBefore(today);
        });
      } else if (status === "pending") {
        rows = rows.filter(item => item.status === "pending");
      } else if (status === "rejected") {
        rows = rows.filter(item => item.status === "rejected");
      } else if (status === "archived") {
        rows = rows.filter(item => item.status === "archived");
      }

      resolve({ err: 0, msg: "OK", response: { count: rows.length, rows: rows.slice(offset * limit, offset * limit + limit) } });
    } catch (error) {
      reject(error);
    }
  });

export const deleteAdminPostService = (postId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await deleteManagedPost(postId, { role: "admin" });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const approveAdminPostService = (postId) =>
  new Promise(async (resolve, reject) => {
    try {
      const post = await db.Post.findOne({ where: { id: postId } });
      if (!post) return resolve({ err: 1, msg: "Không tìm thấy" });

      await db.sequelize.transaction(async (transaction) => {
        await db.Post.update({ status: "active" }, { where: { id: postId }, transaction });
        const star = +post.star || 0;
        const expiredDays = star === 5 ? 30 : star === 4 ? 15 : star === 3 ? 10 : star === 2 ? 7 : 3;
        await db.Attribute.update({ published: moment().format("DD/MM/YYYY") }, { where: { postId }, transaction });
        await db.Overview.update({ published: moment().format("DD/MM/YYYY"), expired: moment().add(expiredDays, 'days').format("DD/MM/YYYY") }, { where: { postId }, transaction });
        
        await db.Notification.create({
          id: generateId(),
          senderId: null,
          recipientId: post.userId,
          postId: post.id,
          title: "Tin đăng đã được duyệt",
          content: `Tin đăng #${post.id.slice(0, 8).toUpperCase()} "${post.title?.slice(0, 50)}${post.title?.length > 50 ? '...' : ''}" của bạn đã được Admin phê duyệt thành công.`,
          isRead: false
        }, { transaction });
      });
      resolve({ err: 0, msg: "Duyệt thành công" });
    } catch (error) {
      reject(error);
    }
  });

export const rejectAdminPostService = (postId, reason = "") =>
  new Promise(async (resolve, reject) => {
    try {
      await db.sequelize.transaction(async (t) => {
        const post = await db.Post.findOne({ where: { id: postId }, transaction: t });
        if (!post) throw new Error("POST_NOT_FOUND");
        if (post.status === 'rejected') return;

        // Tìm giao dịch thanh toán gần nhất của tin này để hoàn tiền
        const shortId = postId.slice(0, 8);
        const lastTransaction = await db.Transaction.findOne({
          where: {
            userId: post.userId,
            type: 'payment',
            status: 'success',
            content: { [Op.like]: `%${shortId}%` }
          },
          order: [['createdAt', 'DESC']],
          transaction: t
        });

        if (lastTransaction) {
          // Hoàn tiền cho user
          const user = await db.User.findOne({ where: { id: post.userId }, transaction: t });
          if (user) {
            await db.User.update({ balance: (user.balance || 0) + lastTransaction.amount }, { where: { id: post.userId }, transaction: t });
            await db.Transaction.create({
              id: generateId(),
              userId: post.userId,
              amount: lastTransaction.amount,
              type: 'refund',
              content: `Hoàn tiền tin đăng bị từ chối: ${shortId}`,
              status: 'success'
            }, { transaction: t });
          }
        }

        await db.Post.update({ status: 'rejected', note: reason }, { where: { id: postId }, transaction: t });

        await db.Notification.create({
          id: generateId(),
          senderId: null,
          recipientId: post.userId,
          postId: post.id,
          title: "Tin đăng bị từ chối",
          content: `Tin đăng #${post.id.slice(0, 8).toUpperCase()} "${post.title?.slice(0, 50)}${post.title?.length > 50 ? '...' : ''}" của bạn bị từ chối phê duyệt. Lý do: "${reason}".`,
          isRead: false
        }, { transaction: t });
      });
      resolve({ err: 0, msg: "Đã từ chối bài đăng và hoàn tiền cho người dùng" });
    } catch (error) {
      if (error.message === "POST_NOT_FOUND") resolve({ err: 1, msg: "Không tìm thấy bài đăng" });
      else reject(error);
    }
  });

export const sweepPendingPostsService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const pendingPosts = await db.Post.findAll({
        where: { status: "pending" }
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
            where: { userId, status: "active" }
          });
          const rejectedCount = await db.Post.count({
            where: { userId, status: "rejected" }
          });

          // Điều kiện uy tín: Có tối thiểu 5 tin đăng hoạt động và chưa từng bị từ chối tin nào
          if (activeCount >= 5 && rejectedCount === 0) {
            shouldApprove = true;
          }
        }

        if (shouldApprove) {
          await db.sequelize.transaction(async (transaction) => {
            await db.Post.update({ status: "active" }, { where: { id: post.id }, transaction });
            const expiredDays = star === 5 ? 30 : star === 4 ? 15 : star === 3 ? 10 : star === 2 ? 7 : 3;
            await db.Attribute.update({ published: moment().format("DD/MM/YYYY") }, { where: { postId: post.id }, transaction });
            await db.Overview.update({ 
              published: moment().format("DD/MM/YYYY"), 
              expired: moment().add(expiredDays, 'days').format("DD/MM/YYYY") 
            }, { where: { postId: post.id }, transaction });

            await db.Notification.create({
              id: generateId(),
              senderId: null,
              recipientId: post.userId,
              postId: post.id,
              title: "Tin đăng đã được duyệt",
              content: `Tin đăng #${post.id.slice(0, 8).toUpperCase()} "${post.title?.slice(0, 50)}${post.title?.length > 50 ? '...' : ''}" của bạn đã được duyệt tự động.`,
              isRead: false
            }, { transaction });
          });
          approvedCount++;
        }
      }

      resolve({ err: 0, msg: `Quét hệ thống thành công. Đã duyệt tự động ${approvedCount} tin chờ duyệt.`, approvedCount });
    } catch (error) {
      reject(error);
    }
  });

