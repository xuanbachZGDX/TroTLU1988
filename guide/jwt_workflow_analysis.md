
## 1. Đăng nhập (Authentication)
*   **Lý thuyết:** Người dùng gửi thông tin (username/password) đến server.
*   **Trong dự án:** Ở file `server/src/services/Auth/authService.js` (hàm `loginService`), server nhận `phone` và `password`, sau đó truy vấn cơ sở dữ liệu và dùng thư viện `bcrypt.compareSync` để đối chiếu mật khẩu an toàn.

## 2. Tạo Token
*   **Lý thuyết:** Server xác thực thông tin, tạo ra một JWT chứa các dữ liệu cần thiết (User ID, Quyền, Thời gian hết hạn) và ký tên bằng một khóa bí mật (Secret Key).
*   **Trong dự án:** Tại `server/src/services/Auth/authService.js`, hệ thống đang sử dụng hàm `jwt.sign` chuẩn xác như mô tả:

```javascript
const token =
  checkPassword &&
  jwt.sign(
    {
      id: response.id, // User ID
      phone: response.phone,
      role: response.role || "user", // Quyền
    },
    process.env.SECRET_KEY, // Secret Key
    { expiresIn: "2d" }, // Thời gian hết hạn (2 ngày)
  );
```

## 3. Gửi Token về Client
*   **Lý thuyết:** Server gửi JWT trả về cho client (trình duyệt, mobile app).
*   **Trong dự án:** Token được khởi tạo thành công sẽ được trả về qua `resolve({ err, msg, token })` và Controller sẽ gửi dưới dạng JSON response về cho ứng dụng React frontend.

## 4. Lưu trữ Token
*   **Lý thuyết:** Client thường lưu token vào LocalStorage hoặc Cookie.
*   **Trong dự án:** Tại `client/src/axiosConfig.js`, ứng dụng đang sử dụng thư viện `redux-persist` để lưu trữ token trực tiếp vào **LocalStorage** của trình duyệt:

```javascript
let token =
  window.localStorage.getItem("persist:auth") &&
  JSON.parse(window.localStorage.getItem("persist:auth"))?.token?.slice(1, -1);
```

## 5. Gửi kèm Token
*   **Lý thuyết:** Ở các request tiếp theo, client gửi JWT trong Header (thường là `Authorization: Bearer <token>`).
*   **Trong dự án:** Cũng tại file `client/src/axiosConfig.js`, ứng dụng đã được cấu hình một Axios Request Interceptor để tự động kiểm tra và gắn chuẩn cấu trúc `Bearer <token>` vào mọi API request gửi đi:

```javascript
config.headers = {
  authorization: token ? `Bearer ${token}` : null,
};
```

## 6. Xác thực Token
*   **Lý thuyết:** Server nhận token, kiểm tra chữ ký. Nếu hợp lệ và chưa hết hạn, server cho phép truy cập tài nguyên.
*   **Trong dự án:** Tại `server/src/middlewares/verifyToken.js`, một middleware đã được xây dựng chuẩn xác để bắt, giải mã và xác thực token trước khi cho phép các request chạm vào dữ liệu:

```javascript
let accessToken = req.headers.authorization?.split(" ")[1];

if (!accessToken)
  return res.status(401).json({ err: 1, msg: "Missing access token" });

jwt.verify(accessToken, process.env.SECRET_KEY, (err, user) => {
  if (err) 
    return res.status(401).json({ err: 1, msg: "Access token expired" });
    
  req.user = user;
  next(); // Xác thực thành công, cho phép đi tiếp vào Controller
});
```

---
**Nhận xét:** Cơ chế xác thực này là Best Practice rất phổ biến và an toàn hiện nay cho các Single Page Application (như React) kết hợp với RESTful API (Node/Express). Sinh viên có thể tự tin sử dụng sơ đồ và giải thích này cho phần báo cáo/bảo vệ đồ án của mình.
