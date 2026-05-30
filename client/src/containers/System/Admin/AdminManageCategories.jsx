import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as actions from "../../../store/actions";
import { apiGetAllCategories, apiDeleteCategory } from "../../../services";
import CategoryModal from "./CategoryModal";
import Swal from "sweetalert2";

const AdminManageCategories = () => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await apiGetAllCategories();
      if (response?.data?.err === 0) {
        setCategories(response?.data?.response || []);
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Lỗi", "Không thể lấy danh sách danh mục", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (category) => {
    const confirm = await Swal.fire({
      title: `Xóa danh mục "${category.value}"?`,
      text: "Các bài đăng thuộc danh mục này phải được chuyển sang danh mục khác trước khi xóa.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#ef4444",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await apiDeleteCategory(category.id);
      if (response?.data?.err === 0) {
        Swal.fire("Thành công", "Đã xóa danh mục thành công!", "success");
        dispatch(actions.getAllCategories(true));
        fetchCategories();
      } else {
        Swal.fire(
          "Lỗi",
          response?.data?.msg || "Không thể xóa danh mục",
          "error",
        );
      }
    } catch (error) {
      Swal.fire("Lỗi", "Lỗi máy chủ", "error");
    }
  };

  const handleModalSuccess = () => {
    dispatch(actions.getAllCategories(true));
    fetchCategories();
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            Quản lý danh mục
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Thêm, sửa, hoặc xóa các danh mục phòng trọ hiển thị ngoài trang chủ.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="mt-4 md:mt-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
        >
          + Thêm danh mục mới
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left w-20">Thứ tự</th>
                <th className="px-4 py-3 text-left w-32">Mã Code</th>
                <th className="px-4 py-3 text-left">Tên danh mục</th>
                <th className="px-4 py-3 text-left">Tiêu đề SEO</th>
                <th className="px-4 py-3 text-left">Mô tả chi tiết</th>
                <th className="px-4 py-3 text-center w-40">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    Chưa có danh mục nào.
                  </td>
                </tr>
              ) : (
                categories.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      {item.order || 0}
                    </td>
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                      {item.code}
                    </td>
                    <td className="px-4 py-3 font-medium text-blue-700">
                      {item.value}
                    </td>
                    <td className="px-4 py-3 text-gray-700 font-medium max-w-xs truncate">
                      {item.header || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-sm truncate">
                      {item.description || "—"}
                    </td>
                    <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="rounded bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="rounded bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingCategory={editingCategory}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default AdminManageCategories;
