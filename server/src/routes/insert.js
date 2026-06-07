import express from "express";
import * as insertController from "../controllers/App/insertController";

import verifyAdmin from "../middlewares/verifyAdmin";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Seed
 *   description: API để khởi tạo dữ liệu mẫu (Internal use)
 */

/**
 * @swagger
 * /seed/:
 *   post:
 *     summary: Khởi tạo dữ liệu từ file JSON
 *     tags: [Seed]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post("/", verifyAdmin, insertController.insert);

export default router;
