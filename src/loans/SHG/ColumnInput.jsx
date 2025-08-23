import React from "react";

export default function ColumnInput({
  type,
  placeholder,
  name,
  value,
  options,
  handleChange,
  className = "",
  label = null,
  disabled = false,
}) {
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label py-1">
          <span className="label-text text-xs font-medium text-gray-700">
            {label}
          </span>
        </label>
      )}

      {type === "select" ? (
        <select
          name={name}
          value={value || ""}
          onChange={handleChange}
          className={`select select-bordered select-sm w-full ${className}`}
          aria-label={placeholder}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={handleChange}
          className={`input input-bordered input-sm w-full ${className}`}
          aria-label={placeholder}
          //placeholder={placeholder}
          disabled={disabled}
        />
      )}
    </div>
  );
}
