import { Op } from "sequelize";
import db from "../../models";
import moment from "moment";
import { v4 as generateId } from "uuid";
import { getStandardPostInclude } from "./postHelper";

export const getPostLimitAdminService = (page, { search, status, ...query }, id) =>
  new Promise(async (resolve, reject) => {
    try {
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const limit = +process.env.LIMIT || 10;
      const where = id ? { userId: id } : {};

      for (const [key, value] of Object.entries(query)) {
        if (value !== "" && value !== undefined && value !== null) where[key] = value;
      }

      if (search) {
        where[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { address: { [Op.like]: `%${search}%` } }
        ];
      }

      const allPosts = await db.Post.findAll({
        where, order: [["createdAt", "DESC"]],
        include: [...getStandardPostInclude(), { model: db.Overview, as: "overview" }],
      });

      let filteredRows = allPosts;
      const today = moment().startOf('day');

      if (status === "active") {
        filteredRows = allPosts.filter(item => {
          if (item.status === "pending" || item.status === "rejected") return false;
          const expDate = moment(item.overview?.expired, "DD/MM/YYYY");
          return !expDate.isValid() || expDate.isSameOrAfter(today);
        });
      } else if (status === "expired") {
        filteredRows = allPosts.filter(item => {
          if (item.status === "pending" || item.status === "rejected") return false;
          const expDate = moment(item.overview?.expired, "DD/MM/YYYY");
          return expDate.isValid() && expDate.isBefore(today);
        });
      } else if (status === "pending") {
        filteredRows = allPosts.filter(item => item.status === "pending");
      } else if (status === "rejected") {
        filteredRows = allPosts.filter(item => item.status === "rejected");
      }

      const count = filteredRows.length;
      const rows = filteredRows.slice(offset * limit, offset * limit + limit);
      resolve({ err: 0, msg: "OK", response: { count, rows: rows.map(r => r.get({ plain: true })) } });
    } catch (error) {
      reject(error);
    }
  });

export const extendPostService = (postId, userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const extendPrice = 10000;
      const extendDays = 7;

      await db.sequelize.transaction(async (transaction) => {
        const user = await db.User.findOne({ where: { id: userId }, transaction });
        if (!user || (user.balance || 0) < extendPrice) throw new Error("NOT_ENOUGH_BALANCE");

        const post = await db.Post.findOne({ where: { id: postId, userId }, include: [{ model: db.Overview, as: 'overview' }], transaction });
        if (!post) throw new Error("POST_NOT_FOUND");

        await db.User.update({ balance: (user.balance || 0) - extendPrice }, { where: { id: userId }, transaction });
        await db.Transaction.create({ id: generateId(), userId, amount: extendPrice, type: 'payment', content: `Gia hạn tin ${post.overview?.code || post.id.slice(0,8)}`, status: 'success' }, { transaction });

        const today = moment().startOf('day');
        const expMoment = moment(post.overview?.expired, "DD/MM/YYYY");
        const newExpiredDate = expMoment.isAfter(today) ? expMoment.add(extendDays, 'days') : today.add(extendDays, 'days');

        await db.Overview.update({ expired: newExpiredDate.format("DD/MM/YYYY") }, { where: { postId }, transaction });
      });
      resolve({ err: 0, msg: "Gia hạn tin thành công (7 ngày)" });
    } catch (error) {
      if (error.message === "NOT_ENOUGH_BALANCE") resolve({ err: 2, msg: "Số dư không đủ." });
      else reject(error);
    }
  });

export const rejectPostService = (postId) =>
  new Promise(async (resolve, reject) => {
    try {
      await db.sequelize.transaction(async (t) => {
        const post = await db.Post.findOne({ where: { id: postId }, transaction: t });
        if (!post) throw new Error("POST_NOT_FOUND");
        if (post.status === 'rejected') return; // Đã từ chối rồi thì thôi

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

        await db.Post.update({ status: 'rejected' }, { where: { id: postId }, transaction: t });
      });
      resolve({ err: 0, msg: "Đã từ chối bài đăng và hoàn tiền cho người dùng" });
    } catch (error) {
      if (error.message === "POST_NOT_FOUND") resolve({ err: 1, msg: "Không tìm thấy bài đăng" });
      else reject(error);
    }
  });
