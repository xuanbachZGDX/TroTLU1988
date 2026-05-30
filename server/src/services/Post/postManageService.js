import { Op } from "sequelize";
import db from "../../models";
import moment from "moment";
import { v4 as generateId } from "uuid";
import { getStandardPostInclude } from "./postHelper";

export const getPostLimitAdminService = (
  page,
  { search, status, ...query },
  id,
) =>
  new Promise(async (resolve, reject) => {
    try {
      const pageInt = !page || +page <= 1 ? 0 : +page - 1;
      const limit = +process.env.LIMIT || 10;
      const offset = pageInt * limit;
      const where = id ? { userId: id } : {};

      for (const [key, value] of Object.entries(query)) {
        if (value !== "" && value !== undefined && value !== null)
          where[key] = value;
      }

      if (search) {
        where[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { address: { [Op.like]: `%${search}%` } },
          { id: { [Op.like]: `%${search}%` } },
        ];
      }

      const todayStr = moment().format("YYYY-MM-DD");
      const overviewWhere = {};

      if (status === "active") {
        where.status = "active";
        where[Op.and] = [
          db.sequelize.literal(
            `STR_TO_DATE(expired, '%d/%m/%Y') >= '${todayStr}'`,
          ),
        ];
      } else if (status === "expired") {
        where.status = { [Op.in]: ["active", "expired"] };
        where[Op.and] = [
          db.sequelize.literal(
            `STR_TO_DATE(expired, '%d/%m/%Y') < '${todayStr}'`,
          ),
        ];
      } else if (
        status === "pending" ||
        status === "rejected" ||
        status === "archived" ||
        status === "blocked"
      ) {
        where.status = status;
      } else {
        // Mặc định không hiển thị tin đã ẩn (archived) ở danh sách chính
        where.status = { [Op.ne]: "archived" };
      }

      const response = await db.Post.findAndCountAll({
        where,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
        include: getStandardPostInclude(),
        distinct: true,
      });

      resolve({
        err: 0,
        msg: "OK",
        response: {
          count: response.count,
          rows: response.rows.map((r) => r.get({ plain: true })),
        },
      });
    } catch (error) {
      reject(error);
    }
  });

export const extendPostService = (postId, userId, days = 7, newStar = null) =>
  new Promise(async (resolve, reject) => {
    try {
      const daysInt = parseInt(days);
      if (isNaN(daysInt) || daysInt <= 0) throw new Error("INVALID_DAYS");

      await db.sequelize.transaction(async (transaction) => {
        const post = await db.Post.findOne({
          where: { id: postId, userId },
          transaction,
        });
        if (!post) throw new Error("POST_NOT_FOUND");

        // Tính giá dựa trên số sao (loại tin)
        // 5 sao: 10k, 4 sao: 7k, 3 sao: 5k, 2 sao: 3k, 0 sao: 1k
        const star = newStar !== null ? parseInt(newStar) : post.star || 0;

        // Fetch package price from database dynamically
        const targetPackage = await db.Package.findOne({
          where: { star },
          transaction,
        });
        const pricePerDay = targetPackage
          ? targetPackage.price
          : star === 5
            ? 10000
            : star === 4
              ? 7000
              : star === 3
                ? 5000
                : star === 2
                  ? 3000
                  : 1000;

        const totalPrice = pricePerDay * daysInt;

        const user = await db.User.findOne({
          where: { id: userId },
          transaction,
          lock: transaction.LOCK.UPDATE,
        });
        if (!user || (user.balance || 0) < totalPrice)
          throw new Error("NOT_ENOUGH_BALANCE");

        await db.User.update(
          { balance: (user.balance || 0) - totalPrice },
          { where: { id: userId }, transaction },
        );

        // Cập nhật lại số sao cho tin nếu có thay đổi
        if (newStar !== null) {
          await db.Post.update(
            { star },
            { where: { id: postId }, transaction },
          );
        }

        await db.Transaction.create(
          {
            id: generateId(),
            userId,
            amount: totalPrice,
            type: "payment",
            content: `Gia hạn ${newStar !== null ? "& Nâng cấp" : ""} tin ${post.overviewCode || post.id.slice(0, 8)} thêm ${daysInt} ngày`,
            status: "success",
          },
          { transaction },
        );

        const today = moment().startOf("day");
        const expMoment = moment(post.expired, "DD/MM/YYYY");

        // Nếu tin chưa hết hạn thì cộng dồn từ ngày hết hạn cũ, nếu đã hết hạn thì cộng từ hôm nay
        const newExpiredDate =
          expMoment.isValid() && expMoment.isAfter(today)
            ? expMoment.add(daysInt, "days")
            : today.add(daysInt, "days");

        await db.Post.update(
          { expired: newExpiredDate.format("DD/MM/YYYY") },
          { where: { id: postId }, transaction },
        );
      });
      resolve({ err: 0, msg: `Gia hạn tin thành công (${days} ngày)` });
    } catch (error) {
      if (error.message === "NOT_ENOUGH_BALANCE")
        resolve({ err: 2, msg: "Số dư ví không đủ để thực hiện gia hạn." });
      else if (error.message === "INVALID_DAYS")
        resolve({ err: 1, msg: "Số ngày gia hạn không hợp lệ." });
      else reject(error);
    }
  });

export const rejectPostService = (postId) =>
  new Promise(async (resolve, reject) => {
    try {
      await db.sequelize.transaction(async (t) => {
        const post = await db.Post.findOne({
          where: { id: postId },
          transaction: t,
        });
        if (!post) throw new Error("POST_NOT_FOUND");
        if (post.status === "rejected") return; // Đã từ chối rồi thì thôi

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
          { status: "rejected" },
          { where: { id: postId }, transaction: t },
        );
      });
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
