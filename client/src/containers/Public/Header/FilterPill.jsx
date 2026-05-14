import React from "react";

const FilterPill = ({ label, active, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all relative ${
      active
        ? "border-[#FF6600] bg-[#FFF5EE] text-[#FF6600] font-bold"
        : "border-gray-200 text-gray-600 hover:border-gray-400 bg-white"
    } min-w-[90px] gap-2`}
  >
    {icon && <span className="text-xl">{icon}</span>}
    <span className="text-[12px]">{label}</span>
    {active && (
      <span className="absolute top-1 right-1 bg-[#FF6600] text-white rounded-full p-0.5">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    )}
  </button>
);

export default FilterPill;
