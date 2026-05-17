import React, { useEffect, useState } from "react";
import userAvatar from "../../assets/user.png";
import { useSelector, useDispatch } from "react-redux";
import { menuSystem } from "../../utils/Menu/menuSystem.jsx";
import { NavLink } from "react-router-dom";
import * as actions from "../../store/actions";
import { AiOutlineLogout } from "react-icons/ai";
import { getRoleFromToken as getNormalizedRoleFromToken } from "../../utils/Common/role";
import { apiGetAdminNotifications } from "../../services";

const active = "flex items-center gap-3 py-3 px-4 font-bold bg-blue-50 text-blue-600 rounded-xl shadow-sm transition-all duration-200 border-r-4 border-blue-500";
const notActive = "flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all duration-200";

const ROLE_LABEL = { admin: "Quản trị viên", landlord: "Chủ trọ", user: "Khách hàng" };

const SystemSidebar = () => {
  const { currentData } = useSelector((state) => state.user);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const role = currentData?.role?.toLowerCase() || getNormalizedRoleFromToken(token) || "user";
  const isAdmin = role === "admin";
  const isLandlord = role === "landlord";

  useEffect(() => {
    if (isAdmin) {
      const fetchUnread = async () => {
        try {
          const res = await apiGetAdminNotifications();
          if (res?.data?.err === 0) {
            setUnreadCount((res.data.data || []).filter(n => !n.isRead).length);
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchUnread();
      const interval = setInterval(fetchUnread, 8000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  const handleLogout = () => {
    setIsLogoutLoading(true);
    setTimeout(() => {
      dispatch(actions.logout());
      setIsLogoutLoading(false);
    }, 1000);
  };

  return (
    <div className="w-[280px] h-full flex-none p-6 flex flex-col bg-white border-r border-gray-100 shadow-sm overflow-y-auto hide-scrollbar">
      {isLogoutLoading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/40 z-[999] flex flex-col items-center justify-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-b-transparent"></div>
          <span className="text-white font-bold text-lg">Đang đăng xuất...</span>
        </div>
      )}

      {/* Avatar & thông tin user */}
      <div className="flex flex-col items-center gap-4 py-6 mb-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl text-white shadow-lg shadow-blue-200 flex-none">
        <div className="relative">
          <img src={currentData?.avatar || userAvatar} alt="avatar" className="w-16 h-16 object-cover rounded-2xl border-2 border-white/20 shadow-inner" />
          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
        </div>
        <div className="text-center px-4">
          <span className="block font-bold text-base truncate w-40">{currentData?.name}</span>
          <div className="flex flex-col gap-0.5 mt-1">
            <span className="text-[10px] text-blue-100 opacity-90 uppercase tracking-wider font-medium">{ROLE_LABEL[role] || "Thành viên"}</span>
            <span className="text-[11px] font-mono bg-white/10 py-0.5 px-2 rounded-lg inline-block mt-1">Mã: {currentData?.id?.slice(0, 8).toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="flex flex-col gap-2">
        <p className="text-[10px] uppercase font-bold text-gray-400 px-4 mb-2 tracking-widest">Danh mục quản lý</p>
        {menuSystem.map((item) => {
          if (item.type === "admin" && !isAdmin) return null;
          if (item.type === "landlord" && !isLandlord) return null;

          const isNotif = item.id === 14;

          return (
            <NavLink className={({ isActive }) => (isActive ? active : notActive)} key={item.id} to={item?.path}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item?.icons}</span>
                  <span className="text-sm font-semibold">{item.text}</span>
                </div>
                {isNotif && unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">{unreadCount}</span>
                )}
              </div>
            </NavLink>
          );
        })}

        <div className="mt-4 pt-4 border-t border-gray-100">
          <span onClick={handleLogout} className="flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer text-red-500 hover:bg-red-50 transition-all duration-200 font-bold">
            <AiOutlineLogout className="text-xl" />
            <span className="text-sm">Đăng xuất</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SystemSidebar;
