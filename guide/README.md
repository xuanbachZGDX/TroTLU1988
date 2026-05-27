# Dự án Chuyên đề Tốt nghiệp: Website Cho thuê Phòng trọ (PhongTro123)

## 📝 Tổng quan dự án
Dự án tập trung xây dựng một nền tảng kết nối giữa người cho thuê và người đi thuê phòng trọ, căn hộ. Hệ thống được thiết kế hiện đại, tối ưu trải nghiệm tìm kiếm và quản lý tin đăng.

## 🛠 Công nghệ sử dụng (Tech Stack)

### 1. Frontend (Giao diện người dùng)
*   **ReactJS (Vite):** Thư viện JavaScript hiện đại để xây dựng giao diện người dùng theo hướng component. Sử dụng **Vite** làm công cụ build để tối ưu tốc độ phản hồi (HMR) và hiệu năng khi phát triển.
*   **Tailwind CSS:** Framework CSS utility-first giúp xây dựng giao diện Responsive nhanh chóng, dễ bảo trì và đảm bảo tính thẩm mỹ hiện đại.
*   **Redux & Redux Persist:** Quản lý trạng thái toàn cục (Global State) cho ứng dụng. **Redux Persist** giúp lưu trữ trạng thái đăng nhập và dữ liệu người dùng ngay cả khi trình duyệt bị tải lại.
*   **Axios:** Thư viện HTTP Client để kết nối và xử lý các yêu cầu API giữa Frontend và Backend.

### 2. Backend (Máy chủ & Logic)
*   **Node.js & Express:** Môi trường thực thi và Framework linh hoạt, mạnh mẽ để xây dựng các API RESTful hiệu năng cao.
*   **JSON Web Token (JWT):** Cơ chế xác thực không trạng thái (stateless), đảm bảo an toàn cho việc truy cập các tài nguyên nhạy cảm.
*   **Bcryptjs:** Thư viện mã hóa mật khẩu người dùng theo cơ chế băm (hashing) nhiều lớp, đảm bảo an toàn dữ liệu tuyệt đối.

### 3. Cơ sở dữ liệu (Database)
*   **MySQL:** Hệ quản trị cơ sở dữ liệu quan hệ mạnh mẽ, đảm bảo tính toàn vẹn dữ liệu cho các mối quan hệ phức tạp (User-Post-Location).
*   **Sequelize ORM:** Công cụ ánh xạ đối tượng giúp quản lý database bằng code JavaScript. Hỗ trợ **Migrations** để theo dõi lịch sử thay đổi cấu trúc bảng và quản lý **Associations** (mối quan hệ giữa các bảng) một cách khoa học.

### 4. Dịch vụ & Công cụ khác
*   **Cloudinary:** Dịch vụ lưu trữ và quản lý hình ảnh chuyên nghiệp, tự động tối ưu hóa dung lượng ảnh cho web.
*   **Postman:** Công cụ đắc lực để kiểm thử và tài liệu hóa các API trước khi tích hợp vào Frontend.
*   **Git & GitHub:** Quản lý phiên bản mã nguồn và hỗ trợ làm việc nhóm hiệu quả.

## 📂 Tổ chức Module (Architecture)
Hệ thống được tổ chức theo mô hình **Service Layer** và **Component-based**:
*   **Server Side:**
    *   `Routes`: Định nghĩa endpoint và điều hướng request.
    *   `Controllers`: Điều phối luồng dữ liệu giữa Route và Service.
    *   `Services`: Xử lý logic nghiệp vụ và truy vấn Database (Brain of system).
    *   `Models`: Định nghĩa cấu trúc các bảng Database qua Sequelize.
*   **Client Side:**
    *   `Containers/Pages`: Quản lý logic và state của từng trang lớn.
    *   `Components`: Các thành phần giao diện có khả năng tái sử dụng cao.
    *   `Store/Redux`: Quản lý trạng thái toàn cục (User info, Categories...).

## ✨ Các Chức năng chính
### 1. Phân hệ Người dùng
*   **Tìm kiếm nâng cao:** Lọc đa điều kiện (Tỉnh thành -> Quận huyện -> Phường xã, Giá, Diện tích, Chuyên mục).
*   **Xác thực:** Đăng ký, Đăng nhập, Đăng xuất, Bảo mật phiên làm việc qua JWT.
*   **Dashboard Cá nhân:** Đăng tin mới, Chỉnh sửa/Xóa tin đã đăng, Cập nhật thông tin cá nhân.
*   **Hiển thị:** Trang chi tiết tin đăng chuyên nghiệp, Responsive mượt mà trên Mobile.

### 2. Phân hệ Quản trị (Admin)
*   **Thống kê:** Theo dõi tổng số User, tổng số Post (Active/Expired).
*   **Quản lý Nội dung:** Kiểm duyệt và xóa bất kỳ bài đăng nào vi phạm.
*   **Quản lý Người dùng:** Danh sách user, tìm kiếm và thống kê bài đăng của từng user.

### 3. Hệ thống Crawler
*   Tự động thu thập dữ liệu thật từ website nguồn để đảm bảo hệ thống luôn có dữ liệu phong phú phục vụ vận hành.

## 🚀 Danh sách API (Endpoints)
Tất cả API bắt đầu bằng `/api/v1`

### Nội bộ (Internal APIs)

| Nhóm | Method | Endpoint | Mô tả |
| :--- | :--- | :--- | :--- |
| **Auth** | POST | `/api/v1/auth/register` | Đăng ký tài khoản |
| | POST | `/api/v1/auth/login` | Đăng nhập |
| **User** | GET | `/api/v1/user/get-current` | Lấy thông tin cá nhân |
| | PUT | `/api/v1/user/update-user` | Cập nhật profile |
| **Post** | GET | `/api/v1/post/all` | Lấy tất cả bài đăng (Lọc & Phân trang) |
| | GET | `/api/v1/post/latest` | Lấy tin đăng mới nhất |
| | GET | `/api/v1/post/detail` | Xem chi tiết bài đăng |
| | POST | `/api/v1/post/create` | Đăng tin mới |
| | GET | `/api/v1/post/manage` | Quản lý tin đăng cá nhân |
| | PUT | `/api/v1/post/update` | Chỉnh sửa bài đăng |
| | DELETE | `/api/v1/post/delete` | Xóa bài đăng |
| **Admin** | GET | `/api/v1/admin/dashboard` | Thống kê hệ thống |
| | GET | `/api/v1/admin/posts` | Danh sách bài đăng toàn hệ thống |
| | GET | `/api/v1/admin/users` | Danh sách tất cả người dùng |
| | DELETE | `/api/v1/admin/posts/:postId` | Xóa bài đăng vi phạm |
| **Master** | GET | `/api/v1/province/all` | Danh sách Tỉnh/Thành phố |
| | GET | `/api/v1/district/all` | Danh sách Quận/Huyện |
| | GET | `/api/v1/category/all` | Danh sách Chuyên mục |
| | GET | `/api/v1/price/all` | Các khoảng giá lọc |
| | GET | `/api/v1/area/all` | Các khoảng diện tích lọc |

### Bên thứ ba (External APIs)
| Dịch vụ | Method | Endpoint / URL | Mục đích |
| :--- | :--- | :--- | :--- |
| **Địa chính** | GET | `https://provinces.open-api.vn/api/` | Lấy dữ liệu Tỉnh/Quận/Phường chuẩn |
| **Media** | POST | `Cloudinary API` | Lưu trữ và tối ưu hóa hình ảnh bài đăng |
| **Bản đồ** | GET | `Google Maps API` | Hiển thị vị trí thực tế của phòng trọ |

## 💡 Điểm nhấn Kỹ thuật
*   **Database Optimization:** Xử lý phân trang (Pagination) ở mức Database bằng Sequelize `limit/offset`.
*   **Security:** Mã hóa mật khẩu 1 chiều, xác thực API qua Header Authorization Token.
*   **Performance:** Sử dụng Vite để tối ưu tốc độ build và HMR giúp phát triển nhanh hơn.

## 🎥 Kịch bản Demo Báo cáo (3-5 phút)
1.  **Trang chủ (30s):** Show giao diện, giới thiệu tech stack và dữ liệu crawler.
2.  **Bộ lọc (1p):** Demo lọc theo khu vực + giá (Khẳng định tính chính xác của Backend).
3.  **User Dashboard (1p):** Login -> Đăng tin -> Quản lý tin (CRUD).
4.  **Admin Panel (30s):** Show thống kê và quyền kiểm duyệt bài đăng.
5.  **Kết luận:** Trình bày về tính thực tiễn và hướng mở rộng.
