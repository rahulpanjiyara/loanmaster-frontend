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
        <label className="label">
          <span className="label-text text-sm font-semibold text-gray-800">
            {label}
          </span>
        </label>
      )}
      {type === "select" ? (
        <select
          name={name}
          value={value || ""}
          onChange={handleChange}
          className={`select select-bordered w-full ${className}`}
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
          className="input w-full"
          aria-label={placeholder}
          disabled={disabled}
         
        />
      )}
    </div>
  );
}
