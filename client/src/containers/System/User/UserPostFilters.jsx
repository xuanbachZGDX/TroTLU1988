import React from 'react';

const UserPostFilters = ({ filters, setFilters, provinces, districts, handleApplyFilters }) => {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-2 lg:grid-cols-6">
      <input
        type="text"
        placeholder="Tìm tiêu đề/địa chỉ/mã..."
        className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 text-sm"
        value={filters.search}
        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
      />
      <select
        className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 text-sm"
        value={filters.status}
        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
      >
        <option value="">Trạng thái</option>
        <option value="pending">Chờ duyệt</option>
        <option value="active">Đang hoạt động</option>
        <option value="expired">Đã hết hạn</option>
        <option value="rejected">Bị từ chối</option>
        <option value="archived">Kho lưu trữ</option>
      </select>
      <select
        className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 text-sm"
        value={filters.star || ""}
        onChange={(e) => setFilters(prev => ({ ...prev, star: e.target.value }))}
      >
        <option value="">Chọn gói tin</option>
        <option value="5">VIP Nổi bật</option>
        <option value="4">Tin VIP 1</option>
        <option value="3">Tin VIP 2</option>
        <option value="2">Tin VIP 3</option>
        <option value="0">Tin thường</option>
      </select>
      <select
        className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 text-sm"
        value={filters.provinceCode}
        onChange={(e) => setFilters(prev => ({ ...prev, provinceCode: e.target.value, districtCode: "" }))}
      >
        <option value="">Tỉnh/Thành</option>
        {provinces.map(item => <option key={item.code} value={item.code}>{item.value}</option>)}
      </select>
      <select
        className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 text-sm"
        value={filters.districtCode}
        disabled={!filters.provinceCode}
        onChange={(e) => setFilters(prev => ({ ...prev, districtCode: e.target.value }))}
      >
        <option value="">Quận/Huyện</option>
        {districts.map(item => <option key={item.code} value={item.code}>{item.value}</option>)}
      </select>
      <button onClick={handleApplyFilters} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white text-sm hover:bg-blue-700 transition-colors">Lọc</button>
    </div>
  );
};

export default UserPostFilters;
