# Tích hợp Thanh toán VNPay cho Nền tảng Phòng Trọ

Mục tiêu: Cho phép người dùng mua các gói tin đăng VIP thông qua cổng thanh toán VNPay một cách an toàn và chuyên nghiệp nhất.

## Đề xuất Kiến trúc: Mô hình "Ví điện tử" (Nạp tiền vào tài khoản)

Thay vì thanh toán trực tiếp mỗi khi đăng tin (rất rủi ro vì nếu người dùng tắt trang lúc đang thanh toán sẽ gây ra lỗi thiếu dữ liệu bài đăng), chúng ta sẽ áp dụng **mô hình Nạp tiền** giống hệt các trang web lớn hiện nay (Batdongsan, Chotot, Phongtro123 thực tế):

1. **Nạp tiền (Top-up):** Người dùng nhập số tiền cần nạp -> Chuyển sang VNPay thanh toán -> Thành công -> Cộng tiền vào Số dư tài khoản (`balance`).
2. **Thanh toán dịch vụ:** Khi người dùng chọn đăng tin VIP, hệ thống sẽ tự động trừ tiền trực tiếp từ Số dư tài khoản. Nếu không đủ tiền, báo lỗi yêu cầu nạp thêm.

**Ưu điểm của mô hình này:**
- Tách biệt hoàn toàn luồng thanh toán và luồng đăng tin, giúp code rất gọn gàng và ít lỗi.
- Quản lý lịch sử giao dịch (nạp/trừ) dễ dàng.
- Rất chuyên nghiệp và ghi điểm tuyệt đối khi thuyết trình đồ án tốt nghiệp!

## User Review Required

> [!IMPORTANT]
> Bạn có đồng ý với kiến trúc **"Nạp tiền vào tài khoản rồi dùng tiền đó để đăng tin"** không? Hay bạn muốn làm kiểu **"Đăng tin nào thanh toán tiền tin đó trực tiếp qua VNPay"**? (Mình thật sự khuyên dùng mô hình nạp tiền).

## Open Questions

> [!WARNING]
> Bạn đã có tài khoản **VNPay Sandbox** (môi trường test cho lập trình viên) chưa? Hệ thống cần 2 mã bảo mật là `vnp_TmnCode` và `vnp_HashSecret`. 
> - Nếu chưa có, bạn hãy truy cập [vnpay.vn/sandbox](https://sandbox.vnpayment.vn/devreg/) để đăng ký miễn phí, chỉ mất 2 phút là có mã gửi về Email.

## Proposed Changes

### Database & Models

#### [MODIFY] `server/src/models/user.js` & `server/src/migrations/01-create-user.js`
- Thêm trường `balance` (Số dư tài khoản - kiểu Integer, mặc định 0) vào bảng User.

#### [NEW] `server/src/models/transaction.js` & `server/src/migrations/13-create-transaction.js`
- Tạo bảng `Transaction` để lưu lịch sử giao dịch (Gồm: Mã giao dịch, Số tiền, Loại giao dịch (Nạp/Trừ), Nội dung, Trạng thái).

---

### Backend (Server)

#### [NEW] `server/src/controllers/Payment/vnpayController.js` & `server/src/routes/payment.js`
- **API `POST /create_payment_url`**: Tạo URL mã hóa an toàn và chuyển hướng frontend sang cổng thanh toán VNPay.
- **API `GET /vnpay_return`**: Nhận kết quả từ VNPay trả về, kiểm tra chữ ký (signature) để chống giả mạo, và tự động cộng `balance` cho User nếu thanh toán thành công.

#### [MODIFY] `server/src/services/Post/postService.js`
- Cập nhật hàm `createNewPostService`: Tính toán số tiền dựa trên gói tin VIP mà người dùng chọn.
- Kiểm tra `user.balance` có đủ không. Nếu đủ thì **trừ tiền**, lưu lịch sử giao dịch và tạo bài đăng. Nếu không đủ thì trả về thông báo lỗi.

---

### Frontend (Client)

#### [NEW] `client/src/containers/System/User/Deposit.jsx`
- Giao diện "Nạp tiền vào tài khoản": Có sẵn các nút chọn nhanh (50K, 100K, 200K, 500K) và nút "Chuyển tới VNPay".

#### [NEW] `client/src/containers/System/User/PaymentResult.jsx`
- Trang hiển thị "Nạp tiền thành công" hoặc "Nạp tiền thất bại" (bắt mã lỗi từ URL khi VNPay chuyển hướng về).

#### [MODIFY] `client/src/containers/System/User/CreatePost.jsx`
- Hiển thị Số dư hiện tại của người dùng ở góc trên form.
- Khi chọn loại Chuyên mục VIP, hiển thị mức giá cần thanh toán.

## Verification Plan

### Manual Verification
1. Đăng nhập bằng tài khoản test, số dư hiển thị là `0đ`.
2. Thử đăng tin VIP -> Hệ thống báo *"Không đủ số dư"*.
3. Truy cập Menu "Nạp tiền", chọn nạp `100,000đ` qua VNPay. Sử dụng thẻ ngân hàng TEST do VNPay cung cấp để thanh toán.
4. Giao dịch thành công, web tự động chuyển về trang báo cáo, Số dư tài khoản cập nhật thành `100,000đ`.
5. Đăng tin VIP giá `30,000đ` -> Đăng thành công, Số dư bị trừ còn `70,000đ`.
6. Admin có thể xem được luồng tiền trong database.
