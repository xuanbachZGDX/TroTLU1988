import React, { memo } from "react";

const Select = ({
  label,
  options,
  value,
  setValue,
  type,
  name,
  invalidFields,
  setInvalidFields,
}) => {
  const handleTextError = () => {
    let nameInvalid = invalidFields?.find((item) => item.name === name);
    let addressInvalid = invalidFields?.find((item) => item.name === "address");

    return (
      `${nameInvalid ? nameInvalid.message : ""}` ||
      `${addressInvalid ? addressInvalid.message : ""}`
    );
  };

  return (
    <div className="flex flex-col gap-2 w-full flex-1">
      <label className="font-medium">{label}</label>
      <select
        value={value || ""}
        onChange={(e) => {
          const selectedValue = e.target.value;
          console.log(`Selected ${type}:`, selectedValue);
          !name
            ? setValue(selectedValue)
            : setValue((prev) => ({ ...prev, [name]: selectedValue }));
        }}
        className="border border-gray-300 p-2 rounded-md w-full outline-none cursor-pointer"
        onFocus={() => setInvalidFields([])}
      >
        <option value="">-- Chọn {label} --</option>
        {options?.map((item) => (
          <option key={item.code} value={item.code}>
            {item.value || item.name}
          </option>
        ))}
      </select>
      <small className="text-red-500">{handleTextError()}</small>
    </div>
  );
};

export default memo(Select);
