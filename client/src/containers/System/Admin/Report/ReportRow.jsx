import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { RiExternalLinkLine, RiCheckLine, RiCloseLine } from "react-icons/ri";

const ReportRow = ({ item, handleViewDetail, handleAction }) => {
  return (
    <tr className="hover:bg-gray-50/50 transition-colors duration-150">
      <td className="px-6 py-5">
        <div className="flex flex-col">
          <span className="font-bold text-gray-700 text-sm">
            {item.reporter?.name || "Khách vãng lai"}
          </span>
          <span className="text-xs text-blue-500 font-medium mt-1">
            {item.reporter?.phone || "N/A"}
          </span>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex flex-col max-w-xs">
          {item.post ? (
            <>
              <Link
                to={`/chi-tiet/post/${item.post.id}`}
                target="_blank"
                className="font-bold text-gray-700 hover:text-blue-600 transition-colors text-sm line-clamp-1 flex items-center gap-1"
              >
                {item.post.title}
                <RiExternalLinkLine className="inline-block" size={14} />
              </Link>
              <span className="text-[10px] text-gray-400 font-mono mt-1">
                ID: #{item.post.id.slice(0, 8).toUpperCase()}
              </span>
              <span className="text-xs mt-1">
                Chủ trọ:{" "}
                <span className="font-medium text-gray-600">
                  {item.post.user?.name || "N/A"} ({item.post.user?.phone})
                </span>
              </span>
            </>
          ) : (
            <span className="text-sm text-red-500 italic">
              Bài viết đã bị xóa khỏi hệ thống
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex flex-col gap-1 max-w-md">
          <div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-600">
              {item.reason}
            </span>
          </div>
          <div
            onClick={() => handleViewDetail(item)}
            className="cursor-pointer group mt-1"
          >
            <p className="text-xs text-gray-600 leading-relaxed italic line-clamp-2 group-hover:text-blue-600">
              "{item.content || "Không có chi tiết"}"
            </p>
            <span className="text-[9px] text-blue-400 font-bold opacity-0 group-hover:opacity-100 uppercase tracking-tighter">
              Nhấn xem chi tiết
            </span>
          </div>
        </div>
      </td>
      <td className="px-6 py-5 text-center">
        <span className="text-xs font-medium text-gray-400">
          {moment(item.createdAt).format("DD/MM/YYYY HH:mm")}
        </span>
      </td>
      <td className="px-6 py-5 text-center">
        {item.status === "pending" ? (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handleAction(item.id, "resolve")}
              className="p-2 text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-all duration-200 flex items-center gap-1 text-xs font-bold px-3 py-1.5"
              title="Khóa bài đăng vi phạm"
            >
              <RiCheckLine size={16} /> Duyệt & Khóa
            </button>
            <button
              onClick={() => handleAction(item.id, "reject")}
              className="p-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 flex items-center gap-1 text-xs font-bold px-3 py-1.5"
              title="Từ chối báo cáo"
            >
              <RiCloseLine size={16} /> Từ chối
            </button>
          </div>
        ) : (
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
              item.status === "resolved"
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {item.status === "resolved" ? "Đã khóa bài" : "Đã bác bỏ"}
          </span>
        )}
      </td>
    </tr>
  );
};

export default ReportRow;
