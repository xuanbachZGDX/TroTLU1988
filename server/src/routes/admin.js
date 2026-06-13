import express from "express";
import * as adminController from "../controllers/Admin/adminController";
import verifyAdmin from "../middlewares/verifyAdmin";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: API dành cho quản trị viên
 */

router.use(verifyAdmin);

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Lấy dữ liệu tổng quan cho Dashboard
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/dashboard", adminController.getDashboard);

/**
 * @swagger
 * /admin/posts:
 *   get:
 *     summary: Lấy danh sách tất cả bài đăng (Dành cho Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/posts", adminController.getPosts);

/**
 * @swagger
 * /admin/posts/{postId}:
 *   delete:
 *     summary: Xóa bài đăng (Dành cho Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.delete("/posts/:postId", adminController.deletePost);

/**
 * @swagger
 * /admin/posts/{postId}/approve:
 *   put:
 *     summary: Phê duyệt bài đăng
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.put("/posts/:postId/approve", adminController.approvePost);

/**
 * @swagger
 * /admin/posts/{postId}/reject:
 *   put:
 *     summary: Từ chối bài đăng
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.put("/posts/:postId/reject", adminController.rejectPost);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Lấy danh sách người dùng
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/users", adminController.getUsers);

/**
 * @swagger
 * /admin/users/{userId}/status:
 *   put:
 *     summary: Cập nhật trạng thái người dùng (Khóa/Mở khóa)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.put("/users/:userId/status", adminController.updateUserStatus);

/**
 * @swagger
 * /admin/contacts:
 *   get:
 *     summary: Lấy danh sách liên hệ/góp ý
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/contacts", adminController.getContacts);

/**
 * @swagger
 * /admin/contacts/{contactId}:
 *   delete:
 *     summary: Xóa liên hệ
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.delete("/contacts/:contactId", adminController.deleteContact);
router.put("/contacts/:contactId/reply", adminController.replyContact);
router.get("/notifications", adminController.getNotifications);
router.put("/notifications/:id/read", adminController.readNotification);
router.get("/settings", adminController.getSettings);
router.put("/settings", adminController.updateSettings);
router.get("/kyc-pending", adminController.getKycPendingUsers);
router.put("/kyc-handle", adminController.handleKyc);

// Categories CRUD
router.post("/categories", adminController.createCategory);
router.put("/categories/:id", adminController.updateCategory);
router.delete("/categories/:id", adminController.deleteCategory);

// Packages CRUD
router.get("/packages", adminController.getPackages);
router.put("/packages/:id", adminController.updatePackage);

// Transactions Management
router.get("/transactions", adminController.getTransactions);

export default router;
