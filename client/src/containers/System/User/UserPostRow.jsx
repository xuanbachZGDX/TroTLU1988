import React from 'react';
import { formatDateVN } from "../../../utils/Common/formatDate";
import { checkStatus } from "../../../utils/Common/checkStatus";

const UserPostRow = ({ item, handleEdit, handleExtend, handleDelete, handleRestore }) => {
  let images = [];
  try { images = JSON.parse(item?.images?.image || "[]"); } catch (e) { images = []; }

  const isRejected = item.status === "rejected";
  const isPending = item.status === "pending";
  const isArchived = item.status === "archived";
  const isActive = !isRejected && !isPending && !isArchived && checkStatus(item?.overview?.expired) === "Đang hoạt động";
  
  const statusLabel = isRejected ? "Bị từ chối"
    : isPending ? "Chờ duyệt"
    : isArchived ? "Kho lưu trữ"
    : isActive ? "Đang hoạt động"
    : "Đã hết hạn";

  const statusColor = isRejected ? "text-red-600 bg-red-50 border border-red-200"
    : isPending ? "text-orange-600 bg-orange-50 border border-orange-200"
    : isArchived ? "text-purple-700 bg-purple-50 border border-purple-200 font-bold"
    : isActive ? "text-green-700 bg-green-50 border border-green-200"
    : "text-gray-500 bg-gray-50 border border-gray-200";

  const renderPackage = (bonus) => {
    const baseClass = "whitespace-nowrap inline-block text-center px-2.5 py-1 rounded text-[10px] font-bold uppercase shadow-sm";
    if (!bonus) {
      return <span className={`${baseClass} bg-gray-100 text-gray-500`}>Tin thường</span>;
    }
    const bonusStr = String(bonus);
    if (bonusStr.includes("5")) {
      return <span className={`${baseClass} bg-red-600 text-white animate-pulse`}>VIP Nổi bật</span>;
    }
    if (bonusStr.includes("4")) {
      return <span className={`${baseClass} bg-pink-500 text-white`}>Tin VIP 1</span>;
    }
    if (bonusStr.includes("3")) {
      return <span className={`${baseClass} bg-orange-500 text-white`}>Tin VIP 2</span>;
    }
    if (bonusStr.includes("2")) {
      return <span className={`${baseClass} bg-blue-500 text-white`}>Tin VIP 3</span>;
    }
    return <span className={`${baseClass} bg-gray-100 text-gray-500`}>Tin thường</span>;
  };

  return (
    <>
      {isRejected && (
        <tr className="border-t border-red-100 bg-red-50">
          <td colSpan="9" className="px-4 py-2">
            <div className="flex items-center gap-2 text-red-700 text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <span>
                <strong>Tin bị từ chối.</strong> Lý do: <strong className="underline italic text-red-900">{item.note || "Nội dung hoặc hình ảnh chưa phù hợp"}</strong>. Hãy nhấn <strong>Sửa & Gửi lại</strong> bên dưới để chỉnh sửa và gửi duyệt lại.
              </span>
            </div>
          </td>
        </tr>
      )}
      <tr className={`border-t transition-colors text-xs ${isRejected ? "bg-red-50/50 hover:bg-red-50" : "border-gray-100 hover:bg-gray-50"}`}>
        <td className="px-4 py-4 font-mono text-gray-600">{item?.overview?.code || item?.id?.slice(0, 8)}</td>
        <td className="px-4 py-4"><img className="w-10 h-10 object-cover rounded" src={images[0]} alt="img" /></td>
        <td className="px-4 py-4 max-w-[180px] font-medium line-clamp-1" title={item.title}>{item.title}</td>
        <td className="px-4 py-4">
          {renderPackage(item?.overview?.bonus)}
        </td>
        <td className="px-4 py-4 font-bold text-green-600">{item?.attributes?.price}</td>
        <td className="px-4 py-4">{formatDateVN(item?.overview?.published || item?.createdAt)}</td>
        <td className="px-4 py-4">{isRejected || isArchived ? "—" : formatDateVN(item?.overview?.expired)}</td>
        <td className="px-4 py-4 text-center">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor}`}>{statusLabel}</span>
        </td>
        <td className="px-4 py-4">
          <div className="flex gap-1 justify-center">
            {isArchived ? (
              <button
                onClick={() => handleRestore(item)}
                className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg hover:bg-purple-200 text-[10px] font-extrabold transition-all shadow-sm"
              >
                🔄 Khôi phục tin
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-blue-50 text-blue-600 p-1.5 rounded hover:bg-blue-100 text-xs font-medium"
                >
                  {isRejected ? "✏️ Sửa & Gửi lại" : "Sửa"}
                </button>
                {!isRejected && (
                  <button
                    onClick={() => handleExtend(item)}
                    className="bg-green-50 text-green-600 p-1.5 rounded hover:bg-green-100 text-xs font-medium"
                  >
                    Gia hạn
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item)}
                  className="bg-red-50 text-red-600 p-1.5 rounded hover:bg-red-100 text-xs font-medium"
                >
                  {isPending ? "Hủy & Hoàn tiền" : "Xóa"}
                </button>
              </>
            )}
          </div>
        </td>
      </tr>
    </>
  );
};

export default UserPostRow;
