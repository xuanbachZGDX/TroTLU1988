import React from "react";

const InputReadOnly = ({ label, value, direction }) => {
  return (
    <div className={`flex ${direction ? direction : "flex-col gap-2"}`}>
      <label className="w-48 flex-none font-medium" htmlFor="exact-address">
        {label}
      </label>
      <div className="flex flex-auto">
        <input
          id="exact-address"
          value={value || ""}
          type="text"
          readOnly
          className="border border-gray-200 rounded-md bg-gray-100 p-2 w-full outline-none"
        />
      </div>
    </div>
  );
};

export default InputReadOnly;
