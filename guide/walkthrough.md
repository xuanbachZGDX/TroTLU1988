# Hoàn thành tích hợp VNPay

Toàn bộ quá trình tích hợp VNPay theo mô hình "Ví điện tử" đã hoàn tất.

## Những thay đổi đã thực hiện

1. **Cơ sở dữ liệu (Database):**
   - Đã thêm cột `balance` (Số dư) vào bảng `Users`.
   - Đã tạo bảng `Transactions` để lưu lịch sử giao dịch nạp/trừ tiền.

2. **Cấu hình Backend:**
   - Cập nhật file `.env` với các mã kết nối `vnp_TmnCode`, `vnp_HashSecret`, `vnp_Url`, `vnp_ReturnUrl` mà bạn cung cấp.
   - Thư viện cần thiết đã cài đặt (`qs`, `moment`).

3. **API Thanh toán (Payment Router):**
   - Đã viết API `POST /api/v1/payment/create_payment_url` dùng để định tuyến sang trang thanh toán VNPay.
   - Đã viết API `GET /api/v1/payment/vnpay_return` dùng để VNPay trả kết quả về sau khi thanh toán, tự động cộng `balance` vào tài khoản nếu thanh toán thành công.

4. **Giao diện Người dùng (Frontend):**
   - Thêm nút **"Nạp tiền vào tài khoản"** ở menu bên trái (Sidebar).
   - Thêm trang giao diện `Deposit` (Chọn số tiền nạp: 50K, 100K, 200K...).
   - Thêm trang giao diện `PaymentResult` (Báo cáo kết quả "Thành công" / "Thất bại" siêu đẹp).
   - Trên form **Đăng tin cho thuê**, đã hiển thị Số dư hiện tại ở góc trên bên phải. Các gói tin VIP (VIP Nổi bật, VIP 1, VIP 2, VIP 3, Tin thường) đều có hiển thị mức giá kèm theo.
   - Khi bấm **Đăng tin**, hệ thống sẽ tự động đối chiếu: Nếu đủ tiền thì trừ tiền và lưu vào lịch sử giao dịch. Nếu thiếu tiền thì báo lỗi yêu cầu nạp thêm.

## Hướng dẫn Kiểm thử trực tiếp (Demo)

> [!TIP]
> Hãy thao tác các bước sau để thấy hệ thống hoạt động:

1. **Đăng nhập** bằng một tài khoản User (hoặc F5 lại trình duyệt nếu đã đăng nhập).
2. Ấn vào **Nạp tiền vào tài khoản** bên thanh công cụ, chọn mức 100.000đ và bấm "Thanh toán ngay".
3. Website sẽ chuyển qua cổng VNPay. Ở đây, bạn sử dụng thông tin thẻ Test của VNPay để thanh toán:
   - Ngân hàng: `NCB`
   - Số thẻ: `9704198526191432198`
   - Tên in trên thẻ: `NGUYEN VAN A`
   - Ngày phát hành: `07/15`
   - OTP: `123456`
4. Ấn thanh toán, bạn sẽ thấy kết quả "Thành công" và số dư tài khoản tăng lên `100.000đ`.
5. Tiếp tục vào mục **Đăng tin cho thuê**, thử đăng một tin "VIP 1" (30.000đ), bạn sẽ thấy tin đăng thành công và số dư tài khoản bị trừ chính xác.
6. Cực kỳ hoàn hảo cho báo cáo tốt nghiệp!

> [!WARNING]
> Vì mình vừa cài đặt thêm các thư viện mới cho backend (`qs`, `moment`) và reset database một vài bảng, nên bạn hãy khởi động lại Backend & Frontend nhé. (Tắt 2 cái terminal đi chạy lại `npm start`).

Mời bạn thử nghiệm! Nếu gặp lỗi gì cứ nhắn lên đây mình fix ngay lập tức.
