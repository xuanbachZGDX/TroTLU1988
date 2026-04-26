import React from "react";

const InputFormV2 = ({ label, unit, value, setValue, name, small }) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <div className="flex items-center">
        <input
          type="text"
          id={name}
          className={`${unit ? "rounded-tl-md rounded-bl-md" : "rounded-md"} flex-auto outline-none border border-gray-300 p-2 w-full`}
          value={value}
          onChange={(e) => setValue(prev => ({ ...prev, [name]: e.target.value }))}
        />
        {unit && (
          <span className="flex-none flex items-center justify-center w-16 p-2 border bg-gray-200 rounded-tr-md rounded-br-md">
            {unit}
          </span>
        )}
      </div>
      {small && <small className="text-gray-500">{small}</small>}
    </div>
  );
};

export default InputFormV2;
