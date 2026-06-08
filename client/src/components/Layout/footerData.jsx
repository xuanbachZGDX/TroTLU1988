import React from "react";
import { path } from "../../utils/constant";
import { FaFacebook, FaYoutube, FaTwitter } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";

export const ABOUT_LINKS = [
  { label: "Giới thiệu", id: "gioi-thieu" },
  { label: "Quy chế hoạt động", id: "quy-che" },
  { label: "Quy định sử dụng", id: "quy-dinh-su-dung" },
  { label: "Chính sách bảo mật", id: "bao-mat" },
  { label: "Liên hệ", to: `/${path.CONTACT}` },
];

export const CUSTOMER_LINKS = [
  { label: "Câu hỏi thường gặp", id: "faq" },
  { label: "Hướng dẫn đăng tin", id: "huong-dan-dang-tin" },
  { label: "Bảng giá dịch vụ", to: `/${path.BANG_GIA}` },
  { label: "Quy định đăng tin", id: "quy-dinh-dang-tin" },
  { label: "Giải quyết khiếu nại", id: "khieu-nai" },
];

export const PAYMENT_METHODS = [
  { label: "VISA", bg: "#1a1f71", color: "#fff" },
  { label: "MasterCard", bg: "#eb001b", color: "#fff" },
  { label: "JCB", bg: "#003087", color: "#fff" },
  { label: "MoMo", bg: "#ae2070", color: "#fff" },
  { label: "ZaloPay", bg: "#0068ff", color: "#fff" },
  { label: "ShopeePay", bg: "#f05d25", color: "#fff" },
];

export const SOCIAL_LINKS = [
  {
    icon: <FaFacebook size={20} />,
    bg: "#1877f2",
    href: "https://facebook.com",
    label: "Facebook",
  },
  {
    icon: <FaYoutube size={20} />,
    bg: "#ff0000",
    href: "https://youtube.com",
    label: "YouTube",
  },
  {
    icon: <span className="text-xs font-extrabold">Zalo</span>,
    bg: "#0068ff",
    href: "https://zalo.me",
    label: "Zalo",
  },
  {
    icon: <FaTwitter size={20} />,
    bg: "#1da1f2",
    href: "https://twitter.com",
    label: "Twitter",
  },
  {
    icon: <FaTiktok size={20} />,
    bg: "#010101",
    href: "https://tiktok.com",
    label: "TikTok",
  },
];

export const DOCS_CONTENT = {
  "gioi-thieu": {
    title: "Giới thiệu về TroTLU1988.com",
    content: `TroTLU1988.com là hệ thống kết nối phòng trọ và nhà cho thuê hàng đầu dành cho sinh viên và người đi làm.

Chúng tôi cung cấp nền tảng tìm kiếm, đăng tin cho thuê căn hộ, phòng trọ, mặt bằng, ở ghép với thông tin chính xác, hình ảnh chân thực và vị trí rõ ràng. Hệ thống kiểm duyệt tin đăng nghiêm ngặt giúp hạn chế tối đa tin đăng ảo hoặc lừa đảo, đem lại trải nghiệm tìm kiếm an toàn và nhanh chóng nhất cho người thuê.`,
  },
  "quy-che": {
    title: "Quy chế hoạt động",
    content: `1. Trách nhiệm của chủ trọ:
- Cung cấp thông tin chính xác về phòng trọ, diện tích, giá thuê, hình ảnh thực tế.
- Chịu hoàn toàn trách nhiệm pháp lý đối với nội dung tin đăng và các giao dịch phát sinh với người thuê.

2. Trách nhiệm của hệ thống:
- Cung cấp nền tảng đăng tin hoạt động ổn định.
- Hỗ trợ giải quyết khiếu nại, phản hồi của người dùng liên quan đến tin đăng sai sự thật.
- Khóa tin đăng hoặc tài khoản vi phạm quy định nghiêm trọng.`,
  },
  "quy-dinh-su-dung": {
    title: "Quy định sử dụng dịch vụ",
    content: `Chào mừng bạn đến với TroTLU1988. Bằng việc truy cập và sử dụng dịch vụ, bạn cam kết tuân thủ các quy định sau:
- Không sử dụng tài khoản vào các mục đích lừa đảo, quấy rối hoặc phá hoại hệ thống.
- Không sử dụng các công cụ tự động quét dữ liệu hoặc spam bài đăng.
- Nghiêm cấm mọi hành vi giả mạo thông tin cá nhân, giả mạo chủ nhà hoặc đăng tin không được sự cho phép của chủ sở hữu hợp pháp.`,
  },
  "bao-mat": {
    title: "Chính sách bảo mật",
    content: `Hệ thống cam kết bảo vệ dữ liệu cá nhân của người dùng một cách tuyệt đối:
1. Thu thập thông tin: Chúng tôi chỉ thu thập các thông tin cần thiết như Tên, Số điện thoại, Email để quản lý tài khoản và hỗ trợ liên hệ đăng tin.
2. Bảo mật dữ liệu: Mọi thông tin mật khẩu được mã hóa an toàn ở phía máy chủ. Chúng tôi cam kết không cung cấp hoặc bán dữ liệu người dùng cho bất kỳ bên thứ ba nào ngoại trừ cơ quan pháp luật khi có yêu cầu hợp pháp.`,
  },
  faq: {
    title: "Câu hỏi thường gặp (FAQ)",
    content: `Q: Tôi đăng tin nhưng không thấy hiển thị ngoài trang chủ?
A: Tất cả tin đăng thường cần được Admin duyệt thủ công (thời gian từ 10-30 phút). Các gói tin VIP sẽ được duyệt tự động ngay lập tức.

Q: Làm thế nào để nạp tiền vào tài khoản?
A: Bạn vào mục Quản lý tài khoản -> Chọn "Nạp tiền", sau đó quét mã thanh toán bằng ví điện tử hoặc tài khoản ngân hàng.

Q: Tin đăng bị từ chối phê duyệt thì tiền của tôi đi đâu?
A: Số tiền của bạn sẽ được tự động hoàn lại 100% vào số dư tài khoản của bạn ngay khi Admin từ chối tin đăng.`,
  },
  "huong-dan-dang-tin": {
    title: "Hướng dẫn đăng tin hiệu quả",
    content: `Để tin đăng thu hút nhiều khách hàng hơn, bạn nên thực hiện theo các bước sau:
1. Tiêu đề: Ngắn gọn nhưng chứa thông tin quan trọng (Ví dụ: "Phòng trọ khép kín gần Đại học Thủy Lợi, có ban công").
2. Mô tả: Mô tả chi tiết diện tích, giá điện nước, các tiện ích nổi bật (wifi, điều hòa, giờ giấc tự do, chỗ để xe).
3. Hình ảnh: Tải lên tối thiểu 3 hình ảnh thực tế, sắc nét để tăng độ uy tín lên 80%.
4. Chọn gói tin: Cân nhắc sử dụng tin VIP nổi bật hoặc VIP 1, 2 để bài đăng luôn đứng ở vị trí hàng đầu.`,
  },
  "quy-dinh-dang-tin": {
    title: "Quy định đăng tin & Kiểm duyệt",
    content: `Để đảm bảo môi trường tin đăng chất lượng, vui lòng tuân thủ quy tắc sau:
- Không đăng tin trùng lặp (nhiều bài đăng cho một phòng trọ).
- Giá thuê và diện tích phải ghi đúng thực tế (không để giá 1.000đ hay diện tích ảo).
- Hình ảnh đăng tải phải là ảnh thực tế của phòng trọ đang cho thuê, không đăng tải ảnh mạng hoặc chứa logo của website khác.`,
  },
  "khieu-nai": {
    title: "Giải quyết tranh chấp & Khiếu nại",
    content: `Quy trình báo cáo sai phạm:
1. Phát hiện vi phạm: Nếu bạn phát hiện một tin đăng chứa thông tin sai sự thật hoặc chủ trọ có dấu hiệu lừa đảo, hãy nhấn nút "Báo cáo" ở trang chi tiết tin đăng.
2. Xử lý khiếu nại: Đội ngũ Admin sẽ tiếp nhận và tiến hành xác minh thông tin. 
3. Kết quả: Nếu xác định có hành vi vi phạm, tin đăng sẽ bị khóa và tài khoản vi phạm sẽ bị vô hiệu hóa số dư hoặc khóa tài khoản vĩnh viễn.`,
  },
};
