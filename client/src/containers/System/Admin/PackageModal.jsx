import React, { useEffect, useState } from "react";
import { apiUpdatePackage } from "../../../services";
import Swal from "sweetalert2";

const PackageModal = ({ isOpen, onClose, editingPackage, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    color: "",
    benefit: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingPackage) {
      setFormData({
        name: editingPackage.name || "",
        price: String(editingPackage.price || ""),
        color: editingPackage.color || "",
        benefit: editingPackage.benefit || "",
      });
    }
  }, [editingPackage, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price.trim()) {
      Swal.fire("Lỗi", "Tên và đơn giá không được để trống", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await apiUpdatePackage(editingPackage.id, formData);
      if (response?.data?.err === 0) {
        Swal.fire(
          "Thành công!",
          "Đã cập nhật gói dịch vụ thành công!",
          "success",
        );
        onSuccess();
        onClose();
      } else {
        Swal.fire("Lỗi", response?.data?.msg || "Có lỗi xảy ra", "error");
      }
    } catch (error) {
      Swal.fire("Lỗi", "Không thể lưu thông tin cấu hình", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Cập nhật cấu hình: {editingPackage?.name}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Tên gói dịch vụ *
            </label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Tin VIP Nổi Bật..."
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Đơn giá áp dụng (VND / Ngày) *
            </label>
            <input
              type="number"
              required
              min="0"
              placeholder="Ví dụ: 10000"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, price: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 text-sm font-bold text-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Lớp màu CSS cho Text / Badge
            </label>
            <input
              type="text"
              placeholder="Ví dụ: text-red-600, text-pink-600..."
              value={formData.color}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, color: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Quyền lợi hiển thị của gói
            </label>
            <textarea
              placeholder="Mô tả các quyền lợi VIP..."
              value={formData.benefit}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, benefit: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 text-sm h-24 resize-none"
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
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PackageModal;
