# Kịch Bản Kiểm Thử Chi Tiết Hệ Thống - TroTLU1988

Tài liệu này đặc tả chi tiết kịch bản kiểm thử (Test Cases) cho toàn bộ các chức năng thuộc hệ thống TroTLU1988, bao gồm cả Client, Server và Module Crawler, được sắp xếp và phân nhóm khoa học theo từng phân hệ chức năng.

---

## 1. Feature: Authentication & Authorization (Xác thực & Phân quyền)

### [TC_AUTH_001] Đăng ký tài khoản người dùng mới thành công

- **Precondition:** Số điện thoại chưa được đăng ký trong hệ thống.
- **Steps:**
  1. Truy cập trang đăng ký.
  2. Chọn Loại tài khoản: "Người tìm kiếm" hoặc "Chủ trọ".
  3. Nhập đầy đủ thông tin hợp lệ (Họ tên, Số điện thoại, Mật khẩu).
  4. Nhấp nút "Đăng ký".
- **Test Data:**
  - Loại tài khoản: `user` (Người tìm kiếm) hoặc `landlord` (Chủ trọ)
  - Họ tên: `Nguyen Van A`
  - Số điện thoại: `0912345678`
  - Mật khẩu: `password123`
- **Expected:** Hệ thống tạo tài khoản thành công với vai trò (role) tương ứng đã chọn, hiển thị thông báo đăng ký thành công và tự động chuyển hướng sang trang đăng nhập.
- **Actual:** Đạt

---

### [TC_AUTH_002] Đăng ký thất bại do thiếu chọn Loại tài khoản hoặc thiếu trường bắt buộc

- **Precondition:** Số điện thoại chưa được đăng ký trong hệ thống.
- **Steps:**
  1. Truy cập trang đăng ký.
  2. Không chọn Loại tài khoản (để trống) hoặc bỏ trống một trong các trường Họ tên, Số điện thoại, Mật khẩu.
  3. Nhấp nút "Đăng ký".
- **Test Data:**
  - Loại tài khoản: Trống (Chưa chọn)
  - Họ tên: `Nguyen Van B`
  - Số điện thoại: `0911223344`
  - Mật khẩu: `password123`
- **Expected:** Hệ thống hiển thị thông báo lỗi yêu cầu chọn loại tài khoản hoặc điền đầy đủ thông tin bắt buộc dưới chân các input tương ứng, không cho phép gửi request đăng ký.
- **Actual:** Đạt

---

### [TC_AUTH_002B] Đăng ký thất bại do số điện thoại đã tồn tại

- **Precondition:** Số điện thoại "0912345678" đã đăng ký trước đó trên hệ thống.
- **Steps:**
  1. Truy cập trang đăng ký.
  2. Chọn Loại tài khoản: "Người tìm kiếm".
  3. Nhập số điện thoại đã tồn tại.
  4. Điền các trường khác hợp lệ.
  5. Nhấp nút "Đăng ký".
- **Test Data:**
  - Loại tài khoản: `user`
  - Họ tên: `Nguyen Van B`
  - Số điện thoại: `0912345678`
  - Mật khẩu: `password123`
- **Expected:** Hệ thống hiển thị thông báo lỗi "Số điện thoại đã được sử dụng" và không tạo tài khoản mới.
- **Actual:** Đạt

---

### [TC_AUTH_003] Đăng nhập bằng tài khoản/mật khẩu hợp lệ (Người dùng/Chủ trọ)

- **Precondition:** Tài khoản đã tồn tại và đang hoạt động (`status = "active"`).
- **Steps:**
  1. Truy cập trang đăng nhập.
  2. Nhập số điện thoại và mật khẩu chính xác.
  3. Nhấp nút "Đăng nhập".
- **Test Data:**
  - Số điện thoại: `0912345678`
  - Mật khẩu: `password123`
- **Expected:** Đăng nhập thành công, lưu JWT vào LocalStorage/Redux Store và chuyển hướng về trang chủ với thông tin tài khoản hiển thị ở Header.
- **Actual:** Đạt

---

### [TC_AUTH_003B] Đăng nhập tài khoản quản trị hệ thống (Admin) thành công

- **Precondition:** Tài khoản Admin đã được khởi tạo trong hệ thống.
- **Steps:**
  1. Truy cập đường dẫn dành riêng cho Admin (`/admin/login`).
  2. Nhập Số điện thoại Admin và Mật khẩu bảo mật chính xác.
  3. Nhấp nút "Xác thực & Đăng nhập".
- **Test Data:**
  - Số điện thoại: `0999999999` (Số điện thoại của Admin)
  - Mật khẩu: `admin123456`
- **Expected:** Xác thực thành công, lưu JWT của Admin, chuyển hướng trực tiếp vào trang quản trị hệ thống (`/admin/dashboard`).
- **Actual:** Đạt

---

### [TC_AUTH_004] Đăng nhập thất bại do sai mật khẩu

- **Precondition:** Tài khoản đã tồn tại trong hệ thống.
- **Steps:**
  1. Truy cập trang đăng nhập.
  2. Nhập đúng số điện thoại nhưng sai mật khẩu.
  3. Nhấp nút "Đăng nhập".
- **Test Data:**
  - Số điện thoại: `0912345678`
  - Mật khẩu: `wrongpassword`
- **Expected:** Hệ thống báo lỗi "Sai số điện thoại hoặc mật khẩu", không đăng nhập được.
- **Actual:** Đạt

---

### [TC_AUTH_005] Đăng nhập thất bại do tài khoản bị khóa

- **Precondition:** Tài khoản có trạng thái `status = "blocked"`.
- **Steps:**
  1. Truy cập trang đăng nhập.
  2. Nhập đúng số điện thoại và mật khẩu.
  3. Nhấp nút "Đăng nhập".
- **Test Data:**
  - Số điện thoại: `0987654321`
  - Mật khẩu: `password123`
- **Expected:** Hệ thống báo lỗi "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin.", không đăng nhập được.
- **Actual:** Đạt

---

### [TC_AUTH_006] Đăng nhập bằng tài khoản Google lần đầu (Đăng ký tài khoản mới qua Google)

- **Precondition:** Trình duyệt đã đăng nhập một tài khoản Google và tài khoản này chưa từng đăng ký trên hệ thống.
- **Steps:**
  1. Truy cập trang đăng nhập.
  2. Nhấp nút "Đăng nhập bằng Google".
  3. Chọn tài khoản Google trong cửa sổ popup.
  4. Hệ thống phát hiện tài khoản mới, hiển thị form hoàn tất tài khoản Google và yêu cầu chọn loại tài khoản.
  5. Chọn Loại tài khoản: "Người tìm kiếm" hoặc "Chủ trọ".
  6. Nhấp nút "Hoàn tất đăng nhập Google".
- **Test Data:**
  - Tài khoản Google: `nva@gmail.com`
  - Loại tài khoản chọn thêm: `landlord` (Chủ trọ)
- **Expected:** Hệ thống liên kết tạo tài khoản mới liên kết với Google với vai trò `landlord`, đăng nhập thành công và chuyển hướng vào hệ thống.
- **Actual:** Đạt

---

### [TC_AUTH_006B] Đăng nhập bằng tài khoản Google đã liên kết trước đó

- **Precondition:** Trình duyệt đã đăng nhập một tài khoản Google và tài khoản này đã hoàn tất liên kết vai trò trước đây.
- **Steps:**
  1. Truy cập trang đăng nhập.
  2. Nhấp nút "Đăng nhập bằng Google".
  3. Chọn tài khoản Google đã liên kết.
- **Test Data:** Tài khoản Google đã đăng ký vai trò trước đó.
- **Expected:** Đăng nhập thành công trực tiếp mà không cần qua bước chọn loại tài khoản nữa, tự động chuyển hướng vào hệ thống.
- **Actual:** Đạt

---

### [TC_AUTH_007] Yêu cầu khôi phục mật khẩu (Quên mật khẩu)

- **Precondition:** Email liên kết với tài khoản có tồn tại trong hệ thống.
- **Steps:**
  1. Truy cập trang Đăng nhập -> chọn "Quên mật khẩu".
  2. Nhập email đã đăng ký.
  3. Nhấp nút "Gửi mã OTP".
- **Test Data:**
  - Email: `nva@gmail.com`
- **Expected:** Hệ thống gửi mã OTP về email, hiển thị giao diện nhập OTP để đặt lại mật khẩu.
- **Actual:** Đạt

---

### [TC_AUTH_008] Đặt lại mật khẩu mới bằng OTP

- **Precondition:** Đã nhận được mã OTP hợp lệ qua email.
- **Steps:**
  1. Nhập mã OTP chính xác.
  2. Nhập mật khẩu mới.
  3. Nhấp nút "Xác nhận".
- **Test Data:**
  - Mã OTP: `123456`
  - Mật khẩu mới: `newpass123`
- **Expected:** Hệ thống cập nhật mật khẩu mới thành công, thông báo đặt lại mật khẩu thành công.
- **Actual:** Đạt

---

### [TC_AUTH_009] Đăng xuất khỏi hệ thống

- **Precondition:** Người dùng đã đăng nhập thành công vào hệ thống.
- **Steps:**
  1. Nhấp biểu tượng Quản lý / Avatar trên Header.
  2. Chọn "Đăng xuất".
- **Test Data:** Không có.
- **Expected:**
  1. Token JWT bị xóa khỏi LocalStorage và Redux state.
  2. Trang web tự động chuyển hướng về Trang chủ.
  3. Header hiển thị lại hai nút "Đăng nhập" và "Đăng ký".
- **Actual:** Đạt

---

### [TC_AUTH_010] Chặn truy cập trực tiếp trang quản trị (Admin/System Route Guard)

- **Precondition:** Chưa đăng nhập hoặc đăng nhập bằng tài khoản có quyền `user` (người tìm kiếm).
- **Steps:**
  1. Nhập trực tiếp đường dẫn quản trị hệ thống `/he-thong` hoặc `/admin` trên thanh địa chỉ trình duyệt.
  2. Nhấn Enter để truy cập.
- **Test Data:** URL: `http://localhost:5173/he-thong/quan-ly-bai-dang`
- **Expected:** Hệ thống kiểm tra quyền truy cập (Route Guard), chặn không cho hiển thị trang và tự động chuyển hướng về trang Đăng nhập `/login`.
- **Actual:** Đạt

---

### [TC_AUTH_011] Phiên làm việc hết hạn (Token Expired)

- **Precondition:** Người dùng đang ở trong hệ thống, nhưng token JWT lưu trong LocalStorage đã hết hạn sử dụng.
- **Steps:**
  1. Thực hiện một thao tác yêu cầu gửi API có kèm token (ví dụ: Nhấp xem "Lịch sử nạp tiền").
- **Test Data:** Token JWT hết hạn.
- **Expected:**
  1. API server trả về mã lỗi `401 Unauthorized` kèm thông báo hết hạn.
  2. Client tự động xóa token hết hạn, hiển thị popup "Phiên làm việc hết hạn, vui lòng đăng nhập lại".
  3. Chuyển hướng người dùng về trang Đăng nhập.
- **Actual:** Đạt

---

### [TC_AUTH_013] Quên mật khẩu - Email không tồn tại trong hệ thống

- **Precondition:** Địa chỉ email chưa từng đăng ký tài khoản.
- **Steps:**
  1. Nhập email chưa đăng ký tại trang Quên mật khẩu.
  2. Bấm "Gửi yêu cầu".
- **Test Data:** Email: `notfound_email@gmail.com`
- **Expected:** Hệ thống trả về lỗi "Email này không tồn tại trong hệ thống hoặc chưa được đăng ký".
- **Actual:** Đạt

---

### [TC_AUTH_015] Đăng ký thất bại do mật khẩu không đủ độ bảo mật tối thiểu

- **Precondition:** Số điện thoại chưa được đăng ký trong hệ thống.
- **Steps:**
  1. Truy cập trang đăng ký.
  2. Điền Họ tên, Số điện thoại hợp lệ.
  3. Nhập mật khẩu quá ngắn (dưới 6 ký tự).
  4. Nhấp nút "Đăng ký".
- **Test Data:** Họ tên: `Nguyen Van A`, Số điện thoại: `0923456789`, Mật khẩu: `123`
- **Expected:** Hệ thống chặn gửi request và báo lỗi "Mật khẩu phải chứa ít nhất 6 ký tự" ngay dưới ô nhập liệu.
- **Actual:** Đạt

---

### [TC_AUTH_016] Chặn gửi yêu cầu gửi mã OTP liên tục (Anti-spam OTP Rate Limit)

- **Precondition:** Tài khoản có Email liên kết tồn tại trong hệ thống.
- **Steps:**
  1. Truy cập trang Quên mật khẩu.
  2. Nhập Email hợp lệ và nhấn nút "Gửi mã OTP".
  3. Ngay lập tức nhấn liên tiếp nút "Gửi lại OTP".
- **Test Data:** Email: `nva@gmail.com`
- **Expected:** Hệ thống vô hiệu hóa nút gửi trong vòng 60 giây và hiển thị thông báo "Vui lòng đợi 60 giây trước khi yêu cầu mã OTP mới".
- **Actual:** Đạt

---

### [TC_AUTH_017] Thời gian đếm ngược và hết hạn OTP khôi phục mật khẩu (OTP Expiration & Countdown Timer)

- **Precondition:** Đã gửi yêu cầu quên mật khẩu và được chuyển hướng sang trang đặt lại mật khẩu.
- **Steps:**
  1. Quan sát đồng hồ đếm ngược hiển thị ở góc trên biểu mẫu.
  2. Chờ 60 giây cho đồng hồ đếm ngược về `0s`.
  3. Nhập mã OTP đã nhận qua Email, mật khẩu mới và nhấp nút "Cập nhật mật khẩu".
- **Test Data:** Mã OTP đúng nhưng đã quá 60 giây.
- **Expected:**
  1. Đồng hồ đếm ngược chạy lùi từ 60s về 0s. Khi về 0s, hệ thống hiển thị biểu tượng cảnh báo màu đỏ: "🚫 Mã OTP đã hết hạn!".
  2. Nút bấm "Cập nhật mật khẩu" bị vô hiệu hóa.
  3. Nếu người dùng cố ý gửi request bằng mã OTP đã hết hạn, Backend trả về lỗi mã OTP hết hạn và Frontend hiển thị cảnh báo đỏ từ SweetAlert2.
  4. Xuất hiện tùy chọn "Gửi lại mã OTP mới".
- **Actual:** Đạt

---

### [TC_AUTH_018] Tính năng gửi lại mã OTP trực tiếp tại màn hình Đặt lại mật khẩu (Resend OTP directly on ResetPassword)

- **Precondition:** Đang ở giao diện Đặt lại mật khẩu và mã OTP cũ đã hết hạn.
- **Steps:**
  1. Nhấp nút "Gửi lại mã OTP mới" dưới cảnh báo hết hạn.
- **Test Data:** Không có.
- **Expected:** Hệ thống thực hiện gửi lại email chứa mã OTP mới, thiết lập lại bộ đếm ngược thời gian về 60s và thông báo "Mã OTP mới đã được gửi tới email của bạn!" bằng SweetAlert2 thành công.
- **Actual:** Đạt

---

### [TC_AUTH_019] Đăng ký tài khoản - Tự động định dạng số điện thoại đầu số Việt Nam (Phone Number Format Normalization)

- **Precondition:** Đang ở trang Đăng ký tài khoản.
- **Steps:**
  1. Nhập số điện thoại chứa khoảng trắng, ký tự đặc biệt hoặc định dạng mã quốc gia (+84).
  2. Nhấp nút "Đăng ký".
- **Test Data:** Số điện thoại: `+84 912 345 678`, `091-234-5678`.
- **Expected:** Hệ thống tự động làm sạch (loại bỏ ký tự đặc biệt, dấu cách) và chuẩn hóa số điện thoại về định dạng chuẩn `0912345678` trước khi gửi lên API Backend để đăng ký thành công.
- **Actual:** Đạt

---

## 2. Feature: Profile Management (Quản lý thông tin cá nhân)

### [TC_USER_001] Cập nhật thông tin cá nhân thành công

- **Precondition:** Đã đăng nhập vào hệ thống.
- **Steps:**
  1. Truy cập vào trang "Sửa thông tin cá nhân".
  2. Thay đổi Zalo, Email, tải lên Avatar mới.
  3. Nhấp nút "Lưu thay đổi".
- **Test Data:**
  - Họ tên: `Nguyen Van A Pro`
  - Zalo: `0912345678`
  - Email: `nvapro@gmail.com`
  - Avatar: File ảnh (.png)
- **Expected:** Hệ thống lưu thông tin mới vào database, hiển thị thông báo cập nhật thành công và cập nhật tức thì trên giao diện Header/Sidebar.
- **Actual:** Đạt

---

### [TC_USER_002] Thay đổi mật khẩu cá nhân thành công

- **Precondition:** Đã đăng nhập vào hệ thống.
- **Steps:**
  1. Truy cập mục "Đổi mật khẩu" (hoặc tab tương ứng).
  2. Nhập mật khẩu hiện tại và mật khẩu mới.
  3. Nhấp nút "Đổi mật khẩu".
- **Test Data:**
  - Mật khẩu cũ: `password123`
  - Mật khẩu mới: `newpass123`
- **Expected:** Hệ thống cập nhật mật khẩu mới thành công, hiển thị thông báo và yêu cầu đăng nhập lại bằng mật khẩu mới.
- **Actual:** Đạt

---

### [TC_USER_003] Số dư ví không thay đổi khi hủy giao dịch giữa chừng

- **Precondition:** Đang thực hiện luồng nạp tiền và đã được chuyển sang cổng VNPay.
- **Steps:**
  1. Tại màn hình nhập thông tin thẻ của VNPay, tắt tab trình duyệt hoặc bấm nút "Hủy".
  2. Kiểm tra số dư ví tài khoản sau đó.
- **Test Data:** Số tiền nạp: 500,000đ.
- **Expected:**
  1. Số dư ví tài khoản giữ nguyên giá trị cũ.
  2. Hệ thống không tạo giao dịch thành công.
- **Actual:** Đạt

---

### [TC_USER_004] Cập nhật số dư ví đồng bộ thời gian thực (Real-time Balance Sync)

- **Precondition:** Tài khoản đăng nhập cùng lúc trên 2 thiết bị/trình duyệt khác nhau (Tab A và Tab B).
- **Steps:**
  1. Thực hiện nạp tiền hoặc đăng tin bị trừ tiền thành công tại Tab A.
  2. Reload trang hoặc thực hiện một thao tác bất kỳ tại Tab B.
- **Expected:** Số dư ví hiển thị trên Header của Tab B lập tức cập nhật chính xác theo số dư thực tế mới của tài khoản.
- **Actual:** Đạt

---

### [TC_USER_005] Đổi mật khẩu - Nhập mật khẩu hiện tại không khớp

- **Precondition:** Đã đăng nhập vào trang hệ thống.
- **Steps:**
  1. Vào mục "Đổi mật khẩu" (hoặc Sửa thông tin cá nhân).
  2. Nhập mật khẩu cũ sai, điền mật khẩu mới và xác nhận mật khẩu mới.
  3. Nhấn "Cập nhật".
- **Test Data:** Mật khẩu cũ sai: `wrong_pass_123`
- **Expected:** Hệ thống báo lỗi "Mật khẩu cũ không chính xác" và chặn không cho đổi mật khẩu mới.
- **Actual:** Đạt

---

### [TC_USER_006] Cập nhật thông tin cá nhân thất bại do Email không đúng định dạng

- **Precondition:** Đã đăng nhập vào hệ thống.
- **Steps:**
  1. Vào trang "Sửa thông tin cá nhân".
  2. Nhập Email sai định dạng (thiếu @, thiếu tên miền).
  3. Nhấn "Lưu thay đổi".
- **Test Data:** Email: `invalid-email-format`
- **Expected:** Hệ thống chặn và hiển thị thông báo lỗi "Email không đúng định dạng", không cập nhật thông tin trong cơ sở dữ liệu.
- **Actual:** Đạt

---

### [TC_USER_007] Thay đổi ảnh đại diện (Avatar) của người dùng thành công (Update Avatar)

- **Precondition:** Đã đăng nhập vào tài khoản cá nhân.
- **Steps:**
  1. Vào mục "Sửa thông tin cá nhân".
  2. Tại phần Ảnh đại diện, chọn một hình ảnh mới từ thiết bị.
  3. Nhấp "Lưu thay đổi".
- **Test Data:** File hình ảnh `avatar.png`.
- **Expected:** Ảnh đại diện mới được upload lên Cloudinary CDN và cập nhật đồng bộ hiển thị ngay lập tức trên Header và trang cá nhân của người dùng.
- **Actual:** Đạt

---

## 3. Feature: Post Management (Quản lý bài đăng & Duyệt tin)

### [TC_POST_001] Tạo tin đăng cho thuê mới thành công (Số dư đủ)

- **Precondition:** Đã đăng nhập tài khoản với vai trò Chủ trọ (`role = "landlord"`), số dư ví lớn hơn hoặc bằng phí đăng tin.
- **Steps:**
  1. Truy cập trang "Đăng tin mới".
  2. **Bước 1 (Thông tin chi tiết):**
     - Chọn "Loại chuyên mục" (phòng trọ, nhà nguyên căn, căn hộ chung cư...).
     - Điền khu vực: Chọn Tỉnh/Thành phố, Quận/Huyện, Phường/Xã, Số nhà/Tên đường.
     - Nhập thông tin mô tả: Tiêu đề bài đăng, Nội dung mô tả chi tiết.
     - Nhập thông tin giá thuê (đồng/tháng), diện tích (m2), và đối tượng cho thuê.
     - Chọn các "Tiện ích nổi bật" của phòng trọ (gác lửng, máy lạnh, máy giặt, tự do...).
     - Tải lên các hình ảnh thực tế của phòng trọ.
     - Nhấp nút "Tiếp tục".
  3. **Bước 2 (Thanh toán & Gói tin):**
     - Chọn Gói tin đăng (Tin thường, VIP 1, VIP 2, VIP 3, VIP 4, hoặc VIP 5).
     - Chọn số ngày hiển thị tin (Thời hạn đăng tin).
     - Xem tổng số tiền thanh toán thực tế hiển thị.
     - Nhấp nút "Xác nhận".
- **Test Data:**
  - Địa điểm: `Hồ Chí Minh` -> `Quận 1` -> `Phường Bến Nghé` -> `Số 12 Lê Lợi`
  - Tiêu đề: "Cho thuê phòng trọ giá rẻ Quận 1 đầy đủ tiện nghi"
  - Giá thuê: `3,500,000` VNĐ/tháng
  - Diện tích: `25` m2
  - Tiện ích: `Máy lạnh`, `Gác lửng`
  - Ảnh tải lên: 2 file ảnh (.jpg)
  - Gói tin: Tin thường (1,000đ/ngày)
  - Số ngày đăng: 10 ngày (Tổng phí: 10,000đ)
  - Số dư ví hiện có: 50,000đ
- **Expected:**
  1. Hệ thống trừ `10,000đ` trong số dư tài khoản của chủ trọ.
  2. Tạo bản ghi giao dịch `payment` thành công trong database.
  3. Tạo bài viết ở trạng thái `pending` (nếu cần Admin duyệt) hoặc `active` (nếu hệ thống đang bật cấu hình tự động duyệt và chủ trọ uy tín).
  4. Tạo thông báo hệ thống gửi đến tài khoản Admin để kiểm duyệt.
- **Actual:** Đạt

---

### [TC_POST_002] Tạo tin đăng thất bại do số dư ví không đủ

- **Precondition:** Đã đăng nhập tài khoản Chủ trọ, số dư ví nhỏ hơn chi phí thanh toán gói tin đã chọn.
- **Steps:**
  1. Truy cập trang "Đăng tin mới".
  2. **Bước 1 (Thông tin chi tiết):**
     - Điền đầy đủ thông tin chuyên mục, khu vực, mô tả, giá, diện tích, tiện ích và ảnh.
     - Nhấp nút "Tiếp tục".
  3. **Bước 2 (Thanh toán & Gói tin):**
     - Chọn gói tin VIP 5 sao (50,000đ/ngày).
     - Chọn thời gian đăng 10 ngày (Tổng phí thanh toán: 500,000đ).
     - Nhấp nút "Xác nhận".
- **Test Data:**
  - Gói tin: VIP 5 (50,000đ/ngày)
  - Số ngày: 10 ngày (Tổng phí: 500,000đ)
  - Số dư ví hiện có: 5,000đ
- **Expected:** Hệ thống hiển thị cảnh báo "Số dư không đủ.", không trừ tiền ví và không tạo tin đăng mới.
- **Actual:** Đạt

---

### [TC_POST_003] Chỉnh sửa tin đăng thành công

- **Precondition:** Tin đăng thuộc sở hữu của chủ trọ đang đăng nhập.
- **Steps:**
  1. Truy cập trang "Quản lý tin đăng".
  2. Chọn tin cần chỉnh sửa -> nhấn "Sửa".
  3. Thay đổi tiêu đề, mô tả.
  4. Nhấp nút "Lưu cập nhật".
- **Test Data:**
  - Tiêu đề mới: "Cho thuê phòng trọ Quận 1 máy lạnh, ban công rộng"
  - Mô tả mới: "Phòng trọ đẹp đầy đủ tiện nghi, có bếp riêng..."
- **Expected:**
  1. Bài viết được cập nhật thông tin mới.
  2. Trạng thái tin đăng chuyển về `pending` (nếu chế độ tự động duyệt tắt) để duyệt lại.
  3. Tạo bản ghi lưu vết thay đổi trong bảng `PostHistory`.
  4. Gửi thông báo đến Admin.
- **Actual:** Đạt

---

### [TC_POST_003B] Chỉnh sửa tin bị Admin từ chối và gửi duyệt lại (Khóa và thanh toán lại theo gói tin ban đầu)

- **Precondition:** Bài đăng bị Admin Từ chối, hệ thống đã hoàn trả 100% số tiền phí đăng tin vào tài khoản chủ trọ. Số dư tài khoản đủ tiền.
- **Steps:**
  1. Vào quản lý tin đăng -> Chọn tin bị từ chối.
  2. Nhấn nút "Sửa" và cập nhật thông tin bài đăng cho hợp lệ (giao diện không hiển thị chọn gói mới mà mặc định khóa theo gói đăng ban đầu).
  3. Nhấn "Lưu cập nhật và gửi duyệt".
- **Test Data:**
  - Tiêu đề mới: "Cho thuê phòng trọ giá tốt chính chủ..."
  - Gói tin ban đầu: VIP 3 (10,000đ/ngày)
  - Thời hạn: 10 ngày (Phí thanh toán lại: 100,000đ)
  - Số dư ví hiện tại: 120,000đ
- **Expected:**
  1. Hệ thống tự động sử dụng lại cấu hình gói tin cũ (VIP 3, 10 ngày) của bài viết bị từ chối để tính toán phí.
  2. Hệ thống trừ đúng số tiền phí tương ứng (`100,000đ`) từ số dư ví của chủ trọ.
  3. Tạo giao dịch trừ phí bài đăng (`payment`) mới trong CSDL.
  4. Trạng thái tin đăng chuyển về `pending` chờ Admin duyệt lại.
- **Actual:** Đạt

---

### [TC_POST_003C] Chỉnh sửa tin đang hoạt động bình thường (Không trừ phí)

- **Precondition:** Bài đăng đang ở trạng thái hiển thị (`status = "active"`).
- **Steps:**
  1. Vào quản lý tin đăng -> Chọn tin đang hoạt động.
  2. Nhấn nút "Sửa" và cập nhật tiêu đề/mô tả.
  3. Nhấn "Lưu cập nhật".
- **Test Data:**
  - Thay đổi tiêu đề: "Cho thuê phòng trọ Quận 1 sạch đẹp..."
- **Expected:**
  1. Hệ thống cập nhật thông tin bài đăng thành công và lưu lịch sử chỉnh sửa.
  2. Không tạo giao dịch trừ tiền mới và số dư tài khoản của chủ trọ giữ nguyên.
- **Actual:** Đạt

---

### [TC_POST_004] Ẩn tin đăng (Lưu trữ vào kho ẩn)

- **Precondition:** Tin đăng đang ở trạng thái hiển thị (`active`) hoặc chờ duyệt (`pending`).
- **Steps:**
  1. Truy cập trang "Quản lý tin đăng".
  2. Nhấp nút "Ẩn tin" (hoặc dừng hiển thị).
- **Test Data:** Không có.
- **Expected:**
  1. Trạng thái bài đăng chuyển thành `archived`.
  2. Tin đăng không còn hiển thị trên các bộ lọc và trang chủ tìm kiếm.
  3. Tạo thông báo gửi cho Admin báo tin đăng bị ẩn bởi chủ trọ.
- **Actual:** Đạt

---

### [TC_POST_005] Khôi phục tin đăng từ kho lưu trữ

- **Precondition:** Tin đăng đang ở trạng thái lưu trữ (`status = "archived"`).
- **Steps:**
  1. Truy cập trang "Quản lý tin đăng" -> Tab "Tin đã ẩn".
  2. Nhấp nút "Khôi phục".
- **Test Data:** Không có.
- **Expected:**
  1. Trạng thái bài đăng chuyển thành `pending`.
  2. Tạo thông báo gửi Admin yêu cầu duyệt lại bài viết khôi phục.
- **Actual:** Đạt

---

### [TC_POST_005B] Khôi phục tin đăng đã ẩn và giữ nguyên thời hạn (Không trừ phí)

- **Precondition:** Tin đăng đang hoạt động và còn hạn hiển thị bị chủ trọ ẩn đi (`status = "archived"`).
- **Steps:**
  1. Vào trang "Quản lý tin đăng" -> Chọn tab "Tin đã ẩn".
  2. Nhấn nút "Khôi phục" (Duyệt tin hiển thị lại).
- **Test Data:** Tin đăng ID: "post-archived-1" (còn 5 ngày hiển thị).
- **Expected:**
  1. Trạng thái tin đăng chuyển sang `active` hoặc `pending` để hiển thị lại.
  2. Giữ nguyên ngày hết hạn hiển thị cũ.
  3. Không trừ thêm bất kỳ khoản phí nào của chủ trọ.
- **Actual:** Đạt

---

### [TC_POST_006] Xem lịch sử chỉnh sửa bài đăng

- **Precondition:** Tin đăng đã từng được chỉnh sửa và có bản ghi lịch sử.
- **Steps:**
  1. Truy cập trang quản lý bài đăng.
  2. Chọn bài đăng -> nhấp nút "Xem lịch sử".
- **Test Data:** Không có.
- **Expected:** Hệ thống hiển thị danh sách các phiên bản chỉnh sửa cũ gồm: Tiêu đề, Giá, Diện tích trước và sau khi sửa, người sửa và thời điểm thực hiện.
- **Actual:** Đạt

---

### [TC_POST_007] Tạo tin đăng với độ dài tiêu đề nằm ngoài phạm vi cho phép

- **Precondition:** Đã đăng nhập tài khoản chủ trọ và đang ở trang đăng tin mới.
- **Steps:**
  1. Nhập tiêu đề quá ngắn (dưới 10 ký tự) hoặc quá dài (trên 150 ký tự).
  2. Nhấp nút "Tiếp tục".
- **Test Data:**
  - Tiêu đề ngắn: "Cho thuê" (8 ký tự)
  - Tiêu đề dài: Đoạn văn bản dài trên 160 ký tự.
- **Expected:** Hệ thống chặn và báo lỗi "Tiêu đề phải dài từ 10 đến 150 ký tự" ngay phía dưới trường nhập liệu.
- **Actual:** Đạt

---

### [TC_POST_008] Tạo tin đăng nhưng bỏ qua không đăng tải hình ảnh phòng trọ

- **Precondition:** Đã điền đầy đủ các thông tin văn bản ở Bước 1 của trang đăng tin.
- **Steps:**
  1. Không tải lên bất kỳ tệp hình ảnh nào trong khu vực tải ảnh.
  2. Nhấp nút "Tiếp tục".
- **Test Data:** Danh sách ảnh trống.
- **Expected:** Hệ thống báo lỗi "Vui lòng tải lên ít nhất 1 hình ảnh thực tế của phòng trọ" và không cho phép chuyển sang Bước thanh toán.
- **Actual:** Đạt

---

### [TC_POST_009] Nhập giá thuê hoặc diện tích bằng 0 hoặc số âm

- **Precondition:** Đang ở trang đăng tin mới.
- **Steps:**
  1. Nhập Giá thuê bằng `0` hoặc `-3500000`.
  2. Nhập Diện tích bằng `0` hoặc `-25`.
- **Test Data:** Giá thuê = 0, Diện tích = -5.
- **Expected:** Hệ thống kiểm tra dữ liệu và hiển thị lỗi validation ngay dưới ô nhập: "Giá thuê / Diện tích phải là số lớn hơn 0".
- **Actual:** Đạt

---

### [TC_POST_011] Tiến trình tự động quét và chuyển trạng thái tin đăng hết hạn (Cron Job / Scheduler)

- **Precondition:** Có tin đăng đang hoạt động (`status = "active"`) có thời hạn hết hạn (`expired`) nhỏ hơn hoặc bằng thời gian hiện tại.
- **Steps:**
  1. Đợi hoặc kích hoạt thủ công tác vụ định kỳ quét tin hết hạn (`expirePostsJob`).
  2. Kiểm tra trạng thái tin đăng trong database.
- **Test Data:** Tin đăng ID `post-expired-99` có `expired = "2026-05-20T00:00:00Z"`.
- **Expected:** Hệ thống tự động chuyển trạng thái bài viết từ `active` sang `expired` (hoặc `archived`), bài đăng không còn hiển thị trên các trang tìm kiếm.
- **Actual:** Đạt

---

### [TC_POST_012] Ngăn chặn chủ trọ sửa tin đăng đã bị Admin Khóa

- **Precondition:** Tin đăng có trạng thái `status = "blocked"` do vi phạm quy chế đăng tin.
- **Steps:**
  1. Chủ trọ vào trang Quản lý bài đăng cá nhân.
  2. Tìm đến bài đăng bị khóa và nhấp nút "Sửa" hoặc cố ý gửi API cập nhật tin đăng này.
- **Test Data:** Post ID bị khóa.
- **Expected:** Hệ thống không hiển thị nút Sửa bài trên giao diện, và API server chặn request cập nhật, trả về lỗi "Bài viết đã bị khóa, không thể chỉnh sửa."
- **Actual:** Đạt

---

### [TC_POST_013] Giới hạn số lượng hình ảnh tải lên tối đa cho một bài đăng

- **Precondition:** Đang ở trang Đăng tin mới (Bước 1: Nhập thông tin và tải ảnh).
- **Steps:**
  1. Chọn và tải lên 11 hình ảnh từ thiết bị.
- **Test Data:** 11 ảnh định dạng `.jpg`.
- **Expected:** Hệ thống hiển thị thông báo lỗi "Bạn chỉ được tải lên tối đa 10 hình ảnh cho mỗi tin đăng" và tự động loại bỏ các file thừa.
- **Actual:** Đạt

---

### [TC_POST_014] Đồng bộ ngày giờ đăng tin chính xác đến từng phút giữa giao diện Admin và Chủ trọ (Date Time Synchronization)

- **Precondition:** Bài viết đã được tạo và kích hoạt trên hệ thống tại một mốc thời gian cụ thể (ví dụ: 07:11).
- **Steps:**
  1. Đăng nhập tài khoản Chủ trọ, vào trang Quản lý tin đăng và xem thời gian cột "Ngày đăng - Ngày hết hạn".
  2. Đăng nhập tài khoản Admin, vào mục Quản lý bài viết và xem cột ngày đăng của tin đó.
- **Test Data:** Tin đăng ID `post-datetime-sync` có ngày tạo `25/05/2026` lúc `07:11`.
- **Expected:** Cả hai giao diện Chủ trọ và Admin đều hiển thị đồng nhất định dạng ngày giờ cụ thể lấy từ thuộc tính `createdAt` (Ví dụ: `Thứ 2, 07:11 25/05/2026`) thay vì giao diện chủ trọ bị mặc định giờ phút về `00:00`.
- **Actual:** Đạt

---

### [TC_POST_015] Kiểm thử bộ lọc trạng thái "Tin đang ẩn" và bộ lọc mặc định của Chủ trọ (Landlord Status Filtering Logic)

- **Precondition:** Chủ trọ có ít nhất 1 bài viết đang hoạt động (`active`) và 1 bài viết đã ẩn (`archived`).
- **Steps:**
  1. Vào trang Quản lý tin đăng và quan sát danh sách mặc định khi chưa chọn lọc.
  2. Nhấp chọn bộ lọc Trạng thái: "Tin đang ẩn (Kho lưu trữ)" và bấm nút Lọc.
- **Test Data:** Không có.
- **Expected:**
  1. Danh sách mặc định ban đầu không hiển thị các tin đăng đã ẩn (`status = "archived"`) để tránh gây lộn xộn danh sách của chủ trọ.
  2. Khi chọn bộ lọc "Tin đang ẩn (Kho lưu trữ)", hệ thống hiển thị chính xác các tin có trạng thái `archived` trong cơ sở dữ liệu.
- **Actual:** Đạt

---

### [TC_POST_017] Tính năng nạp/đăng tin đồng thời nhiều luồng tránh Race Condition (Concurrent Post Action)

- **Precondition:** Tài khoản chủ trọ có số dư ví vừa đủ cho duy nhất 1 lần đăng tin VIP (Ví dụ: 20,000 VNĐ).
- **Steps:**
  1. Mở 2 tab trình duyệt hoặc gửi cùng lúc 2 request song song tạo bài đăng VIP bằng tài khoản này.
- **Test Data:** Payload tạo tin VIP giá 20,000 VNĐ.
- **Expected:** Backend sử dụng cơ chế Transaction để kiểm tra số dư. Chỉ có tối đa 1 request đăng tin thành công và trừ tiền ví, request còn lại bị từ chối và báo lỗi "Số dư tài khoản không đủ". Số dư ví không bị âm.
- **Actual:** Đạt

---

## 4. Feature: Search & Filtering (Tìm kiếm & Bộ lọc)

### [TC_SRCH_001] Lọc bài đăng theo Tỉnh/Thành phố và Quận/Huyện

- **Precondition:** Có dữ liệu bài đăng thuộc khu vực được chọn.
- **Steps:**
  1. Tại thanh tìm kiếm, chọn Tỉnh/Thành phố.
  2. Chọn Quận/Huyện trực thuộc.
  3. Nhấp nút "Tìm kiếm".
- **Test Data:**
  - Tỉnh/Thành: `Thành phố Hồ Chí Minh`
  - Quận/Huyện: `Quận 1`
- **Expected:** Hệ thống trả về danh sách các bài đăng đang hoạt động có địa chỉ nằm tại Quận 1, TP.HCM.
- **Actual:** Đạt

---

### [TC_SRCH_002] Lọc bài đăng theo Khoảng giá và Diện tích

- **Precondition:** Có dữ liệu bài đăng trong khoảng được chọn.
- **Steps:**
  1. Chọn khoảng giá cần tìm.
  2. Chọn khoảng diện tích cần tìm.
  3. Nhấp nút "Tìm kiếm".
- **Test Data:**
  - Khoảng giá: `2 - 3 triệu`
  - Khoảng diện tích: `20 - 30 m2`
- **Expected:** Hệ thống lọc và hiển thị danh sách bài đăng có giá trị `priceNumber` từ 2 đến 3 triệu và `areaNumber` từ 20 đến 30 m2.
- **Actual:** Đạt

---

### [TC_SRCH_003] Tìm kiếm theo từ khóa tự do

- **Precondition:** Có bài viết chứa từ khóa.
- **Steps:**
  1. Nhập từ khóa vào ô tìm kiếm.
  2. Nhấp nút "Tìm kiếm" (hoặc nhấn Enter).
- **Test Data:**
  - Từ khóa: `máy lạnh gác lửng`
- **Expected:** Hệ thống hiển thị các tin đăng có tiêu đề, mô tả hoặc địa chỉ chứa từ khóa "máy lạnh gác lửng".
- **Actual:** Đạt

---

### [TC_SRCH_004] Lọc bài đăng kết hợp nhiều Đặc điểm nổi bật (AND logic)

- **Precondition:** Có dữ liệu bài đăng chứa các đặc điểm nổi bật khác nhau trong database.
- **Steps:**
  1. Nhấp nút "Bộ lọc" trên thanh tìm kiếm của Header.
  2. Chọn đồng thời nhiều Đặc điểm nổi bật (ví dụ: "Có tủ lạnh" và "Có máy lạnh").
  3. Nhấp nút "Áp dụng".
- **Test Data:** Đặc điểm được chọn: `Feature 1 (Có tủ lạnh)`, `Feature 2 (Có máy lạnh)`.
- **Expected:** Hệ thống lọc và trả về danh sách các bài đăng có chứa đồng thời cả hai đặc điểm "Có tủ lạnh" và "Có máy lạnh". Các bài đăng chỉ chứa một trong hai hoặc không chứa đặc điểm nào sẽ bị loại bỏ.
- **Actual:** Đạt

---

### [TC_SRCH_005] Lọc bài đăng kết hợp tất cả các tiêu chí (Multi-filter Combination)

- **Precondition:** Cơ sở dữ liệu chứa đa dạng bài đăng ở các khu vực và mức giá khác nhau.
- **Steps:**
  1. Mở bộ lọc nâng cao.
  2. Chọn đồng thời: Danh mục, Tỉnh thành, Quận huyện, Phường xã, Khoảng giá, Khoảng diện tích và Đặc điểm nổi bật.
  3. Nhấp nút "Áp dụng".
- **Test Data:**
  - Danh mục: "Căn hộ chung cư"
  - Vị trí: "Hà Nội" -> "Cầu Giấy" -> "Dịch Vọng"
  - Giá: "5 - 7 triệu"
  - Diện tích: "30 - 50 m2"
  - Tiện ích: "Có máy giặt", "Có ban công"
- **Expected:** Hệ thống trả về danh sách các tin đăng thỏa mãn đồng thời tất cả các tiêu chí chọn ở trên.
- **Actual:** Đạt

---

### [TC_SRCH_006] Tìm kiếm không tìm thấy kết quả phù hợp

- **Precondition:** Người dùng tìm kiếm với bộ lọc quá sâu hoặc từ khóa không tồn tại.
- **Steps:**
  1. Nhập từ khóa không có nghĩa vào ô tìm kiếm hoặc chọn lọc các tiêu chí xung đột nhau.
  2. Bấm tìm kiếm.
- **Test Data:** Từ khóa: `xyzabc12345`
- **Expected:** Hệ thống không bị crash, hiển thị màn hình trống kèm thông báo "Không tìm thấy kết quả nào phù hợp với bộ lọc của bạn" cùng gợi ý thay đổi bộ lọc.
- **Actual:** Đạt

---

### [TC_SRCH_007] Lọc tin đăng với giá trị biên lớn nhất / nhỏ nhất

- **Precondition:** Cơ sở dữ liệu chứa đa dạng tin đăng có giá và diện tích cực lớn hoặc cực nhỏ.
- **Steps:**
  1. Chọn lọc giá thuê với tiêu chí "Dưới 1 triệu" hoặc diện tích "Trên 90 m2".
  2. Nhấp nút "Tìm kiếm".
- **Test Data:** Giá lọc = dưới 1M, Diện tích lọc = trên 90m2.
- **Expected:** Hệ thống trả về chính xác các tin đăng có `priceNumber` < 1,000,000 hoặc `areaNumber` > 90 mà không bị lỗi logic so sánh.
- **Actual:** Đạt

---

### [TC_SRCH_008] Lọc tin đăng chỉ theo Tỉnh/Thành phố mà không chọn Quận/Huyện

- **Precondition:** Có các tin đăng thuộc nhiều quận huyện khác nhau của cùng một Tỉnh/Thành phố.
- **Steps:**
  1. Chọn Tỉnh/Thành phố trên thanh tìm kiếm.
  2. Bỏ trống ô Quận/Huyện và Phường/Xã.
  3. Nhấp nút "Tìm kiếm".
- **Test Data:** Tỉnh/Thành phố = `Hà Nội`
- **Expected:** Hệ thống lọc ra tất cả các tin đăng thuộc Hà Nội, bao gồm đầy đủ các Quận/Huyện trực thuộc như Cầu Giấy, Đống Đa, Hai Bà Trưng, v.v.
- **Actual:** Đạt

---

### [TC_SRCH_009] Phân trang danh sách tin đăng ở Trang chủ (Pagination UX)

- **Precondition:** Hệ thống có tổng số bài viết nhiều hơn số lượng hiển thị tối đa của một trang (ví dụ > 10 tin).
- **Steps:**
  1. Cuộn xuống cuối danh sách tin đăng ở trang chủ.
  2. Nhấp chọn số trang `2` hoặc nút mũi tên `Sau`.
- **Test Data:** Không có.
- **Expected:**
  1. Hệ thống chuyển sang danh sách tin đăng tiếp theo của trang 2.
  2. Vị trí cuộn trang (scroll position) tự động đưa lên đầu danh sách tin đăng mới để người dùng bắt đầu đọc mà không phải tự cuộn thủ công lên trên.
  3. Số hiệu trang `2` trên thanh phân trang được làm nổi bật.
- **Actual:** Đạt

---

## 5. Feature: Deposit & Transactions (Nạp tiền & Giao dịch ví)

### [TC_DEP_001] Tạo yêu cầu nạp tiền qua VNPay

- **Precondition:** Đã đăng nhập tài khoản chủ trọ.
- **Steps:**
  1. Truy cập trang "Nạp tiền vào tài khoản".
  2. Nhập số tiền muốn nạp.
  3. Nhấp nút "Thanh toán qua VNPay".
- **Test Data:**
  - Số tiền: `100000` VNĐ
- **Expected:** Hệ thống tạo link thanh toán VNPay thành công và tự động chuyển hướng người dùng sang trang thanh toán sandbox của VNPay.
- **Actual:** Đạt

---

### [TC_DEP_002] Nạp tiền thành công và cộng số dư ví

- **Precondition:** Đã thực hiện bước [TC_DEP_001] thành công.
- **Steps:**
  1. Chọn phương thức thanh toán "Thẻ nội địa" trên cổng VNPay.
  2. Nhập thông tin thẻ test.
  3. Xác nhận OTP giao dịch thành công.
  4. Hệ thống nhận callback thành công từ VNPay và cập nhật kết quả.
- **Test Data:**
  - Thẻ test: NCB
  - Số thẻ: `9704191333333333`
  - Tên chủ thẻ: `NGUYEN VAN A`
  - Ngày phát hành: `07/15`
  - OTP: `123456`
- **Expected:** Hệ thống kiểm tra chữ ký hợp lệ, cộng thêm `100,000` VNĐ vào số dư ví của tài khoản, tạo bản ghi giao dịch trạng thái `success`, hiển thị trang thông báo nạp tiền thành công.
- **Actual:** Đạt

---

### [TC_DEP_003] Nạp tiền thất bại do người dùng hủy giao dịch

- **Precondition:** Đã thực hiện bước [TC_DEP_001] thành công.
- **Steps:**
  1. Trên trang thanh toán VNPay, nhấp nút "Hủy giao dịch" hoặc nút "Quay lại" trên trình duyệt.
  2. Chờ hệ thống xử lý callback redirect của VNPay.
- **Test Data:** Không có.
- **Expected:** Hệ thống ghi nhận giao dịch thất bại/hủy bỏ, số dư tài khoản giữ nguyên, hiển thị thông báo giao dịch không thành công.
- **Actual:** Đạt

---

### [TC_DEP_004] Xem lịch sử giao dịch ví

- **Precondition:** Đã đăng nhập tài khoản.
- **Steps:**
  1. Truy cập trang "Lịch sử giao dịch".
- **Test Data:** Không có.
- **Expected:** Hệ thống hiển thị danh sách tất cả các giao dịch: nạp tiền (`deposit`), thanh toán tin (`payment`), hoàn tiền (`refund`) sắp xếp theo thời gian mới nhất.
- **Actual:** Đạt

---

### [TC_DEP_005] Tạo yêu cầu nạp tiền với số tiền không hợp lệ (Biên trị số)

- **Precondition:** Đã truy cập trang "Nạp tiền vào tài khoản".
- **Steps:**
  1. Nhập số tiền nạp nhỏ hơn hạn mức tối thiểu, nhập số âm hoặc nhập ký tự chữ.
  2. Nhấp nút "Thanh toán".
- **Test Data:** Số tiền: `5000` (dưới 10k), `-50000`, `abc`
- **Expected:** Hệ thống kiểm tra dữ liệu đầu vào, hiển thị thông báo lỗi "Số tiền nạp phải là số nguyên dương và tối thiểu là 10,000 VNĐ", không cho phép chuyển hướng sang VNPay.
- **Actual:** Đạt

---

### [TC_DEP_006] Ngăn ngừa nạp tiền trùng lặp giao dịch (Idempotency check trên IPN)

- **Precondition:** Đã thực hiện nạp tiền và nhận callback thanh toán VNPay thành công.
- **Steps:**
  1. Server nhận request callback IPN của VNPay lần 1 cho mã giao dịch `vnp_TxnRef = "TXN-1002"`.
  2. Hệ thống đã xử lý cộng tiền và cập nhật trạng thái `success`.
  3. Gửi lại request IPN callback lần 2 với cùng mã `vnp_TxnRef = "TXN-1002"`.
- **Test Data:** `vnp_TxnRef = "TXN-1002"`, `vnp_ResponseCode = "00"`
- **Expected:** Server kiểm tra thấy giao dịch đã được xử lý thành công trước đó, trả về JSON phản hồi cho VNPay: `{"RspCode": "02", "Message": "Order already confirmed"}` và không cộng số dư tài khoản lần 2.
- **Actual:** Đạt

---

### [TC_DEP_007] Kiểm tra lịch sử giao dịch khi được hoàn trả tiền do bị từ chối duyệt (Refund Transaction History)

- **Precondition:** Có tin đăng VIP đang ở trạng thái chờ duyệt (`pending`) đã bị trừ phí.
- **Steps:**
  1. Admin bấm Từ chối duyệt tin đăng và nhập lý do từ chối.
  2. Chủ trọ đăng nhập, vào mục "Lịch sử giao dịch".
- **Test Data:** Tin VIP 2, phí đăng tin 30,000 VNĐ.
- **Expected:** Hệ thống cộng lại tiền vào ví (+30,000 VNĐ) và hiển thị một bản ghi hoàn tiền mới trong lịch sử giao dịch với loại là `refund`, ghi rõ lý do hoàn tiền kèm mã tin đăng ngắn gọn.
- **Actual:** Đạt

---

## 6. Feature: Landlord KYC Verification (Xác minh danh tính chủ trọ)

### [TC_KYC_001] Gửi yêu cầu xác minh danh tính (KYC) từ phía chủ trọ thành công

- **Precondition:** Đã đăng nhập tài khoản chủ trọ có trạng thái chưa xác minh (`kycStatus = "unverified"`).
- **Steps:**
  1. Vào mục "Xác minh tài khoản" trên sidebar hệ thống.
  2. Nhập số CCCD hợp lệ gồm 12 chữ số.
  3. Chọn và tải ảnh mặt trước CCCD và mặt sau CCCD từ thiết bị.
  4. Nhấn nút "Gửi yêu cầu".
- **Test Data:**
  - Số CCCD: `001099123456`
  - Ảnh CCCD: `front.jpg`, `back.jpg`
- **Expected:**
  1. Yêu cầu được gửi lên thành công, cập nhật trạng thái KYC của chủ trọ thành `pending`.
  2. Ảnh được tải và lưu link an toàn trên CDN Cloudinary.
  3. Màn hình tự động chuyển sang giao diện Chờ duyệt.
- **Actual:** Đạt

---

### [TC_KYC_002] Hệ thống hiển thị banner cảnh báo KYC động trên dashboard chủ trọ ở trạng thái chưa xác minh

- **Precondition:** Đang đăng nhập tài khoản chủ trọ chưa thực hiện KYC (`kycStatus = "unverified"`).
- **Steps:**
  1. Truy cập vào bất kỳ trang quản lý nào trong hệ thống (Đăng tin, Quản lý tin đăng, Lịch sử giao dịch,...).
  2. Quan sát phần trên cùng của vùng nội dung chính.
- **Test Data:** Không có.
- **Expected:** Hệ thống hiển thị banner màu vàng cam cảnh báo tài khoản chưa xác minh danh tính, đi kèm nút bấm "Xác minh ngay →" để đi nhanh tới trang gửi yêu cầu KYC.
- **Actual:** Đạt

---

### [TC_KYC_003] Admin phê duyệt yêu cầu KYC thành công (Hiển thị tích xanh xác minh)

- **Precondition:** Có yêu cầu xác minh danh tính (KYC) ở trạng thái chờ duyệt trong hệ thống.
- **Steps:**
  1. Đăng nhập tài khoản Admin, vào mục "Phê duyệt KYC".
  2. Tìm yêu cầu KYC tương ứng, kiểm tra thông tin và nhấp phóng to hình ảnh CCCD để kiểm chứng.
  3. Nhấn nút "Phê duyệt".
- **Test Data:** Bản ghi yêu cầu KYC của chủ trọ Nguyen Van A.
- **Expected:**
  1. Trạng thái KYC của chủ trọ chuyển sang `verified` trong database.
  2. Khi người dùng xem chi tiết các tin đăng của chủ trọ này ngoài trang chủ, cạnh tên chủ trọ sẽ hiển thị Huy hiệu tích xanh đã xác minh uy tín.
- **Actual:** Đạt

---

### [TC_KYC_004] Admin từ chối yêu cầu KYC kèm lý do và hiển thị cảnh báo chi tiết cho chủ trọ

- **Precondition:** Có yêu cầu xác minh danh tính (KYC) ở trạng thái chờ duyệt.
- **Steps:**
  1. Đăng nhập tài khoản Admin, vào mục "Phê duyệt KYC".
  2. Nhấp nút "Từ chối" trên yêu cầu tương ứng.
  3. Nhập lý do từ chối (ví dụ: "Ảnh CCCD bị mờ, không nhìn rõ thông tin").
  4. Nhấp nút "Xác nhận".
  5. Đăng nhập tài khoản chủ trọ đã bị từ chối, truy cập trang quản lý.
- **Test Data:** Lý do từ chối: `Ảnh CCCD bị mờ, không nhìn rõ thông tin`.
- **Expected:**
  1. Trạng thái KYC của chủ trọ chuyển sang `rejected`, lưu lý do vào trường `kycNote`.
  2. Tại trang quản lý của chủ trọ, banner cảnh báo chuyển sang màu đỏ và hiển thị chính xác lý do từ chối của Admin kèm nút "Gửi lại yêu cầu →".
- **Actual:** Đạt

---

### [TC_KYC_005] Hệ thống hiển thị banner trạng thái đang chờ duyệt (pending) của chủ trọ

- **Precondition:** Tài khoản chủ trọ đã gửi yêu cầu KYC và đang ở trạng thái chờ duyệt (`kycStatus = "pending"`).
- **Steps:**
  1. Đăng nhập tài khoản chủ trọ này, truy cập vào trang quản lý hệ thống.
  2. Quan sát phần trên cùng của vùng nội dung chính.
- **Test Data:** Không có.
- **Expected:** Hệ thống hiển thị banner màu xanh lam thông báo yêu cầu xác minh danh tính đang được Admin xem xét phê duyệt. Nút bấm xác minh ngay bị ẩn đi.
- **Actual:** Đạt

---

## 7. Feature: Report & Violation Management (Báo cáo vi phạm)

### [TC_REP_001] Khách thuê gửi báo cáo vi phạm (báo xấu) bài đăng tin phòng trọ thành công

- **Precondition:** Khách thuê đang xem chi tiết một tin đăng phòng trọ cụ thể trên website.
- **Steps:**
  1. Bấm vào nút "Báo cáo vi phạm" (Báo xấu) ở cột bên phải thông tin liên hệ.
  2. Chọn một trong các lý do có sẵn (ví dụ: "Tin ảo, phòng không có thực").
  3. Điền nội dung chi tiết phản ánh.
  4. Nhấn nút "Gửi báo cáo".
- **Test Data:** Lý do: `Tin ảo, phòng không có thực`, Nội dung: `Gọi điện chủ trọ báo phòng đã bán từ lâu nhưng vẫn đăng tin`.
- **Expected:** Báo cáo được gửi đi thành công, hiển thị thông báo Swal chúc mừng và tạo mới một dòng ghi nhận trong bảng `Reports` ở database.
- **Actual:** Đạt

---

### [TC_REP_002] Admin xem danh sách và phân loại báo cáo vi phạm

- **Precondition:** Có các báo cáo vi phạm được gửi từ người dùng trong cơ sở dữ liệu.
- **Steps:**
  1. Đăng nhập tài khoản Admin, truy cập mục "Quản lý báo cáo".
  2. Nhấp chọn lần lượt các tab phân loại: "Tất cả", "Chờ xử lý", "Đã xử lý", "Bị từ chối".
- **Test Data:** Không có.
- **Expected:** Danh sách hiển thị đúng các báo cáo vi phạm tương ứng với trạng thái của từng tab, đi kèm thông tin chi tiết bài đăng bị báo cáo và lý do.
- **Actual:** Đạt

---

### [TC_REP_003] Admin xử lý báo cáo vi phạm bài đăng thành công

- **Precondition:** Đang đăng nhập tài khoản Admin và ở trang "Quản lý báo cáo".
- **Steps:**
  1. Tìm báo cáo vi phạm đang ở trạng thái chờ xử lý (`pending`).
  2. Nhấp nút "Xử lý" (hoặc "Từ chối" nếu báo cáo không đúng sự thật).
  3. Chọn phương thức xử lý (ẩn bài đăng vi phạm). Nhấn "Xác nhận".
- **Test Data:** Báo cáo vi phạm của bài đăng ID `99a8b8c8`.
- **Expected:**
  1. Trạng thái của báo cáo vi phạm chuyển sang `resolved` (hoặc `rejected`).
  2. Bài đăng bị báo cáo vi phạm chuyển sang trạng thái ẩn, không còn hiển thị công khai ngoài trang chủ.
- **Actual:** Đạt

---

## 8. Feature: UI/UX & Utility Features (Giao diện & Tiện ích)

### [TC_UI_001] Thiết kế đáp ứng trên thiết bị di động (Responsive Layout)

- **Precondition:** Hệ thống chạy ở độ phân giải di động (Width < 768px).
- **Steps:**
  1. Sử dụng chế độ Responsive của DevTools (F12) chuyển sang thiết bị di động (ví dụ iPhone 12 Pro).
  2. Truy cập Trang chủ, Trang chi tiết tin đăng và Trang quản lý cá nhân.
- **Test Data:** Width = 390px.
- **Expected:**
  1. Giao diện hiển thị gọn gàng, không bị vỡ khung hình, không xuất hiện thanh cuộn ngang (horizontal scrollbar).
  2. Menu Sidebar trên máy tính thu gọn thành Menu ẩn (Hamburger menu) hoặc thanh điều hướng rút gọn để tối ưu hóa không gian hiển thị.
- **Actual:** Đạt

---

### [TC_UI_002] Hiệu ứng tương tác rê chuột (Hover Effects & Micro-animations)

- **Precondition:** Người dùng sử dụng thiết bị có con trỏ chuột.
- **Steps:**
  1. Rê chuột (hover) qua các thẻ tin đăng (Post Card) trên trang chủ.
  2. Rê chuột qua các nút hành động (nút Tìm kiếm, Đăng tin, Gia hạn).
- **Test Data:** Không có.
- **Expected:**
  1. Thẻ tin đăng thay đổi hiệu ứng bóng đổ (box-shadow) mịn màng và dịch chuyển nhẹ (transform: translateY) để tăng tính sinh động.
  2. Các nút đổi màu nền nhẹ nhàng (transition) và con trỏ chuột chuyển thành dạng bàn tay (cursor: pointer), mang lại cảm giác phản hồi tức thì.
- **Actual:** Đạt

---

### [TC_UI_003] Trải nghiệm tải trang và Skeleton Loader (Loading State Experience)

- **Precondition:** Kết nối mạng chậm hoặc đang gọi API lấy danh sách bài viết.
- **Steps:**
  1. Truy cập Trang chủ hoặc bấm chuyển trang (Pagination).
  2. Quan sát giao diện trước khi dữ liệu được tải về thành công.
- **Test Data:** Giả lập mạng chậm (Slow 3G trong DevTools).
- **Expected:** Hệ thống không hiển thị màn hình trống trơn hay bị giật khung hình; thay vào đó, hiển thị các khung xám động (Skeleton Loader) khớp với hình dạng của các thẻ tin đăng thật để giữ chân người dùng.
- **Actual:** Đạt

---

### [TC_UI_004] Thông báo trực quan sinh động bằng SweetAlert2 (Visual Feedback)

- **Precondition:** Thực hiện hành động đăng ký thành công, đăng nhập sai mật khẩu, hoặc nạp tiền.
- **Steps:**
  1. Nhập sai mật khẩu khi đăng nhập và nhấn "Đăng nhập".
- **Test Data:** Mật khẩu: `wrong-pass`
- **Expected:** Hệ thống hiển thị thông báo dưới dạng popup SweetAlert2 có hiệu ứng animation mượt mà, icon thông báo lỗi màu đỏ trực quan thay cho hộp thoại alert mặc định thô sơ của trình duyệt.
- **Actual:** Đạt

---

### [TC_UI_005] Vô hiệu hóa nút và chỉ báo tải khi gửi biểu mẫu (Double-submit Prevention UI)

- **Precondition:** Đang ở biểu mẫu gửi yêu cầu (Đăng ký, Đổi mật khẩu, Gửi OTP).
- **Steps:**
  1. Điền thông tin và nhấn nút gửi.
- **Test Data:** Biểu mẫu gửi mã OTP.
- **Expected:** Ngay sau khi nhấn nút, nút đó sẽ bị vô hiệu hóa (`disabled`) và hiển thị biểu tượng loading (hoặc đếm ngược thời gian) để ngăn chặn người dùng vô ý nhấp đúp hoặc gửi yêu cầu liên tục làm quá tải máy chủ.
- **Actual:** Đạt

---

### [TC_UI_006] Phân cấp trực quan tin đăng VIP nổi bật (Visual Hierarchy)

- **Precondition:** Danh sách bài đăng chứa cả tin thường lẫn tin VIP các cấp (VIP 1, 2, 3, VIP Nổi bật).
- **Steps:**
  1. Duyệt danh sách bài viết ngoài trang chủ hoặc trang tìm kiếm.
- **Test Data:** Không có.
- **Expected:**
  1. Tin VIP nổi bật nhất hiển thị tiêu đề màu đỏ, in hoa, đính kèm huy hiệu (Badge) động nhấp nháy (pulse animation) để thu hút chú ý.
  2. Tin thường có thiết kế tối giản, tạo sự phân cấp thẩm mỹ rõ rệt và thúc đẩy chủ trọ nâng cấp gói tin.
- **Actual:** Đạt

---

### [TC_UI_007] Trực quan hóa lỗi nhập liệu thời gian thực (Real-time Input Field Validation UI)

- **Precondition:** Người dùng đang ở màn hình điền thông tin (Đăng ký, Đổi mật khẩu, Tạo bài viết).
- **Steps:**
  1. Blur (rời khỏi) ô nhập dữ liệu mà không điền thông tin bắt buộc, hoặc nhập thông tin không đúng định dạng.
- **Test Data:** Để trống ô "Số điện thoại" khi đăng ký.
- **Expected:**
  1. Viền của ô nhập liệu lập tức đổi màu sang đỏ (hoặc cam cảnh báo).
  2. Dòng thông báo lỗi hiển thị rõ ràng ngay bên dưới trường đó để người dùng nhận biết ngay lập tức lỗi ở đâu mà không phải đợi click nút submit.
- **Actual:** Đạt

---

### [TC_UI_008] Lưu trạng thái cuộn trang khi quay lại (Scroll Restoration UX)

- **Precondition:** Người dùng đang lướt xem danh sách phòng trọ ở giữa trang chủ.
- **Steps:**
  1. Nhấp chọn một bài đăng bất kỳ để xem chi tiết.
  2. Bấm nút "Quay lại" (Back) trên trình duyệt để về Trang chủ.
- **Test Data:** Vị trí cuộn trang ở tọa độ Y = 1200px.
- **Expected:** Hệ thống tự động khôi phục đúng vị trí cuộn trang (Y = 1200px) trước đó, người dùng không phải cuộn lại từ đầu trang chủ.
- **Actual:** Đạt

---

### [TC_UI_009] Giao diện hiển thị bộ lọc động thu gọn trên di động (Responsive Collapsible Drawer Filters)

- **Precondition:** Người dùng truy cập trên thiết bị di động (Width < 768px).
- **Steps:**
  1. Vào trang Tìm kiếm / Lọc bài đăng.
  2. Bấm chọn nút "Bộ lọc lọc nâng cao".
- **Test Data:** Width = 375px.
- **Expected:**
  1. Trên di động, các bộ lọc không chiếm diện tích hiển thị dọc mà được thu gọn lại.
  2. Khi nhấn nút, một ngăn kéo (Drawer/Modal) trượt mượt mà (slide in) từ dưới lên hoặc bên phải sang chứa các thanh trượt chọn giá, diện tích và tiện ích.
- **Actual:** Đạt

---

### [TC_UI_010] Trình chiếu và phóng to album ảnh phòng trọ (Image Lightbox Slider)

- **Precondition:** Ở trang chi tiết của một tin đăng có nhiều ảnh.
- **Steps:**
  1. Click vào ảnh chính hoặc ảnh phụ trong thư viện ảnh.
- **Test Data:** Không có.
- **Expected:**
  1. Hệ thống hiển thị giao diện xem ảnh phóng to toàn màn hình với nền tối (overlay mờ).
  2. Người dùng có thể nhấn nút mũi tên Trái/Phải để chuyển ảnh kế tiếp hoặc vuốt cảm ứng dễ dàng trên thiết bị di động.
- **Actual:** Đạt

---

### [TC_UI_011] Hiển thị bản đồ vị trí tại trang chi tiết phòng trọ (Map Rendering in Detail Page)

- **Precondition:** Tin đăng có địa chỉ cụ thể và tọa độ GPS (latitude, longitude) hợp lệ trong cơ sở dữ liệu.
- **Steps:**
  1. Click vào một tin đăng cụ thể ngoài trang chủ để xem trang chi tiết.
  2. Cuộn xuống phần "Bản đồ đường đi" ở dưới trang.
- **Test Data:** Không có.
- **Expected:** Bản đồ hiển thị chính xác vị trí phòng trọ bằng marker đỏ dựa trên tọa độ GPS, người dùng có thể zoom in/zoom out và nhấp vào để chuyển sang dẫn đường bằng Google Maps.
- **Actual:** Đạt

---

## 9. Feature: Admin Operations & System Moderation (Quản lý Admin)

### [TC_ADM_001] Xem số liệu tổng quan trên Dashboard

- **Precondition:** Đăng nhập bằng tài khoản có vai trò `role = "admin"`.
- **Steps:**
  1. Truy cập vào trang quản trị (Admin Dashboard).
- **Test Data:** Không có.
- **Expected:** Hệ thống hiển thị chính xác thống kê tổng doanh thu, tổng số tin đăng, số lượng người dùng mới, và biểu đồ doanh thu theo thời gian.
- **Actual:** Đạt

---

### [TC_ADM_002] Phê duyệt tin đăng thành công

- **Precondition:** Có tin đăng ở trạng thái chờ duyệt (`status = "pending"`).
- **Steps:**
  1. Vào mục "Quản lý bài đăng" trong trang Admin.
  2. Tìm tin đăng trạng thái `pending`.
  3. Nhấp nút "Duyệt".
- **Test Data:**
  - Post ID: `post-pending-123`
- **Expected:**
  1. Trạng thái tin đăng chuyển sang `active`.
  2. Kích hoạt ngày đăng và ngày hết hạn.
  3. Tạo thông báo gửi cho chủ trọ báo tin đã được duyệt thành công.
- **Actual:** Đạt

---

### [TC_ADM_003] Từ chối phê duyệt tin đăng & hoàn tiền cho chủ trọ

- **Precondition:** Có tin đăng ở trạng thái chờ duyệt và có giao dịch thanh toán phí trước đó.
- **Steps:**
  1. Vào mục "Quản lý bài đăng".
  2. Tìm tin đăng trạng thái `pending`.
  3. Nhấp nút "Từ chối".
  4. Nhập lý do từ chối vào popup.
  5. Nhấp nút "Xác nhận".
- **Test Data:**
  - Post ID: `post-pending-123`
  - Lý do từ chối: `Ảnh phòng trọ không đúng thực tế`
- **Expected:**
  1. Trạng thái tin đăng chuyển sang `rejected`, cột ghi chú `note` lưu lại lý do.
  2. Số dư tài khoản chủ trọ được hoàn lại số tiền phí đăng tin tương ứng.
  3. Tạo giao dịch hoàn tiền `refund` thành công.
  4. Gửi thông báo từ chối kèm lý do cho chủ trọ.
- **Actual:** Đạt

---

### [TC_ADM_004] Khóa tài khoản người dùng vi phạm

- **Precondition:** Tài khoản người dùng đang hoạt động (`active`).
- **Steps:**
  1. Vào mục "Quản lý người dùng" trong trang Admin.
  2. Chọn tài khoản cần khóa.
  3. Nhấp nút "Khóa tài khoản" và nhập lý do.
- **Test Data:**
  - User ID: `user-id-999`
  - Lý do: `Đăng tin rác lừa đảo nhiều lần`
- **Expected:** Trạng thái tài khoản đổi thành `blocked`. Người dùng này sẽ bị kick ra khỏi phiên đăng nhập và không thể đăng nhập lại.
- **Actual:** Đạt

---

### [TC_ADM_005] Phản hồi liên hệ / góp ý của khách hàng

- **Precondition:** Có yêu cầu liên hệ ở trạng thái chờ xử lý.
- **Steps:**
  1. Vào mục "Quản lý liên hệ".
  2. Chọn liên hệ cần phản hồi.
  3. Nhập câu trả lời và nhấp nút "Gửi phản hồi".
- **Test Data:**
  - Contact ID: `contact-id-12`
  - Nội dung trả lời: `Cảm ơn bạn, gói VIP 5 có thời hạn hiển thị tối đa...`
- **Expected:** Lưu câu trả lời vào trường `response` của liên hệ, đổi trạng thái liên hệ sang `processed`.
- **Actual:** Đạt

---

### [TC_ADM_006] Thay đổi cài đặt phê duyệt tự động

- **Precondition:** Tài khoản Admin đang truy cập.
- **Steps:**
  1. Vào trang "Cấu hình hệ thống" (System Settings).
  2. Bật checkbox "Tự động duyệt tin đăng mới".
  3. Nhấp nút "Lưu thay đổi".
- **Test Data:**
  - autoApprove: `true`
- **Expected:** Hệ thống cập nhật cấu hình vào file `systemSettings.json`, các tin đăng mới tạo sau này sẽ tự động chuyển sang `active` nếu thỏa mãn điều kiện.
- **Actual:** Đạt

---

### [TC_ADM_007] Tự động duyệt các tin chờ duyệt cũ khi bật tính năng duyệt tự động

- **Precondition:** Hệ thống có sẵn các tin thường và tin VIP ở trạng thái `pending`.
- **Steps:**
  1. Admin thực hiện kích hoạt chế độ "Tự động duyệt tin đăng mới" (TC_ADM_006).
- **Test Data:** Không có.
- **Expected:** Hệ thống chạy trình quét tự động duyệt (`sweepPendingPostsService`): Các tin đăng VIP hoặc các tin đăng thường của chủ trọ có độ uy tín cao (đủ 5 tin hoạt động và chưa bị từ chối lần nào) sẽ được tự động chuyển sang `active` và gửi thông báo cho chủ trọ.
- **Actual:** Đạt

---

### [TC_ADM_008] Phê duyệt tin đăng có thời hạn chờ duyệt quá hạn (Tính lại ngày hết hạn)

- **Precondition:** Tin đăng của chủ trọ ở trạng thái chờ duyệt (`pending`), đã được tạo từ cách đây nhiều ngày và thời hạn đăng ban đầu ngắn hơn thời gian chờ duyệt.
- **Steps:**
  1. Admin truy cập trang Quản lý bài đăng -> Nhấp nút "Duyệt" cho tin chờ duyệt quá hạn này.
- **Test Data:**
  - Ngày tạo tin: `15/05/2026`
  - Thời hạn đăng: 5 ngày (lẽ ra hết hạn vào `20/05/2026`)
  - Ngày Admin phê duyệt: `22/05/2026`
- **Expected:** Hệ thống tự động tính toán lại thời gian hiển thị bắt đầu từ thời điểm phê duyệt (`published` = `22/05/2026`) và gia hạn ngày hết hạn tương ứng (`expired` = `27/05/2026`) để bảo đảm quyền lợi đủ số ngày hiển thị đã mua của chủ trọ.
- **Actual:** Đạt

---

## 10. Feature: Notification Management (Quản lý thông báo)

### [TC_NOT_001] Hiển thị thông báo trên chuông thông báo

- **Precondition:** Có thông báo mới phát sinh gửi đến tài khoản.
- **Steps:**
  1. Đăng nhập tài khoản.
  2. Nhấp vào biểu tượng chuông thông báo ở góc trên bên phải.
- **Test Data:** Không có.
- **Expected:** Danh sách các thông báo hiển thị chi tiết (ví dụ: Tin được duyệt, giao dịch thành công) kèm theo chấm đỏ báo hiệu thông báo chưa đọc.
- **Actual:** Đạt

---

### [TC_NOT_002] Đánh dấu thông báo đã đọc

- **Precondition:** Có thông báo trong danh sách ở trạng thái chưa đọc (`isRead = false`).
- **Steps:**
  1. Nhấp chọn một thông báo chưa đọc trong danh sách chuông thông báo.
- **Test Data:**
  - Notification ID: `notif-uuid-1`
- **Expected:** Trạng thái thông báo chuyển thành `isRead = true` ở database. Chấm đỏ chưa đọc trên UI biến mất.
- **Actual:** Đạt

---

### [TC_NOT_003] Đánh dấu đọc tất cả các thông báo

- **Precondition:** Danh sách thông báo có nhiều thông báo ở trạng thái chưa đọc.
- **Steps:**
  1. Nhấp chuông thông báo.
  2. Nhấp chọn nút "Đọc tất cả" ở góc danh sách thông báo.
- **Test Data:** Không có.
- **Expected:**
  1. Tất cả thông báo chưa đọc của người dùng chuyển sang trạng thái đã đọc (`isRead = true`).
  2. Dấu đỏ thông báo chưa đọc biến mất hoàn toàn trên biểu tượng chuông ở Header.
- **Actual:** Đạt

---

### [TC_NOT_004] Gửi thông báo cho Chủ trọ khi tin đăng được duyệt tự động (Landlord Notification on Auto-Approval)

- **Precondition:** Hệ thống đang bật chế độ tự động duyệt tin đăng và số dư ví của chủ trọ đủ.
- **Steps:**
  1. Chủ trọ tiến hành đăng tin mới (hoặc chỉnh sửa tin đăng) thỏa mãn điều kiện tự động duyệt.
  2. Sau khi tin đăng tạo thành công, nhấp vào biểu tượng chuông thông báo của Chủ trọ.
- **Test Data:** Tin đăng VIP hoặc Tin thường từ chủ trọ có độ uy tín cao.
- **Expected:** Chuông thông báo của chủ trọ nhận được thông báo mới từ hệ thống: "Tin đăng đã được duyệt tự động" (hoặc "Tin đăng cập nhật đã được duyệt tự động") kèm theo mã tin và tiêu đề tin được duyệt thành công.
- **Actual:** Đạt

---

## 11. Feature: Wishlist & Saved Posts (Quản lý tin đã lưu)

### [TC_WSH_001] Thêm bài đăng vào danh sách yêu thích

- **Precondition:** Đã đăng nhập vào hệ thống.
- **Steps:**
  1. Duyệt danh sách bài đăng trên trang chủ.
  2. Nhấp biểu tượng trái tim/lưu tin trên thẻ bài đăng.
- **Test Data:**
  - Post ID: `post-id-123`
- **Expected:** Biểu tượng trái tim đổi màu (active), hệ thống thêm bài đăng vào danh sách tin đã lưu của người dùng.
- **Actual:** Đạt

---

### [TC_WSH_002] Xóa bài đăng khỏi danh sách yêu thích

- **Precondition:** Bài đăng đã nằm trong danh sách yêu thích.
- **Steps:**
  1. Vào mục "Tin đã lưu".
  2. Nhấp biểu tượng trái tim hoặc nút "Xóa" trên tin đăng đó.
- **Test Data:**
  - Post ID: `post-id-123`
- **Expected:** Bài đăng biến mất khỏi trang "Tin đã lưu", biểu tượng trái tim hiển thị trạng thái chưa lưu.
- **Actual:** Đạt

---

### [TC_WSH_003] Sử dụng tính năng "Tin đã lưu" khi chưa đăng nhập (Khách vãng lai)

- **Precondition:** Người dùng chưa thực hiện Đăng nhập tài khoản.
- **Steps:**
  1. Duyệt tin đăng ngoài trang chủ -> Nhấp biểu tượng trái tim để lưu một số bài đăng.
  2. Truy cập trang "Tin đã lưu" từ Header.
- **Test Data:** Post ID: "post-id-anonymous"
- **Expected:**
  1. Biểu tượng trái tim sáng đỏ báo hiệu đã lưu.
  2. Trang "Tin đã lưu" liệt kê đầy đủ các tin đăng đã chọn (dữ liệu được quản lý dưới localStorage).
- **Actual:** Đạt

---

### [TC_WSH_004] Duy trì danh sách "Tin đã lưu" sau khi Đăng nhập tài khoản (Client-side Persistence)

- **Precondition:** Người dùng đã lưu một số tin đăng dưới danh nghĩa khách vãng lai (như TC_WSH_003).
- **Steps:**
  1. Nhấp nút "Đăng nhập" ở Header và thực hiện đăng nhập tài khoản.
  2. Kiểm tra lại danh mục "Tin đã lưu".
- **Test Data:** Không có.
- **Expected:** Danh sách tin đã lưu trước khi đăng nhập không bị mất đi, hệ thống tiếp tục duy trì và hiển thị đầy đủ các bài viết đã lưu từ LocalStorage cho tài khoản vừa đăng nhập.
- **Actual:** Đạt

---

## 12. Feature: Post Extension & Expiration (Gia hạn tin đăng)

### [TC_EXT_001] Gia hạn tin đăng thành công (Tin chưa hết hạn)

- **Precondition:** Tin đăng đang hoạt động (`active`) và số dư ví của chủ trọ đủ tiền.
- **Steps:**
  1. Vào quản lý tin đăng -> Chọn "Gia hạn".
  2. Chọn số ngày cần gia hạn và gói tin nâng cấp.
  3. Xác nhận thanh toán gia hạn.
- **Test Data:**
  - Tin đăng ID: "abc-xyz"
  - Số ngày: 7 ngày
  - Gói nâng cấp: Giữ nguyên VIP 3 (10,000đ/ngày)
  - Tổng phí: 70,000đ
  - Số dư ví: 100,000đ
- **Expected:**
  1. Ví bị trừ `70,000đ`.
  2. Tạo giao dịch thanh toán `payment` trong hệ thống.
  3. Thời hạn hết hạn (`expired`) trong bảng Overview được cộng dồn thêm 7 ngày dựa trên ngày hết hạn cũ.
- **Actual:** Đạt

---

### [TC_EXT_002] Gia hạn tin đăng thành công (Tin đã hết hạn)

- **Precondition:** Tin đăng đã hết hạn hiển thị và số dư ví đủ tiền.
- **Steps:**
  1. Vào danh sách tin đã hết hạn -> Chọn "Gia hạn".
  2. Chọn số ngày cần gia hạn.
  3. Xác nhận thanh toán.
- **Test Data:**
  - Tin đăng ID: "def-123"
  - Số ngày: 5 ngày
  - Gói: Tin thường (2,000đ/ngày)
  - Tổng phí: 10,000đ
- **Expected:**
  1. Ví bị trừ `10,000đ`.
  2. Ngày hết hạn mới được tính bằng ngày hôm nay (`today`) cộng thêm 5 ngày.
- **Actual:** Đạt

---

### [TC_EXT_003] Gia hạn tin đăng thất bại do ví thiếu tiền

- **Precondition:** Số dư ví nhỏ hơn tổng phí gia hạn.
- **Steps:**
  1. Chọn gia hạn tin đăng.
  2. Chọn số ngày gia hạn lớn vượt quá số dư ví.
  3. Xác nhận thanh toán.
- **Test Data:**
  - Số ngày: 30 ngày
  - Tổng phí: 300,000đ
  - Số dư ví: 20,000đ
- **Expected:** Hệ thống báo lỗi "Số dư ví không đủ để thực hiện gia hạn.", từ chối giao dịch.
- **Actual:** Đạt

---

## 13. Feature: Contact & Feedback (Liên hệ & Góp ý)

### [TC_CON_001] Gửi yêu cầu liên hệ hỗ trợ thành công

- **Precondition:** Truy cập trang liên hệ.
- **Steps:**
  1. Nhập Họ tên, Số điện thoại, Nội dung liên hệ.
  2. Nhấp nút "Gửi liên hệ".
- **Test Data:**
  - Họ tên: `Nguyen Van A`
  - Số điện thoại: `0912345678`
  - Nội dung: `Tôi muốn hỏi về gói tin VIP 5`
- **Expected:** Lưu thông tin liên hệ vào database, hiển thị thông báo gửi thành công và tạo thông báo gửi tới Admin.
- **Actual:** Đạt

---

### [TC_CON_002] Xem lịch sử phản hồi liên hệ của bản thân

- **Precondition:** Đã đăng nhập tài khoản.
- **Steps:**
  1. Truy cập mục "Hỏi đáp / Liên hệ của tôi".
- **Test Data:** Không có.
- **Expected:** Hiển thị danh sách các liên hệ đã gửi kèm trạng thái xử lý và nội dung phản hồi từ Admin (nếu có).
- **Actual:** Đạt

---

## 14. Feature: Crawler & Data Ingestion (Thu thập dữ liệu tự động)

### [TC_CRWL_001] Cào danh sách chuyên mục tin đăng phòng trọ thành công

- **Precondition:** Máy chủ cào dữ liệu có kết nối Internet ổn định, sử dụng DNS-over-HTTPS (DoH) của Google để bypass chặn phân giải DNS của nhà mạng.
- **Steps:**
  1. Chạy lệnh khởi động Crawler (`npm run refresh:scraped` hoặc `node Crawler/index.js`).
  2. Quan sát log console hiển thị danh sách các URL chuyên mục đang được cào.
- **Test Data:** URL mục tiêu: `https://phongtro123.com/`.
- **Expected:**
  1. Crawler khởi chạy thành công, gửi request GET đến trang chủ và trích xuất thành công danh sách các URL chuyên mục (Ví dụ: /cho-thue-phong-tro, /cho-thue-nha-nguyen-can...).
  2. Không xảy ra lỗi `ERR_NAME_NOT_RESOLVED` hay `ERR_CONNECTION_TIMED_OUT`.
- **Actual:** Đạt

---

### [TC_CRWL_002] Cào chi tiết tin đăng phòng trọ thành công

- **Precondition:** Có danh sách URL tin đăng chi tiết đã trích xuất từ listing.
- **Steps:**
  1. Crawler duyệt qua từng URL tin đăng chi tiết.
  2. Trích xuất các trường dữ liệu: Tiêu đề, Giá, Diện tích, Địa chỉ, Mô tả, Số điện thoại chủ trọ, Danh sách ảnh.
- **Test Data:** URL bài viết cụ thể trên phongtro123.com.
- **Expected:** Trích xuất đầy đủ và chính xác tất cả thông tin chi tiết của bài đăng mà không bị sót trường bắt buộc (Tiêu đề, Giá, Diện tích, Số điện thoại).
- **Actual:** Đạt

---

### [TC_CRWL_003] Cơ chế giãn cách (Anti-bot Delay) và chống chặn IP hoạt động hiệu quả

- **Precondition:** Crawler cần cào số lượng lớn bài đăng (>100 bài) và chặn các request từ bên thứ ba (Ads, Tracking, Widgets) để tránh treo trang.
- **Steps:**
  1. Khởi chạy Crawler cào hàng loạt trang.
  2. Quan sát khoảng thời gian giãn cách giữa các request và User-Agent được gửi đi trong Header.
- **Test Data:** Cấu hình giãn cách ngẫu nhiên 1.5 - 3 giây, chặn mọi request không thuộc tên miền `phongtro123.com` và sử dụng User-Agent thực tế của trình duyệt.
- **Expected:** Crawler gửi các request tuần tự với thời gian chờ ngẫu nhiên tránh tần suất quá dày, chặn hết các script bên thứ ba để tăng tốc tải trang gấp 4 lần, thay đổi linh hoạt các User-Agent giả lập để tránh tường lửa của Cloudflare/phongtro123.com chặn IP (HTTP 403 Forbidden).
- **Actual:** Đạt

---

### [TC_CRWL_004] Lưu trữ dữ liệu cào được vào Database và xử lý trùng lặp bài đăng

- **Precondition:** Kết nối cơ sở dữ liệu MySQL hoạt động tốt.
- **Steps:**
  1. Chạy tiến trình cào và lưu dữ liệu.
  2. Kiểm tra dữ liệu trong các bảng `Posts`, `Images`, `Attributes`, `Overview`, `Users`.
  3. Chạy lại Crawler lần 2 để kiểm tra cơ chế chống trùng lặp.
- **Test Data:** Dữ liệu phòng trọ cào được.
- **Expected:**
  1. Dữ liệu được lưu trữ chuẩn xác vào MySQL, liên kết khóa ngoại đầy đủ.
  2. Đối với các tin đăng đã tồn tại trong CSDL, Crawler tự động bỏ qua (hoặc chỉ cập nhật thay đổi) mà không tạo bản ghi mới trùng lặp.
- **Actual:** Đạt

---

## 15. Feature: Performance & System Optimization (Hiệu năng & Tối ưu)

### [TC_PERF_001] Tối ưu hóa dung lượng hình ảnh qua Cloudinary CDN

- **Precondition:** Có bài viết đã đăng tải hình ảnh kích thước và dung lượng gốc lớn.
- **Steps:**
  1. Truy cập trang chủ hoặc trang chi tiết của tin đăng đó.
  2. Inspect (F12) để xem thuộc tính `src` của thẻ ảnh.
- **Test Data:** ID tin đăng: `post-id-image-test`
- **Expected:** URL ảnh gốc của Cloudinary đã được hàm tối ưu tự động chèn thêm các tham số tối ưu hóa nén dung lượng, định dạng và kích thước phù hợp (Ví dụ chứa: `/upload/w_300,h_300,q_auto,f_auto/...`), giúp trang web tải cực nhanh và tiết kiệm băng thông.
- **Actual:** Đạt

---

### [TC_PERF_002] Tối ưu hiệu năng truy vấn dữ liệu lớn (Database Indexes)

- **Precondition:** Cơ sở dữ liệu lớn chứa hàng nghìn bài đăng trọ.
- **Steps:**
  1. Thực hiện tìm kiếm và lọc bài đăng trọ theo khu vực hoặc mức giá.
  2. Xem thời gian phản hồi (Response time) của API tìm kiếm bài đăng.
- **Test Data:** Bộ lọc: Quận 1, Giá 3 - 5 triệu.
- **Expected:** Kết quả trả về ngay lập tức (dưới 100ms) nhờ cơ sở dữ liệu đã thiết lập chỉ mục (Indexes) trên các khóa ngoại (`provinceCode`, `districtCode`), trạng thái (`status`), và các trường lọc thường xuyên (`priceNumber`, `areaNumber`).
- **Actual:** Đạt
