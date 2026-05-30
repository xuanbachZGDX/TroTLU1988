import rateLimit from "express-rate-limit";

// Giới hạn cho các API xác thực nhạy cảm (Đăng nhập, Đăng ký, Quên mật khẩu...)
// 10 yêu cầu trong vòng 15 phút trên mỗi IP
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: process.env.NODE_ENV === "production" ? 10 : 1000, // Tối đa 10 lượt ở production, 1000 lượt khi dev
  message: {
    err: -1,
    msg: "Bạn đã gửi quá nhiều yêu cầu xác thực. Vui lòng thử lại sau 15 phút.",
  },
  standardHeaders: true, // Trả về thông tin giới hạn trong các header `RateLimit-*`
  legacyHeaders: false, // Tắt các header `X-RateLimit-*` cũ
});

// Giới hạn chung cho toàn bộ các API khác để tránh spam (DDoS nhẹ)
// 100 yêu cầu trong vòng 1 phút trên mỗi IP
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 phút
  max: process.env.NODE_ENV === "production" ? 100 : 5000, // Tối đa 100 lượt ở production, 5000 lượt khi dev
  message: {
    err: -1,
    msg: "Hệ thống phát hiện quá nhiều yêu cầu từ IP của bạn. Vui lòng thử lại sau ít phút.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
