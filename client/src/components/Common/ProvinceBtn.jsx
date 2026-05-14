import React, { memo } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { path } from "../../utils/constant";

const ProvinceBtn = ({ name, image, code }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate({
      pathname: `/${path.SEARCH}`,
      search: createSearchParams({ provinceCode: code }).toString(),
    });
  };

  return (
    <div 
      onClick={handleNavigate}
      className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 w-[220px] h-[140px]"
    >
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-blue-900/80 transition-colors duration-500" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
        <span className="text-white font-bold text-sm uppercase tracking-wider group-hover:text-blue-200 transition-colors">
          {name}
        </span>
      </div>
    </div>
  );
};

export default memo(ProvinceBtn);
