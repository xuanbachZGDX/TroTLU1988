# Kế hoạch triển khai tính năng Quên mật khẩu qua Email

Tài liệu này mô tả luồng xử lý và các bước thực hiện tính năng Quên mật khẩu (Forgot Password) cho dự án PhongTro123 bằng phương thức xác thực Email.

## 1. Luồng xử lý (Workflow)

```mermaid
sequenceDiagram
    participant U as Người dùng
    participant F as Frontend (React)
    participant B as Backend (Node.js)
    participant DB as Database (MySQL)
    participant M as Email Service (Nodemailer)

    U->>F: Nhấn "Quên mật khẩu" & Nhập Email
    F->>B: Gửi yêu cầu (POST /api/v1/auth/forgot-password)
    B->>DB: Kiểm tra Email có tồn tại không?
    alt Email hợp lệ
        B->>B: Tạo Token bí mật & Set thời gian hết hạn (15 phút)
        B->>DB: Lưu Token & Expiry vào bản ghi User
        B->>M: Gửi Email kèm link chứa Token
        M-->>U: Nhận Email thông báo
        B-->>F: Trả về: "Vui lòng kiểm tra email của bạn"
    else Email không tồn tại
        B-->>F: Trả về lỗi: "Email không tồn tại"
    end
    
    U->>F: Nhấn vào link trong Email (reset-password/:token)
    F->>F: Hiển thị trang "Đặt lại mật khẩu"
    U->>F: Nhập mật khẩu mới & Submit
    F->>B: Gửi Pass mới + Token (POST /api/v1/auth/reset-password)
    B->>DB: Xác thực Token & Chưa hết hạn?
    B->>B: Mã hóa mật khẩu mới (Bcrypt)
    B->>DB: Cập nhật mật khẩu & Xóa Token
    B-->>F: Trả về: "Thành công!"
    F->>U: Chuyển hướng về trang Đăng nhập
```

## 2. Các thành phần cần triển khai

### A. Database (Model User)
Cần bổ sung 2 trường mới vào bảng `Users`:
- `passwordResetToken`: (String) Lưu mã hash của token.
- `passwordResetExpires`: (Date) Thời gian hết hạn của mã.

### B. Backend (Node.js)
1. **Cài đặt thư viện:** `npm install nodemailer`
2. **Cấu hình Email:** Sử dụng dịch vụ Gmail (App Password).
3. **Controller Auth:**
   - Hàm `forgotPassword`: Kiểm tra email, tạo mã, lưu DB và gửi mail.
   - Hàm `resetPassword`: Kiểm tra mã từ URL, cập nhật mật khẩu mới.

### C. Frontend (React)
1. **Trang Quên mật khẩu:**
   - Form nhập Email.
   - Thông báo hướng dẫn người dùng check mail.
2. **Trang Đặt lại mật khẩu:**
   - Form nhập `New Password` và `Confirm Password`.
   - Tính năng ẩn/hiện mật khẩu để tránh sai sót.

## 3. Lý do lựa chọn phương án này
- **Chi phí:** Hoàn toàn miễn phí (không tốn tiền mua API SMS).
- **Tính chuyên nghiệp:** Đây là tiêu chuẩn bảo mật của các hệ thống hiện đại.
- **Dễ Demo:** Thầy cô có thể thấy email gửi về thật sự trong quá trình bảo vệ đồ án.

---
