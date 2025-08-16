import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/userContext";
import axios from "axios";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { user, token, fetchUserDetails,backendUrl } = useContext(UserContext);
  const [form, setForm] = useState(user || {});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (user) setForm(user);
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setForm(user || {});
    setEditMode(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(backendUrl+`/user/update/${user._id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Profile updated successfully!");
      fetchUserDetails();
      //setEditMode(false);
    } catch (err) {
      toast.error(err.response?.data?.error || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-3xl bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Profile Header */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={`https://ui-avatars.com/api/?name=${
                    form.name || "User"
                  }&background=random`}
                  alt="Profile"
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold">{form.name || "User"}</h2>
            <p className="text-sm text-gray-500">{form.email}</p>
          </div>

          <div className="divider my-4">Profile Details</div>

          {/* Profile Form */}
          <form
            onSubmit={handleSave}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {[
              { label: "Name", name: "name", type: "text" },
              { label: "Mobile", name: "mobile", type: "tel", disabled: true },
              { label: "Email", name: "email", type: "email", colSpan: 2 },
              { label: "Branch Name", name: "brName" },
              { label: "Branch Place", name: "brPlace" },
              { label: "Branch Code", name: "brCode" },
              { label: "Branch ABM", name: "brAbm" },
              { label: "Branch Manager", name: "brManager" },
              // { label: "User Type", name: "userType", disabled: true },
            ].map((field, idx) => (
              <div
                key={idx}
                className={`form-control ${
                  field.colSpan === 2 ? "sm:col-span-2" : ""
                }`}
              >
                <label className="label">
                  <span className="label-text">{field.label}</span>
                </label>
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                  disabled={field.disabled || !editMode}
                  className="input input-bordered w-full"
                />
              </div>
            ))}

             <div className="form-control">
              <label className="label">
                <span className="label-text">BM Designation</span>
              </label>
              <select
                name="BMDesignation"
                value={form.BMDesignation || ""}
                onChange={handleChange}
                disabled={!editMode}
                className="select select-bordered w-full"
              >
                <option value="Branch Manager">Branch Manager - Scale I</option>
                <option value="Manager">Manager - Scale II</option>
                <option value="Sr. Manager">Sr. Manager - Scale III</option>
                <option value="Chief Manager">Chief Manager - Scale IV</option>
              </select>
            </div>

            {/* <div className="form-control ">
              <label className="label">
                <span className="label-text">User Status</span>
              </label>
              <select
                name="userStatus"
                value={form.userStatus || ""}
                onChange={handleChange}
                disabled={!editMode}
                className="select select-bordered w-full"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div> */}

            {/* Buttons */}
            <div className="sm:col-span-2 flex flex-col sm:flex-row justify-end gap-3 mt-4">
              {editMode ? (
                <>
                  <button
                    type="submit"
                    className="btn btn-primary w-full sm:w-auto"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-ghost w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault(); // prevent accidental form submission
                    handleEdit();
                  }}
                  className="btn btn-secondary w-full sm:w-auto"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
