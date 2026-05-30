# Đặc tả chi tiết các thực thể dữ liệu - Hệ thống TroTLU1988

Dưới đây là đặc tả chi tiết của tất cả các thực thể dữ liệu vật lý (tương ứng với các bảng trong cơ sở dữ liệu) của hệ thống TroTLU1988, kèm theo giải thích ý nghĩa và danh sách các thuộc tính cụ thể.

---

### 1. Tên thực thể: User

- **Giải thích ý nghĩa:** Người dùng
- **Mô tả:** Lưu trữ thông tin chi tiết của người dùng, chủ trọ, quản trị viên trong hệ thống và hồ sơ xác thực KYC.
- **Khóa chính:** Id (Mã người dùng)
- **Các thuộc tính của thực thể:**
  - name: tên của người dùng
  - password: mật khẩu đã mã hóa (bcrypt)
  - phone: số điện thoại đăng ký tài khoản
  - zalo: số điện thoại Zalo của người dùng
  - email: địa chỉ email của người dùng
  - avatar: ảnh đại diện của người dùng
  - role: vai trò hệ thống (admin/user)
  - balance: số dư tài khoản (BIGINT - dùng thanh toán phí đăng bài)
  - otp: mã xác thực OTP dùng để khôi phục mật khẩu
  - passwordResetExpires: thời gian hết hạn của mã reset mật khẩu
  - status: trạng thái tài khoản của người dùng (active/blocked)
  - cccdNumber: số căn cước công dân (12 chữ số) dùng để xác minh KYC
  - cccdFront: đường dẫn ảnh mặt trước CCCD trên Cloudinary
  - cccdBack: đường dẫn ảnh mặt sau CCCD trên Cloudinary
  - kycStatus: trạng thái xác minh danh tính KYC (unverified, pending, rejected, verified)
  - kycNote: ghi chú hoặc lý do từ chối KYC từ Admin
  - createdAt: thời điểm tạo tài khoản
  - updatedAt: thời điểm cập nhật tài khoản gần nhất

---

### 2. Tên thực thể: Post

- **Giải thích ý nghĩa:** Tin đăng
- **Mô tả:** Thực thể cốt lõi lưu trữ thông tin của các bài đăng cho thuê phòng trọ, căn hộ, bao gồm cả các thông tin tổng quan hiển thị và thuộc tính hiển thị (được thiết kế dạng phẳng hóa/gộp cột trực tiếp).
- **Khóa chính:** Id (Mã bài đăng)
- **Các thuộc tính của thực thể:**
  - title: tiêu đề của bài đăng
  - star: số sao đánh giá (tương ứng với loại tin VIP, từ 0 đến 5)
  - address: địa chỉ chi tiết của bất động sản cho thuê
  - description: nội dung mô tả chi tiết của bài đăng
  - categoryCode: mã danh mục loại hình cho thuê (Khóa ngoại)
  - provinceCode: mã tỉnh hoặc thành phố (Khóa ngoại)
  - districtCode: mã quận hoặc huyện (Khóa ngoại)
  - priceCode: mã khoảng giá cho thuê (phục vụ bộ lọc tìm kiếm nhanh)
  - areaCode: mã khoảng diện tích cho thuê (phục vụ bộ lọc tìm kiếm nhanh)
  - priceNumber: giá trị số của tiền thuê (triệu/tháng)
  - areaNumber: giá trị số của diện tích (m2)
  - status: trạng thái tin đăng (pending/active/expired)
  - userId: mã người dùng sở hữu bài đăng (Khóa ngoại)
  - note: ghi chú từ quản trị viên (ví dụ: lý do từ chối bài đăng)
  - price: chuỗi hiển thị giá (ví dụ: "3.5 triệu/tháng")
  - acreage: chuỗi hiển thị diện tích (ví dụ: "28m2")
  - overviewCode: mã tin hiển thị (ví dụ: #123456)
  - type: loại chuyên mục hiển thị
  - target: đối tượng khách hàng mục tiêu (Tất cả, Nam, Nữ)
  - bonus: gói tin đăng dịch vụ VIP (VIP Nổi bật, VIP 1, VIP 2, VIP 3, Tin thường)
  - published: ngày bắt đầu đăng tin
  - expired: ngày hết hạn tin đăng
  - createdAt: thời điểm tạo bài đăng
  - updatedAt: thời điểm cập nhật bài đăng gần nhất

---

### 3. Tên thực thể: Transaction

- **Giải thích ý nghĩa:** Giao dịch
- **Mô tả:** Lưu trữ nhật ký biến động số dư (nạp tiền và thanh toán phí dịch vụ tin đăng).
- **Khóa chính:** Id (Mã giao dịch)
- **Các thuộc tính của thực thể:**
  - userId: mã người dùng thực hiện giao dịch (Khóa ngoại)
  - amount: số tiền biến động trong giao dịch (VND)
  - type: loại giao dịch (Nạp tiền / Thanh toán gói VIP)
  - content: nội dung diễn giải chi tiết cho giao dịch
  - status: trạng thái giao dịch (success, pending, cancel)
  - createdAt: thời điểm thực hiện giao dịch
  - updatedAt: thời điểm cập nhật trạng thái gần nhất

---

### 4. Tên thực thể: Category

- **Giải thích ý nghĩa:** Danh mục
- **Mô tả:** Lưu trữ các danh mục loại hình cho thuê (ví dụ: Phòng trọ, Căn hộ, Nhà nguyên căn, Tìm người ở ghép).
- **Khóa chính:** Id (Mã danh mục)
- **Các thuộc tính của thực thể:**
  - code: mã định danh duy nhất của danh mục (Unique)
  - value: tên danh mục
  - header: tiêu đề hiển thị trên trang danh mục
  - description: nội dung mô tả ngắn về danh mục
  - order: thứ tự ưu tiên hiển thị danh mục trên menu điều hướng
  - createdAt: thời điểm tạo danh mục
  - updatedAt: thời điểm cập nhật danh mục gần nhất

---

### 5. Tên thực thể: Image

- **Giải thích ý nghĩa:** Hình ảnh
- **Mô tả:** Chứa danh sách hình ảnh thực tế đính kèm của mỗi bài đăng.
- **Khóa chính:** Id (Mã định danh hình ảnh)
- **Các thuộc tính của thực thể:**
  - postId: mã liên kết với bài đăng (Khóa ngoại)
  - image: chuỗi JSON chứa danh sách các đường dẫn ảnh (URL Cloudinary)
  - createdAt: thời điểm tạo bản ghi
  - updatedAt: thời điểm cập nhật gần nhất

---

### 6. Tên thực thể: Feature

- **Giải thích ý nghĩa:** Tiện ích phòng trọ
- **Mô tả:** Lưu trữ danh mục các tiện ích đi kèm của bất động sản (như Wifi, Điều hòa, Nóng lạnh, Máy giặt, Gác lửng...).
- **Khóa chính:** Id (Mã tiện ích)
- **Các thuộc tính của thực thể:**
  - code: mã định danh duy nhất của tiện ích (Unique)
  - value: tên tiện ích
  - createdAt: thời điểm tạo tiện ích
  - updatedAt: thời điểm cập nhật gần nhất

---

### 7. Tên thực thể: PostFeature

- **Giải thích ý nghĩa:** Tiện ích bài đăng
- **Mô tả:** Thực thể trung gian biểu diễn mối quan hệ nhiều-nhiều giữa tin đăng (`Post`) và tiện ích (`Feature`).
- **Khóa chính:** Id (Mã bản ghi trung gian)
- **Các thuộc tính của thực thể:**
  - postId: mã liên kết với bài đăng (Khóa ngoại)
  - featureId: mã liên kết với tiện ích (Khóa ngoại)
  - createdAt: thời điểm liên kết được tạo
  - updatedAt: thời điểm cập nhật gần nhất

---

### 8. Tên thực thể: Province

- **Giải thích ý nghĩa:** Tỉnh / Thành phố
- **Mô tả:** Lưu trữ thông tin đơn vị hành chính cấp tỉnh phục vụ tìm kiếm địa lý.
- **Khóa chính:** Id (Mã định danh tỉnh)
- **Các thuộc tính:**
  - code: mã hành chính duy nhất (Unique)
  - value: tên tỉnh hoặc thành phố (Hà Nội, TP. Hồ Chí Minh...)
  - createdAt: thời điểm tạo bản ghi
  - updatedAt: thời điểm cập nhật gần nhất

---

### 9. Tên thực thể: District

- **Giải thích ý nghĩa:** Quận / Huyện
- **Mô tả:** Lưu trữ thông tin đơn vị hành chính cấp quận/huyện trực thuộc một tỉnh/thành.
- **Khóa chính:** Id (Mã định danh quận huyện)
- **Các thuộc tính:**
  - code: mã hành chính duy nhất (Unique)
  - value: tên quận hoặc huyện
  - provinceCode: mã tỉnh/thành phố trực quản (Khóa ngoại)
  - createdAt: thời điểm tạo bản ghi
  - updatedAt: thời điểm cập nhật gần nhất

---

### 10. Tên thực thể: Contact

- **Giải thích ý nghĩa:** Liên hệ / Phản hồi
- **Mô tả:** Lưu trữ thông tin góp ý, phản hồi, khiếu nại của người dùng gửi tới Admin và nội dung phản hồi tương ứng.
- **Khóa chính:** Id (Mã tự tăng, INTEGER)
- **Các thuộc tính của thực thể:**
  - userId: mã tài khoản gửi liên hệ (Khóa ngoại, có thể NULL nếu khách hàng gửi ẩn danh/vãng lai)
  - name: họ tên người gửi
  - phone: số điện thoại liên hệ
  - content: nội dung liên hệ chi tiết
  - response: nội dung phản hồi từ ban quản trị
  - status: trạng thái xử lý của liên hệ (pending, processed)
  - createdAt: thời điểm gửi liên hệ
  - updatedAt: thời điểm cập nhật gần nhất

---

### 11. Tên thực thể: PostHistory

- **Giải thích ý nghĩa:** Lịch sử chỉnh sửa bài đăng
- **Mô tả:** Lưu trữ vết thay đổi của các trường dữ liệu quan trọng trong bài đăng (Tiêu đề, Giá, Diện tích, Mô tả, Địa chỉ) trước và sau mỗi lần chỉnh sửa.
- **Khóa chính:** Id (UUID)
- **Các thuộc tính của thực thể:**
  - postId: mã bài đăng được chỉnh sửa (Khóa ngoại, SET NULL nếu bài đăng bị xóa)
  - editorId: mã người thực hiện chỉnh sửa (Khóa ngoại, SET NULL nếu người dùng bị xóa)
  - oldTitle: tiêu đề bài đăng trước khi sửa
  - newTitle: tiêu đề bài đăng sau khi sửa
  - oldPrice: giá thuê trước khi sửa (triệu/tháng)
  - newPrice: giá thuê sau khi sửa (triệu/tháng)
  - oldArea: diện tích trước khi sửa (m2)
  - newArea: diện tích sau khi sửa (m2)
  - oldDescription: nội dung mô tả cũ
  - newDescription: nội dung mô tả mới
  - oldAddress: địa chỉ cũ
  - newAddress: địa chỉ mới
  - createdAt: thời điểm thực hiện chỉnh sửa
  - updatedAt: thời điểm cập nhật bản ghi gần nhất

---

### 12. Tên thực thể: Notification

- **Giải thích ý nghĩa:** Thông báo hệ thống
- **Mô tả:** Lưu trữ các thông báo gửi đến quản trị viên hoặc người dùng cụ thể khi có sự kiện nghiệp vụ phát sinh (ví dụ: nạp tiền thành công, tin đăng bị từ chối, duyệt KYC...).
- **Khóa chính:** Id (UUID)
- **Các thuộc tính của thực thể:**
  - postId: mã tin đăng liên quan đến thông báo (Nullable)
  - senderId: mã tài khoản thực hiện hành động tạo thông báo (Nullable)
  - recipientId: mã tài khoản nhận thông báo (Nullable, nếu NULL là thông báo gửi cho toàn bộ Admin)
  - title: tiêu đề tóm tắt của thông báo
  - content: nội dung chi tiết của thông báo
  - isRead: trạng thái đã đọc hay chưa (true/false)
  - createdAt: thời điểm phát sinh thông báo
  - updatedAt: thời điểm cập nhật trạng thái gần nhất

---

### 13. Tên thực thể: Report

- **Giải thích ý nghĩa:** Báo cáo vi phạm / Báo xấu
- **Mô tả:** Lưu các báo cáo của người thuê trọ phản ánh bài đăng lừa đảo, sai sự thật hoặc phòng đã cho thuê.
- **Khóa chính:** Id (UUID)
- **Các thuộc tính của thực thể:**
  - postId: mã tin đăng bị báo cáo (Khóa ngoại)
  - userId: mã người gửi báo cáo (Khóa ngoại, Nullable nếu gửi ẩn danh)
  - reason: lý do báo cáo vi phạm (chọn từ danh sách định sẵn)
  - content: nội dung mô tả chi tiết vi phạm
  - status: trạng thái xử lý báo cáo (pending, resolved, rejected)
  - createdAt: thời điểm gửi báo cáo
  - updatedAt: thời điểm cập nhật trạng thái gần nhất

---

### 14. Tên thực thể: Package

- **Giải thích ý nghĩa:** Gói dịch vụ đăng tin (Gói VIP)
- **Mô tả:** Lưu trữ cấu hình giá cả, đặc quyền và mức độ hiển thị nổi bật của các gói tin đăng dịch vụ.
- **Khóa chính:** Id (Ví dụ: v5, v4, v3, v2, v0)
- **Các thuộc tính của thực thể:**
  - name: tên gói dịch vụ (Tin VIP Nổi Bật, Tin VIP 1, VIP 2, VIP 3, Tin thường)
  - star: số sao đánh giá hiển thị của gói tin tương ứng (0 - 5)
  - price: mức giá dịch vụ tính theo ngày (VND)
  - color: class màu sắc đại diện hiển thị trên giao diện người dùng
  - benefit: danh sách các mô tả quyền lợi chi tiết của gói tin
  - createdAt: thời điểm tạo gói dịch vụ
  - updatedAt: thời điểm cập nhật gần nhất

---

## 15. Mô tả các mối quan hệ giữa các thực thể

Dưới đây là mô tả chi tiết về cách các thực thể liên kết với nhau trong hệ thống:

1.  **User - Post (1:N):** Một người dùng (chủ nhà) có thể đăng nhiều tin đăng cho thuê khác nhau, nhưng mỗi tin đăng chỉ thuộc sở hữu của một người dùng duy nhất. Khóa ngoại `userId` liên kết đến bảng Users, với hành vi `ON DELETE CASCADE`.
2.  **User - Transaction (1:N):** Một người dùng có thể thực hiện nhiều giao dịch nạp tiền hoặc thanh toán. Mỗi giao dịch gắn liền với một mã người dùng cụ thể thông qua khóa ngoại `userId`.
3.  **User - Contact (1:N):** Một người dùng có thể gửi nhiều yêu cầu liên hệ hoặc phản hồi cho hệ thống. Thông qua `userId` (cho phép NULL), quản trị viên có thể biết chính xác ai là người đã gửi phản hồi.
4.  **Post - Image (1:1):** Mỗi tin đăng có một bản ghi hình ảnh tương ứng thông qua khóa ngoại `postId` trong bảng `Images` (bản ghi này chứa danh sách đường dẫn ảnh dưới dạng JSON).
5.  **Post - Category (N:1):** Nhiều tin đăng có thể cùng thuộc về một danh mục (ví dụ: nhiều tin cùng là "Phòng trọ") thông qua khóa ngoại `categoryCode` trong bảng `Posts`.
6.  **Post - Feature (N:N Logic):**
    - _Ý nghĩa:_ Mối quan hệ logic Nhiều - Nhiều giữa bài đăng (`Posts`) và tiện ích (`Features`). Một bài đăng có thể chọn sở hữu nhiều tiện ích (Wifi, Điều hòa, Nóng lạnh...) và một tiện ích cũng có thể xuất hiện trong nhiều bài đăng khác nhau.
7.  **Post - PostFeature (1:N):**
    - Khóa ngoại `postId` trong bảng trung gian `PostFeatures` tham chiếu đến `id` của bảng `Posts` với hành vi `ON DELETE CASCADE`.
    - _Ý nghĩa:_ Để liên kết các tiện ích, mỗi bài đăng có thể có một hoặc nhiều bản ghi liên kết tương ứng nằm trong bảng trung gian `PostFeatures`. Khi một bài đăng bị xóa, tất cả bản ghi liên kết của nó trong `PostFeatures` cũng tự động bị xóa theo.
8.  **Feature - PostFeature (1:N):**
    - Khóa ngoại `featureId` trong bảng trung gian `PostFeatures` tham chiếu đến `id` của bảng `Features` với hành vi `ON DELETE CASCADE`.
    - _Ý nghĩa:_ Một tiện ích (ví dụ: Wifi) có thể xuất hiện ở nhiều bản ghi liên kết trong bảng `PostFeatures`. Khi tiện ích bị xóa, mọi bản ghi liên kết liên quan đến tiện ích đó trong `PostFeatures` cũng tự động bị xóa theo.
9.  **Province - District (1:N):** Một tỉnh hoặc thành phố có nhiều quận, huyện trực thuộc thông qua khóa ngoại `provinceCode` liên kết bảng `Districts` với trường `code` (Unique) trong bảng `Provinces`.
10. **Post - Province (N:1):**
    - Khóa ngoại `provinceCode` trong bảng `Posts` tham chiếu đến trường `code` (Unique) của bảng `Provinces` (`ON DELETE SET NULL`).
    - _Ý nghĩa:_ Nhiều tin đăng có thể thuộc cùng một tỉnh/thành phố (ví dụ: Tỉnh Thái Nguyên). Khi tỉnh thành bị xóa, trường `provinceCode` của tin đăng nhận giá trị `NULL`.
11. **Post - District (N:1):**
    - Khóa ngoại `districtCode` trong bảng `Posts` tham chiếu đến trường `code` (Unique) của bảng `Districts` (`ON DELETE SET NULL`).
    - _Ý nghĩa:_ Nhiều tin đăng có thể thuộc cùng một quận/huyện (ví dụ: Thành phố Thái Nguyên). Khi quận/huyện bị xóa, trường `districtCode` của tin đăng nhận giá trị `NULL`.
12. **Post - Package (N:1 Logic):**
    - Mối quan hệ logic dựa trên trường `star` (số sao của tin) hoặc `bonus` (tên gói dịch vụ) trong bảng `Posts` tương ứng với trường `star` trong bảng `Packages`.
    - _Ý nghĩa:_ Một bài đăng sẽ thuộc về duy nhất một gói dịch vụ tin đăng (VIP Nổi bật, VIP 1, VIP 2, VIP 3, Tin thường). Hệ thống sử dụng mối quan hệ này để xác định mức phí thanh toán tin đăng mỗi ngày (lấy từ bảng `Packages` khi đăng tin) và độ ưu tiên hiển thị (tin VIP nhiều sao hiển thị ở vị trí cao hơn), cũng như kiểu dáng thiết kế UI tương ứng.
13. **Post - PostHistory (1:N):** Một bài đăng có thể được chỉnh sửa nhiều lần qua các thời kỳ, mỗi lần chỉnh sửa sẽ tạo ra một bản ghi lịch sử nội dung tương ứng trong bảng `PostHistory`.
14. **User - PostHistory (1:N):** Một người dùng (hoặc quản trị viên) có thể chỉnh sửa nhiều bài đăng khác nhau trên hệ thống, mỗi lần thực hiện sẽ ghi nhận mã tài khoản biên tập (`editorId`) trong `PostHistory`.
15. **Post - Notification (1:N):** Một bài đăng có thể phát sinh nhiều thông báo liên quan trong quá trình duyệt hoặc cập nhật. Trường `postId` có thể mang giá trị NULL đối với các thông báo chung (như liên hệ/góp ý).
16. **User - Notification (1:N) [Người gửi]:** Một người dùng khi thực hiện các hành động gửi phản hồi hoặc đăng tin sẽ kích hoạt các thông báo tương ứng đến Admin, ghi nhận mã người gửi (`senderId`) trong `Notification`.
17. **User - Notification (1:N) [Người nhận]:** Một người dùng hoặc quản trị viên có thể là người nhận của các thông báo cụ thể gửi riêng cho họ, ghi nhận mã người nhận (`recipientId`) trong `Notification`. Dành cho thông báo gửi riêng hoặc thông báo hệ thống nhắm đến đối tượng xác định. Trường này có giá trị NULL nếu thông báo gửi chung cho tất cả các quản trị viên.
18. **Post - Report (1:N):** Một bài đăng cho thuê phòng trọ có thể nhận nhiều báo cáo vi phạm từ nhiều người thuê trọ khác nhau. Khóa ngoại `postId` trong bảng `Report` tham chiếu đến `id` của bảng `Post` với hành vi `ON DELETE CASCADE`.
19. **User - Report (1:N):** Một người dùng có thể gửi nhiều lượt báo cáo vi phạm về các bài đăng khác nhau. Khóa ngoại `userId` trong bảng `Report` tham chiếu đến `id` của bảng `User` (cho phép NULL nếu tài khoản bị xóa hoặc gửi ẩn danh).
