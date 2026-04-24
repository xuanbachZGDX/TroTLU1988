import icons from "./icons";

const { ImPencil2 } = icons;
const { MdManageSearch } = icons;
const { FaRegUserCircle } = icons;

const menuSidebar = [
  {
    id: 1,
    text: "Đăng tin cho thuê",
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
    text: "Sửa thông tin cá nhân",
    path: "/he-thong/sua-thong-tin-ca-nhan",
    icons: <FaRegUserCircle />,
  },
  {
    id: 4,
    text: "Liên hệ",
    path: "/he-thong/lien-he",
    icons: <FaRegUserCircle />,
  },
];

export default menuSidebar;
