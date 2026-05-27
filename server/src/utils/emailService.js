import nodemailer from "nodemailer";

export const sendBlockEmail = async (toEmail, userName, reason) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL || process.env.EMAIL_USER || "demo@gmail.com",
        pass: process.env.EMAIL_PASS || "demo1234",
      },
    });

    const mailOptions = {
      from: '"TLU.com" <no-reply@tlu.com>',
      to: toEmail,
      subject: "Thông báo: Tài khoản của bạn đã bị khóa trên TLU.com",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #e11d48; border-bottom: 2px solid #e11d48; padding-bottom: 10px;">⚠️ Thông Báo Khóa Tài Khoản</h2>
          <p>Xin chào <strong>${userName}</strong>,</p>
          <p>Chúng tôi rất tiếc phải thông báo rằng tài khoản của bạn trên hệ thống <strong>TLU.com</strong> đã bị tạm khóa bởi Ban quản trị.</p>
          <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-weight: bold; color: #991b1b;">Lý do khóa tài khoản:</p>
            <p style="margin: 5px 0 0 0; color: #7f1d1d; font-style: italic;">"${reason}"</p>
          </div>
          <p>Nếu bạn cho rằng đây là một sự nhầm lẫn hoặc muốn yêu cầu mở khóa, vui lòng liên hệ trực tiếp với chúng tôi qua hotline hoặc phản hồi email này.</p>
          <p style="margin-top: 30px; font-size: 11px; color: #999;">Đây là email tự động từ hệ thống TLU.com, vui lòng không trả lời trực tiếp email này.</p>
        </div>
      `,
    };

    // Đảm bảo SMTP không chặn luồng chạy của server nếu chưa cấu hình đúng trong demo
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Gửi email thất bại (Có thể SMTP chưa được cấu hình hoặc sai thông tin trong .env):", error.message);
      } else {
        console.log("Email thông báo khóa tài khoản đã gửi thành công tới: " + toEmail + " | Info: " + info.response);
      }
    });
    return true;
  } catch (error) {
    console.log("Lỗi gửi mail:", error.message);
    return false;
  }
};

export const sendPostStatusEmail = async (toEmail, userName, postTitle, postId, status, reason = "") => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL || process.env.EMAIL_USER || "demo@gmail.com",
        pass: process.env.EMAIL_PASS || "demo1234",
      },
    });

    const isApproved = status === "active";
    const subject = isApproved 
      ? `[PhongTro123] Tin đăng của bạn đã được duyệt thành công!` 
      : `[PhongTro123] Yêu cầu duyệt tin đăng của bạn bị từ chối`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: ${isApproved ? '#16a34a' : '#dc2626'}; border-bottom: 2px solid ${isApproved ? '#16a34a' : '#dc2626'}; padding-bottom: 10px; margin-top: 0;">
          ${isApproved ? '🎉 Tin Đăng Đã Được Duyệt' : '⚠️ Tin Đăng Bị Từ Chối'}
        </h2>
        <p>Xin chào <strong>${userName}</strong>,</p>
        <p>Chúng tôi xin thông báo về trạng thái bài đăng mã số: <strong>#${postId.slice(0, 8).toUpperCase()}</strong></p>
        
        <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 15px; margin: 15px 0; border-radius: 6px;">
          <p style="margin: 0;"><strong>Tiêu đề:</strong> ${postTitle}</p>
          <p style="margin: 5px 0 0 0;"><strong>Trạng thái:</strong> <span style="color: ${isApproved ? '#16a34a' : '#dc2626'}; font-weight: bold;">${isApproved ? 'Đã hoạt động' : 'Bị từ chối'}</span></p>
        </div>

        ${!isApproved && reason ? `
          <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-weight: bold; color: #991b1b;">Lý do từ chối:</p>
            <p style="margin: 5px 0 0 0; color: #7f1d1d; font-style: italic;">"${reason}"</p>
          </div>
        ` : ''}

        ${isApproved ? `
          <p>Tin đăng của bạn đã hiển thị trên website và người thuê phòng có thể liên hệ trực tiếp với bạn.</p>
        ` : `
          <p>Số tiền phí đăng tin đã được hoàn lại vào tài khoản ví của bạn. Vui lòng kiểm tra lại thông tin, chỉnh sửa bài viết theo lý do trên và gửi duyệt lại.</p>
        `}

        <p style="margin-top: 30px; font-size: 11px; color: #999;">Đây là email tự động từ hệ thống PhongTro123, vui lòng không trả lời trực tiếp email này.</p>
      </div>
    `;

    const mailOptions = {
      from: '"PhongTro123" <no-reply@phongtro123.com>',
      to: toEmail,
      subject,
      html: htmlContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Gửi email trạng thái tin đăng thất bại (Có thể SMTP chưa cấu hình):", error.message);
      } else {
        console.log("Email thông báo trạng thái tin đã gửi thành công tới: " + toEmail);
      }
    });
    return true;
  } catch (error) {
    console.log("Lỗi gửi mail trạng thái tin:", error.message);
    return false;
  }
};
