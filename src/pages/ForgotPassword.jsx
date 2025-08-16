import { useState } from "react";
import axios from "axios";



export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(backendUrl+ "/user/forgot-password", { email });
      setMessage(res.data.message);
      setIsError(false);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending reset link");
      setIsError(true);
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl p-6">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
        {message && <p className={`mb-2 ${isError?"text-secondary":"text-success"}`}>{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full"
            required
          />
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
           {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Send Reset Link"
          )}
          </button>
        </form>
      </div>
    </div>
  );
}
