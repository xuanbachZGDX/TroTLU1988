import express from "express";
import * as controller from "../controllers/App/priceController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Prices
 *   description: API cho mức giá
 */

/**
 * @swagger
 * /prices/all:
 *   get:
 *     summary: Lấy tất cả mức giá
 *     tags: [Prices]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/all", controller.getPrices);

export default router;
