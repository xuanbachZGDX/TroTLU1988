import React from "react";

const ReportTabs = ({ statusFilter, setStatusFilter, setPage }) => {
  const tabs = [
    { value: "pending", label: "Đang chờ xử lý" },
    { value: "resolved", label: "Đã xử lý (Đã khóa bài)" },
    { value: "rejected", label: "Đã từ chối báo cáo" },
  ];

  return (
    <div className="flex border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => {
            setStatusFilter(tab.value);
            setPage(1);
          }}
          className={`py-3 px-6 font-bold text-sm border-b-2 transition-all duration-200 ${
            statusFilter === tab.value
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ReportTabs;
