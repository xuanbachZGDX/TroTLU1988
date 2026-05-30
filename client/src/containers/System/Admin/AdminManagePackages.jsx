import React, { useEffect, useState } from "react";
import { apiGetAdminPackages } from "../../../services";
import PackageModal from "./PackageModal";
import Swal from "sweetalert2";

const AdminManagePackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const response = await apiGetAdminPackages();
      if (response?.data?.err === 0) {
        setPackages(response?.data?.response || []);
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Lỗi", "Không thể lấy danh sách gói dịch vụ VIP", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleOpenEditModal = (pkg) => {
    setEditingPackage(pkg);
    setIsModalOpen(true);
  };

  const formatVND = (number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(number);
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div>
        <h1 className="text-3xl font-semibold text-gray-800">
          Cấu hình gói VIP & Bảng giá
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Thay đổi đơn giá và quyền lợi của các gói tin đăng VIP trực tiếp mà
          không cần can thiệp database.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left w-24">Cấp độ VIP</th>
                <th className="px-4 py-3 text-left w-48">Tên gói dịch vụ</th>
                <th className="px-4 py-3 text-left w-36">Đơn giá / Ngày</th>
                <th className="px-4 py-3 text-left w-36">Màu sắc UI</th>
                <th className="px-4 py-3 text-left">Quyền lợi hiển thị</th>
                <th className="px-4 py-3 text-center w-28">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    Đang tải dữ liệu cấu hình...
                  </td>
                </tr>
              ) : packages.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    Chưa có cấu hình gói dịch vụ nào.
                  </td>
                </tr>
              ) : (
                packages.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 align-middle whitespace-nowrap">
                      {item.star > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700 border border-orange-200">
                          <span>{item.star} Sao</span>
                          <span className="text-orange-500 text-[10px] leading-none">
                            ⭐
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded bg-gray-50 px-2.5 py-1 text-xs font-bold text-gray-600 border border-gray-200">
                          Thường
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 align-middle font-semibold text-gray-800">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 align-middle font-bold text-blue-600">
                      {formatVND(item.price)}
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <span
                        className={`inline-flex items-center font-mono text-xs px-2 py-0.5 rounded border border-gray-200 bg-gray-50 ${item.color}`}
                      >
                        {item.color || "text-gray-600"}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-middle text-gray-600 max-w-sm truncate">
                      {item.benefit || "—"}
                    </td>
                    <td className="px-4 py-3 align-middle text-center">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="rounded bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                      >
                        Thiết lập
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PackageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingPackage={editingPackage}
        onSuccess={fetchPackages}
      />
    </div>
  );
};

export default AdminManagePackages;
