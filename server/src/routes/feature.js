import express from "express";
import * as controller from "../controllers/App/featureController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Features
 *   description: API cho tiện ích bài đăng
 */

/**
 * @swagger
 * /features/all:
 *   get:
 *     summary: Lấy tất cả tiện ích
 *     tags: [Features]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/all", controller.getFeatures);

export default router;
