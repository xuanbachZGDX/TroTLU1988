import React from "react";
import moment from "moment";

const TransactionRow = ({ tx, onOpenInvoice }) => {
  const isPlus = tx.type === "deposit" || tx.type === "refund";

  return (
    <tr className="hover:bg-gray-50/40 transition-colors">
      <td className="px-6 py-4 font-mono font-bold text-xs text-gray-600">
        {tx.id}
        <span className="block text-[10px] text-gray-400 font-normal mt-0.5">
          {moment(tx.createdAt).format("DD/MM/YYYY HH:mm:ss")}
        </span>
      </td>
      <td className="px-6 py-4">
        {tx.user ? (
          <div className="flex items-center gap-2.5">
            <img
              src={tx.user.avatar || "https://picsum.photos/100/100"}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover border border-gray-100"
            />
            <div>
              <span className="block font-semibold text-gray-800">
                {tx.user.name}
              </span>
              <span className="block text-[11px] text-gray-400 font-mono">
                {tx.user.phone}
              </span>
            </div>
          </div>
        ) : (
          <span className="text-gray-400 text-xs italic">
            N/A (Người dùng ẩn danh)
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        {tx.type === "deposit" ? (
          <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-100 rounded-lg text-xs font-bold whitespace-nowrap shadow-sm">
            Nạp tiền
          </span>
        ) : tx.type === "refund" ? (
          <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg text-xs font-bold whitespace-nowrap shadow-sm">
            Hoàn tiền
          </span>
        ) : (
          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-bold whitespace-nowrap shadow-sm">
            Thanh toán
          </span>
        )}
      </td>
      <td
        className="px-6 py-4 text-gray-600 max-w-[200px] truncate"
        title={tx.content}
      >
        {tx.content}
      </td>
      <td
        className={`px-6 py-4 text-right font-bold text-base whitespace-nowrap ${isPlus ? "text-green-600" : "text-red-500"}`}
      >
        {isPlus ? "+" : "-"}
        {(tx.amount || 0).toLocaleString("vi-VN")} đ
      </td>
      <td className="px-6 py-4 text-center">
        {tx.status === "success" ? (
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold whitespace-nowrap shadow-sm">
            Thành công
          </span>
        ) : tx.status === "pending" ? (
          <span className="px-2.5 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg text-xs font-bold whitespace-nowrap shadow-sm animate-pulse">
            Đang chờ
          </span>
        ) : (
          <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold whitespace-nowrap shadow-sm">
            Đã hủy/Lỗi
          </span>
        )}
      </td>
      <td className="px-6 py-4 text-center">
        {tx.status === "success" ? (
          <button
            onClick={() => onOpenInvoice(tx)}
            className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl border border-blue-200 text-xs font-bold shadow-sm transition-all whitespace-nowrap"
          >
            🖨️ Xem Biên lai
          </button>
        ) : (
          <span className="text-gray-300 text-xs">-</span>
        )}
      </td>
    </tr>
  );
};

export default TransactionRow;
