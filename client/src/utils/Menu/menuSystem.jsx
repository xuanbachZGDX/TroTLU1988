import icons from "../icons";
import { path } from "../constant";

const {
  ImPencil2, MdManageSearch, FaRegUserCircle,
  AiOutlineDashboard, HiOutlineUsers, MdOutlinePriceChange,
  BsWallet2, MdHistory, RiMessage2Line, IoMdNotificationsOutline
} = icons;

// type:
// 'admin'    → chỉ admin
// 'landlord' → chủ trọ + admin
// 'all'      → mọi người đã đăng nhập (kể cả user tìm kiếm)
export const menuSystem = [
  // Admin only
  { id: 10, text: "Tổng quan hệ thống",      path: `/${path.ADMIN}/${path.ADMIN_DASHBOARD}`, icons: <AiOutlineDashboard />,  type: 'admin' },
  { id: 12, text: "Quản lý người dùng",       path: `/${path.ADMIN}/${path.ADMIN_USERS}`,     icons: <HiOutlineUsers />,      type: 'admin' },
  { id: 11, text: "Quản lý tất cả bài đăng", path: `/${path.ADMIN}/${path.ADMIN_POSTS}`,     icons: <MdManageSearch />,      type: 'admin' },
  { id: 13, text: "Quản lý liên hệ",          path: `/${path.ADMIN}/${path.ADMIN_CONTACTS}`,  icons: <RiMessage2Line />,      type: 'admin' },
  { id: 14, text: "Thông báo hệ thống",       path: `/${path.ADMIN}/${path.ADMIN_NOTIFICATIONS}`, icons: <IoMdNotificationsOutline />, type: 'admin' },

  // Chủ trọ + Admin
  { id: 1, text: "Đăng tin cho thuê",         path: `/${path.SYSTEM}/${path.CREATE_POST}`,            icons: <ImPencil2 />,           type: 'landlord' },
  { id: 2, text: "Quản lý tin đăng",          path: `/${path.SYSTEM}/${path.MANAGE_POST}`,            icons: <MdManageSearch />,      type: 'landlord' },
  { id: 4, text: "Bảng giá dịch vụ",          path: `/${path.SYSTEM}/${path.MANAGE_SERVICE_PRICE}`,   icons: <MdOutlinePriceChange />,type: 'landlord' },
  { id: 5, text: "Nạp tiền vào tài khoản",    path: `/${path.SYSTEM}/${path.DEPOSIT}`,                icons: <BsWallet2 />,           type: 'landlord' },
  { id: 6, text: "Lịch sử giao dịch",         path: `/${path.SYSTEM}/${path.TRANSACTION_HISTORY}`,    icons: <MdHistory />,           type: 'landlord' },
  { id: 7, text: "Hỗ trợ & Góp ý",             path: `/${path.SYSTEM}/${path.MY_CONTACTS}`,            icons: <RiMessage2Line />,      type: 'landlord' },

  // Mọi người đã đăng nhập (user tìm kiếm chỉ thấy mục này)
  { id: 3, text: "Sửa thông tin cá nhân",     path: `/${path.SYSTEM}/${path.EDIT_ACCOUNT}`,           icons: <FaRegUserCircle />,     type: 'all' },
];
