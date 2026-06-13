import React from "react";

const TransactionFilters = ({ filters, setFilters, onApply, onReset }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end gap-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
      <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Tìm kiếm
        </label>
        <input
          type="text"
          placeholder="Tìm theo Mã GD, Tên hoặc SĐT chủ trọ..."
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm bg-gray-50/30"
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          onKeyDown={(e) => e.key === "Enter" && onApply()}
        />
      </div>

      <div className="flex flex-col gap-1.5 w-full md:w-[180px] shrink-0">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Loại giao dịch
        </label>
        <select
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm bg-gray-50/30"
          value={filters.type}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, type: e.target.value }))
          }
        >
          <option value="">Tất cả loại</option>
          <option value="deposit">Nạp tiền (Deposit)</option>
          <option value="payment">Thanh toán tin (Payment)</option>
          <option value="refund">Hoàn tiền (Refund)</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5 w-full md:w-[180px] shrink-0">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Trạng thái
        </label>
        <select
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm bg-gray-50/30"
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value }))
          }
        >
          <option value="">Tất cả trạng thái</option>
          <option value="success">Thành công</option>
          <option value="pending">Chờ xử lý</option>
          <option value="cancel">Thất bại/Hủy</option>
        </select>
      </div>

      <div className="flex gap-2 w-full md:w-auto shrink-0 justify-end">
        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap"
        >
          Xóa bộ lọc
        </button>
        <button
          type="button"
          onClick={onApply}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-100 whitespace-nowrap"
        >
          Áp dụng
        </button>
      </div>
    </div>
  );
};

export default TransactionFilters;
