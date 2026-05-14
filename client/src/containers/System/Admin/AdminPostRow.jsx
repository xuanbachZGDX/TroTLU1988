import React from 'react';
import { checkStatus } from "../../../utils/Common/checkStatus";
import { formatDateVN } from "../../../utils/Common/formatDate";
import { formatVietnameseToString } from "../../../utils/Common/formatVietnameseToString";
import { path } from "../../../utils/constant";

const AdminPostRow = ({ item, handleApprove, handleReject, handleDelete }) => {
  let images = [];
  try {
    images = JSON.parse(item?.images?.image || "[]");
  } catch (error) {
    images = [];
  }

  const status = item.status === "pending" ? "Chờ duyệt" : checkStatus(item?.overview?.expired);
  const isActive = status === "Đang hoạt động";
  const isPending = item.status === "pending";
  const createdDate = new Date(item.createdAt);
  const isNew = (new Date() - createdDate) / (1000 * 60 * 60 * 24) <= 3;

  const renderStar = (star) => {
    const s = +star;
    if (s === 5) return <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-[10px] font-bold uppercase whitespace-nowrap">VIP Nổi bật</span>;
    if (s === 4) return <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded text-[10px] font-bold uppercase whitespace-nowrap">Tin VIP 1</span>;
    if (s === 3) return <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-[10px] font-bold uppercase whitespace-nowrap">Tin VIP 2</span>;
    if (s === 2) return <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-[10px] font-bold uppercase whitespace-nowrap">Tin VIP 3</span>;
    return <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold uppercase whitespace-nowrap">Tin thường</span>;
  };

  return (
    <tr className="border-t border-gray-100 align-top hover:bg-gray-50 transition-colors text-xs">
      <td className="px-4 py-4 font-mono text-gray-600">{item?.overview?.code || item.id?.slice(0, 8).toUpperCase()}</td>
      <td className="px-4 py-4">
        <p className="font-bold text-gray-800">{item?.user?.name || "Ẩn danh"}</p>
        <p className="text-[11px] text-gray-500">{item?.user?.phone}</p>
      </td>
      <td className="px-4 py-4 max-w-[300px]">
        <div className="flex gap-2">
          <img src={images[0] || ""} alt="post" className="h-12 w-12 rounded object-cover" />
          <div>
            <p className="font-semibold line-clamp-1 cursor-pointer hover:text-blue-600" onClick={() => window.open(`/${path.DETAIL}/${formatVietnameseToString(item.title)}/${item.id}`, '_blank')}>{item.title}</p>
            <p className="text-[10px] text-gray-400 line-clamp-1 italic">{item.address}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 font-bold text-green-600">{item?.attributes?.price}</td>
      <td className="px-4 py-4">{renderStar(item.star)}</td>
      <td className="px-4 py-4">{formatDateVN(item?.createdAt)}</td>
      <td className="px-4 py-4">
        {(() => {
          const expiredStr = item?.overview?.expired;
          if (expiredStr && !expiredStr.includes(':')) {
            const createdAt = new Date(item.createdAt);
            const h = createdAt.getHours().toString().padStart(2, '0');
            const m = createdAt.getMinutes().toString().padStart(2, '0');
            return formatDateVN(`${h}:${m} ${expiredStr}`);
          }
          return formatDateVN(expiredStr);
        })()}
      </td>
      <td className="px-4 py-4 text-center">
        <div className="flex flex-col items-center">
          <span className={`font-medium ${isActive ? "text-gray-800" : isPending ? "text-orange-600 font-bold" : "text-red-600 font-bold"}`}>{status}</span>
          {isNew && isActive && <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-full">Mới</span>}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex gap-1 justify-center">
          {isPending && <button onClick={() => handleApprove(item.id)} className="bg-blue-50 text-blue-600 p-1.5 rounded hover:bg-blue-100">Duyệt</button>}
          {isPending && <button onClick={() => handleReject(item.id)} className="bg-orange-50 text-orange-600 p-1.5 rounded hover:bg-orange-100">Từ chối</button>}
          <button onClick={() => handleDelete(item.id)} className="bg-red-50 text-red-600 p-1.5 rounded hover:bg-red-100">Xóa</button>
        </div>
      </td>
    </tr>
  );
};

export default AdminPostRow;
