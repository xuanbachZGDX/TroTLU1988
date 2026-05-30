import React, { useEffect, useState } from "react";
import { apiGetKycPending, apiHandleKyc } from "../../../services/adminService";
import Swal from "sweetalert2";
import { RiShieldCheckLine } from "react-icons/ri";
import KycRow from "./Kyc/KycRow";

const AdminManageKyc = () => {
  const [users, setUsers] = useState([]);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const fetchPendingKyc = async () => {
      try {
        const response = await apiGetKycPending();
        if (response?.data.err === 0) {
          setUsers(response.data.response);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách KYC chờ duyệt:", error);
      }
    };
    fetchPendingKyc();
  }, [update]);

  const handleAction = async (userId, action) => {
    const isApprove = action === "approve";
    const title = isApprove
      ? "Phê duyệt xác minh danh tính?"
      : "Từ chối xác minh danh tính?";
    const text = isApprove
      ? "Tài khoản người dùng này sẽ được gắn nhãn Đã xác minh danh tính."
      : "Vui lòng nhập lý do từ chối để thông báo cho người dùng.";
    const confirmButtonColor = isApprove ? "#22c55e" : "#ef4444";

    if (!isApprove) {
      const { value: note } = await Swal.fire({
        title,
        text,
        input: "textarea",
        inputPlaceholder:
          "Ví dụ: Ảnh mặt sau mờ, thông tin số CCCD không khớp...",
        showCancelButton: true,
        confirmButtonText: "Từ chối",
        cancelButtonText: "Hủy",
        confirmButtonColor,
        inputValidator: (value) => !value && "Bạn phải nhập lý do từ chối!",
      });

      if (note) {
        try {
          const res = await apiHandleKyc({ userId, action, note });
          if (res?.data?.err === 0) {
            Swal.fire("Thành công", res.data.msg, "success");
            setUpdate((prev) => !prev);
          } else {
            Swal.fire("Thất bại", res?.data?.msg || "Có lỗi xảy ra", "error");
          }
        } catch {
          Swal.fire("Lỗi", "Không thể xử lý yêu cầu", "error");
        }
      }
    } else {
      Swal.fire({
        title,
        text,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Phê duyệt",
        cancelButtonText: "Hủy",
        confirmButtonColor,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await apiHandleKyc({ userId, action });
            if (res?.data?.err === 0) {
              Swal.fire("Thành công", res.data.msg, "success");
              setUpdate((prev) => !prev);
            } else {
              Swal.fire("Thất bại", res?.data?.msg || "Có lỗi xảy ra", "error");
            }
          } catch {
            Swal.fire("Lỗi", "Không thể xử lý yêu cầu", "error");
          }
        }
      });
    }
  };

  const handlePreviewImages = (item) => {
    Swal.fire({
      title: `<div class="text-left font-bold text-xl border-b pb-3 mb-4 text-blue-600">Kiểm tra CCCD/Hộ chiếu</div>`,
      html: `
        <div class="text-left">
          <div class="mb-3">
            <span class="text-xs text-gray-400 font-bold uppercase">Họ và tên:</span>
            <span class="font-bold text-gray-800 ml-2">${item.name}</span>
          </div>
          <div class="mb-3">
            <span class="text-xs text-gray-400 font-bold uppercase">Số điện thoại:</span>
            <span class="font-bold text-gray-800 ml-2">${item.phone}</span>
          </div>
          <div class="mb-4">
            <span class="text-xs text-gray-400 font-bold uppercase">Số CCCD/Hộ chiếu:</span>
            <span class="font-mono font-bold text-blue-600 ml-2">${item.cccdNumber}</span>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs font-bold text-gray-500 mb-2 text-center">MẶT TRƯỚC</p>
              <a href="${item.cccdFront}" target="_blank">
                <img src="${item.cccdFront}" class="w-full h-40 object-cover rounded-xl border border-gray-200 hover:shadow-lg transition cursor-zoom-in" />
              </a>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-500 mb-2 text-center">MẶT SAU</p>
              <a href="${item.cccdBack}" target="_blank">
                <img src="${item.cccdBack}" class="w-full h-40 object-cover rounded-xl border border-gray-200 hover:shadow-lg transition cursor-zoom-in" />
              </a>
            </div>
          </div>
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
      width: "700px",
      customClass: { popup: "rounded-3xl p-6" },
    });
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6 bg-gray-50/50">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Phê Duyệt KYC Danh Tính
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Xác minh hồ sơ pháp lý (CCCD/Passport) của chủ trọ trước khi cấp huy
            hiệu Xác minh danh tính
          </p>
        </div>
        <div className="bg-green-50 px-4 py-2 rounded-2xl border border-green-100">
          <span className="text-green-600 font-bold text-lg">
            {users.length}
          </span>
          <span className="text-green-400 text-sm ml-2 font-medium">
            chờ duyệt
          </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                Chủ trọ
              </th>
              <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                Số CCCD/Hộ chiếu
              </th>
              <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
                Hình ảnh hồ sơ
              </th>
              <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
                Thời gian gửi
              </th>
              <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((item) => (
              <KycRow
                key={item.id}
                item={item}
                handlePreviewImages={handlePreviewImages}
                handleAction={handleAction}
              />
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-20 text-center text-gray-400"
                >
                  <div className="flex flex-col items-center gap-3">
                    <RiShieldCheckLine
                      size={48}
                      className="opacity-20 text-green-500 animate-bounce"
                    />
                    <span className="font-medium">
                      Tuyệt vời! Không có yêu cầu KYC nào đang chờ duyệt
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminManageKyc;
