# CHƯƠNG 3.5: THIẾT KẾ GIAO DIỆN CHỨC NĂNG CỦA HỆ THỐNG

## (Đề tài: Website tìm kiếm và đăng tin thuê trọ TroTLU1988)

Dưới đây là phần luận giải chi tiết về lý do cần thiết và đối tượng sử dụng của **13 giao diện chức năng độc lập** trong hệ thống **TroTLU1988**, được tách rời hoàn toàn để giúp bạn dễ dàng chụp ảnh minh họa tương ứng đưa vào báo cáo Chuyên đề tốt nghiệp.

---

### 3.5.1. Giao diện Trang chủ

- **Lý do cần giao diện:** Là trang đầu tiên hiển thị khi truy cập website, giúp người dùng tiếp cận ngay danh sách các bài đăng mới nhất và tin VIP nổi bật nhất để nhanh chóng cập nhật thông tin thuê trọ hiện có.
- **Đối tượng sử dụng:** Tất cả mọi người (Khách vãng lai, Người đi thuê phòng, Chủ trọ).

---

### 3.5.2. Giao diện Tìm kiếm và Lọc phòng trọ

- **Lý do cần giao diện:** Cho phép người dùng lọc nhanh các bài đăng theo địa điểm (Tỉnh/Thành, Quận/Huyện), mức giá, diện tích và danh mục để nhanh chóng tìm thấy phòng trọ phù hợp nhất với nhu cầu của mình mà không mất công lướt xem từng tin.
- **Đối tượng sử dụng:** Khách vãng lai, Người đi thuê phòng.

---

### 3.5.3. Giao diện Chi tiết tin đăng

- **Lý do cần giao diện:** Hiển thị toàn bộ thông tin chi tiết của một phòng trọ cụ thể (bao gồm slide hình ảnh mô tả, giá thuê, diện tích, tiện ích đi kèm, bản đồ vị trí) và thông tin liên hệ của chủ trọ để khách thuê đánh giá chính xác độ phù hợp của căn phòng.
- **Đối tượng sử dụng:** Khách vãng lai, Người đi thuê phòng.

---

### 3.5.4. Giao diện Đăng ký tài khoản

- **Lý do cần giao diện:** Giúp người dùng chưa có tài khoản tự khởi tạo một tài khoản mới trên hệ thống. Việc chọn vai trò (Người tìm kiếm hoặc Chủ trọ) ngay từ bước đăng ký là cơ sở để hệ thống thiết lập nhóm quyền hạn và phân loại tài khoản trong cơ sở dữ liệu.
- **Đối tượng sử dụng:** Khách vãng lai (chưa có tài khoản trên hệ thống).

---

### 3.5.5. Giao diện Đăng nhập hệ thống

- **Lý do cần giao diện:** Để xác thực thông tin tài khoản (Số điện thoại và Mật khẩu) của người dùng. Sau khi đăng nhập thành công, hệ thống sẽ cấp mã bảo mật (Token) để mở khóa các tính năng tương ứng với vai trò của họ.
- **Đối tượng sử dụng:** Tất cả thành viên (Người đi thuê, Chủ trọ, Admin) đã có tài khoản.

---

### 3.5.6. Giao diện Liên hệ và Góp ý

- **Lý do cần giao diện:** Để người dùng gửi các tin nhắn góp ý, phản hồi lỗi hoặc yêu cầu hỗ trợ trực tiếp đến ban quản trị hệ thống, giúp nâng cao chất lượng dịch vụ của website.
- **Đối tượng sử dụng:** Khách vãng lai, Người đi thuê phòng, Chủ trọ.

---

### 3.5.7. Giao diện Đăng tin mới (Phân hệ Chủ trọ)

- **Lý do cần giao diện:** Để chủ trọ tự nhập thông tin phòng trọ của mình, tải lên các hình ảnh thực tế và lựa chọn gói tin dịch vụ (VIP hoặc tin thường) để đưa bài đăng cho thuê lên website.
- **Đối tượng sử dụng:** Chủ trọ (người có nhu cầu đăng tin cho thuê).

---

### 3.5.8. Giao diện Quản lý tin đăng cá nhân (Phân hệ Chủ trọ)

- **Lý do cần giao diện:** Giúp chủ trọ dễ dàng theo dõi danh sách các bài đăng của mình (xem tin nào đang hiển thị, tin nào đang chờ duyệt hay đã hết hạn). Chủ trọ có thể nhanh chóng sửa lại thông tin nếu viết sai, ẩn/xóa tin đi khi phòng đã có người thuê, hoặc thực hiện gia hạn để tin tiếp tục hiển thị.
- **Đối tượng sử dụng:** Chủ trọ.

---

### 3.5.9. Giao diện Nạp tiền dịch vụ (Phân hệ Chủ trọ)

- **Lý do cần giao diện:** Cho phép chủ trọ chủ động nạp ngân sách vào tài khoản thông qua cổng thanh toán trực tuyến VNPay để có kinh phí đăng các bài tin VIP nổi bật trên trang chủ.
- **Đối tượng sử dụng:** Chủ trọ.

---

### 3.5.10. Giao diện Lịch sử giao dịch (Phân hệ Chủ trọ)

- **Lý do cần giao diện:** Hiển thị chi tiết biến động số dư (nạp tiền vào và trừ phí đăng tin VIP), giúp chủ trọ đối soát tài chính cá nhân một cách minh bạch và rõ ràng.
- **Đối tượng sử dụng:** Chủ trọ.

---

### 3.5.11. Giao diện Duyệt bài đăng (Phân hệ Admin)

- **Lý do cần giao diện:** Giúp quản trị viên (Admin) kiểm tra kỹ nội dung, hình ảnh của các tin đăng trước khi cho phép hiển thị công khai trên web. Admin có thể duyệt tin nếu thông tin chuẩn xác, hoặc từ chối duyệt nếu tin đăng chứa thông tin rác, lừa đảo để bảo vệ uy tín cho toàn website.
- **Đối tượng sử dụng:** Quản trị viên (Admin).

---

### 3.5.12. Giao diện Quản lý thành viên và Khóa tài khoản (Phân hệ Admin)

- **Lý do cần giao diện:** Trao quyền cho Admin theo dõi danh sách tất cả người dùng trên hệ thống, kiểm tra nhanh thông tin số dư tài khoản và trạng thái hoạt động. Admin có thể thực hiện khóa các tài khoản cố tình vi phạm nội quy, lừa đảo hoặc đăng tin rác để bảo vệ môi trường tìm kiếm an toàn cho người thuê.
- **Đối tượng sử dụng:** Quản trị viên (Admin).

---

### 3.5.13. Giao diện Thống kê và Báo cáo Doanh thu (Phân hệ Admin)

- **Lý do cần giao diện:** Tổng hợp tự động các số liệu vận hành của website (doanh thu nạp tiền, số lượng thành viên mới, số lượng tin đăng...) dưới dạng biểu đồ trực quan để Admin đánh giá nhanh tình hình hoạt động của web và đưa ra chiến lược kinh doanh phù hợp.
- **Đối tượng sử dụng:** Quản trị viên (Admin).
