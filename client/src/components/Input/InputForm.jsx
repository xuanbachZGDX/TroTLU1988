import React, { memo, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const InputForm = ({
  label,
  value,
  setValue,
  keyPayload,
  invalidFields,
  setInvalidFields,
  type,
  onKeyDown,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === "password";

  return (
    <div>
      <label htmlFor={keyPayload} className="text-xs">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          type={
            isPasswordType
              ? showPassword
                ? "text"
                : "password"
              : type || "text"
          }
          id={keyPayload}
          className={`outline-none bg-[#e8f0fe] p-2 rounded-md w-full ${isPasswordType ? "pr-10" : ""}`}
          value={value}
          onChange={(e) =>
            setValue((prev) => ({ ...prev, [keyPayload]: e.target.value }))
          }
          onFocus={() => setInvalidFields && setInvalidFields([])}
          onKeyDown={onKeyDown}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
          </button>
        )}
      </div>
      {invalidFields?.some((i) => i.name === keyPayload) && (
        <small className="text-red-500 italic block mt-1">
          {invalidFields.find((i) => i.name === keyPayload)?.message}
        </small>
      )}
    </div>
  );
};

export default memo(InputForm);
