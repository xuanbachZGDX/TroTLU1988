import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../store/actions";

const statsConfig = [
  { key: "totalPosts", label: "Tổng bài đăng", color: "text-blue-600" },
  { key: "activePosts", label: "Bài đang hoạt động", color: "text-green-600" },
  { key: "expiredPosts", label: "Bài hết hạn", color: "text-red-600" },
  { key: "totalUsers", label: "Tổng người dùng", color: "text-violet-600" },
  { key: "totalRevenue", label: "Tổng doanh thu", color: "text-amber-600", isCurrency: true },
];

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(actions.getAdminDashboard());
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-800">Tổng quan admin</h1>
        <p className="mt-2 text-sm text-gray-500">
          Xem nhanh tình trạng bài đăng và người dùng trên hệ thống.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statsConfig.map((item) => (
          <div
            key={item.key}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className={`mt-3 text-3xl font-bold ${item.color}`}>
              {item.isCurrency 
                ? (dashboard?.[item.key] || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                : (dashboard?.[item.key] || 0)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
