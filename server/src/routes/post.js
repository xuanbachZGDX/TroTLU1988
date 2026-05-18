import express from "express";
import * as postController from "../controllers/Post/postController";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API cho quản lý bài đăng
 */

/**
 * @swagger
 * /posts/all:
 *   get:
 *     summary: Lấy tất cả bài đăng
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/all",    postController.getPosts);

/**
 * @swagger
 * /posts/:
 *   get:
 *     summary: Lấy bài đăng có phân trang và lọc
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/",       postController.getPostsLimit);

/**
 * @swagger
 * /posts/latest:
 *   get:
 *     summary: Lấy bài đăng mới nhất
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/latest", postController.getNewPosts);

/**
 * @swagger
 * /posts/detail:
 *   get:
 *     summary: Lấy chi tiết bài đăng
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/detail", postController.getPostById);

router.use(verifyToken);

/**
 * @swagger
 * /posts/create:
 *   post:
 *     summary: Tạo bài đăng mới
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tạo bài đăng thành công
 */
router.post("/create",   postController.createNewPost);

/**
 * @swagger
 * /posts/manage:
 *   get:
 *     summary: Quản lý bài đăng cá nhân
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/manage",    postController.getPostLimitAdmin);

/**
 * @swagger
 * /posts/history:
 *   get:
 *     summary: Lấy lịch sử chỉnh sửa bài đăng
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/history",   postController.getPostHistory);

/**
 * @swagger
 * /posts/update:
 *   put:
 *     summary: Cập nhật bài đăng
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put("/update",    postController.updatePost);

/**
 * @swagger
 * /posts/extend:
 *   put:
 *     summary: Gia hạn bài đăng
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Gia hạn thành công
 */
router.put("/extend",    postController.extendPost);

/**
 * @swagger
 * /posts/restore:
 *   put:
 *     summary: Khôi phục bài đăng
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Khôi phục thành công
 */
router.put("/restore",   postController.restorePost);

/**
 * @swagger
 * /posts/delete:
 *   delete:
 *     summary: Xóa bài đăng
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete("/delete", postController.deletePost);

export default router;
