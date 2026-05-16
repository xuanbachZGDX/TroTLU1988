import React, { useEffect, useState } from "react";
import { apiGetAdminContacts, apiDeleteAdminContact, apiReplyAdminContact } from "../../../services/adminService";
import Swal from "sweetalert2";
import moment from "moment";
import { ImBin } from "react-icons/im";
import { RiMessage2Line } from "react-icons/ri";

const AdminManageContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      const response = await apiGetAdminContacts();
      if (response?.data.err === 0) {
        setContacts(response.data.response);
      }
    };
    fetchContacts();
  }, [update]);

  const handleDelete = async (contactId) => {
    Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc chắn muốn xóa tin nhắn này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await apiDeleteAdminContact(contactId);
        if (response?.data.err === 0) {
          Swal.fire("Đã xóa!", "Tin nhắn đã được xóa thành công.", "success");
          setUpdate((prev) => !prev);
        } else {
          Swal.fire("Lỗi!", "Không thể xóa tin nhắn.", "error");
        }
      }
    });
  };

  const handleViewDetail = (item) => {
    Swal.fire({
      title: `<div class="text-left font-bold text-xl border-b pb-3 mb-4">Chi tiết tin nhắn</div>`,
      html: `
        <div class="text-left">
          <div class="mb-4">
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Khách hàng</p>
            <p class="text-gray-800 font-bold">${item.name} - <span class="text-blue-600">${item.phone}</span></p>
          </div>
          <div class="mb-4">
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Thời gian gửi</p>
            <p class="text-gray-600">${moment(item.createdAt).format("DD/MM/YYYY HH:mm:ss")}</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nội dung mô tả</p>
            <p class="text-gray-700 leading-relaxed whitespace-pre-wrap italic">"${item.content}"</p>
          </div>
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
      width: '600px',
      customClass: {
        container: 'rounded-3xl',
        popup: 'rounded-3xl p-6',
      }
    });
  };

  const handleReply = async (contactId) => {
    const { value: text } = await Swal.fire({
      title: "Phản hồi khách hàng",
      input: "textarea",
      inputLabel: "Nội dung phản hồi",
      inputPlaceholder: "Nhập nội dung phản hồi tại đây...",
      inputAttributes: {
        "aria-label": "Nhập nội dung phản hồi",
      },
      showCancelButton: true,
      confirmButtonText: "Gửi phản hồi",
      cancelButtonText: "Hủy",
      inputValidator: (value) => {
        if (!value) {
          return "Bạn cần nhập nội dung phản hồi!";
        }
      },
    });

    if (text) {
      try {
        const response = await apiReplyAdminContact(contactId, text);
        if (response?.data.err === 0) {
          await Swal.fire("Thành công!", "Đã gửi phản hồi đến khách hàng.", "success");
          setUpdate((prev) => !prev);
        } else {
          Swal.fire("Thất bại!", response?.data.msg || "Có lỗi xảy ra, vui lòng thử lại.", "error");
        }
      } catch (error) {
        console.error("Lỗi khi phản hồi:", error);
        Swal.fire("Lỗi!", "Không thể kết nối đến máy chủ hoặc có lỗi xảy ra.", "error");
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6 bg-gray-50/50">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Quản lý Liên hệ</h1>
          <p className="text-gray-500 text-sm mt-1">Xem và quản lý các tin nhắn từ khách hàng</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
          <span className="text-blue-600 font-bold text-lg">{contacts.length}</span>
          <span className="text-blue-400 text-sm ml-2 font-medium">tin nhắn</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Khách hàng</th>
              <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Nội dung & Phản hồi</th>
              <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Trạng thái</th>
              <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Thời gian</th>
              <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {contacts.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-700 text-sm">{item.name}</span>
                    <span className="text-xs text-blue-500 font-medium mt-1">{item.phone}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-2 max-w-md">
                    <div 
                      onClick={() => handleViewDetail(item)}
                      className="group cursor-pointer"
                    >
                      <p className="text-sm text-gray-600 leading-relaxed italic line-clamp-2 group-hover:text-blue-600 transition-colors">
                        "{item.content}"
                      </p>
                      <span className="text-[10px] text-blue-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">Nhấn để xem chi tiết</span>
                    </div>
                    {item.response && (
                      <div className="bg-green-50 p-2 rounded-lg border border-green-100">
                        <p className="text-[11px] font-bold text-green-600 uppercase mb-1">Phản hồi của Admin:</p>
                        <p className="text-xs text-gray-700 line-clamp-2">{item.response}</p>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${item.status === 'replied' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                    {item.status === 'replied' ? 'Đã phản hồi' : 'Đang chờ'}
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="text-xs font-medium text-gray-400">
                    {moment(item.createdAt).format("DD/MM/YYYY HH:mm")}
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleReply(item.id)}
                      className="p-2.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                      title="Phản hồi khách hàng"
                    >
                      <RiMessage2Line size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                      title="Xóa tin nhắn"
                    >
                      <ImBin size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {contacts.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-20 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-3">
                    <RiMessage2Line size={48} className="opacity-20" />
                    <span className="font-medium">Chưa có tin nhắn liên hệ nào</span>
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

export default AdminManageContacts;
