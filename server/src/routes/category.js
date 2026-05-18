import express from "express";
import * as controller from "../controllers/App/categoryController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API cho danh mục
 */

/**
 * @swagger
 * /categories/all:
 *   get:
 *     summary: Lấy tất cả danh mục
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/all", controller.getAllCategories);

export default router;
