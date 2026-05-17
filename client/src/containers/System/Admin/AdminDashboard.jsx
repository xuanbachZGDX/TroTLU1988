import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../store/actions";
import { apiGetAdminSettings, apiUpdateAdminSettings } from "../../../services";
import Swal from "sweetalert2";
import DashboardCharts from "./DashboardCharts";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state.admin);
  const [autoApprove, setAutoApprove] = useState(false);
  const [loadingSetting, setLoadingSetting] = useState(false);
  const [statPeriod, setStatPeriod] = useState("6months"); // "6months" hoặc "1year"

  useEffect(() => {
    dispatch(actions.getAdminDashboard());
    const fetchSettings = async () => {
      const res = await apiGetAdminSettings();
      if (res?.data?.err === 0) {
        setAutoApprove(res.data.data?.autoApprove || false);
      }
    };
    fetchSettings();
  }, [dispatch]);

  const handleToggleAutoApprove = async () => {
    setLoadingSetting(true);
    const newValue = !autoApprove;
    const res = await apiUpdateAdminSettings({ autoApprove: newValue });
    setLoadingSetting(false);
    if (res?.data?.err === 0) {
      setAutoApprove(newValue);
      Swal.fire({
        title: "Thành công!",
        text: res?.data?.msg || (newValue
          ? "Đã kích hoạt chế độ Tự động duyệt tin đăng tức thì!"
          : "Đã chuyển về chế độ Phê duyệt tin đăng thủ công."),
        icon: "success",
        timer: 4000,
        showConfirmButton: true,
        confirmButtonColor: "#3b82f6",
      });
    } else {
      Swal.fire("Lỗi!", "Không thể cập nhật cấu hình hệ thống.", "error");
    }
  };

  // Hàm nhóm dữ liệu và chuẩn bị vẽ biểu đồ
  const getMonthsArray = () => {
    const list = [];
    const count = statPeriod === "6months" ? 6 : 12;
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      list.push({ month: d.getMonth() + 1, year: d.getFullYear(), label: `Thg ${d.getMonth() + 1}` });
    }
    return list;
  };

  const months = getMonthsArray();

  // Trích xuất doanh thu theo tháng
  const chartData = months.map(m => {
    const revObj = dashboard?.monthlyRevenue?.find(r => +r.month === m.month && +r.year === m.year);
    const postObj = dashboard?.monthlyPosts?.find(p => +p.month === m.month && +p.year === m.year);
    const userObj = dashboard?.monthlyUsers?.find(u => +u.month === m.month && +u.year === m.year);
    return {
      ...m,
      revenue: revObj ? +revObj.revenue : 0,
      posts: postObj ? +postObj.count : 0,
      users: userObj ? +userObj.count : 0
    };
  });



  const statsConfig = [
    { key: "totalPosts", label: "Tổng bài đăng", color: "text-blue-600 bg-blue-50 border-blue-100", icon: "📝" },
    { key: "activePosts", label: "Bài đang hoạt động", color: "text-green-700 bg-green-50 border-green-100", icon: "⚡" },
    { key: "expiredPosts", label: "Bài đã hết hạn", color: "text-red-600 bg-red-50 border-red-100", icon: "🛑" },
    { key: "totalUsers", label: "Tổng người dùng", color: "text-violet-600 bg-violet-50 border-violet-100", icon: "👥" },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-[1200px] mx-auto pb-10">
      {/* Header & Auto Moderation Switch */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">📊 Bảng điều khiển quản trị</h1>
          <p className="text-xs text-gray-500 mt-1">Hệ thống phân tích tài chính và quản trị tin thuê tự động.</p>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
          <span className="text-xs font-semibold text-gray-700">🤖 Chế độ duyệt bài tự động:</span>
          <button
            disabled={loadingSetting}
            onClick={handleToggleAutoApprove}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${autoApprove ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoApprove ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${autoApprove ? 'bg-green-100 text-green-700 animate-pulse' : 'bg-gray-200 text-gray-600'}`}>
            {autoApprove ? 'BẬT' : 'TẮT'}
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map((item) => (
          <div key={item.key} className={`rounded-2xl border p-5 shadow-sm bg-white hover:scale-[1.02] hover:shadow-md transition-all flex items-center justify-between`}>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{item.label}</p>
              <p className="mt-2 text-2xl font-black text-gray-800">{dashboard?.[item.key] || 0}</p>
            </div>
            <span className={`text-2xl p-3 rounded-xl border ${item.color}`}>{item.icon}</span>
          </div>
        ))}
      </div>

      {/* Dynamic Revenue Card */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 text-white shadow-lg flex items-center justify-between transition-all hover:scale-[1.01]">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-amber-100">Tổng doanh thu hệ thống</p>
          <p className="text-3xl font-black mt-2">
            {(dashboard?.totalRevenue || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </p>
        </div>
        <span className="text-4xl opacity-80">💰</span>
      </div>

      {/* Period Filter for Charts */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <span className="text-sm font-bold text-gray-800">📈 Biểu đồ thống kê chi tiết</span>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setStatPeriod("6months")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${statPeriod === "6months" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
          >
            6 Tháng gần nhất
          </button>
          <button
            onClick={() => setStatPeriod("1year")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${statPeriod === "1year" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
          >
            Cả năm
          </button>
        </div>
      </div>

      {/* Biểu đồ Phân tích Trực quan */}
      <DashboardCharts chartData={chartData} />
    </div>
  );
};

export default AdminDashboard;
