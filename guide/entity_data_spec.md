# Đặc tả chi tiết các thực thể dữ liệu - Hệ thống PhongTro123

Dưới đây là đặc tả chi tiết của tất cả các thực thể trong hệ thống, kèm theo giải thích ý nghĩa tên bảng.

---

### 1. Tên thực thể: User
- **Giải thích ý nghĩa:** Người dùng
- **Mô tả:** Lưu trữ thông tin chi tiết của người dùng và quản trị viên trong hệ thống.
- **Khóa chính:** Id (Mã người dùng)
- **Các thuộc tính của thực thể:**
    + name: tên của người dùng
    + password: mật khẩu đã mã hóa
    + phone: số điện thoại của người dùng
    + zalo: số điện thoại Zalo của người dùng
    + email: địa chỉ email của người dùng
    + avatar: ảnh đại diện của người dùng
    + role: vai trò của người dùng (admin/user)
    + balance: số dư tài khoản của người dùng
    + otp: mã xác thực OTP dùng để khôi phục mật khẩu
    + passwordResetExpires: thời gian hết hạn của mã reset mật khẩu
    + status: trạng thái tài khoản của người dùng (active/blocked)
    + createdAt: thời điểm tạo tài khoản
    + updatedAt: thời điểm cập nhật tài khoản gần nhất

---

### 2. Tên thực thể: Post
- **Giải thích ý nghĩa:** Tin đăng
- **Mô tả:** Lưu trữ thông tin cốt lõi của các bài đăng cho thuê trong hệ thống.
- **Khóa chính:** Id (Mã bài đăng)
- **Các thuộc tính của thực thể:**
    + title: tiêu đề của bài đăng
    + star: số sao đánh giá (tương ứng với loại tin VIP)
    + address: địa chỉ chi tiết của bất động sản cho thuê
    + description: nội dung mô tả chi tiết của bài đăng
    + categoryCode: mã danh mục loại hình cho thuê
    + provinceCode: mã tỉnh hoặc thành phố
    + districtCode: mã quận hoặc huyện
    + priceCode: mã khoảng giá cho thuê
    + areaCode: mã khoảng diện tích cho thuê
    + priceNumber: giá trị số của tiền thuê (triệu/tháng)
    + areaNumber: giá trị số của diện tích (m2)
    + status: trạng thái tin đăng (pending/active/expired)
    + userId: mã người dùng sở hữu bài đăng
    + note: ghi chú từ quản trị viên (ví dụ: lý do từ chối bài đăng)
    + createdAt: thời điểm tạo bài đăng
    + updatedAt: thời điểm cập nhật bài đăng

---

### 3. Tên thực thể: Overview
- **Giải thích ý nghĩa:** Tổng quan tin đăng
- **Mô tả:** Lưu trữ thông tin tổng quan và thời hạn của tin đăng.
- **Khóa chính:** Id (Mã định danh)
- **Các thuộc tính của thực thể:**
    + postId: mã liên kết với bài đăng chính
    + code: mã tin đăng hiển thị cho người dùng (ví dụ: #12345)
    + type: loại chuyên mục của tin đăng
    + target: đối tượng khách hàng mục tiêu (Tất cả, Nam, Nữ)
    + bonus: gói tin đăng (Tin thường, Tin VIP...)
    + published: ngày bắt đầu đăng tin hiển thị
    + expired: ngày tin đăng hết hạn hiển thị

---

### 4. Tên thực thể: Transaction
- **Giải thích ý nghĩa:** Giao dịch
- **Mô tả:** Lưu trữ thông tin chi tiết về các giao dịch tài chính của người dùng (nạp tiền, thanh toán).
- **Khóa chính:** Id (Mã giao dịch)
- **Các thuộc tính của thực thể:**
    + userId: mã người dùng thực hiện giao dịch
    + amount: số tiền biến động trong giao dịch
    + type: loại giao dịch (Nạp tiền, Thanh toán tin)
    + content: nội dung diễn giải chi tiết cho giao dịch
    + status: trạng thái giao dịch (Success, Pending, Cancel)
    + createdAt: thời điểm thực hiện giao dịch
    + updatedAt: thời điểm cập nhật trạng thái giao dịch

---

### 5. Tên thực thể: Category
- **Giải thích ý nghĩa:** Danh mục
- **Mô tả:** Lưu trữ thông tin các danh mục loại hình cho thuê.
- **Khóa chính:** Id (Mã danh mục)
- **Các thuộc tính của thực thể:**
    + code: mã định danh duy nhất của danh mục
    + value: tên danh mục (Phòng trọ, Căn hộ, Nhà nguyên căn...)
    + header: tiêu đề hiển thị trên trang danh mục
    + description: nội dung mô tả ngắn về danh mục
    + order: thứ tự ưu tiên hiển thị danh mục

---

### 6. Tên thực thể: Attribute
- **Giải thích ý nghĩa:** Thuộc tính bài đăng
- **Mô tả:** Lưu trữ các thuộc tính hiển thị nhanh của bài đăng như giá và diện tích văn bản.
- **Khóa chính:** Id (Mã định danh)
- **Các thuộc tính của thực thể:**
    + postId: mã liên kết với bài đăng
    + price: chuỗi văn bản hiển thị giá thuê
    + acreage: chuỗi văn bản hiển thị diện tích
    + published: thời gian đăng tin định dạng văn bản

---

### 7. Tên thực thể: Image
- **Giải thích ý nghĩa:** Hình ảnh
- **Mô tả:** Lưu trữ danh sách hình ảnh thực tế của bài đăng.
- **Khóa chính:** Id (Mã định danh)
- **Các thuộc tính của thực thể:**
    + postId: mã liên kết với bài đăng
    + image: chuỗi JSON chứa danh sách các đường dẫn ảnh

---

### 8. Tên thực thể: Feature
- **Giải thích ý nghĩa:** Tiện ích
- **Mô tả:** Lưu trữ danh mục các tiện ích đi kèm của bất động sản.
- **Khóa chính:** Id (Mã tiện ích)
- **Các thuộc tính của thực thể:**
    + code: mã định danh duy nhất của tiện ích
    + value: tên tiện ích (Wifi, Máy giặt, Điều hòa...)

---

### 9. Tên thực thể: PostFeature
- **Giải thích ý nghĩa:** Tiện ích bài đăng
- **Mô tả:** Bảng trung gian quản lý mối quan hệ nhiều-nhiều giữa bài đăng và tiện ích.
- **Khóa chính:** Id (Mã định danh)
- **Các thuộc tính của thực thể:**
    + postId: mã liên kết với bài đăng
    + featureId: mã liên kết với tiện ích

---

### 10. Tên thực thể: Province
- **Giải thích ý nghĩa:** Tỉnh / Thành phố
- **Mô tả:** Lưu trữ thông tin đơn vị hành chính cấp tỉnh.
- **Khóa chính:** Id (Mã định danh)
- **Các thuộc tính:**
    + code: mã hành chính duy nhất
    + value: tên tỉnh hoặc thành phố

---

### 11. Tên thực thể: District
- **Giải thích ý nghĩa:** Quận / Huyện
- **Mô tả:** Lưu trữ thông tin đơn vị hành chính cấp quận/huyện.
- **Khóa chính:** Id (Mã định danh)
- **Các thuộc tính:**
    + code: mã hành chính duy nhất
    + value: tên quận hoặc huyện
    + provinceCode: mã liên kết với tỉnh/thành phố chủ quản

---

### 12. Tên thực thể: Price
- **Giải thích ý nghĩa:** Khoảng giá
- **Mô tả:** Lưu trữ các khoảng giá định sẵn để phục vụ bộ lọc tìm kiếm.
- **Khóa chính:** Id (Mã định danh)
- **Các thuộc tính:**
    + code: mã định danh khoảng giá
    + value: nhãn hiển thị (ví dụ: 1 - 2 triệu)
    + min: giá trị tối thiểu
    + max: giá trị tối đa
    + order: thứ tự hiển thị

---

### 13. Tên thực thể: Area
- **Giải thích ý nghĩa:** Khoảng diện tích
- **Mô tả:** Lưu trữ các khoảng diện tích định sẵn để phục vụ bộ lọc tìm kiếm.
- **Khóa chính:** Id (Mã định danh)
- **Các thuộc tính:**
    + code: mã định danh khoảng diện tích
    + value: nhãn hiển thị (ví dụ: 20 - 30m2)
    + min: giá trị tối thiểu
    + max: giá trị tối đa
    + order: thứ tự hiển thị

---

### 14. Tên thực thể: Contact
- **Giải thích ý nghĩa:** Liên hệ / Phản hồi
- **Mô tả:** Lưu trữ các tin nhắn liên hệ, phản hồi hoặc yêu cầu hỗ trợ từ người dùng gửi đến ban quản trị hệ thống.
- **Khóa chính:** Id (Mã định danh liên hệ)
- **Các thuộc tính của thực thể:**
    + userId: mã người dùng thực hiện gửi liên hệ (liên kết 1:N với thực thể User)
    + name: họ tên người gửi (có thể tùy chỉnh khi gửi)
    + phone: số điện thoại người gửi
    + content: nội dung tin nhắn hoặc ý kiến phản hồi chi tiết
    + response: nội dung phản hồi của quản trị viên gửi cho người dùng
    + status: trạng thái xử lý của liên hệ (ví dụ: pending, processed)
    + createdAt: thời điểm người dùng gửi liên hệ
    + updatedAt: thời điểm cập nhật trạng thái gần nhất

---

### 15. Tên thực thể: PostHistory
- **Giải thích ý nghĩa:** Lịch sử chỉnh sửa bài đăng
- **Mô tả:** Lưu trữ chi tiết các thay đổi của tin đăng trước và sau khi được cập nhật bởi chủ trọ hoặc quản trị viên nhằm phục vụ công tác đối chiếu, kiểm duyệt và quản trị nội dung.
- **Khóa chính:** Id (Mã định danh lịch sử)
- **Các thuộc tính của thực thể:**
    + postId: mã liên kết với bài đăng chính được chỉnh sửa (liên kết N:1 với thực thể Post)
    + editorId: mã người dùng thực hiện cập nhật tin đăng (liên kết N:1 với thực thể User)
    + oldTitle: tiêu đề bài đăng trước khi chỉnh sửa
    + newTitle: tiêu đề bài đăng sau khi chỉnh sửa
    + oldPrice: giá thuê trước khi chỉnh sửa (triệu/tháng)
    + newPrice: giá thuê sau khi chỉnh sửa (triệu/tháng)
    + oldArea: diện tích trước khi chỉnh sửa (m2)
    + newArea: diện tích sau khi chỉnh sửa (m2)
    + oldDescription: nội dung mô tả trước khi chỉnh sửa
    + newDescription: nội dung mô tả sau khi chỉnh sửa
    + oldAddress: địa chỉ trước khi chỉnh sửa
    + newAddress: địa chỉ sau khi chỉnh sửa
    + createdAt: thời điểm thực hiện chỉnh sửa
    + updatedAt: thời điểm cập nhật lịch sử gần nhất

---

### 16. Tên thực thể: Notification
- **Giải thích ý nghĩa:** Thông báo hệ thống
- **Mô tả:** Lưu trữ các thông báo gửi đến Quản trị viên (Admin) hoặc người dùng cụ thể về các sự kiện nghiệp vụ phát sinh cần kiểm duyệt, phản hồi hoặc hỗ trợ.
- **Khóa chính:** Id (Mã định danh thông báo)
- **Các thuộc tính của thực thể:**
    + postId: mã bài đăng liên quan đến sự kiện thông báo (Cho phép NULL, liên kết N:1 với thực thể Post)
    + senderId: mã người dùng thực hiện hành động tạo thông báo (Cho phép NULL, liên kết N:1 với thực thể User)
    + recipientId: mã người dùng nhận thông báo (Cho phép NULL, liên kết N:1 với thực thể User)
    + title: tiêu đề tóm tắt của thông báo (Ví dụ: "Tin đăng đã được cập nhật", "Góp ý / Liên hệ mới")
    + content: nội dung chi tiết hiển thị cho người xem
    + isRead: trạng thái đọc của người quản trị hoặc người nhận (true: đã đọc / false: chưa đọc)
    + createdAt: thời điểm thông báo được phát sinh
    + updatedAt: thời điểm cập nhật trạng thái thông báo gần nhất

---

## 17. Mô tả các mối quan hệ giữa các thực thể

Dưới đây là mô tả chi tiết về cách các thực thể liên kết với nhau trong hệ thống:

1.  **User - Post (1:N):** Một người dùng (chủ nhà) có thể đăng nhiều tin đăng cho thuê khác nhau, nhưng mỗi tin đăng chỉ thuộc sở hữu của một người dùng duy nhất.
2.  **User - Transaction (1:N):** Một người dùng có thể thực hiện nhiều giao dịch nạp tiền hoặc thanh toán. Mỗi giao dịch gắn liền với một mã người dùng cụ thể.
3.  **User - Contact (1:N):** Một người dùng có thể gửi nhiều yêu cầu liên hệ hoặc phản hồi cho hệ thống. Thông qua `userId`, quản trị viên có thể biết chính xác ai là người đã gửi phản hồi.
4.  **Post - Image (1:1):** Mỗi tin đăng có một bản ghi hình ảnh tương ứng (bản ghi này chứa danh sách đường dẫn ảnh dưới dạng JSON).
5.  **Post - Attribute (1:1):** Mỗi tin đăng có một tập hợp các thuộc tính bổ sung (giá, diện tích định dạng văn bản).
6.  **Post - Overview (1:1):** Mỗi tin đăng có một bản ghi tổng quan chứa mã tin, ngày đăng và ngày hết hạn.
7.  **Post - Category (N:1):** Nhiều tin đăng có thể cùng thuộc về một danh mục (ví dụ: nhiều tin cùng là "Phòng trọ").
8.  **Post - Feature (N:N):** Một bài đăng có thể có nhiều tiện ích (Wifi, Điều hòa...) và một tiện ích cũng có thể xuất hiện trong nhiều bài đăng khác nhau. Mối quan hệ này được quản lý thông qua bảng trung gian **PostFeature**.
9.  **Province - District (1:N):** Một tỉnh hoặc thành phố có nhiều quận, huyện trực thuộc.
10. **Post - Location (N:1):** Nhiều bài đăng có thể cùng nằm trên một Quận/Huyện hoặc Tỉnh/Thành phố nhất định.
11. **Post - PostHistory (1:N):** Một bài đăng có thể được chỉnh sửa nhiều lần qua các thời kỳ, mỗi lần chỉnh sửa sẽ tạo ra một bản ghi lịch sử nội dung tương ứng trong bảng `PostHistory`.
12. **User - PostHistory (1:N):** Một người dùng (hoặc quản trị viên) có thể chỉnh sửa nhiều bài đăng khác nhau trên hệ thống, mỗi lần thực hiện sẽ ghi nhận mã tài khoản biên tập (`editorId`) trong `PostHistory`.
13. **Post - Notification (1:N):** Một bài đăng có thể phát sinh nhiều thông báo liên quan trong quá trình duyệt hoặc cập nhật. Trường `postId` có thể mang giá trị NULL đối với các thông báo chung (như liên hệ/góp ý).
14. **User - Notification (1:N) [Người gửi]:** Một người dùng khi thực hiện các hành động gửi phản hồi hoặc đăng tin sẽ kích hoạt các thông báo tương ứng đến Admin, ghi nhận mã người gửi (`senderId`) trong `Notification`.
15. **User - Notification (1:N) [Người nhận]:** Một người dùng hoặc quản trị viên có thể là người nhận của các thông báo cụ thể gửi riêng cho họ, ghi nhận mã người nhận (`recipientId`) trong `Notification`. Dành cho thông báo gửi riêng hoặc thông báo hệ thống nhắm đến đối tượng xác định. Trường này có giá trị NULL nếu thông báo gửi chung cho tất cả các quản trị viên.



