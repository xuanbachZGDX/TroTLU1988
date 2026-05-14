import React from "react";
import { Link } from "react-router-dom";
import icons from "../../../utils/icons";

const { AiOutlineLogout } = icons;

const UserMenu = ({ menuSystem, currentData, handleLogout, setIsShowMenu }) => {
  return (
    <div className="absolute top-[calc(100%+15px)] right-0 w-[240px] bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
      {menuSystem.filter(i => i.type !== 'admin' || currentData?.role === 'admin').map((item) => (
        <Link 
          key={item.id} 
          to={item.path} 
          onClick={() => setIsShowMenu(false)} 
          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors text-sm font-medium"
        >
          {item.icons} {item.text}
        </Link>
      ))}
      <div className="h-[1px] bg-gray-100 my-1 mx-2" />
      <button 
        onClick={handleLogout} 
        className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
      >
        <AiOutlineLogout size={20} /> Đăng xuất
      </button>
    </div>
  );
};

export default UserMenu;
