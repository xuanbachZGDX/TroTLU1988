import { Op } from "sequelize";
import db from "../../models";
import moment from "moment";
import { deletePost as deleteManagedPost } from "../Post/postService";

export * from "./adminPostDecisionService";
export * from "./adminSweepService";

const getPostInclude = () => [
  { model: db.Image, as: "images", attributes: ["image"] },
  { model: db.User, as: "user", attributes: ["id", "name", "phone", "role"] },
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
      if (query.star !== undefined && query.star !== "")
        where.star = query.star;
      if (search)
        where[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { address: { [Op.like]: `%${search}%` } },
          { id: { [Op.like]: `%${search}%` } },
        ];

      const response = await db.Post.findAndCountAll({
        where,
        order: [["createdAt", "DESC"]],
        include: getPostInclude(),
      });

      let rows = response.rows.map((r) => r.get({ plain: true }));
      const today = moment().startOf("day");

      const getExpDate = (dateStr) => {
        if (!dateStr) return moment.invalid();
        const parts = dateStr.split(" ");
        const lastPart = parts[parts.length - 1];
        return moment(lastPart, "DD/MM/YYYY");
      };

      if (status === "active") {
        rows = rows.filter((item) => {
          if (item.status !== "active") return false;
          const expDate = getExpDate(item.overview?.expired);
          return !expDate.isValid() || expDate.isSameOrAfter(today);
        });
      } else if (status === "expired") {
        rows = rows.filter((item) => {
          if (item.status !== "active" && item.status !== "expired")
            return false;
          const expDate = getExpDate(item.overview?.expired);
          return expDate.isValid() && expDate.isBefore(today);
        });
      } else if (status === "pending") {
        rows = rows.filter((item) => item.status === "pending");
      } else if (status === "rejected") {
        rows = rows.filter((item) => item.status === "rejected");
      } else if (status === "archived") {
        rows = rows.filter((item) => item.status === "archived");
      } else if (status === "blocked") {
        rows = rows.filter((item) => item.status === "blocked");
      }

      resolve({
        err: 0,
        msg: "OK",
        response: {
          count: rows.length,
          rows: rows.slice(offset * limit, offset * limit + limit),
        },
      });
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
