import crypto from 'crypto';
import qs from 'qs';
import moment from 'moment';
import { v4 as generateId } from 'uuid';
import db from '../../models';

const sortObject = (obj) => {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj){
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
        str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

export const createPaymentUrl = async (req, res) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    let ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    let tmnCode = process.env.vnp_TmnCode;
    let secretKey = process.env.vnp_HashSecret;
    let vnpUrl = process.env.vnp_Url;
    let returnUrl = process.env.vnp_ReturnUrl;

    let amount = req.body.amount;
    let bankCode = req.body.bankCode;
    let locale = req.body.language;
    if(locale === null || locale === '' || locale === undefined){
        locale = 'vn';
    }
    
    // Tạo transaction id nội bộ (Dùng 8 ký tự ngẫu nhiên để tăng tính duy nhất)
    let orderId = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Lưu vào db tạm trạng thái pending
    try {
        await db.Transaction.create({
            id: orderId,
            userId: req.user.id,
            amount: amount,
            type: 'deposit',
            content: `Nạp tiền vào tài khoản TLU.com`,
            status: 'pending'
        });
    } catch(err) {
        console.error("Lỗi khi tạo transaction:", err);
        return res.status(500).json({err: -1, msg: "Không thể tạo giao dịch"});
    }

    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan don hang ' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if(bankCode !== null && bankCode !== '' && bankCode !== undefined){
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let signData = qs.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });

    res.status(200).json({code: '00', data: vnpUrl});
}

export const vnpayReturn = async (req, res) => {
    try {
        let vnp_Params = req.query;

        let secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);

        let secretKey = process.env.vnp_HashSecret;

        let signData = qs.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");     

        if(secureHash === signed){
            let orderId = vnp_Params['vnp_TxnRef'];
            let rspCode = vnp_Params['vnp_ResponseCode'];
            let amount = vnp_Params['vnp_Amount'] / 100;

            await db.sequelize.transaction(async (t) => {
                // Lock bản ghi để tránh race condition
                const transaction = await db.Transaction.findOne({ 
                    where: { id: orderId },
                    lock: t.LOCK.UPDATE,
                    transaction: t
                });

                if (transaction && transaction.status === 'pending') {
                    if (rspCode === '00' && Number(transaction.amount) === amount) {
                        await db.Transaction.update({ status: 'success' }, { where: { id: orderId }, transaction: t });
                        
                        const user = await db.User.findOne({ where: { id: transaction.userId }, transaction: t });
                        await db.User.update({ balance: (user.balance || 0) + amount }, { where: { id: transaction.userId }, transaction: t });
                        
                        res.status(200).json({ code: rspCode, msg: "Thanh toán thành công" });
                    } else {
                        await db.Transaction.update({ status: 'failed' }, { where: { id: orderId }, transaction: t });
                        res.status(200).json({ code: rspCode, msg: "Giao dịch thất bại hoặc sai lệch số tiền" });
                    }
                } else {
                    res.status(200).json({ code: rspCode, msg: "Giao dịch đã được xử lý hoặc không tồn tại" });
                }
            });
        } else {
            res.status(200).json({ code: '97', msg: "Chữ ký không hợp lệ" });
        }
    } catch (error) {
        console.error("Lỗi khi xử lý callback VNPay:", error);
        res.status(500).json({ code: '99', msg: "Lỗi server" });
    }
}

export const getHistory = async (req, res) => {
    try {
        const transactions = await db.Transaction.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        return res.status(200).json({ err: 0, response: transactions });
    } catch (error) {
        console.error("Lỗi lấy lịch sử:", error);
        return res.status(500).json({ err: -1, msg: "Lỗi server" });
    }
}
