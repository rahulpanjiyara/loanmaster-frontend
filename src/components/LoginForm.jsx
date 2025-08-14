import React, { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/userContext";
import { toast } from "react-toastify";

const LoginForm = () => {
  const [form, setForm] = useState({ mobile: "", password: "" });
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Use the environment variable for backend URL

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (localStorage.getItem("token")) {
      toast.error("You are already logged in");
      return;
    }

    try {
      const res = await axios.post(backendUrl+"/user/login", form);
      if (res.data.token) {
        login(res.data.token);
        toast.success("Login successful!");
        navigate(res.data.userType === "admin" ? "/admin" : "/");
      } else {
        toast.error(res.data.error || "Login failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 px-4">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center mb-4">Login</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Mobile</span>
              </label>
              <input
                type="text"
                name="mobile"
                placeholder="Enter your mobile"
                value={form.mobile}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control mt-4">
              <button type="submit" className="btn btn-primary w-full">
                Login
              </button>
            </div>
          </form>

          <p className="text-center mt-4 text-sm">
            Not registered yet?{" "}
            <Link to="/register" className="link link-primary">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
