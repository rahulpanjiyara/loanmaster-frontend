import React from "react";
import { Trash2 } from "lucide-react";

export default function MemberInput({
  index,
  memberTitle,
  name,
  spouse,
  dob,
  aadhar,
  mobile,
  maritalStatus,
  category,
  sbAccount,
  handleChange,
  handleDelete,
  nameValue,
  spouseValue,
  dobValue,
  aadharValue,
  mobileValue,
  maritalStatusValue,
  categoryValue,
  sbAccountValue,
}) {
  return (
    <div className="mb-3 p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h6 className="font-bold text-lg">{memberTitle}</h6>

        {index > 9 && (
          <button
            type="button"
            onClick={() => handleDelete(index)}
            className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <input
          type="text"
          name={name}
          value={nameValue}
          placeholder="Name"
          className="input input-bordered w-full"
          onChange={handleChange}
        />

        <input
          type="text"
          name={spouse}
          value={spouseValue}
          placeholder="Spouse/Father"
          className="input input-bordered w-full"
          onChange={handleChange}
        />
        <input
          type={dobValue ? "date" : "text"}
          name={dob}
          value={dobValue}
          className="input input-bordered w-full"
          onChange={handleChange}
          placeholder="Date of Birth"
          onFocus={(e) => (e.target.type = "date")}
          onBlur={(e) => {
            if (!e.target.value) e.target.type = "text";
          }}
        />
        <input
          type="number"
          name={aadhar}
          value={aadharValue}
          placeholder="Aadhar"
          className="input input-bordered w-full"
          onChange={handleChange}
          pattern="\d{12}"
          maxLength="12"
          title="Aadhar must be exactly 12 digits"
          required
        />
        <input
          type="number"
          name={mobile}
          value={mobileValue}
          placeholder="Mobile"
          className="input input-bordered w-full"
          onChange={handleChange}
          pattern="\d{10}"
          maxLength="10"
          title="Mobile must be exactly 10 digits"
          required
        />
        <select
          name={maritalStatus}
          value={maritalStatusValue}
          className={`select select-bordered w-full ${
    maritalStatusValue === "" ? "text-gray-400" : "text-black"
  }`}
          onChange={handleChange}
          required
        >
          <option value="" disabled hidden>
            Select Marital Status
          </option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
          <option value="Separated">Separated</option>
          <option value="Widowed">Widowed</option>
        </select>
        <select
          name={category}
          value={categoryValue}
         className={`select select-bordered w-full ${
    categoryValue === "" ? "text-gray-400" : "text-black"
  }`}
          onChange={handleChange}
          required
        >
          <option value="" disabled hidden>
            Select Category
          </option>
          <option value="General">General</option>
          <option value="OBC">OBC</option>
          <option value="SC">SC</option>
          <option value="ST">ST</option>
          <option value="EWS">EWS</option>
          <option value="Minority">Minority</option>
        </select>

        <input
          type="number"
          name={sbAccount}
          value={sbAccountValue}
          placeholder="SB Account"
          className="input input-bordered w-full"
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
