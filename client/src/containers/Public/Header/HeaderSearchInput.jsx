import React from "react";
import icons from "../../../utils/icons";

const { FiSearch, RiCrop2Line } = icons;

const HeaderSearchInput = ({ selProvince, provinces, cleanName, setIsFilterOpen }) => {
  return (
    <div className="flex-1 max-w-[500px] flex items-center bg-gray-100 rounded-full border border-gray-200 overflow-hidden group focus-within:border-blue-400 focus-within:bg-white transition-all">
      <div className="flex items-center px-4 gap-2 flex-1">
        <FiSearch className="text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Tìm theo khu vực" 
          className="bg-transparent border-none outline-none text-sm w-full py-2.5 text-gray-700"
          value={selProvince ? cleanName(provinces?.find(p => p.code == selProvince)?.value) : ""}
          readOnly
          onClick={() => setIsFilterOpen(true)}
        />
      </div>
      <button 
        onClick={() => setIsFilterOpen(true)}
        className="flex items-center gap-2 px-6 py-2.5 bg-white border-l border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <RiCrop2Line size={18} />
        <span>Bộ lọc</span>
      </button>
    </div>
  );
};

export default HeaderSearchInput;
