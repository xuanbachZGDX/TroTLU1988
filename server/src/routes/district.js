import express from "express";
import * as controller from "../controllers/App/districtController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Districts
 *   description: API cho quận huyện
 */

/**
 * @swagger
 * /districts/all:
 *   get:
 *     summary: Lấy danh sách quận huyện
 *     tags: [Districts]
 *     parameters:
 *       - in: query
 *         name: provinceCode
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/all", controller.getDistricts);

export default router;
