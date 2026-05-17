import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../store/actions";
import { formatDateVN } from "../../../utils/Common/formatDate";
import { PaginationAdmin } from "../../../components";
import { apiUpdateUserStatus } from "../../../services";
import Swal from "sweetalert2";

const AdminManageUsers = () => {
  const dispatch = useDispatch();
  const { users, userCount } = useSelector((state) => state.admin);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ search: "", role: "", status: "" });
  const [appliedFilters, setAppliedFilters] = useState({ search: "", role: "", status: "" });

  useEffect(() => {
    dispatch(actions.getAdminUsers({ page, ...appliedFilters }));
  }, [dispatch, page, appliedFilters]);

  const totalPages = Math.max(1, Math.ceil((userCount || 0) / 10));

  const handleToggleStatus = async (userId, currentStatus, role) => {
    if (role === "admin") {
      Swal.fire("Lỗi", "Không thể khóa tài khoản Quản trị viên!", "error");
      return;
    }

    const newStatus = currentStatus === "active" ? "blocked" : "active";
    let reason = "";

    if (newStatus === "blocked") {
      const resReason = await Swal.fire({
        title: "Khóa tài khoản này?",
        input: "text",
        inputLabel: "Nhập lý do khóa tài khoản (sẽ gửi qua email cho chủ tài khoản):",
        inputPlaceholder: "Ví dụ: Đăng tin rác lặp lại nhiều lần...",
        inputValidator: (value) => {
          if (!value) return "Bạn phải nhập lý do khóa!";
        },
        showCancelButton: true,
        confirmButtonText: "Khóa tài khoản & Gửi email",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#ef4444"
      });
      if (!resReason.isConfirmed) return;
      reason = resReason.value;
    } else {
      const resApprove = await Swal.fire({
        title: "Mở khóa tài khoản?",
        text: "Người dùng sẽ có thể đăng nhập và đăng tin bình thường.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Mở khóa",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#10b981"
      });
      if (!resApprove.isConfirmed) return;
    }

    try {
      const response = await apiUpdateUserStatus(userId, newStatus, reason);
      if (response?.data?.err === 0) {
        Swal.fire("Thành công!", newStatus === "blocked" ? "Đã khóa tài khoản và gửi email thông báo!" : "Đã mở khóa tài khoản thành công.", "success");
        dispatch(actions.getAdminUsers({ page, ...appliedFilters }));
      } else {
        Swal.fire("Lỗi!", response?.data?.msg || "Có lỗi xảy ra", "error");
      }
    } catch (error) {
      Swal.fire("Lỗi!", "Không thể kết nối đến máy chủ", "error");
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div>
        <h1 className="text-3xl font-semibold text-gray-800">Quản lý người dùng</h1>
        <p className="mt-2 text-sm text-gray-500">Xem nhanh thông tin tài khoản và trạng thái hoạt động của từng người dùng.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-4">
        <input
          type="text"
          placeholder="Tìm theo tên hoặc số điện thoại"
          className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 text-sm"
          value={filters.search}
          onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
        />

        <select
          className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 text-sm"
          value={filters.role}
          onChange={(event) => setFilters((prev) => ({ ...prev, role: event.target.value }))}
        >
          <option value="">Tất cả quyền</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        <select
          className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 text-sm"
          value={filters.status}
          onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="blocked">Bị khóa</option>
        </select>

        <button
          type="button"
          onClick={() => { setPage(1); setAppliedFilters(filters); }}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 text-sm transition-colors"
        >
          Áp dụng bộ lọc
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Họ tên</th>
                <th className="px-4 py-3 text-left">Số điện thoại</th>
                <th className="px-4 py-3 text-left">Quyền</th>
                <th className="px-4 py-3 text-left">Số bài đăng</th>
                <th className="px-4 py-3 text-left">Ngày tạo</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
                <th className="px-4 py-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan="7" className="px-4 py-6 text-center text-gray-500">Chưa có người dùng phù hợp.</td></tr>
              ) : (
                users.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                    <td className="px-4 py-3 text-gray-700">{item.phone || "Không có số điện thoại"}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium uppercase text-blue-700 border border-blue-100">{item.role || "user"}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 font-bold">{item.postCount || 0}</td>
                    <td className="px-4 py-3 text-gray-700">{formatDateVN(item.createdAt)}</td>
                    <td className="px-4 py-3">
                      {item.status === "blocked" ? (
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 border border-red-200">Bị khóa</span>
                      ) : (
                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 border border-green-200">Hoạt động</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleStatus(item.id, item.status || "active", item.role)}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium text-white transition-colors ${
                          item.status === "blocked" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                        } ${item.role === "admin" ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={item.role === "admin"}
                      >
                        {item.status === "blocked" ? "Mở khóa" : "Khóa"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-500 italic">Tổng người dùng: <span className="font-bold text-blue-600">{userCount || 0}</span></p>
        {totalPages > 1 && (
          <PaginationAdmin page={page} setPage={setPage} totalPages={totalPages} />
        )}
      </div>
    </div>
  );
};

export default AdminManageUsers;
