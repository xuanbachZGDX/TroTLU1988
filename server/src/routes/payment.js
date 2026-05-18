import express from 'express';
import * as vnpayController from '../controllers/Payment/vnpayController';
import verifyToken from '../middlewares/verifyToken';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: API cho nạp tiền qua VNPay
 */

/**
 * @swagger
 * /payment/create_payment_url:
 *   post:
 *     summary: Tạo đường dẫn thanh toán VNPay
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Trả về URL thanh toán
 */
router.post('/create_payment_url', verifyToken, vnpayController.createPaymentUrl);

/**
 * @swagger
 * /payment/vnpay_return:
 *   get:
 *     summary: Nhận kết quả từ VNPay (Webhook/Callback)
 *     tags: [Payment]
 *     responses:
 *       200:
 *         description: Xử lý giao dịch thành công
 */
router.get('/vnpay_return', vnpayController.vnpayReturn);

/**
 * @swagger
 * /payment/history:
 *   get:
 *     summary: Lấy lịch sử nạp tiền cá nhân
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/history', verifyToken, vnpayController.getHistory);

export default router;
