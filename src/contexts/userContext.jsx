// src/contexts/UserContext.jsx
import axios from "axios";
import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Create the context
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ✅ Axios interceptor to catch 401 globally
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          console.warn("Unauthorized! Logging out...");
          logout();
        }
        return Promise.reject(err);
      }
    );
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // ✅ React Query to fetch logged-in user
  const {
    data: user,
    isLoading: loading,
    isError,
    error,
    refetch: fetchUserDetails,
  } = useQuery({
    queryKey: ["user", token], // cache key depends on token
    queryFn: async () => {
      if (!token) return null;
      const res = await axios.get(`${backendUrl}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token, // only run if token exists
    retry: 1, // only retry once if it fails
  });

  // ✅ Save token after login
  const login = (jwtToken) => {
    setToken(jwtToken);
    localStorage.setItem("token", jwtToken);
    queryClient.invalidateQueries(["user"]); // refresh user
  };

  // ✅ Clear user/token on logout
  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    queryClient.clear(); // clear cache
    navigate("/login");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        setToken,
        login,
        logout,
        fetchUserDetails,
        backendUrl,
        loading,
        error: isError ? error : null,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
