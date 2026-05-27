# ĐÁNH GIÁ & PHÂN TÍCH HỆ THỐNG PHONGTRO123
*Dành cho Chuyên đề Tốt nghiệp / Hệ thống đăng tin và tìm kiếm phòng trọ trực tuyến*

Tài liệu này đánh giá hiện trạng của hệ thống (bao gồm Backend Node.js/Express và Frontend ReactJS/Vite/Redux) để xác định các **thiếu sót cần bổ sung** nhằm đạt tiêu chuẩn của một website thương mại hoàn chỉnh, đồng thời chỉ ra các **phần dư thừa có thể loại bỏ** để tối ưu hóa mã nguồn.

---

## I. TỔNG QUAN HIỆN TRẠNG HỆ THỐNG
Hiện tại, hệ thống đã có nền tảng rất vững chắc với các tính năng cốt lõi:
1. **Phân quyền người dùng**: Admin, Chủ trọ (Landlord), Người thuê (Tenant).
2. **Quản lý tin đăng**: Đăng tin, sửa tin, duyệt tin (Admin), khóa/mở khóa tin, nạp tiền nâng cấp gói dịch vụ VIP (VIP Nổi bật, VIP 1, 2, 3, Tin thường).
3. **Thanh toán tích hợp**: Cổng thanh toán trực tuyến **VNPay (Sandbox)** nạp tiền vào ví của chủ trọ tự động và đồng bộ giao dịch.
4. **Báo cáo & Thống kê**: Trang dashboard admin có biểu đồ đường hiển thị doanh thu thực tế và thống kê số liệu trực quan.
5. **Tính năng bổ trợ**: Khôi phục mật khẩu qua Email, đăng nhập bằng tài khoản Google, lịch sử chỉnh sửa tin đăng (`postHistory`), tự động duyệt tin dựa trên độ uy tín của chủ trọ.

---

## II. NHỮNG THIẾU SÓT CẦN BỔ SUNG (LÀM NỔI BẬT ĐỒ ÁN)

Để website thực sự hoàn chỉnh và chuyên nghiệp như một sản phẩm thực tế, hệ thống đang thiếu các tính năng và nghiệp vụ dưới đây (chia theo mức độ ưu tiên):

### 1. Mức độ Cao (Cực kỳ cần thiết cho đồ án & thực tế)
*   **Quản trị Danh mục & Cấu hình dịch vụ (Admin CRUD Category/Packages)**:
    *   *Hiện trạng*: Danh mục phòng trọ và bảng giá các gói VIP đang được cấu hình cứng (hardcoded) hoặc chèn thủ công qua seeders/scripts ở backend.
    *   *Giải pháp*: Bổ sung giao diện trong Admin Panel để Admin có thể thêm/sửa/xóa danh mục phòng trọ (phòng trọ, nhà nguyên căn, căn hộ...) và thay đổi bảng giá dịch vụ (phí đăng tin VIP 1, VIP 2, tin thường theo ngày/tuần/tháng) mà không cần can thiệp vào database.
*   **Hệ thống Báo cáo tin đăng vi phạm (Report/Flag Post System)**:
    *   *Hiện trạng*: Người tìm trọ khi lướt web nếu gặp tin đăng lừa đảo, số điện thoại ảo, hoặc phòng đã được cho thuê từ lâu nhưng không gỡ tin thì chưa có cách nào thông báo với quản trị viên.
    *   *Giải pháp*: Thêm nút "Báo cáo tin đăng" ở trang chi tiết phòng trọ (cho phép chọn lý do: *Sai địa chỉ, Phòng đã cho thuê, Lừa đảo/Đặt cọc ảo, Ảnh không đúng thực tế*). Admin có màn hình quản lý danh sách báo cáo này để ra quyết định gỡ bài hoặc khóa tài khoản chủ trọ vi phạm.
*   **Đánh giá & Nhận xét phòng trọ/chủ trọ (Review & Rating System)**:
    *   *Hiện trạng*: Trường `star` trong cơ sở dữ liệu hiện tại chỉ thể hiện mức độ VIP của gói tin đăng (ví dụ VIP Nổi bật = 5 sao), chứ không phải đánh giá khách quan của người dùng.
    *   *Giải pháp*: Cho phép người dùng đã đăng nhập đánh giá (1-5 sao) và viết nhận xét về phòng trọ đó. Điểm trung bình đánh giá này sẽ hiển thị công khai ở chi tiết bài đăng giúp tăng độ tin cậy của bài viết.

### 2. Mức độ Trung bình (Tăng trải nghiệm người dùng - UX)
*   **Tìm kiếm & Lọc chi tiết đến cấp Phường/Xã và Đường/Phố (Ward/Street Level)**:
    *   *Hiện trạng*: Bộ lọc vị trí mới chỉ dừng lại ở cấp Tỉnh/Thành phố và Quận/Huyện. Trên thực tế, người thuê trọ thường tìm phòng rất chi tiết theo Phường/Xã hoặc gần các tuyến Đường cụ thể.
    *   *Giải pháp*: Cập nhật cơ sở dữ liệu địa giới hành chính để có thêm bảng `Wards` (Phường/Xã) và bộ lọc tìm kiếm tương ứng trên giao diện.
*   **Xác minh danh tính chủ trọ (Landlord Verification/KYC)**:
    *   *Hiện trạng*: Bất kỳ tài khoản nào đăng ký số điện thoại xong đều có thể đăng bài (sau khi nạp tiền). Điều này dễ dẫn đến việc đăng tin rác, lừa đảo cọc.
    *   *Giải pháp*: Bổ sung trạng thái tài khoản: `Chờ xác minh`, `Đã xác minh`. Chủ trọ muốn đăng tin uy tín hoặc tự động duyệt tin cần upload ảnh CCCD hoặc giấy tờ chứng minh sở hữu (KYC). Admin sẽ duyệt các yêu cầu xác minh này.
*   **Chia sẻ mạng xã hội & Copy Link nhanh (Social Sharing)**:
    *   *Hiện trạng*: Chưa có công cụ hỗ trợ người thuê chia sẻ bài viết cho bạn bè.
    *   *Giải pháp*: Bổ sung các nút bấm chia sẻ nhanh lên Facebook, gửi qua Zalo, hoặc một nút bấm "Sao chép liên kết" tiện lợi trong trang chi tiết bài đăng.

### 3. Mức độ Thấp (Nice-to-have / Tính năng nâng cao)
*   **Hệ thống Chat trực tuyến Real-time (In-app Messaging)**:
    *   *Hiện trạng*: Người thuê trọ chỉ có thể gọi điện trực tiếp, add Zalo hoặc gửi form liên hệ (Inquiry).
    *   *Giải pháp*: Tích hợp chat thời gian thực (sử dụng **Socket.io**) cho phép người thuê nhắn tin trao đổi trực tiếp với chủ trọ trên website mà không cần chia sẻ số điện thoại cá nhân sớm.
*   **Thông báo & Gia hạn tự động (Expiry Notification & Auto-Renew)**:
    *   *Hiện trạng*: Chủ trọ phải theo dõi thủ công hạn dùng của tin đăng để vào bấm gia hạn.
    *   *Giải pháp*: Hệ thống tự động gửi email/thông báo hệ thống trước khi tin hết hạn 1 ngày. Bổ sung nút toggle "Tự động gia hạn" khi đăng tin (hệ thống tự động trừ tiền trong ví để gia hạn thêm khi hết hạn nếu số dư đủ).

---

## III. NHỮNG PHẦN DƯ THỪA CÓ THỂ LƯỢC BỎ / TỐI ƯU

Để dọn dẹp mã nguồn sạch sẽ, tránh bị hội đồng chấm thi vặn hỏi về các file không sử dụng, bạn có thể xem xét loại bỏ hoặc cấu trúc lại các phần sau:

1.  **Mã nguồn Crawler dữ liệu (Data Scraper)**:
    *   *Lý do*: Thư mục `Crawler` và file `server/src/scripts/refreshScrapedData.js` là các công cụ cào dữ liệu từ website khác để chạy ban đầu. Khi đưa vào vận hành thực tế (Production) hoặc mang đi bảo vệ, việc giữ mã nguồn cào dữ liệu này trực tiếp trong thư mục chạy chính của server là không cần thiết.
    *   *Giải pháp*: Đóng gói mã nguồn cào dữ liệu này sang một thư mục độc lập ở ngoài dự án hoặc đưa vào file `.gitignore` để không push lên Git chính thức của đồ án.
2.  **Mục "Góp ý của tôi" (User Inquiries) của người dùng**:
    *   *Lý do*: Hiện tại hệ thống có bảng `contacts` lưu thông tin liên hệ. Trên giao diện chủ trọ có phần quản lý liên hệ từ khách hàng gửi đến. Tuy nhiên, luồng nghiệp vụ này khá mơ hồ vì người đi thuê phòng thường gọi điện/Zalo trực tiếp thay vì gửi form góp ý dài dòng.
    *   *Giải pháp*: 
        *   Nếu giữ lại: Hãy đổi tên từ "Góp ý / Inquiries" thành **"Yêu cầu đặt lịch xem phòng" (Viewing Request / Appointment)**. Form này sẽ yêu cầu điền: *Họ tên, SĐT, Ngày giờ muốn đến xem phòng, Lời nhắn*. Điều này thực tế hơn rất nhiều đối với một trang phòng trọ.
        *   Nếu thấy phức tạp: Có thể loại bỏ hoàn toàn tính năng gửi form liên hệ cho chủ trọ, chỉ giữ lại trang Liên hệ (Contact) gửi góp ý kỹ thuật cho Admin hệ thống.
3.  **Bảng `prices` và `areas` trong Cơ sở dữ liệu**:
    *   *Lý do*: Hiện tại database đang có 2 bảng lưu khoảng giá (ví dụ: `dưới 1 triệu`, `1 - 2 triệu`...) và khoảng diện tích (`dưới 20m2`, `20 - 30m2`...) để tạo các bộ lọc. Điều này khiến câu lệnh truy vấn tin đăng ở backend phải thực hiện thêm 2 lệnh JOIN phụ.
    *   *Giải pháp*: Vì các khoảng lọc giá và diện tích này rất ít khi thay đổi, ta có thể lưu chúng dưới dạng một mảng tĩnh (Static Constant JSON) ở cả backend và frontend. Việc này giúp loại bỏ hoàn toàn 2 bảng `prices` và `areas` trong database, giảm tải câu lệnh SQL JOIN giúp truy vấn danh sách tin đăng nhanh hơn đáng kể.

---

## IV. ĐỀ XUẤT CẢI TIẾN BẢO MẬT & HIỆU NĂNG (ĐIỂM CỘNG HỘI ĐỒNG)

*   **Rate Limiting**: Giới hạn số lần gửi yêu cầu (request) trong một khoảng thời gian đến các API nhạy cảm như Đăng nhập, Quên mật khẩu, Đăng tin để chống tấn công brute-force và spam làm cạn kiệt tài nguyên hệ thống.
*   **Validation dữ liệu đầu vào (Input Validation)**: Sử dụng các thư viện như `Joi` hoặc `express-validator` tại Backend để kiểm tra chặt chẽ định dạng dữ liệu gửi lên (ví dụ: email đúng định dạng, số điện thoại đủ 10 số, số tiền nạp phải lớn hơn 0...), tránh lỗi tràn dữ liệu hoặc SQL Injection.
*   **Lịch sử hoạt động của Admin (Admin Audit Logs)**: Tạo bảng lưu lại hoạt động của các Admin (Ví dụ: Admin A duyệt bài đăng X lúc 10h, Admin B khóa tài khoản Y vì lý do Z). Đây là tính năng nghiệp vụ rất quan trọng đối với các hệ thống lớn có nhiều nhân sự quản trị.
