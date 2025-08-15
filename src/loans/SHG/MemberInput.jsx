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
          type="date"
          name={dob}
          value={dobValue}
          className="input input-bordered w-full"
          onChange={handleChange}
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
          className="select select-bordered w-full"
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select Marital Status
          </option>
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="divorced">Divorced</option>
          <option value="seperated">Separated</option>
          <option value="widowed">Widowed</option>
        </select>
        <select
          name={category}
          value={categoryValue}
          className="select select-bordered w-full"
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select Category
          </option>
          <option value="general">General</option>
          <option value="obc">OBC</option>
          <option value="sc">SC</option>
          <option value="st">ST</option>
          <option value="ews">EWS</option>
          <option value="minority">Minority</option>
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
