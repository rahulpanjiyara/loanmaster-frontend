import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
  });
  const [loading,setLoading] =useState(false);

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Use the environment variable for backend URL

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(backendUrl +
        "/user/register",
        form
      );
      if (response.data.success === true) {
        toast.success(response.data.message || "Registration successful!");
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    }finally{
      setLoading(false);
    }
      
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-3xl shadow-2xl bg-base-100">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center mb-6">Create Account</h1>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {/* Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Mobile */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Mobile</span>
              </label>
              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="9876543210"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Branch Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Branch Name</span>
              </label>
              <input
                name="brName"
                value={form.brName}
                onChange={handleChange}
                placeholder="Branch Name"
                className="input input-bordered w-full"
              />
            </div>

            {/* Branch Place */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Branch Place</span>
              </label>
              <input
                name="brPlace"
                value={form.brPlace}
                onChange={handleChange}
                placeholder="Branch Place"
                className="input input-bordered w-full"
              />
            </div>

            {/* Branch Code */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Branch Code</span>
              </label>
              <input
                name="brCode"
                value={form.brCode}
                onChange={handleChange}
                placeholder="Code"
                className="input input-bordered w-full"
              />
            </div>

            {/* Branch ABM */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Branch ABM</span>
              </label>
              <input
                name="brAbm"
                value={form.brAbm}
                onChange={handleChange}
                placeholder="ABM Name"
                className="input input-bordered w-full"
              />
            </div>

            {/* Branch Manager */}
            <div className="form-control sm:col-span-2">
              <label className="label">
                <span className="label-text">Branch Manager</span>
              </label>
              <input
                name="brManager"
                value={form.brManager}
                onChange={handleChange}
                placeholder="Manager Name"
                className="input input-bordered w-full"
              />
            </div>

            {/* Submit Button */}
            <div className="form-control sm:col-span-2 mt-4">
              <button type="submit" className="btn btn-primary w-full">
                {loading ? (
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
