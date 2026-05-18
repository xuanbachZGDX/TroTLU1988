import express from "express";
import * as controller from "../controllers/App/provinceController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Provinces
 *   description: API cho tỉnh thành
 */

/**
 * @swagger
 * /provinces/all:
 *   get:
 *     summary: Lấy tất cả tỉnh thành
 *     tags: [Provinces]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/all", controller.getProvinces);

/**
 * @swagger
 * /provinces/featured:
 *   get:
 *     summary: Lấy tỉnh thành có số lượng bài đăng (Nổi bật)
 *     tags: [Provinces]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/featured", controller.getProvinceWithCount);

export default router;
