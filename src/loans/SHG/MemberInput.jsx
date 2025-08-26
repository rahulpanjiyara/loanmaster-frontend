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
    <div className="mb-2 p-3 border rounded-md bg-white shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h6 className="font-bold text-base">{memberTitle}</h6>

        {index > 9 && (
          <button
            type="button"
            onClick={() => handleDelete(index)}
            className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Name */}
        <label className="form-control w-full floating-label">
          <span className="label-text text-sm ">Name</span>
          <input
            type="text"
            placeholder="Name"
            name={name}
            value={nameValue}
            className="input   w-full"
            onChange={handleChange}
          />
        </label>

        {/* Spouse/Father */}
        <label className="form-control w-full floating-label">
          <span className="label-text text-sm">Spouse / Father</span>
          <input
            type="text"
            placeholder="Spouse/Father"
            name={spouse}
            value={spouseValue}
            className="input   w-full"
            onChange={handleChange}
          />
        </label>

        {/* DOB */}
        <label className="form-control w-full input">
          <span className="label label-text text-sm">Date of Birth</span>
          <input
            type="date"
            name={dob}
            value={dobValue}
            //className="input   w-full"
            onChange={handleChange}
          />
        </label>

        {/* Aadhar */}
        <label className="form-control w-full floating-label">
          <span className="label-text text-sm">Aadhar</span>
          <input
            type="number"
            placeholder="Aadhar"
            name={aadhar}
            value={aadharValue}
            className="input   w-full"
            onChange={handleChange}
            pattern="\d{12}"
            maxLength="12"
            title="Aadhar must be exactly 12 digits"
            required
          />
        </label>

        {/* Mobile */}
        <label className="form-control w-full floating-label">
          <span className="label-text text-sm">Mobile</span>
          <input
            type="number"
            placeholder="Mobile"
            name={mobile}
            value={mobileValue}
            className="input   w-full"
            onChange={handleChange}
            pattern="\d{10}"
            maxLength="10"
            title="Mobile must be exactly 10 digits"
            required
          />
        </label>

        {/* Marital Status */}
        <label className="form-control w-full">
          {/* <span className="label label-text text-sm">Marital Status</span> */}
          <select
            name={maritalStatus}
            value={maritalStatusValue}
            className={`select select-bordered  w-full ${
              maritalStatusValue === "" ? "text-gray-400" : "text-black"
            }`}
            onChange={handleChange}
            required
          >
            <option value="" disabled hidden>
              Select Marital Status
            </option>
            <option value="Married">Married</option>
            <option value="Single">Single</option>
            <option value="Widowed">Widowed</option>
            <option value="Divorced">Divorced</option>
            <option value="Separated">Separated</option>
          </select>
        </label>

        {/* Category */}
        <label className="form-control w-full">
          {/* <span className=" label-text text-sm">Category</span> */}
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
        </label>

        {/* SB Account */}
        <label className="form-control w-full floating-label">
          <span className="label-text text-sm">SB Account</span>
          <input
            type="number"
            placeholder="SB Account"
            name={sbAccount}
            value={sbAccountValue}
            className="input  w-full"
            onChange={handleChange}
          />
        </label>
      </div>
    </div>
  );
}
