import db from "../../models";
import { v4 as generateId } from "uuid";
import generateCode from "../../utils/generateCode";

// CATEGORIES CRUD SERVICES
export const createCategoryService = (body) =>
  new Promise(async (resolve, reject) => {
    try {
      if (!body.value) {
        return resolve({ err: 1, msg: "Missing category value" });
      }
      const code = generateCode(body.value);
      const isExist = await db.Category.findOne({ where: { code } });
      if (isExist) {
        return resolve({
          err: 1,
          msg: "Tên danh mục này đã tồn tại (hoặc có cùng mã định danh)",
        });
      }

      const response = await db.Category.create({
        id: generateId(),
        code,
        value: body.value,
        header: body.header || body.value,
        description: body.description || "",
        order: +body.order || 0,
      });

      resolve({
        err: response ? 0 : 1,
        msg: response ? "Tạo danh mục thành công!" : "Không thể tạo danh mục",
        response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updateCategoryService = (id, body) =>
  new Promise(async (resolve, reject) => {
    try {
      if (!id) return resolve({ err: 1, msg: "Missing category id" });
      const category = await db.Category.findByPk(id);
      if (!category) return resolve({ err: 1, msg: "Danh mục không tồn tại" });

      const newCode = body.value ? generateCode(body.value) : category.code;

      if (body.value && category.code !== newCode) {
        const isExist = await db.Category.findOne({ where: { code: newCode } });
        if (isExist) {
          return resolve({ err: 1, msg: "Tên danh mục mới đã tồn tại" });
        }
      }

      const response = await db.Category.update(
        {
          code: newCode,
          value: body.value || category.value,
          header: body.header || category.header,
          description: body.description || category.description,
          order: body.order !== undefined ? +body.order : category.order,
        },
        {
          where: { id },
        },
      );

      resolve({
        err: response[0] > 0 ? 0 : 1,
        msg:
          response[0] > 0
            ? "Cập nhật danh mục thành công!"
            : "Không có thay đổi nào được lưu",
      });
    } catch (error) {
      reject(error);
    }
  });

export const deleteCategoryService = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      if (!id) return resolve({ err: 1, msg: "Missing category id" });
      const category = await db.Category.findByPk(id);
      if (!category) return resolve({ err: 1, msg: "Danh mục không tồn tại" });

      // Check if there are posts using this category
      const postCount = await db.Post.count({
        where: { categoryCode: category.code },
      });
      if (postCount > 0) {
        return resolve({
          err: 1,
          msg: `Không thể xóa danh mục này vì đang có ${postCount} bài đăng trực thuộc. Hãy chuyển hoặc xóa các bài đăng trước!`,
        });
      }

      await db.Category.destroy({ where: { id } });
      resolve({
        err: 0,
        msg: "Xóa danh mục thành công!",
      });
    } catch (error) {
      reject(error);
    }
  });

// PACKAGES CRUD SERVICES
export const getAdminPackagesService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Package.findAll({
        order: [["star", "DESC"]],
      });
      resolve({
        err: response ? 0 : 1,
        msg: response ? "OK" : "Failed to get packages",
        response,
      });
    } catch (error) {
      reject(error);
    }
  });

export const updatePackageService = (id, body) =>
  new Promise(async (resolve, reject) => {
    try {
      if (!id) return resolve({ err: 1, msg: "Missing package id" });
      const pkg = await db.Package.findByPk(id);
      if (!pkg) return resolve({ err: 1, msg: "Gói VIP không tồn tại" });

      const response = await db.Package.update(
        {
          price: body.price !== undefined ? +body.price : pkg.price,
          color: body.color || pkg.color,
          benefit: body.benefit || pkg.benefit,
          name: body.name || pkg.name,
        },
        {
          where: { id },
        },
      );

      resolve({
        err: response[0] > 0 ? 0 : 1,
        msg:
          response[0] > 0
            ? "Cập nhật gói dịch vụ thành công!"
            : "Không có thay đổi nào được lưu",
      });
    } catch (error) {
      reject(error);
    }
  });
