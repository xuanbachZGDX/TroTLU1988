# Kế hoạch tích hợp Đăng nhập bằng Google (Google OAuth2)

Dưới đây là lộ trình 4 giai đoạn để thêm tính năng đăng nhập Google vào hệ thống PhongTro123.

## Giai đoạn 1: Chuẩn bị (Cấu hình phía Google)
Bạn cần thực hiện các bước này trên trình duyệt:
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/).
2. Tạo một Project mới (ví dụ: `PhongTro123-Auth`).
3. Cấu hình **OAuth Consent Screen** (Màn hình chấp thuận).
4. Tạo **OAuth 2.0 Client IDs**:
   - Loại ứng dụng: Web Application.
   - Authorized JavaScript origins: `http://localhost:3000`.
   - Authorized redirect URIs: `http://localhost:3000`.
5. **Lấy Client ID**: Lưu lại mã này để dùng ở Frontend.

## Giai đoạn 2: Cập nhật Frontend (React)
1. **Cài đặt thư viện**: `npm install @react-oauth/google`.
2. **Bọc ứng dụng**: Sử dụng `GoogleOAuthProvider` ở file `index.js` hoặc `main.jsx`.
3. **Thêm nút Đăng nhập**: 
   - Tại `Login.jsx`, thêm thành phần `GoogleLogin`.
   - Khi người dùng đăng nhập thành công, Google sẽ trả về một mã `Credential` (JWT).
4. **Gửi dữ liệu**: Gửi mã này lên API phía Backend để xác thực.

## Giai đoạn 3: Cập nhật Backend (Node.js)
1. **Cài đặt thư viện**: `npm install google-auth-library`.
2. **Tạo API mới**: `/api/v1/auth/google-login`.
3. **Logic xử lý**:
   - Nhận mã `Credential` từ Frontend.
   - Dùng thư viện của Google để xác thực mã này xem có đúng là do Google cấp không.
   - Lấy thông tin người dùng từ mã đó (Họ tên, Email, Ảnh đại diện).
   - **Kiểm tra Database**: 
     - Nếu Email đã tồn tại: Cho đăng nhập luôn.
     - Nếu Email chưa tồn tại: Tạo người dùng mới trong DB với thông tin từ Google.
   - Trả về JWT của hệ thống mình cho Frontend.

## Giai đoạn 4: Kiểm tra và Hoàn thiện
- Kiểm tra luồng đăng nhập lần đầu (tạo tài khoản).
- Kiểm tra luồng đăng nhập các lần sau.
- Cập nhật hiển thị ảnh đại diện từ Google lên thanh Header.

---

> [!IMPORTANT]
> **Lưu ý quan trọng**: Khi dùng đăng nhập Google, người dùng sẽ không có mật khẩu trong hệ thống của bạn (mật khẩu do Google quản lý). Vì vậy, bạn cần xử lý cột `password` trong Database là `allowNull: true` hoặc đặt một giá trị mặc định ngẫu nhiên.

