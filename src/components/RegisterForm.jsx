import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../services/userService";

const RegisterForm = () => {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    brName: "",
    brPlace: "",
    brCode: "",
    brAbm: "",
    brManager: "",
    BMDesignation: "",
  });

  const navigate = useNavigate();

  // ✅ React Query mutation
  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Registration successful!");
        navigate("/login");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Registration failed");
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-3xl shadow-2xl bg-base-100">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center mb-6">
            Create Account
          </h1>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {/* Name */}
            <div className="form-control">
              <label className="label">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Mobile */}
            <div className="form-control">
              <label className="label">Mobile</label>
              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Branch Name */}
            <div className="form-control">
              <label className="label">Branch Name</label>
              <input
                name="brName"
                value={form.brName}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            {/* Branch Place */}
            <div className="form-control">
              <label className="label">Branch Place</label>
              <input
                name="brPlace"
                value={form.brPlace}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            {/* Branch Code */}
            <div className="form-control">
              <label className="label">Branch Code</label>
              <input
                name="brCode"
                value={form.brCode}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            {/* Branch ABM */}
            <div className="form-control">
              <label className="label">Branch ABM</label>
              <input
                name="brAbm"
                value={form.brAbm}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            {/* Branch Manager */}
            <div className="form-control">
              <label className="label">Branch Manager</label>
              <input
                name="brManager"
                value={form.brManager}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            {/* BM Designation */}
            <div className="form-control">
              <label className="label">BM Designation</label>
              <select
                name="BMDesignation"
                value={form.BMDesignation}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">Select Designation</option>
                <option value="Branch Manager">Branch Manager - Scale I</option>
                <option value="Manager">Manager - Scale II</option>
                <option value="Sr. Manager">Sr. Manager - Scale III</option>
                <option value="Chief Manager">Chief Manager - Scale IV</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="form-control sm:col-span-2 mt-4">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </form>

          {/* Link to Login */}
          <p className="mt-6 text-center text-sm">
            Already registered?{" "}
            <Link to="/login" className="link link-primary">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
