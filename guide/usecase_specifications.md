# ĐẶC TẢ CHI TIẾT USE CASE - HỆ THỐNG PHONGTRO123

Tài liệu này đặc tả chi tiết các Use Case chính của hệ thống quản lý và cho thuê phòng trọ **PhongTro123** theo cấu trúc bảng chuẩn hóa, mô tả rõ các luồng sự kiện chính và luồng phát sinh trực tiếp trong bảng.

---

### UC01: Đăng nhập hệ thống

| Thành phần | Nội dung đặc tả |
| :--- | :--- |
| **Mã Use Case** | **UC01** |
| **Tên Use Case** | **Đăng nhập hệ thống** |
| **Tác nhân** | Khách, Thành viên (Người thuê, Người cho thuê), Quản trị viên (Admin) |
| **Mô tả** | Cho phép người dùng và Admin đăng nhập vào hệ thống để thực hiện các tính năng cá nhân hoặc quản trị tương ứng. |
| **Tiền điều kiện** | Người dùng đã có tài khoản hợp lệ trong hệ thống. |
| **Hậu điều kiện** | Hệ thống cấp Token xác thực (JWT), lưu trạng thái đăng nhập và chuyển hướng người dùng về giao diện tương ứng (Trang chủ cho Thành viên / Dashboard cho Admin). |
| **Luồng sự kiện chính** | 1. Người dùng nhấn nút **"Đăng nhập"** trên thanh điều hướng.<br>2. Hệ thống hiển thị form yêu cầu nhập: **Số điện thoại** và **Mật khẩu**.<br>3. Người dùng nhập thông tin và nhấn **"Đăng nhập"**.<br>4. Hệ thống kiểm tra tính hợp lệ và xác thực thông tin:<br>- Nếu thông tin chính xác và không bật xác thực 2 bước, đăng nhập thành công và chuyển hướng đến trang chủ (hoặc Dashboard nếu là Admin).<br>- Nếu thông tin không hợp lệ, hệ thống hiển thị thông báo lỗi và yêu cầu nhập lại. |
| **Luồng sự kiện phát sinh** | **Luồng A1: Xác thực 2 bước (2FA) được bật**<br>1. Sau khi thông tin đăng nhập hợp lệ, hệ thống gửi mã OTP đến email/số điện thoại đã đăng ký của người dùng.<br>2. Người dùng nhập mã OTP vào form xác nhận trên hệ thống.<br>3. Hệ thống xác nhận OTP:<br>- Nếu OTP hợp lệ, đăng nhập thành công và chuyển hướng đến trang chủ.<br>- Nếu OTP không hợp lệ, hiển thị thông báo lỗi và yêu cầu nhập lại.<br><br>**Luồng A2: Người dùng quên mật khẩu**<br>1. Người dùng nhấn "Quên mật khẩu".<br>2. Hệ thống hiển thị form yêu cầu nhập email.<br>3. Người dùng nhập email và gửi yêu cầu.<br>4. Hệ thống gửi mã OTP đến email của người dùng.<br>5. Người dùng nhập mã OTP:<br>- Nếu OTP hợp lệ, hệ thống cho phép người dùng đặt mật khẩu mới.<br>- Nếu OTP không hợp lệ, hiển thị thông báo lỗi và yêu cầu nhập lại.<br>6. Người dùng đặt mật khẩu mới thành công.<br>7. Hệ thống xác nhận thành công và chuyển hướng về màn hình đăng nhập.<br><br>**Luồng A3: Tài khoản đang bị khóa (Blocked)**<br>1. Tại bước kiểm tra thông tin, hệ thống phát hiện trạng thái tài khoản là "blocked".<br>2. Hệ thống dừng đăng nhập và hiển thị thông báo lỗi: "Tài khoản của bạn đã bị khóa do vi phạm quy định, vui lòng liên hệ Admin!". |

---

### UC02: Đăng ký tài khoản

| Thành phần | Nội dung đặc tả |
| :--- | :--- |
| **Mã Use Case** | **UC02** |
| **Tên Use Case** | **Đăng ký tài khoản** |
| **Tác nhân** | Khách (Visitor) |
| **Mô tả** | Cho phép khách vãng lai đăng ký tài khoản thành viên mới trong hệ thống để đăng tin cho thuê hoặc lưu tin yêu thích. |
| **Tiền điều kiện** | Khách chưa đăng nhập vào hệ thống. |
| **Hậu điều kiện** | Tạo mới tài khoản thành công trong cơ sở dữ liệu (mặc định số dư ví = 0), chuyển hướng người dùng sang trang Đăng nhập. |
| **Luồng sự kiện chính** | 1. Người dùng nhấn nút **"Đăng ký thành viên"** trên thanh điều hướng.<br>2. Hệ thống hiển thị form đăng ký gồm: **Họ tên**, **Số điện thoại**, **Mật khẩu**.<br>3. Người dùng điền đầy đủ thông tin và nhấn nút **"Đăng ký"**.<br>4. Hệ thống kiểm tra định dạng và tính duy nhất của số điện thoại trong database:<br>- Nếu hợp lệ, hệ thống tạo tài khoản mới thành công, hiển thị thông báo "Đăng ký thành công!" và tự động chuyển hướng về trang Đăng nhập.<br>- Nếu không hợp lệ, hệ thống hiển thị thông báo lỗi tương ứng. |
| **Luồng sự kiện phát sinh** | **Luồng A1: Số điện thoại đã được đăng ký trước đó**<br>1. Tại bước kiểm tra, hệ thống phát hiện số điện thoại đã tồn tại trong bảng `Users`.<br>2. Hệ thống hiển thị cảnh báo lỗi: "Số điện thoại này đã được sử dụng!".<br>3. Người dùng nhập lại số điện thoại khác hoặc bấm đăng nhập.<br><br>**Luồng A2: Dữ liệu nhập trống hoặc sai định dạng**<br>1. Người dùng bỏ trống các trường bắt buộc hoặc nhập số điện thoại không đúng cấu trúc (không phải 10 số).<br>2. Hệ thống dừng đăng ký, đánh dấu đỏ các trường lỗi và hiển thị thông báo: "Vui lòng nhập đúng định dạng dữ liệu!". |

---

### UC03: Đăng tin cho thuê

| Thành phần | Nội dung đặc tả |
| :--- | :--- |
| **Mã Use Case** | **UC03** |
| **Tên Use Case** | **Đăng tin cho thuê** |
| **Tác nhân** | Chủ trọ / Người cho thuê (Landlord) |
| **Mô tả** | Cho phép chủ trọ đăng bài giới thiệu phòng trọ mới lên hệ thống, chọn gói dịch vụ VIP hoặc thường để hiển thị tin đăng. |
| **Tiền điều kiện** | Chủ trọ đã đăng nhập thành công và số dư tài khoản đủ để thanh toán gói tin đăng đã chọn (phí tối thiểu 1.000đ/ngày). |
| **Hậu điều kiện** | Tin đăng mới được tạo trong bảng `Posts` với trạng thái tương ứng (Đã duyệt hoặc Chờ duyệt), số dư ví chủ trọ bị trừ tiền tương ứng, ghi nhận lịch sử giao dịch. |
| **Luồng sự kiện chính** | 1. Chủ trọ chọn chức năng **"Đăng tin mới"** từ trang quản lý cá nhân.<br>2. Hệ thống hiển thị biểu mẫu đăng tin gồm 4 phần: Địa chỉ (Tỉnh/Quận/Phường/Đường), Thông tin mô tả (Danh mục, Tiêu đề, Nội dung), Thông tin chi tiết (Giá, Diện tích, Đối tượng), và Hình ảnh thực tế.<br>3. Chủ trọ điền thông tin, tải lên tối thiểu 1 hình ảnh và nhấn **"Tiếp tục"**.<br>4. Hệ thống hiển thị giao diện chọn Gói dịch vụ (Tin thường, VIP 3, VIP 2, VIP 1, VIP Nổi bật) và thời gian đăng tin (từ 3 đến 30 ngày). Hệ thống tự động tính toán tổng chi phí hiển thị.<br>5. Chủ trọ bấm **"Thanh toán & Đăng tin"**.<br>6. Hệ thống thực hiện trừ số dư tài khoản của chủ trọ, tạo lịch sử giao dịch và lưu tin đăng với trạng thái "Hoạt động" (nếu được tự động duyệt) hoặc "Chờ duyệt". |
| **Luồng sự kiện phát sinh** | **Luồng A1: Số dư tài khoản không đủ để thanh toán**<br>1. Tại bước thanh toán, hệ thống kiểm tra số dư ví chủ trọ nhỏ hơn số tiền cần thanh toán.<br>2. Hệ thống ngăn không cho đăng tin, hiển thị cảnh báo: "Số dư tài khoản của bạn không đủ để đăng tin!" và hiển thị nút liên kết đến trang Nạp tiền.<br><br>**Luồng A2: Thiếu thông tin bắt buộc hoặc hình ảnh**<br>1. Chủ trọ để trống tiêu đề, nội dung, giá, diện tích hoặc chưa tải lên hình ảnh nào.<br>2. Hệ thống ngăn việc tiếp tục, cuộn màn hình đến vị trí lỗi và hiển thị thông báo yêu cầu bổ sung.<br><br>**Luồng A3: Tin đăng thuộc diện tự động phê duyệt**<br>1. Hệ thống kiểm tra tài khoản chủ trọ có uy tín (ví dụ: đã đăng nhiều tin chất lượng và không vi phạm) hoặc gói tin VIP Nổi bật.<br>2. Hệ thống tự động chuyển trạng thái tin đăng sang "Active" (Hoạt động) ngay lập tức mà không cần Admin duyệt thủ công. |

---

### UC04: Quản lý tin đăng cá nhân

| Thành phần | Nội dung đặc tả |
| :--- | :--- |
| **Mã Use Case** | **UC04** |
| **Tên Use Case** | **Quản lý tin đăng cá nhân** |
| **Tác nhân** | Chủ trọ / Người cho thuê (Landlord) |
| **Mô tả** | Cho phép chủ trọ xem danh sách, chỉnh sửa nội dung, xóa hoặc thực hiện gia hạn/đẩy tin đăng của chính mình. |
| **Tiền điều kiện** | Chủ trọ đã đăng nhập vào hệ thống. |
| **Hậu điều kiện** | Trạng thái hoặc thông tin của bài đăng được cập nhật thành công trong cơ sở dữ liệu. |
| **Luồng sự kiện chính** | 1. Chủ trọ truy cập mục **"Quản lý tin đăng"**.<br>2. Hệ thống hiển thị danh sách các bài đăng của chủ sở hữu kèm theo trạng thái hiện tại (Đang hiển thị, Đã hết hạn, Chờ duyệt, Bị từ chối).<br>3. Chủ trọ chọn một bài đăng cụ thể và chọn thao tác:<br>- **Sửa tin**: Hệ thống hiển thị lại form điền thông tin cũ, chủ trọ thay đổi dữ liệu và nhấn "Cập nhật". Hệ thống lưu thông tin mới và chuyển trạng thái tin về "Chờ duyệt" nếu cần thiết.<br>- **Xóa tin**: Hệ thống yêu cầu xác nhận. Chủ trọ bấm đồng ý, hệ thống ẩn bài đăng khỏi giao diện công khai.<br>- **Gia hạn/Đẩy tin**: Chủ trọ chọn thời gian gia hạn, hệ thống tính phí, thực hiện trừ số dư ví và cập nhật ngày hết hạn của tin đăng. |
| **Luồng sự kiện phát sinh** | **Luồng A1: Gia hạn tin khi số dư tài khoản không đủ**<br>1. Tại bước gia hạn, hệ thống kiểm tra ví tiền của chủ trọ không đủ thanh toán phí.<br>2. Hệ thống báo lỗi: "Gia hạn thất bại do số dư tài khoản không đủ. Vui lòng nạp thêm tiền!". |

---

### UC05: Nạp tiền tài khoản

| Thành phần | Nội dung đặc tả |
| :--- | :--- |
| **Mã Use Case** | **UC05** |
| **Tên Use Case** | **Nạp tiền tài khoản** |
| **Tác nhân** | Chủ trọ / Người cho thuê (Landlord) |
| **Mô tả** | Cho phép chủ trọ nạp tiền vào tài khoản thông qua các phương thức thanh toán trực tuyến hoặc chuyển khoản thủ công để có số dư đăng tin. |
| **Tiền điều kiện** | Chủ trọ đã đăng nhập vào hệ thống. |
| **Hậu điều kiện** | Số dư tài khoản (`balance` trong bảng `Users`) được cộng thêm số tiền nạp tương ứng, tạo hóa đơn nạp tiền thành công. |
| **Luồng sự kiện chính** | 1. Chủ trọ chọn mục **"Nạp tiền vào tài khoản"**.<br>2. Hệ thống hiển thị form nhập số tiền cần nạp và danh sách phương thức thanh toán (Cổng VNPAY / Chuyển khoản ngân hàng trực tiếp).<br>3. Chủ trọ nhập số tiền (tối thiểu 10.000đ), chọn **"Thanh toán qua VNPAY"** và nhấn **"Xác nhận"**.<br>4. Hệ thống chuyển hướng chủ trọ đến giao diện cổng thanh toán VNPAY.<br>5. Chủ trọ thực hiện thanh toán bằng ứng dụng ngân hàng hoặc thẻ ATM.<br>6. Sau khi thanh toán thành công, VNPAY gửi phản hồi về hệ thống.<br>7. Hệ thống cập nhật cộng số dư tài khoản thành viên, ghi nhận lịch sử giao dịch và chuyển hướng chủ trọ về trang quản lý kèm thông báo thành công. |
| **Luồng sự kiện phát sinh** | **Luồng A1: Người dùng hủy thanh toán hoặc giao dịch bị lỗi**<br>1. Tại giao diện VNPAY, chủ trọ bấm nút "Hủy giao dịch" hoặc nhập sai mã OTP ngân hàng.<br>2. Hệ thống nhận phản hồi thất bại từ VNPAY, giữ nguyên số dư ví cũ và hiển thị thông báo: "Giao dịch thanh toán đã bị hủy hoặc không thành công!".<br><br>**Luồng A2: Thanh toán chuyển khoản ngân hàng thủ công**<br>1. Tại bước 2, chủ trọ chọn "Chuyển khoản trực tiếp".<br>2. Hệ thống hiển thị thông tin tài khoản ngân hàng của Admin kèm cú pháp chuyển khoản chứa ID người dùng.<br>3. Chủ trọ thực hiện chuyển khoản ngoài hệ thống và chờ Admin xác nhận thủ công để cộng tiền. |

---

### UC06: Tìm kiếm và lọc phòng trọ

| Thành phần | Nội dung đặc tả |
| :--- | :--- |
| **Mã Use Case** | **UC06** |
| **Tên Use Case** | **Tìm kiếm và lọc phòng trọ** |
| **Tác nhân** | Khách, Thành viên |
| **Mô tả** | Cho phép mọi người dùng tìm kiếm và lọc danh sách phòng trọ theo nhiều tiêu chí như danh mục, địa lý (tỉnh, quận), khoảng giá và khoảng diện tích. |
| **Tiền điều kiện** | Không có. |
| **Hậu điều kiện** | Hệ thống truy vấn và hiển thị danh sách các bài đăng khớp với toàn bộ tiêu chí lọc của người dùng. |
| **Luồng sự kiện chính** | 1. Người dùng truy cập vào trang chủ hoặc trang danh sách phòng trọ.<br>2. Hệ thống hiển thị thanh công cụ lọc tìm kiếm gồm: **Chuyên mục**, **Tỉnh thành/Quận huyện**, **Khoảng giá**, **Khoảng diện tích**.<br>3. Người dùng chọn các tiêu chí mong muốn và nhấn nút **"Tìm kiếm"**.<br>4. Hệ thống thực hiện câu lệnh truy vấn động `SELECT ... WHERE` dựa trên các tham số bộ lọc đã nhận.<br>5. Hệ thống trả về danh sách bài đăng phù hợp, sắp xếp ưu tiên các tin VIP lên đầu và hiển thị cho người dùng. |
| **Luồng sự kiện phát sinh** | **Luồng A1: Không có bài đăng nào thỏa mãn bộ lọc**<br>1. Hệ thống kiểm tra kết quả truy vấn trả về 0 dòng dữ liệu.<br>2. Hệ thống hiển thị giao diện trống kèm thông báo: "Không tìm thấy kết quả phù hợp cho tiêu chí tìm kiếm của bạn. Vui lòng thử lại với bộ lọc rộng hơn!". |

---

### UC07: Duyệt tin đăng

| Thành phần | Nội dung đặc tả |
| :--- | :--- |
| **Mã Use Case** | **UC07** |
| **Tên Use Case** | **Duyệt tin đăng** |
| **Tác nhân** | Quản trị viên (Admin) |
| **Mô tả** | Cho phép Admin kiểm duyệt nội dung tin đăng của chủ trọ trước khi hiển thị công khai trên trang chủ nhằm đảm bảo an toàn thông tin. |
| **Tiền điều kiện** | Admin đã đăng nhập thành công vào trang quản trị (Dashboard Admin). |
| **Hậu điều kiện** | Trạng thái tin đăng được cập nhật trong database, tin đăng được hiển thị công khai hoặc gửi phản hồi yêu cầu sửa tin về cho chủ trọ. |
| **Luồng sự kiện chính** | 1. Admin truy cập vào mục **"Quản lý bài đăng"** -> Chọn bộ lọc trạng thái **"Chờ duyệt"**.<br>2. Hệ thống hiển thị danh sách bài đăng đang đợi duyệt.<br>3. Admin nhấn xem chi tiết nội dung, hình ảnh, thông tin liên hệ của bài đăng.<br>4. Admin đưa ra quyết định kiểm duyệt:<br>- Nếu nội dung hợp lệ, Admin nhấn nút **"Phê duyệt"**. Hệ thống chuyển trạng thái tin sang "Active" (Hoạt động) và hiển thị tin công khai.<br>- Nếu nội dung không hợp lệ hoặc thiếu thông tin thực tế, Admin nhấn **"Từ chối"** và nhập lý do tương ứng. |
| **Luồng sự kiện phát sinh** | **Luồng A1: Bài đăng vi phạm chính sách nghiêm trọng (lừa đảo, cấm kỵ)**<br>1. Tại bước kiểm duyệt, Admin phát hiện tin đăng lừa đảo hoặc chứa nội dung xấu.<br>2. Admin chọn chức năng **"Xóa bài viết"** để gỡ hoàn toàn khỏi cơ sở dữ liệu và chuyển sang màn hình Quản lý thành viên để thực hiện Khóa tài khoản của chủ trọ đó. |

---

### UC08: Quản lý người dùng

| Thành phần | Nội dung đặc tả |
| :--- | :--- |
| **Mã Use Case** | **UC08** |
| **Tên Use Case** | **Quản lý người dùng** |
| **Tác nhân** | Quản trị viên (Admin) |
| **Mô tả** | Cho phép Admin quản lý thông tin các thành viên đăng ký trong hệ thống, khóa hoặc mở khóa tài khoản để duy trì trật tự an toàn. |
| **Tiền điều kiện** | Admin đã đăng nhập thành công vào trang quản trị Dashboard Admin. |
| **Hậu điều kiện** | Trạng thái hoạt động (`status` = "active" hoặc "blocked") của người dùng được cập nhật thành công trong cơ sở dữ liệu. |
| **Luồng sự kiện chính** | 1. Admin truy cập vào mục **"Quản lý người dùng"**.<br>2. Hệ thống hiển thị danh sách tất cả các tài khoản thành viên kèm theo trạng thái hiện tại (Đang hoạt động/Bị khóa).<br>3. Admin tìm kiếm tài khoản theo Tên hoặc Số điện thoại.<br>4. Admin chọn một tài khoản cụ thể và thực hiện thay đổi:<br>- Nếu tài khoản vi phạm quy chế đăng tin, Admin nhấn nút **"Khóa tài khoản"**. Hệ thống chuyển trạng thái tài khoản sang "blocked" và chấm dứt các phiên đăng nhập hiện tại của user đó.<br>- Nếu tài khoản đã hết thời hạn phạt hoặc được xem xét lại, Admin nhấn **"Mở khóa"**. Hệ thống chuyển trạng thái về "active". |
| **Luồng sự kiện phát sinh** | **Luồng A1: Ngăn chặn tự khóa tài khoản bản thân**<br>1. Admin vô tình nhấn nút Khóa tài khoản của chính mình hoặc các tài khoản thuộc nhóm Quản trị viên (Admin role).<br>2. Hệ thống kiểm tra vai trò người bị khóa, hiển thị cảnh báo: "Không thể khóa tài khoản thuộc nhóm Quản trị viên!" và dừng thao tác. |
