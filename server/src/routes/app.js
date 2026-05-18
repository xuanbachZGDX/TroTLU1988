import express from "express";
import * as contactController from "../controllers/App/contactController";
import verifyToken from "../middlewares/verifyToken";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: App
 *   description: API chung cho ứng dụng (Góp ý, Liên hệ)
 */

/**
 * @swagger
 * /app/contact:
 *   post:
 *     summary: Gửi thông tin liên hệ/góp ý
 *     tags: [App]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Gửi thành công
 */
router.post("/contact", verifyToken, contactController.createContact);

export default router;
