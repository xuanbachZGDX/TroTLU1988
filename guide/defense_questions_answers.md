# HƯỚNG DẪN TRẢ LỜI CÂU HỎI BẢO VỆ CHUYÊN ĐỀ TỐT NGHIỆP
## Dự án: PhongTro123 - Hệ thống cho thuê phòng trọ

Tài liệu này tổng hợp các câu trả lời "ăn điểm" cho những vấn đề cốt lõi trong cơ sở dữ liệu, giúp bạn thể hiện tư duy hệ thống và kiến thức chuyên môn vững chắc trước Hội đồng.

---

### Câu 1: Tại sao tách Post, Attribute và Overview thay vì gộp chung?
*   **Câu trả lời:** 
    *   **Về Logic:** Đây là việc áp dụng nguyên tắc **Separation of Concerns (Tách biệt các mối quan tâm)**. Bảng `Post` lưu thông tin cốt lõi để tìm kiếm, `Attribute` lưu thông tin kỹ thuật, và `Overview` lưu thông tin về trạng thái hiển thị/vận hành.
    *   **Về Hiệu năng:** Khi truy vấn danh sách (Listing page), hệ thống chỉ cần JOIN những bảng cần thiết. Việc giữ bảng `Post` gọn nhẹ giúp tăng tốc độ quét Index. 
    *   **Về Mở rộng:** Nếu sau này hệ thống cần thêm các thuộc tính chuyên sâu cho loại hình "Văn phòng cho thuê" (khác với "Phòng trọ"), ta chỉ cần thay đổi bảng `Attribute` mà không làm ảnh hưởng đến cấu trúc chính của bài đăng.

### Câu 2: Tại sao lưu cả `priceNumber` (FLOAT) và `price` (VARCHAR)?
*   **Câu trả lời:**
    *   **Mục đích khác nhau:** `priceNumber` dùng để **Tính toán và Lọc (Filter)** (ví dụ: `WHERE priceNumber BETWEEN 2 AND 5`). Còn `price` trong bảng `Attribute` là dữ liệu **Pre-formatted (Định dạng sẵn)** để hiển thị ngay lên UI (ví dụ: "3.5 triệu/tháng") mà không cần tốn tài nguyên xử lý logic ở Backend hay Frontend mỗi khi render.
    *   **Kỹ thuật:** Đây là kỹ thuật **De-normalization (Phi chuẩn hóa)** có kiểm soát để tối ưu trải nghiệm người dùng (UX) và tốc độ tải trang.

### Câu 3: Tại sao dùng VARCHAR(255) cho ID thay vì INT AUTO_INCREMENT?
*   **Câu trả lời:**
    *   **Tính bảo mật:** Sử dụng chuỗi định danh (như UUID) giúp che giấu số lượng bản ghi thực tế của hệ thống. Nếu dùng số tự tăng, đối thủ cạnh tranh có thể biết bạn có bao nhiêu bài đăng hoặc bao nhiêu khách hàng chỉ bằng cách nhìn vào ID.
    *   **Khả năng mở rộng (Scalability):** Khi hệ thống lớn mạnh và cần phân tán database (Sharding), UUID đảm bảo tính duy nhất trên toàn hệ thống mà không bị trùng lặp như số tự tăng.
    *   **Hỗ trợ Migration:** Dễ dàng gộp dữ liệu từ nhiều nguồn khác nhau mà không lo xung đột khóa chính.

### Câu 4: Tại sao lưu mảng ảnh dưới dạng JSON trong cột TEXT?
*   **Câu trả lời:**
    *   **Tối ưu số lượng Join:** Một bài đăng thường có 5-10 ảnh. Nếu tách ra bảng riêng, mỗi lần lấy 20 bài đăng ta phải Join với hàng trăm dòng ảnh. Lưu JSON giúp lấy toàn bộ bài đăng và ảnh chỉ trong 1 lần đọc duy nhất.
    *   **Tính toàn vẹn:** Trong dự án này, ảnh luôn đi kèm theo bộ với bài đăng, không có nhu cầu tìm kiếm bài đăng theo từng ảnh riêng lẻ, nên lưu JSON là phương án cân bằng giữa hiệu năng và sự đơn giản của schema.

### Câu 5: Làm sao đảm bảo an toàn khi trừ tiền người dùng (balance)?
*   **Câu trả lời:** 
    *   Em sử dụng **Database Transactions (ACID)**. Khi thực hiện giao dịch, hệ thống sẽ thực hiện 3 bước trong 1 khối: (1) Kiểm tra số dư, (2) Trừ tiền tài khoản, (3) Tạo lịch sử giao dịch. 
    *   Nếu bất kỳ bước nào thất bại, hệ thống sẽ thực hiện `Rollback` để trả lại trạng thái cũ, đảm bảo không bao giờ có chuyện người dùng mất tiền mà không có lịch sử hoặc ngược lại.

### Câu 6: Làm thế nào để tối ưu tìm kiếm khi dữ liệu lớn (Big Data)?
*   **Câu trả lời:**
    *   **Indexing:** Em sẽ đánh **Composite Index (Index tổ hợp)** trên các cột thường xuyên được lọc cùng nhau như `(provinceCode, districtCode, categoryCode, priceNumber)`.
    *   **Caching:** Sử dụng Redis để lưu kết quả các truy vấn phổ biến ở trang chủ.
    *   **Full-text Search:** Nếu tìm kiếm theo từ khóa trong tiêu đề/mô tả, em sẽ sử dụng Full-text Search của database hoặc tích hợp Elasticsearch để đạt độ chính xác và tốc độ cao nhất.

### Câu 7: Về bảo mật tài khoản và phân quyền
*   **Câu trả lời:**
    *   Mật khẩu được mã hóa bằng thuật toán băm một chiều (ví dụ: **BCrypt**) kèm theo Salt để chống tấn công Rainbow Table.
    *   Hệ thống phân quyền dựa trên **JWT (JSON Web Token)**. Mỗi Request lên Server đều được Middleware kiểm tra tính hợp lệ của Token và so khớp `role` của người dùng với quyền hạn yêu cầu của API đó ở phía Backend.

---
**Gợi ý cho bạn:** Khi trả lời, hãy giữ thái độ tự tin, nếu không biết rõ một vấn đề nào đó, hãy trả lời theo hướng: *"Trong phạm vi đồ án hiện tại, em ưu tiên giải pháp X để đảm bảo tiến độ, nhưng em đã tìm hiểu giải pháp Y và sẽ áp dụng khi hệ thống mở rộng thực tế."* (Đây là câu trả lời cực kỳ ăn điểm về thái độ cầu tiến).
