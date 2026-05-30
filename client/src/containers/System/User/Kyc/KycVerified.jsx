import React from "react";
import moment from "moment";
import { RiShieldCheckLine } from "react-icons/ri";

const KycVerified = ({ currentData }) => {
  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-6">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-green-500 shadow-inner">
          <RiShieldCheckLine size={48} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Đã Xác Minh Tài Khoản
          </h1>
          <p className="text-gray-500 mt-2">
            Tài khoản của bạn đã được xác minh danh tính chủ trọ thành công.
          </p>
        </div>
        <div className="w-full border-t border-gray-100 pt-6 flex flex-col gap-4 text-left">
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Số CCCD/Hộ chiếu:</span>
            <span className="font-mono font-bold text-gray-800">
              {currentData.cccdNumber
                ? currentData.cccdNumber.replace(/.(?=.{4})/g, "*")
                : "---"}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Trạng thái:</span>
            <span className="font-bold text-green-600">
              Đã xác minh danh tính ✔
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Thời gian phê duyệt:</span>
            <span className="text-gray-700">
              {moment(currentData.updatedAt).format("DD/MM/YYYY")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KycVerified;
