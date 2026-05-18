import express from "express";
import verifyToken from "../middlewares/verifyToken";
import * as userController from "../controllers/User/userController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: API cho thông tin người dùng
 */

router.use(verifyToken);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Lấy thông tin người dùng hiện tại
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/me",  userController.getCurrent);

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put("/me",  userController.updateUser);

export default router;
