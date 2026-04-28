import React from "react";

const InputFormV2 = ({
  label,
  unit,
  value,
  setValue,
  name,
  small,
  invalidFields,
  setInvalidFields,
  direction,
  type,
}) => {
  return (
    <div className={`flex ${direction ? direction : "flex-col"}`}>
      <label className="w-48 flex-none" htmlFor={name}>{label}</label>
      <div className="flex flex-auto items-stretch mt-1">
        <input
          type={type || "text"}
          id={name}
          className={`${unit ? "rounded-tl-md rounded-bl-md" : "rounded-md"} outline-none border border-gray-300 p-2 w-full`}
          value={value}
          onChange={(e) =>
            setValue((prev) => ({ ...prev, [name]: e.target.value }))
          }
          onFocus={() =>
            setInvalidFields &&
            setInvalidFields((prev) => prev.filter((i) => i.name !== name))
          }
        />
        {unit && (
          <span className="flex-none flex items-center justify-center bg-gray-200 border border-l-0 border-gray-300 rounded-tr-md rounded-br-md px-4">
            {unit}
          </span>
        )}
      </div>
      {small && (
        <small className="text-gray-500 block mb-1 mt-1">{small}</small>
      )}
      {invalidFields?.some((i) => i.name === name) && (
        <small className="text-red-500 block mt-1">
          {invalidFields.find((i) => i.name === name)?.message}
        </small>
      )}
    </div>
  );
};

export default InputFormV2;
