import { Op } from "sequelize";
import db from "../../models";
import moment from "moment";
import { deletePost as deleteManagedPost } from "../Post/postService";

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
      if (search) where[Op.or] = [{ title: { [Op.like]: `%${search}%` } }, { address: { [Op.like]: `%${search}%` } }];

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
          if (item.status !== 'active') return false;
          const expDate = getExpDate(item.overview?.expired);
          return expDate.isValid() && expDate.isBefore(today);
        });
      } else if (status === "pending") {
        rows = rows.filter(item => item.status === "pending");
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
      });
      resolve({ err: 0, msg: "Duyệt thành công" });
    } catch (error) {
      reject(error);
    }
  });

export const rejectAdminPostService = (postId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Post.update({ status: 'rejected' }, { where: { id: postId } });
      resolve({ err: response[0] > 0 ? 0 : 1, msg: response[0] > 0 ? "Đã từ chối" : "Thất bại" });
    } catch (error) {
      reject(error);
    }
  });
