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
  const [filters, setFilters] = useState({
    search: "",
    role: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    role: "",
  });

  useEffect(() => {
    dispatch(
      actions.getAdminUsers({
        page,
        ...appliedFilters,
      }),
    );
  }, [dispatch, page, appliedFilters]);

  const totalPages = Math.max(1, Math.ceil((userCount || 0) / 10));

  const handleToggleStatus = async (userId, currentStatus, role) => {
    if (role === "admin") {
      Swal.fire("Lỗi", "Không thể khóa tài khoản Quản trị viên!", "error");
      return;
    }

    const newStatus = currentStatus === "active" ? "blocked" : "active";
    const actionText = newStatus === "blocked" ? "khóa" : "mở khóa";

    const result = await Swal.fire({
      title: `Xác nhận ${actionText}?`,
      text: `Bạn có chắc chắn muốn ${actionText} tài khoản này không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Đồng ý ${actionText}`,
      cancelButtonText: "Hủy"
    });

    if (result.isConfirmed) {
      try {
        const response = await apiUpdateUserStatus(userId, newStatus);
        if (response?.data?.err === 0) {
          Swal.fire("Thành công!", response.data.msg, "success");
          dispatch(actions.getAdminUsers({ page, ...appliedFilters }));
        } else {
          Swal.fire("Lỗi!", response?.data?.msg || "Có lỗi xảy ra", "error");
        }
      } catch (error) {
        Swal.fire("Lỗi!", "Không thể kết nối đến máy chủ", "error");
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div>
        <h1 className="text-3xl font-semibold text-gray-800">Quản lý người dùng</h1>
        <p className="mt-2 text-sm text-gray-500">
          Xem nhanh thông tin tài khoản và số bài đăng của từng người dùng.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-3">
        <input
          type="text"
          placeholder="Tìm theo tên hoặc số điện thoại"
          className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
          value={filters.search}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, search: event.target.value }))
          }
        />

        <select
          className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
          value={filters.role}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, role: event.target.value }))
          }
        >
          <option value="">Tất cả quyền</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        <button
          type="button"
          onClick={() => {
            setPage(1);
            setAppliedFilters(filters);
          }}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
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
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                    Chưa có người dùng phù hợp.
                  </td>
                </tr>
              ) : (
                users.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {item.phone || "Không có số điện thoại"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium uppercase text-blue-700">
                        {item.role || "user"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{item.postCount || 0}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatDateVN(item.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      {item.status === "blocked" ? (
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 border border-red-200">
                          Bị khóa
                        </span>
                      ) : (
                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 border border-green-200">
                          Hoạt động
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleStatus(item.id, item.status || "active", item.role)}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium text-white transition-colors ${
                          item.status === "blocked"
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
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
