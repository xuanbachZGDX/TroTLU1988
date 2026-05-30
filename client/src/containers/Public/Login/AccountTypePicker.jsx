import React from "react";

const AccountTypePicker = ({ value, onChange }) => (
  <div className="flex gap-4">
    <button
      type="button"
      onClick={() => onChange("user")}
      className={`flex-1 flex flex-col items-center justify-center border-2 rounded-xl p-4 transition-all duration-200 hover:scale-[1.02] ${
        value === "user"
          ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md"
          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
      }`}
    >
      <span className="font-bold text-base">Người tìm kiếm</span>
      <span className="text-xs mt-1 text-gray-500">(Người thuê phòng)</span>
    </button>
    <button
      type="button"
      onClick={() => onChange("landlord")}
      className={`flex-1 flex flex-col items-center justify-center border-2 rounded-xl p-4 transition-all duration-200 hover:scale-[1.02] ${
        value === "landlord"
          ? "border-orange-500 bg-orange-50 text-orange-700 shadow-md"
          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
      }`}
    >
      <span className="font-bold text-base">Chủ trọ</span>
      <span className="text-xs mt-1 text-gray-500">(Đăng tin cho thuê)</span>
    </button>
  </div>
);

export default AccountTypePicker;
