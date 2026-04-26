import React, { memo } from "react";

const Select = ({ label, options, value, setValue, type, name }) => {
  return (
    <div className="flex flex-col gap-2 w-full flex-1">
      <label className="font-medium">{label}</label>
      <select
        value={value || ""}
        onChange={(e) =>
          !name
            ? setValue(e.target.value)
            : setValue((prev) => ({ ...prev, [name]: e.target.value }))
        }
        className="border border-gray-300 p-2 rounded-md w-full outline-none"
      >
        <option value="">-- Chọn {label} --</option>
        {options?.map((item) => (
          <option key={item.code} value={item.code}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default memo(Select);
