import React from "react";
import moment from "moment";
import { ImBin } from "react-icons/im";
import { RiMessage2Line } from "react-icons/ri";

const ContactRow = ({ item, handleViewDetail, handleReply, handleDelete }) => {
  return (
    <tr className="hover:bg-gray-50/50 transition-colors duration-150">
      <td className="px-6 py-5">
        <div className="flex flex-col">
          <span className="font-bold text-gray-700 text-sm">{item.name}</span>
          <span className="text-xs text-blue-500 font-medium mt-1">
            {item.phone}
          </span>
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
            <span className="text-[10px] text-blue-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">
              Nhấn để xem chi tiết
            </span>
          </div>
          {item.response && (
            <div className="bg-green-50 p-2 rounded-lg border border-green-100">
              <p className="text-[11px] font-bold text-green-600 uppercase mb-1">
                Phản hồi của Admin:
              </p>
              <p className="text-xs text-gray-700 line-clamp-2">
                {item.response}
              </p>
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-5 text-center">
        {item.status === "replied" ? (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-600">
            Đã phản hồi
          </span>
        ) : (
          <span className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-red-100 text-red-600">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping absolute left-[10px]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 relative"></span>
            Mới / Chưa trả lời
          </span>
        )}
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
  );
};

export default ContactRow;
