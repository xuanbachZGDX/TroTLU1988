import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  apiGetAdminNotifications, 
  apiReadAdminNotification, 
  apiGetPostHistory,
  apiGetUserNotifications,
  apiReadUserNotification
} from "../../../services";
import { PostHistoryModal } from "../../../components";
import { path } from "../../../utils/constant";
import icons from "../../../utils/icons";
import userAvatar from "../../../assets/user.png";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const { IoMdNotificationsOutline } = icons;

const AdminBellNotification = () => {
  const navigate = useNavigate();
  const { currentData } = useSelector((state) => state.user);
  const { token } = useSelector((state) => state.auth);

  const tokenRole = React.useMemo(() => {
    if (!token) return null;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(base64))?.role?.toLowerCase() || null;
    } catch {
      return null;
    }
  }, [token]);

  const role = currentData?.role?.toLowerCase() || tokenRole;
  const isAdmin = role === "admin";

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef();

  const [historyPost, setHistoryPost] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const fetchNotifs = async () => {
    try {
      const res = isAdmin ? await apiGetAdminNotifications() : await apiGetUserNotifications();
      if (res?.data?.err === 0) {
        const list = res.data.data || [];
        setNotifications(list);
        setUnreadCount(list.filter(n => !n.isRead).length);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 10000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemClick = async (n) => {
    setIsOpen(false);
    if (!n.isRead) {
      if (isAdmin) {
        await apiReadAdminNotification(n.id);
      } else {
        await apiReadUserNotification(n.id);
      }
      fetchNotifs();
    }
    if (!n.postId) {
      if (isAdmin) {
        navigate(`/${path.ADMIN}/${path.ADMIN_CONTACTS}`);
      } else {
        navigate(`/${path.SYSTEM}/${path.MY_CONTACTS}`);
      }
      return;
    }
    
    if (isAdmin) {
      setHistoryPost({ id: n.postId, overview: { code: n.postId?.slice(0, 8).toUpperCase() } });
      const response = await apiGetPostHistory(n.postId);
      if (response?.data?.err === 0) {
        setHistoryData(response.data.data || []);
        setShowHistoryModal(true);
      } else {
        Swal.fire("Không tìm thấy", "Chưa có dữ liệu lịch sử cho tin đăng này.", "info");
      }
    } else {
      navigate(`/${path.SYSTEM}/${path.MANAGE_POST}`);
    }
  };

  return (
    <div className="relative flex items-center" ref={bellRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 transition-colors relative p-1"
      >
        <IoMdNotificationsOutline size={25} className={unreadCount > 0 ? "animate-wiggle" : ""} />
        <span className="text-[11px] font-bold mt-0.5 whitespace-nowrap uppercase tracking-tighter">Thông báo</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+15px)] right-0 w-[320px] bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 flex flex-col gap-2">
          <div className="px-4 pb-2 border-b flex justify-between items-center">
            <span className="text-xs font-bold text-gray-800">Thông báo mới nhận</span>
            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">{unreadCount} chưa đọc</span>
          </div>
          <div className="max-h-[260px] overflow-y-auto flex flex-col">
            {notifications.length === 0 ? (
              <div className="text-center py-6 text-xs text-gray-400 italic">Chưa có thông báo nào.</div>
            ) : (
              notifications.slice(0, 5).map(n => (
                <div 
                  key={n.id} 
                  onClick={() => handleItemClick(n)}
                  className={`flex items-start gap-3 px-4 py-2.5 cursor-pointer transition-colors border-b border-gray-50 last:border-0 ${n.isRead ? "hover:bg-gray-50" : "bg-blue-50/20 hover:bg-blue-50/40"}`}
                >
                  <img src={n.sender?.avatar || userAvatar} alt="avatar" className="w-8 h-8 rounded-lg object-cover flex-none" />
                  <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                    <span className={`text-[11px] truncate ${n.isRead ? "text-gray-700" : "font-bold text-gray-900"}`}>{n.title}</span>
                    <p className="text-[10px] text-gray-500 line-clamp-2">{n.content}</p>
                    <span className="text-[9px] text-gray-400 mt-0.5">{new Date(n.createdAt).toLocaleTimeString('vi-VN')}</span>
                  </div>
                  {!n.isRead && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-none mt-1.5"></span>}
                </div>
              ))
            )}
          </div>
          {isAdmin && (
            <button 
              onClick={() => { setIsOpen(false); navigate(`/${path.ADMIN}/${path.ADMIN_NOTIFICATIONS}`); }} 
              className="text-[11px] text-blue-600 hover:text-blue-700 font-bold text-center pt-2 border-t w-full block hover:underline"
            >
              Xem tất cả thông báo
            </button>
          )}
        </div>
      )}

      <PostHistoryModal 
        isOpen={showHistoryModal} 
        onClose={() => { setShowHistoryModal(false); setHistoryData([]); }} 
        historyPost={historyPost} 
        historyData={historyData} 
        isAdmin={true}
      />
    </div>
  );
};

export default AdminBellNotification;
