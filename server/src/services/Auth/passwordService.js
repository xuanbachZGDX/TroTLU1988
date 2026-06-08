import db from "../../models";
import sendEmail from "../../utils/sendEmail";
import { hashPassword } from "./authHelper";

export const forgotPasswordService = (email) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({ where: { email } });
      if (!user)
        return resolve({ err: 1, msg: "Email không tồn tại trong hệ thống!" });

      if (user.passwordResetExpires) {
        const lastSent =
          new Date(user.passwordResetExpires).getTime() - 1 * 60 * 1000;
        const diff = Date.now() - lastSent;
        if (diff < 60 * 1000) {
          return resolve({
            err: 3,
            msg: "Vui lòng đợi 60 giây trước khi yêu cầu mã OTP mới",
          });
        }
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = otp;
      user.passwordResetExpires = Date.now() + 1 * 60 * 1000;
      await user.save();

      const emailSubject = "[TroTLU1988.com] Mã xác thực khôi phục mật khẩu";
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #007bff;">Khôi phục mật khẩu</h2>
          <p>Mã OTP của bạn là: <b style="font-size: 20px; color: #d9534f;">${otp}</b></p>
          <p>Mã này có hiệu lực trong 1 phút.</p>
        </div>
      `;
      const isSent = await sendEmail(email, emailSubject, emailHtml);
      resolve({
        err: isSent ? 0 : 2,
        msg: isSent ? "Mã OTP đã được gửi!" : "Lỗi gửi email!",
      });
    } catch (error) {
      reject(error);
    }
  });

export const resetPasswordService = ({ password, otp, email }) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({
        where: {
          email,
          otp,
          passwordResetExpires: { [db.Sequelize.Op.gt]: Date.now() },
        },
      });
      if (!user)
        return resolve({
          err: 1,
          msg: "Mã OTP không chính xác hoặc đã hết hạn!",
        });

      user.password = hashPassword(password);
      user.otp = null;
      user.passwordResetExpires = null;
      await user.save();
      resolve({ err: 0, msg: "Mật khẩu đã được cập nhật thành công!" });
    } catch (error) {
      reject(error);
    }
  });
