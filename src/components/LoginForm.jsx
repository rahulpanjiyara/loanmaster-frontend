import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../contexts/userContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const loginUser = async (form) => {
  const res = await axios.post(`${backendUrl}/user/login`, form);
  return res.data;
};

const LoginForm = () => {
  const [form, setForm] = useState({ mobile: "", password: "" });
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.token) {
        // Save token in context + localStorage
        login(data.token);

        // ✅ Decode token payload
        const decoded = jwtDecode(data.token);
        //console.log("Decoded JWT:", decoded);

        toast.success("Login successful!");

        // ✅ Navigate based on role
        navigate(decoded.type === "admin" ? "/admin" : "/");
      } else {
        toast.error(data?.error || "Login failed");
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Login failed");
    },
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (localStorage.getItem("token")) {
      toast.error("You are already logged in");
      return;
    }

    mutate(form); // ✅ use React Query mutation
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
                value={form.mobile}
                onChange={handleChange}
                placeholder="Enter your mobile"
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
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control mt-4">
              <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
                {isPending ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>

          <p className="text-center mt-4 text-sm">
            Not registered yet?{" "}
            <Link to="/register" className="link link-primary">
              Register here
            </Link>
          </p>
          <p className="text-center mt-4 text-sm">
            <Link to="/forgot-password" className="link link-secondary">
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
