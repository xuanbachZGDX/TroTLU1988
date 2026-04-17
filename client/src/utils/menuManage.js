import icons from "./icons";

const { ImPencil2 } = icons;
const { MdManageSearch } = icons;
const { FaRegUserCircle } = icons;

const menuManage = [
  {
    id: 1,
    text: "Đămg tin cho thuê",
    path: "/he-thong/tao-moi-bai-dang",
    icons: <ImPencil2 />,
  },
  {
    id: 2,
    text: "Quản lý tin đăng",
    path: "/he-thong/quan-ly-bai-dang",
    icons: <MdManageSearch />,
  },
  {
    id: 3,
    text: "Thông tin tài khoản",
    path: "/he-thong/thong-tin-tai-khoan",
    icons: <FaRegUserCircle />,
  },
];

export default menuManage;
