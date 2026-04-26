import React from "react";

const InputReadOnly = ({ label, value }) => {
  return (
    <div>
      <div className="flex flex-col gap-2">
        <label className="font-medium" htmlFor="exact-address">
          {label}
        </label>
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
