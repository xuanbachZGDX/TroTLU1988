import React from "react";
import moment from "moment";
import { RiShieldCheckLine } from "react-icons/ri";

const KycPending = ({ currentData }) => {
  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-6">
        <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 animate-pulse">
          <RiShieldCheckLine size={48} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Đang Chờ Phê Duyệt
          </h1>
          <p className="text-gray-500 mt-2">
            Yêu cầu xác minh danh tính của bạn đang được Ban quản trị xem xét.
            Quá trình này thường mất từ 12-24 giờ.
          </p>
        </div>
        <div className="w-full border-t border-gray-100 pt-6 flex flex-col gap-4 text-left text-sm">
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Số CCCD/Hộ chiếu gửi duyệt:</span>
            <span className="font-mono font-semibold text-gray-700">
              {currentData.cccdNumber}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Ngày gửi yêu cầu:</span>
            <span className="text-gray-700">
              {moment(currentData.updatedAt).format("DD/MM/YYYY HH:mm")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KycPending;
