import express from "express";
import * as controller from "../controllers/App/areaController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Areas
 *   description: API cho diện tích
 */

/**
 * @swagger
 * /areas/all:
 *   get:
 *     summary: Lấy tất cả khoảng diện tích
 *     tags: [Areas]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/all", controller.getAreas);

export default router;
