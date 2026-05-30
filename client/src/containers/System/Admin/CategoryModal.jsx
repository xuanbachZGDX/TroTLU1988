import React, { useEffect, useState } from "react";
import { apiCreateCategory, apiUpdateCategory } from "../../../services";
import Swal from "sweetalert2";

const CategoryModal = ({ isOpen, onClose, editingCategory, onSuccess }) => {
  const [formData, setFormData] = useState({
    value: "",
    header: "",
    description: "",
    order: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        value: editingCategory.value || "",
        header: editingCategory.header || "",
        description: editingCategory.description || "",
        order: String(editingCategory.order || ""),
      });
    } else {
      setFormData({ value: "", header: "", description: "", order: "" });
    }
  }, [editingCategory, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.value.trim()) {
      Swal.fire("Lỗi", "Tên danh mục không được để trống", "error");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (editingCategory) {
        response = await apiUpdateCategory(editingCategory.id, formData);
      } else {
        response = await apiCreateCategory(formData);
      }

      if (response?.data?.err === 0) {
        Swal.fire(
          "Thành công!",
          response?.data?.msg || "Lưu danh mục thành công",
          "success",
        );
        onSuccess();
        onClose();
      } else {
        Swal.fire("Lỗi", response?.data?.msg || "Có lỗi xảy ra", "error");
      }
    } catch (error) {
      Swal.fire("Lỗi", "Không thể lưu thông tin", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {editingCategory ? "Cập nhật danh mục" : "Thêm danh mục mới"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Tên danh mục *
            </label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Phòng trọ, Căn hộ mini..."
              value={formData.value}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, value: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Tiêu đề SEO / Header hiển thị
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Cho thuê phòng trọ giá rẻ, uy tín..."
              value={formData.header}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, header: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Mô tả SEO / Subtitle
            </label>
            <textarea
              placeholder="Mô tả tóm tắt danh mục hiển thị ngoài trang chủ..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 text-sm h-20 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Thứ tự ưu tiên hiển thị
            </label>
            <input
              type="number"
              placeholder="Ví dụ: 1, 2, 3..."
              value={formData.order}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, order: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              {loading
                ? "Đang lưu..."
                : editingCategory
                  ? "Cập nhật"
                  : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
