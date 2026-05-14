import { Op } from "sequelize";
import db from "../../models";
import { getStandardPostInclude } from "./postHelper";

export const getPostsService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Post.findAll({
        where: { status: 'active' },
        include: getStandardPostInclude(),
        attributes: ["id", "title", "star", "address", "description"],
      });
      resolve({ err: response ? 0 : 1, msg: response ? "OK" : "Thất bại", response: response.map(r => r.get({ plain: true })) });
    } catch (error) {
      reject(error);
    }
  });

export const getPostsLimitService = (page, { limitPost, order, features, ...query }, { priceNumber, areaNumber }) =>
  new Promise(async (resolve, reject) => {
    try {
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const limit = Math.max(+limitPost || +process.env.LIMIT || 10, 10);
      const where = { status: 'active' };
      
      const provinceName = query.province;
      const districtName = query.district;
      
      for (const [key, value] of Object.entries(query)) {
        if (key !== 'province' && key !== 'district') {
          where[key] = Array.isArray(value) ? { [Op.in]: value } : value;
        }
      }

      if (priceNumber?.length === 2) where.priceNumber = { [Op.between]: priceNumber };
      if (areaNumber?.length === 2) where.areaNumber = { [Op.between]: areaNumber };

      if (provinceName || districtName) {
        let addressSearch = "";
        if (districtName) addressSearch += `%${districtName}%`;
        if (provinceName) addressSearch += `%${provinceName.replace('Thành phố ', '').replace('Tỉnh ', '').trim()}%`;
        where.address = { [Op.like]: `%${addressSearch}%` };
      }

      const includeForIds = [];
      if (features && features.length > 0) {
        const featureCodes = Array.isArray(features) ? features : [features];
        includeForIds.push({
          model: db.Feature, as: "features",
          where: { code: { [Op.in]: featureCodes } },
          attributes: [], through: { attributes: [] }
        });
      }

      const sortOrder = order === 'new' ? [["createdAt", "DESC"]] : [["star", "DESC"], ["createdAt", "DESC"]];

      const { count, rows: idRows } = await db.Post.findAndCountAll({
        where, limit, offset: offset * limit, order: sortOrder,
        attributes: ["id"], distinct: true, include: includeForIds,
      });

      const postIds = idRows.map(r => r.id);
      let rows = [];
      if (postIds.length > 0) {
        rows = await db.Post.findAll({
          where: { id: { [Op.in]: postIds } },
          order: sortOrder,
          include: getStandardPostInclude(),
          attributes: ["id", "title", "star", "address", "description"],
        });
      }

      resolve({ err: 0, msg: "OK", response: { count, rows: rows.map(r => r.get({ plain: true })) } });
    } catch (error) {
      reject(error);
    }
  });

export const getPostByIdService = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Post.findOne({
        where: { id },
        include: [...getStandardPostInclude(), { model: db.Overview, as: "overview" }],
      });
      resolve({ err: response ? 0 : 1, msg: response ? "OK" : "Không tìm thấy bài đăng", response: response ? response.get({ plain: true }) : null });
    } catch (error) {
      reject(error);
    }
  });

export const getNewPostService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Post.findAll({
        where: { status: 'active' },
        order: [["createdAt", "DESC"]],
        limit: Math.max(+process.env.LIMIT || 10, 10),
        include: [
          { model: db.Image, as: "images", attributes: ["image"] },
          { model: db.Attribute, as: "attributes", attributes: ["price", "acreage", "published"] },
        ],
        attributes: ["id", "title", "star", "createdAt"],
      });
      resolve({ err: response ? 0 : 1, msg: response ? "OK" : "Thất bại", response: response.map(r => r.get({ plain: true })) });
    } catch (error) {
      reject(error);
    }
  });
