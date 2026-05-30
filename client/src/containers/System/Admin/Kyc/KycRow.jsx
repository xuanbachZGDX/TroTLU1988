import React from "react";
import moment from "moment";
import { RiCheckLine, RiCloseLine } from "react-icons/ri";

const KycRow = ({ item, handlePreviewImages, handleAction }) => {
  return (
    <tr className="hover:bg-gray-50/50 transition-colors duration-150">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <img
            src={
              item.avatar ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
            }
            alt={item.name}
            className="w-10 h-10 rounded-full object-cover border border-gray-100"
          />
          <div className="flex flex-col">
            <span className="font-bold text-gray-700 text-sm">{item.name}</span>
            <span className="text-xs text-blue-500 font-medium mt-0.5">
              {item.phone}
            </span>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <span className="font-mono font-bold text-gray-700 text-sm">
          {item.cccdNumber}
        </span>
      </td>
      <td className="px-6 py-5 text-center">
        <div className="flex justify-center gap-2">
          <img
            src={item.cccdFront}
            alt="Front"
            onClick={() => handlePreviewImages(item)}
            className="w-12 h-8 object-cover rounded border border-gray-200 cursor-pointer hover:scale-105 transition"
          />
          <img
            src={item.cccdBack}
            alt="Back"
            onClick={() => handlePreviewImages(item)}
            className="w-12 h-8 object-cover rounded border border-gray-200 cursor-pointer hover:scale-105 transition"
          />
        </div>
      </td>
      <td className="px-6 py-5 text-center">
        <span className="text-xs font-medium text-gray-400">
          {moment(item.updatedAt).format("DD/MM/YYYY HH:mm")}
        </span>
      </td>
      <td className="px-6 py-5 text-center">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handleAction(item.id, "approve")}
            className="p-2 text-white bg-green-500 hover:bg-green-600 rounded-xl transition-all duration-200 flex items-center gap-1 text-xs font-bold px-3 py-1.5"
            title="Phê duyệt KYC"
          >
            <RiCheckLine size={16} /> Phê duyệt
          </button>
          <button
            onClick={() => handleAction(item.id, "reject")}
            className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all duration-200 flex items-center gap-1 text-xs font-bold px-3 py-1.5"
            title="Từ chối KYC"
          >
            <RiCloseLine size={16} /> Từ chối
          </button>
        </div>
      </td>
    </tr>
  );
};

export default KycRow;
