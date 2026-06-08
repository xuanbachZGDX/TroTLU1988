import { Op } from "sequelize";
import db from "../../models";
import { getStandardPostInclude } from "./postHelper";

export const getPostsService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Post.findAll({
        where: { status: "active" },
        include: getStandardPostInclude(),
        attributes: [
          "id",
          "title",
          "star",
          "address",
          "description",
          "priceNumber",
          "areaNumber",
          "published",
          "expired",
          "sourcePostRef",
          "type",
          "target",
          "bonus",
          "attributes",
          "overview",
        ],
      });
      resolve({
        err: response ? 0 : 1,
        msg: response ? "OK" : "Thất bại",
        response: response.map((r) => r.get({ plain: true })),
      });
    } catch (error) {
      reject(error);
    }
  });

export const getPostsLimitService = (
  page,
  { limitPost, order, features, ...query },
  { priceNumber, areaNumber },
) =>
  new Promise(async (resolve, reject) => {
    try {
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const limit = Math.max(+limitPost || +process.env.LIMIT || 10, 10);
      const where = { status: "active" };

      const provinceName = query.province;
      const districtName = query.district;

      for (const [key, value] of Object.entries(query)) {
        if (key !== "province" && key !== "district") {
          where[key] = Array.isArray(value) ? { [Op.in]: value } : value;
        }
      }

      if (priceNumber?.length === 2)
        where.priceNumber = { [Op.between]: priceNumber };
      if (areaNumber?.length === 2)
        where.areaNumber = { [Op.between]: areaNumber };

      if (provinceName || districtName) {
        let addressSearch = "";
        if (districtName) addressSearch += `%${districtName}%`;
        if (provinceName)
          addressSearch += `%${provinceName.replace("Thành phố ", "").replace("Tỉnh ", "").trim()}%`;
        where.address = { [Op.like]: `%${addressSearch}%` };
      }

      if (features && features.length > 0) {
        const featureCodes = Array.isArray(features) ? features : [features];
        const dbFeatures = await db.Feature.findAll({
          where: { code: { [Op.in]: featureCodes } },
          attributes: ["id"],
        });
        const featureIds = dbFeatures.map((f) => f.id);

        if (featureIds.length > 0) {
          const matchingRows = await db.PostFeature.findAll({
            where: { featureId: { [Op.in]: featureIds } },
            attributes: ["postId"],
            group: ["postId"],
            having: db.sequelize.literal(
              `COUNT(DISTINCT featureId) = ${featureIds.length}`,
            ),
          });
          const matchingPostIds = matchingRows.map((r) => r.postId);
          where.id = { [Op.in]: matchingPostIds };
        } else {
          where.id = null;
        }
      }

      const sortOrder =
        order === "new"
          ? [["createdAt", "DESC"]]
          : [
              ["star", "DESC"],
              ["createdAt", "DESC"],
            ];

      const { count, rows: idRows } = await db.Post.findAndCountAll({
        where,
        limit,
        offset: offset * limit,
        order: sortOrder,
        attributes: ["id"],
        distinct: true,
      });

      const postIds = idRows.map((r) => r.id);
      let rows = [];
      if (postIds.length > 0) {
        rows = await db.Post.findAll({
          where: { id: { [Op.in]: postIds } },
          order: sortOrder,
          include: getStandardPostInclude(),
          attributes: [
            "id",
            "title",
            "star",
            "address",
            "description",
            "priceNumber",
            "areaNumber",
            "published",
            "expired",
            "sourcePostRef",
            "type",
            "target",
            "bonus",
            "attributes",
            "overview",
          ],
        });
      }

      resolve({
        err: 0,
        msg: "OK",
        response: { count, rows: rows.map((r) => r.get({ plain: true })) },
      });
    } catch (error) {
      reject(error);
    }
  });

export const getPostByIdService = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Post.findOne({
        where: { id },
        include: getStandardPostInclude(),
      });
      resolve({
        err: response ? 0 : 1,
        msg: response ? "OK" : "Không tìm thấy bài đăng",
        response: response ? response.get({ plain: true }) : null,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getNewPostService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Post.findAll({
        where: { status: "active" },
        order: [["createdAt", "DESC"]],
        limit: Math.max(+process.env.LIMIT || 10, 10),
        include: [{ model: db.Image, as: "images", attributes: ["image"] }],
      });
      resolve({
        err: response ? 0 : 1,
        msg: response ? "OK" : "Thất bại",
        response: response.map((r) => r.get({ plain: true })),
      });
    } catch (error) {
      reject(error);
    }
  });
