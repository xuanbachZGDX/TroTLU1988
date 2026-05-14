import express from 'express';
import * as vnpayController from '../controllers/Payment/vnpayController';
import verifyToken from '../middlewares/verifyToken';

const router = express.Router();

router.post('/create_payment_url', verifyToken, vnpayController.createPaymentUrl);
router.get('/vnpay_return', vnpayController.vnpayReturn);
router.get('/history', verifyToken, vnpayController.getHistory);

export default router;
