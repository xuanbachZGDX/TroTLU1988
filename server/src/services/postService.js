import { Op, where } from "sequelize";
import db from "../models";
import { v4 as generateId } from "uuid";
import generateCode from "../utils/generateCode.js";
import moment from "moment";

export const getPostsService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Post.findAll({
        raw: true,
        nest: true,
        include: [
          { model: db.Image, as: "images", attributes: ["image"] },
          {
            model: db.Attribute,
            as: "attributes",
            attributes: ["price", "acreage", "published"],
          },
          { model: db.User, as: "user", attributes: ["name", "zalo", "phone"] },
        ],
        attributes: ["id", "title", "star", "address", "description"],
      });
      resolve({
        err: response ? 0 : 1,
        msg: response ? "OK" : "Get posts failed",
        response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getPostsLimitService = (
  page,
  { limitPost, order, ...query },
  { priceNumber, areaNumber },
) =>
  new Promise(async (resolve, reject) => {
    try {
      let offset = !page || +page <= 1 ? 0 : +page - 1;
      const limit = +limitPost || +process.env.LIMIT;

      const where = {};
      for (const [key, value] of Object.entries(query)) {
        if (Array.isArray(value)) {
          where[key] = { [Op.in]: value }; 
        } else {
          where[key] = value;              
        }
      }

      // Thêm điều kiện lọc khoảng giá và diện tích
      if (priceNumber?.length === 2) {
        where.priceNumber = { [Op.between]: priceNumber };
      }
      if (areaNumber?.length === 2) {
        where.areaNumber = { [Op.between]: areaNumber };
      }

      const response = await db.Post.findAndCountAll({
        where,                 
        limit,                  
        order: order ? [order] : [["createdAt", "DESC"]], 
        raw: true,
        nest: true,
        offset: offset * limit,
        include: [
          { model: db.Image, as: "images", attributes: ["image"] },
          {
            model: db.Attribute,
            as: "attributes",
            attributes: ["price", "acreage", "published"],
          },
          { model: db.User, as: "user", attributes: ["name", "zalo", "phone"] },
        ],
        attributes: ["id", "title", "star", "address", "description"],
      });
      resolve({
        err: response ? 0 : 1,
        msg: response ? "OK" : "Get posts failed",
        response,
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
        raw: true,
        nest: true,
        include: [
          { model: db.Image, as: "images", attributes: ["image"] },
          { model: db.Attribute, as: "attributes", attributes: ["price", "acreage", "published", "features"] },
          { model: db.User, as: "user", attributes: ["name", "zalo", "phone", "avatar", "createdAt"] },
          { model: db.Overview, as: "overview" },
        ],
      });
      resolve({
        err: response ? 0 : 1,
        msg: response ? "OK" : "Không tìm thấy bài đăng",
        response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getNewPostService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Post.findAll({
        raw: true,
        nest: true,
        offset: 0,
        order: [["createdAt", "DESC"]],
        limit: +process.env.LIMIT,
        include: [
          { model: db.Image, as: "images", attributes: ["image"] },
          {
            model: db.Attribute,
            as: "attributes",
            attributes: ["price", "acreage", "published"],
          },
        ],
        attributes: ["id", "title", "star", "createdAt"],
      });
      resolve({
        err: response ? 0 : 1,
        msg: response ? "OK" : "Get posts failed",
        response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const createNewPostService = (body, userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const attributeId = generateId();
      const imageId = generateId();
      const overviewId = generateId();
      const labelCode = generateCode(body.label);

      const priceNumber = body.priceNumber || 0;
      const areaNumber = body.areaNumber || 0;

      // Tính ngày hết hạn (10 ngày sau)
      const expiredDate = new Date();
      expiredDate.setDate(expiredDate.getDate() + 10);

      const response = await db.Post.create({
        id: generateId(),
        title: body.title || "",
        labelCode,
        address: body.address || "",
        attributeId,
        categoryCode: body.categoryCode || "",
        description: JSON.stringify(body.description) || "",
        userId,
        overviewId,
        imageId,
        areaCode: body.areaCode || "",
        priceCode: body.priceCode || "",
        provinceCode: body?.provinceCode?.includes("Thành phố")
          ? generateCode(body.provinceCode.replace("Thành phố", ""))
          : generateCode(body.provinceCode.replace("Tỉnh", "")),
        priceNumber,
        areaNumber,
      });

      await db.Attribute.create({
        id: attributeId,
        price:
          body.priceNumber < 1
            ? `${body.priceNumber * 1000000} đồng/tháng`
            : `${body.priceNumber} triệu/tháng`,
        acreage: `${body.areaNumber} m2`,
        published: moment(new Date()).format("DD/MM/YYYY"),
        features: JSON.stringify(body.features || []),
      });

      await db.Image.create({
        id: imageId,
        image: JSON.stringify(body.images || []),
      });

      await db.Overview.create({
        id: overviewId,
        code: `#${Math.floor(Math.random() * Math.pow(10, 6))}`,
        area: body.label,
        target: body.target || "Tất cả",
        created: new Date(),
        expired: expiredDate,
      });

      const provinceValue =
        body?.provinceCode?.replace("Thành phố", "") ||
        body?.provinceCode?.replace("Tỉnh", "");

      if (provinceValue) {
        await db.Province.findOrCreate({
          where: {
            [Op.or]: [{ value: provinceValue }],
          },
          defaults: {
            code: body?.provinceCode?.includes("Thành phố")
              ? generateCode(body.provinceCode.replace("Thành phố", ""))
              : generateCode(body.provinceCode.replace("Tỉnh", "")),
            value: provinceValue,
          },
        });
      }

      await db.Label.findOrCreate({
        where: { code: labelCode },
        defaults: {
          code: labelCode,
          value: body?.label || "",
        },
      });

      resolve({
        err: 0,
        msg: "OK",
      });
    } catch (error) {
      reject(error);
    }
  });

export const getPostLimitAdminService = (page, query, id) =>
  new Promise(async (resolve, reject) => {
    try {
      let offset = !page || +page <= 1 ? 0 : +page - 1;
      const queries = { ...query, userId: id };

      const response = await db.Post.findAndCountAll({
        where: queries,
        raw: true,
        nest: true,
        offset: offset * +process.env.LIMIT,
        limit: +process.env.LIMIT,
        order: [["createdAt", "DESC"]],
        include: [
          { model: db.Image, as: "images", attributes: ["image"] },
          {
            model: db.Attribute,
            as: "attributes",
            attributes: ["price", "acreage", "published"],
          },
          { model: db.User, as: "user", attributes: ["name", "zalo", "phone"] },
          { model: db.Overview, as: "overview" },
        ],
        // attributes: ["id", "title", "star", "address", "description", "createdAt"],
      });
      resolve({
        err: response ? 0 : 1,
        msg: response ? "OK" : "Get posts failed",
        response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updatePost = (postId, payload) =>
  new Promise(async (resolve, reject) => {
    try {
      const { overviewId, imageId, attributeId, ...body } = payload;
      const labelCode = generateCode(body.label);
      const priceNumber = body.priceNumber || 0;
      const areaNumber = body.areaNumber || 0;

      await db.Post.update(
        {
          title: body.title || "",
          labelCode,
          address: body.address || "",
          categoryCode: body.categoryCode || "",
          description: JSON.stringify(body.description) || "",
          areaCode: body.areaCode || "",
          priceCode: body.priceCode || "",
          provinceCode: body?.provinceCode?.includes("Thành phố")
            ? generateCode(body.provinceCode.replace("Thành phố", ""))
            : generateCode(body.provinceCode.replace("Tỉnh", "")),
          priceNumber,
          areaNumber,
        },
        {
          where: { id: postId },
        },
      );

      if (attributeId) {
        await db.Attribute.update(
          {
            price:
              body.priceNumber < 1
                ? `${body.priceNumber * 1000000} đồng/tháng`
                : `${body.priceNumber} triệu/tháng`,
            acreage: `${body.areaNumber} m2`,
            features: JSON.stringify(body.features || []),
          },
          {
            where: { id: attributeId },
          },
        );
      }

      if (imageId) {
        await db.Image.update(
          {
            image: JSON.stringify(body.images || []),
          },
          {
            where: { id: imageId },
          },
        );
      }

      if (overviewId) {
        await db.Overview.update(
          {
            area: body.label,
            type: body.categoryCode,
            target: body.target || "Tất cả",
          },
          {
            where: { id: overviewId },
          },
        );
      }

      const provinceValue =
        body?.provinceCode?.replace("Thành phố", "") ||
        body?.provinceCode?.replace("Tỉnh", "");

      if (provinceValue) {
        await db.Province.findOrCreate({
          where: {
            [Op.or]: [{ value: provinceValue }],
          },
          defaults: {
            code: body?.provinceCode?.includes("Thành phố")
              ? generateCode(body.provinceCode.replace("Thành phố", ""))
              : generateCode(body.provinceCode.replace("Tỉnh", "")),
            value: provinceValue,
          },
        });
      }

      await db.Label.findOrCreate({
        where: { code: labelCode },
        defaults: {
          code: labelCode,
          value: body?.label || "",
        },
      });

      resolve({
        err: 0,
        msg: "Update post successfully",
      });
    } catch (error) {
      reject(error);
    }
  });

export const deletePost = (postId) =>
  new Promise(async (resolve, reject) => {
    try {
      const post = await db.Post.findOne({
        where: { id: postId },
        raw: true,
      });

      if (!post) {
        return resolve({
          err: 1,
          msg: "Không tìm thấy bài đăng",
        });
      }

      const { attributeId, imageId, overviewId } = post;

      const response = await db.Post.destroy({
        where: { id: postId },
      });

      if (response > 0) {
        if (attributeId)
          await db.Attribute.destroy({ where: { id: attributeId } });
        if (imageId) await db.Image.destroy({ where: { id: imageId } });
        if (overviewId)
          await db.Overview.destroy({ where: { id: overviewId } });
      }

      resolve({
        err: response > 0 ? 0 : 1,
        msg: response > 0 ? "Xóa tin đăng thành công" : "Xóa tin đăng thất bại",
      });
    } catch (error) {
      reject(error);
    }
  });
