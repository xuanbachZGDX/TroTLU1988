import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { apiGetAdminNotifications, apiReadAdminNotification, apiGetPostHistory } from "../../../services";
import { PostHistoryModal } from "../../../components";
import userAvatar from "../../../assets/user.png";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [historyPost, setHistoryPost] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await apiGetAdminNotifications();
      if (res?.data?.err === 0) setNotifications(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notif) => {
    if (!notif.isRead) {
      await apiReadAdminNotification(notif.id);
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
    }
  };

  const handleViewChanges = async (notif) => {
    await handleMarkAsRead(notif);
    setHistoryPost({ id: notif.postId, overview: { code: notif.postId?.slice(0, 8).toUpperCase() } });
    
    const response = await apiGetPostHistory(notif.postId);
    if (response?.data?.err === 0) {
      setHistoryData(response.data.data || []);
      setShowHistoryModal(true);
    } else {
      Swal.fire("Không tìm thấy", "Không có dữ liệu lịch sử thay đổi cho tin đăng này.", "info");
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    if (unread.length === 0) return;
    try {
      await Promise.all(unread.map(n => apiReadAdminNotification(n.id)));
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      Swal.fire("Thành công", "Đã đánh dấu tất cả thông báo là đã đọc", "success");
    } catch (err) {
      Swal.fire("Lỗi", "Không thể xử lý", "error");
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-3xl font-semibold">Thông báo hệ thống</h1>
          <p className="text-sm text-gray-500 mt-1">
            Bạn có <span className="text-blue-600 font-bold">{unreadCount}</span> thông báo chưa đọc
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="text-xs bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold hover:bg-blue-100 transition-all">
            Đọc tất cả
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-b-transparent"></div></div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 bg-white border rounded-2xl flex flex-col items-center justify-center gap-3">
          <span className="text-5xl">🔔</span>
          <p className="text-gray-500 font-medium text-sm">Chưa có thông báo nào từ hệ thống.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map(n => (
            <div key={n.id} className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${n.isRead ? "bg-white border-gray-100 hover:bg-gray-50/50" : "bg-blue-50/30 border-blue-100 hover:bg-blue-50/50"}`}>
              <img src={n.sender?.avatar || userAvatar} alt="avatar" className="w-10 h-10 rounded-xl object-cover shadow-sm" />
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-800">{n.title}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{new Date(n.createdAt).toLocaleString('vi-VN')}</span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">{n.content}</p>
                <div className="flex gap-3 mt-2">
                  <button onClick={() => handleViewChanges(n)} className="text-[11px] bg-blue-600 text-white font-bold px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                    Xem thay đổi
                  </button>
                  {!n.isRead && (
                    <button onClick={() => handleMarkAsRead(n)} className="text-[11px] text-gray-500 hover:text-gray-700 font-semibold">
                      Đã đọc
                    </button>
                  )}
                </div>
              </div>
              {!n.isRead && <span className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-none mt-1.5 shadow-sm shadow-blue-200"></span>}
            </div>
          ))}
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

export default AdminNotifications;
