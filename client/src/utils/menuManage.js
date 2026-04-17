import icons from "./icons";

const { ImPencil2 } = icons;
const { MdManageSearch } = icons;
const { FaRegUserCircle } = icons;

const menuManage = [
  {
    id: 1,
    text: "Đămg tin cho thuê",
    path: "/system/create-new",
    icons: <ImPencil2 />,
  },
  {
    id: 2,
    text: "Quản lý tin đăng",
    path: "/system/manage-post",
    icons: <MdManageSearch />,
  },
  {
    id: 3,
    text: "Thông tin tài khoản",
    path: "/system/profile",
    icons: <FaRegUserCircle />,
  },
];

export default menuManage;
